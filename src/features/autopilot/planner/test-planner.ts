import { planAutopilotWorkflow } from "./autopilot-planner";
import { validateAutopilotWorkflow } from "../validation/workflow-validator";

async function main() {
  const workflow = await planAutopilotWorkflow(
    "Create an AI agent that researches a topic and sends the result to another AI agent that summarizes it.",
  );

  const validation = validateAutopilotWorkflow(workflow);

  console.log("WORKFLOW:");
  console.log(JSON.stringify(workflow, null, 2));

  console.log("\nVALIDATION:");
  console.log(JSON.stringify(validation, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
