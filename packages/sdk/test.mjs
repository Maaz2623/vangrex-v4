import { Vangrex } from "./dist/index.js";

const vangrex = new Vangrex({
  apiKey: process.env.VANGREX_API_KEY,
  baseUrl: "http://localhost:3000",
});

const workflowId = process.env.VANGREX_WORKFLOW_ID;

const controller = new AbortController();

console.log("Starting workflow...\n");

const execution = await vangrex.workflows.run(
  workflowId,
  {
    message: "Abort signal test",
  },
  {
    signal: controller.signal,
  },
);

console.log("Execution started:");
console.log(execution);

console.log("\nListening for events...");

try {
  for await (const event of vangrex.executions.events(execution.executionId, {
    signal: controller.signal,
  })) {
    console.log(`[${event.type}]`, event.data);

    if (event.type === "node.completed" || event.type === "node.failed") {
      console.log("\nAborting event stream...");
      controller.abort();
    }
  }
} catch (error) {
  if (error?.name === "AbortError") {
    console.log("\nEvent stream aborted successfully.");
  } else {
    throw error;
  }
}
