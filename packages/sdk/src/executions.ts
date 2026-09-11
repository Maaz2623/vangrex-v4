import type { VangrexClient } from "./client.js";
import type { Execution, ExecutionEvent } from "./types.js";

export interface ExecutionRequestOptions {
  signal?: AbortSignal;
}

export class ExecutionsResource {
  constructor(private readonly client: VangrexClient) {}

  async get(
    executionId: string,
    options: ExecutionRequestOptions = {},
  ): Promise<Execution> {
    if (!executionId || typeof executionId !== "string") {
      throw new Error("executionId is required");
    }

    return this.client.get<Execution>(`/api/v1/executions/${executionId}`, {
      signal: options.signal,
    });
  }

  async *events(
    executionId: string,
    options: ExecutionRequestOptions = {},
  ): AsyncGenerator<ExecutionEvent> {
    if (!executionId || typeof executionId !== "string") {
      throw new Error("executionId is required");
    }

    const response = await this.client.stream(
      `/api/v1/executions/${executionId}/events`,
      {
        signal: options.signal,
      },
    );

    if (!response.body) {
      throw new Error("Vangrex event stream returned no response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, {
          stream: true,
        });

        const messages = buffer.split("\n\n");

        buffer = messages.pop() ?? "";

        for (const message of messages) {
          const event = parseSSEMessage(message);

          if (event) {
            yield event;
          }
        }
      }

      buffer += decoder.decode();

      if (buffer.trim()) {
        const event = parseSSEMessage(buffer);

        if (event) {
          yield event;
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}

function parseSSEMessage(message: string): ExecutionEvent | null {
  const dataLines: string[] = [];

  for (const line of message.split(/\r?\n/)) {
    if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trimStart());
    }
  }

  if (dataLines.length === 0) {
    return null;
  }

  const data = dataLines.join("\n");

  try {
    return JSON.parse(data) as ExecutionEvent;
  } catch {
    return null;
  }
}
