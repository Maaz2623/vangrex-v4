import { generateText, NoObjectGeneratedError, Output } from "ai";

import { z } from "zod";

import { defaultModel } from "@/features/canvas/services/execution/model";

/**
 * Vangrex Autopilot Planner Output Schema
 *
 * Direct schema — no unions.
 */
const plannerOutputSchema = z.object({
  name: z.string().min(1),

  description: z.string(),

  nodes: z.array(
    z.object({
      id: z.string().min(1),

      type: z.enum(["agent", "tool-call", "variable", "output", "sandbox"]),

      name: z.string().min(1),

      purpose: z.string().min(1),

      config: z.object({
        // Agent
        instructions: z.string().optional(),

        prompt: z.string().optional(),

        model: z
          .enum([
            "google/gemini-3.5-flash-lite",
            "google/gemini-2.5-flash",
            "google/gemini-2.5-pro",
            "openai/gpt-5",
            "openai/gpt-5-mini",
            "anthropic/claude-sonnet-4.5",
            "anthropic/claude-opus-4.1",
          ])
          .optional(),

        reasoning: z.enum(["none", "low", "medium", "high"]).optional(),

        // Tool
        implementation: z
          .enum([
            "weather",
            "read_file",
            "write_file",
            "terminal",
            "github_create_repository",
          ])
          .optional(),

        parameters: z.record(z.string(), z.unknown()).optional(),

        // Variable
        variableName: z.string().optional(),

        variableType: z.enum(["text", "number", "json", "boolean"]).optional(),

        value: z.string().optional(),

        variableDescription: z.string().optional(),

        secret: z.boolean().optional(),

        editable: z.boolean().optional(),

        global: z.boolean().optional(),

        // Output
        output: z.string().optional(),

        // Sandbox
        credentials: z
          .array(
            z.object({
              key: z.string(),
              credentialId: z.string(),
            }),
          )
          .optional(),
      }),
    }),
  ),

  edges: z.array(
    z.object({
      source: z.string().min(1),

      target: z.string().min(1),

      sourceHandle: z.string().min(1),

      targetHandle: z.string().min(1),
    }),
  ),
});

type PlannerOutput = z.infer<typeof plannerOutputSchema>;

const PLANNER_SYSTEM_PROMPT = `
You are the Vangrex Autopilot Planner.

Your job is to convert a user's natural-language workflow request
into a valid Vangrex workflow.

Return ONLY the workflow structure requested by the schema.

GENERAL RULES:

- Create only nodes that are necessary.
- Every node must have a unique id.
- Node names should be short and descriptive.
- Every node needs a clear purpose.
- Every edge must reference existing node ids.
- sourceHandle describes where data leaves the source node.
- targetHandle describes where data enters the target node.
- Use "output" as the source handle for normal data flow.
- Do not invent unsupported capabilities.
- Do not write React Flow code.
- Do not write database code.
- Do not execute anything.

SUPPORTED NODE TYPES:

agent:
Performs an AI task.

tool-call:
Calls a registered tool.

variable:
Stores a value that can be passed to other nodes.

output:
Represents the final workflow result.

sandbox:
Provides an isolated execution environment.

CONFIGURATION:

Every node MUST have a config object.

config MUST NEVER be:

- a string
- an array
- null

config MUST ALWAYS be a JSON object.

AGENT CONFIGURATION:

For an agent node, use:

{
  "instructions": "string",
  "prompt": "string",
  "model": "google/gemini-2.5-flash",
  "reasoning": "medium"
}

Every agent MUST have all four fields.

The model MUST be one of:

- "google/gemini-3.5-flash-lite"
- "google/gemini-2.5-flash"
- "google/gemini-2.5-pro"
- "openai/gpt-5"
- "openai/gpt-5-mini"
- "anthropic/claude-sonnet-4.5"
- "anthropic/claude-opus-4.1"

The reasoning MUST be one of:

- "none"
- "low"
- "medium"
- "high"

Never return:

"config": {}

TOOL CONFIGURATION:

For a tool-call node, use:

{
  "implementation": "weather",
  "parameters": {}
}

implementation MUST be one of:

- "weather"
- "read_file"
- "write_file"
- "terminal"
- "github_create_repository"

VARIABLE CONFIGURATION:

For a variable node, use:

{
  "variableName": "topic",
  "variableType": "text",
  "value": "...",
  "variableDescription": "...",
  "secret": false,
  "editable": true,
  "global": false
}

variableType MUST be one of:

- "text"
- "number"
- "json"
- "boolean"

OUTPUT CONFIGURATION:

For an output node, use:

{
  "output": "..."
}

SANDBOX CONFIGURATION:

For a sandbox node, use:

{
  "credentials": []
}

IMPORTANT:

Although the schema contains all possible configuration fields,
ONLY populate the fields relevant to the node type.

For example, an agent should NOT be given tool, variable,
output, or sandbox configuration fields.

Do not invent configuration values for unrelated node types.

WORKFLOW RULES:

- Workflows must contain at least one node.
- Workflows must contain at least one output node.
- Node IDs must be unique.
- Do not create self-referencing edges.
- Every edge source must exist.
- Every edge target must exist.
- Output nodes should normally be terminal nodes.
- Connect nodes according to the logical data flow of the requested workflow.

The planner designs the workflow only.
It does not execute the workflow.
`;

export async function planAutopilotWorkflow(
  request: string,
): Promise<PlannerOutput | undefined> {
  try {
    const result = await generateText({
      model: defaultModel,

      system: PLANNER_SYSTEM_PROMPT,

      prompt: request,

      reasoning: "high",

      output: Output.object({
        schema: plannerOutputSchema,

        name: "VangrexAutopilotWorkflow",

        description:
          "A valid Vangrex workflow containing nodes, configurations, and data-flow edges.",
      }),
    });

    console.log(result.output);

    return result.output;
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error)) {
      console.log("NoObjectGeneratedError");
      console.log("Cause:", error.cause);
      console.log("Text:", error.text);
      console.log("Response:", error.response);
      console.log("Usage:", error.usage);

      return undefined;
    }

    throw error;
  }
}
