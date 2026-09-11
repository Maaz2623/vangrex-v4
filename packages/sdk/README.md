# @vangrex/sdk

Official TypeScript/JavaScript SDK for the Vangrex AI workflow platform.

Vangrex lets you build AI workflows visually and trigger them from your own applications.

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

## Custom API URL

By default, the SDK connects to:

```text
https://api.vangrex.com
```

A custom API URL can be provided when creating the client:

```ts
const vangrex = new Vangrex({
  apiKey: process.env.VANGREX_API_KEY!,
  baseUrl: "http://localhost:3000",
});
```

This is useful for local development and testing.

## API

### `Vangrex`

```ts
new Vangrex({
  apiKey: string;
  baseUrl?: string;
})
```

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

For applications, keep your API key in an environment variable rather than hard-coding it:

```bash
VANGREX_API_KEY=your_api_key
```

Then:

```ts
const vangrex = new Vangrex({
  apiKey: process.env.VANGREX_API_KEY!,
});
```

Never commit your Vangrex API key to source control.

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

## License

MIT
