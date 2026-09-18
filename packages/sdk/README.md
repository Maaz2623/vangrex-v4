# @vangrex/sdk

Official TypeScript/JavaScript SDK for the [Vangrex](https://vangrex.vercel.app) AI workflow platform.

Vangrex lets you build AI workflows visually and run them from your own applications.

## Installation

```bash
npm install @vangrex/sdk
```

## Requirements

- Node.js 18+
- A Vangrex API key
- A Vangrex workflow ID

## Quick Start

Create a Vangrex client using your API key:

```ts
import { Vangrex } from "@vangrex/sdk";

const vangrex = new Vangrex({
  apiKey: process.env.VANGREX_API_KEY!,
});
```

### Run a Workflow

Trigger a workflow with an input payload:

```ts
const execution = await vangrex.workflows.run("workflow-id", {
  message: "Hello from my application",
});

console.log(execution.executionId);
```

The workflow runs asynchronously. The SDK immediately returns an execution ID that can be used to track the execution.

### Get Execution Status

Fetch the current state of an execution:

```ts
const execution = await vangrex.executions.get(executionId);

console.log(execution.status);
console.log(execution.output);
```

Possible execution statuses:

```text
pending
running
success
error
cancelled
```

### Stream Execution Events

Listen to execution events in real time:

```ts
for await (const event of vangrex.executions.events(executionId)) {
  console.log(event.type);
  console.log(event.data);
}
```

Available event types include:

```text
execution.started
node.started
node.output
node.completed
node.failed
execution.completed
execution.failed
```

This allows your application to react to workflow progress without continuously polling the execution endpoint.

## Complete Example

```ts
import { Vangrex } from "@vangrex/sdk";

const vangrex = new Vangrex({
  apiKey: process.env.VANGREX_API_KEY!,
});

const execution = await vangrex.workflows.run("workflow-id", {
  message: "Hello from my application",
});

console.log("Execution:", execution.executionId);

for await (const event of vangrex.executions.events(execution.executionId)) {
  console.log(`[${event.type}]`, event.data);
}

const result = await vangrex.executions.get(execution.executionId);

console.log("Status:", result.status);
console.log("Output:", result.output);
```

## Type-Safe Workflows

Vangrex supports generated TypeScript workflow types so your application can work with workflow inputs and outputs using TypeScript's type system.

Generate workflow types from your Vangrex project:

```bash
npx vangrex generate
```

After generating the types, import them into your application:

```ts
import type { Workflows } from "./vangrex-workflows";
```

You can then use the generated workflow definitions when integrating your Vangrex workflows into your application.

> Generated workflow types are based on the workflows and schemas configured in your Vangrex project.

## Error Handling

API errors are returned as `VangrexError` instances.

```ts
import { Vangrex, VangrexError } from "@vangrex/sdk";

const vangrex = new Vangrex({
  apiKey: process.env.VANGREX_API_KEY!,
});

try {
  await vangrex.workflows.run("workflow-id", {
    message: "Hello",
  });
} catch (error) {
  if (error instanceof VangrexError) {
    console.error("Status:", error.status);
    console.error("Message:", error.message);
    console.error("Body:", error.body);
  }
}
```

`VangrexError` provides:

- `message` — human-readable error message
- `status` — HTTP status code
- `body` — response body returned by the API

## Cancelling Requests

The SDK supports `AbortSignal` for HTTP requests and event streams.

### Cancel a Workflow Request

```ts
const controller = new AbortController();

const execution = await vangrex.workflows.run(
  "workflow-id",
  {
    message: "Hello",
  },
  {
    signal: controller.signal,
  },
);

controller.abort();
```

### Stop Listening to Events

```ts
const controller = new AbortController();

try {
  for await (const event of vangrex.executions.events(executionId, {
    signal: controller.signal,
  })) {
    console.log(event);

    if (event.type === "node.failed") {
      controller.abort();
    }
  }
} catch (error) {
  if (error instanceof Error && error.name === "AbortError") {
    console.log("Event stream stopped.");
  } else {
    throw error;
  }
}
```

Aborting an SDK request or event stream only closes the client connection. It does **not** cancel the underlying Vangrex workflow execution.

## API

### `Vangrex`

```ts
new Vangrex({
  apiKey: string;
})
```

The SDK automatically connects to the Vangrex API.

### `vangrex.workflows.run()`

```ts
await vangrex.workflows.run(
  workflowId,
  input,
  options?,
);
```

Parameters:

- `workflowId` — ID of the Vangrex workflow
- `input` — input payload passed to the workflow
- `options.signal` — optional `AbortSignal`

Returns:

```ts
{
  executionId: string;
  status: string;
}
```

### `vangrex.executions.get()`

```ts
await vangrex.executions.get(
  executionId,
  options?,
);
```

Returns the current execution state.

### `vangrex.executions.events()`

```ts
vangrex.executions.events(
  executionId,
  options?,
);
```

Returns an async generator of execution events.

## Environment Variables

Keep your API key in an environment variable rather than hard-coding it:

```bash
VANGREX_API_KEY=your_api_key
```

Then:

```ts
const vangrex = new Vangrex({
  apiKey: process.env.VANGREX_API_KEY!,
});
```

**Never commit your Vangrex API key to source control.**

## TypeScript

The SDK includes TypeScript type definitions.

```ts
import type {
  Execution,
  ExecutionEvent,
  ExecutionEventData,
  ExecutionEventType,
  RunWorkflowResponse,
} from "@vangrex/sdk";
```

## Public Beta

Vangrex is currently in **public beta**.

The SDK and platform are actively evolving, and APIs may change as we improve the product.

If you encounter an issue or have feedback, please report it through the Vangrex project repository.

## License

MIT
