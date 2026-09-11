import { VangrexError } from "./errors.js";

export interface VangrexClientOptions {
  apiKey: string;
  baseUrl?: string;
}

export class VangrexClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(options: VangrexClientOptions) {
    if (!options.apiKey) {
      throw new Error("Vangrex API key is required");
    }

    this.apiKey = options.apiKey;

    this.baseUrl = (options.baseUrl ?? "https://api.vangrex.com").replace(
      /\/$/,
      "",
    );
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const body = await this.parseErrorBody(response);

      const message =
        body &&
        typeof body === "object" &&
        "error" in body &&
        typeof body.error === "string"
          ? body.error
          : `Vangrex API request failed with status ${response.status}`;

      throw new VangrexError(message, {
        status: response.status,
        body,
      });
    }

    return response.json() as Promise<T>;
  }

  async get<T>(path: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "GET",
    });
  }

  async post<T>(
    path: string,
    body: unknown,
    options: RequestInit = {},
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async stream(path: string, options: RequestInit = {}): Promise<Response> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: "text/event-stream",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const body = await this.parseErrorBody(response);

      const message =
        body &&
        typeof body === "object" &&
        "error" in body &&
        typeof body.error === "string"
          ? body.error
          : `Vangrex API request failed with status ${response.status}`;

      throw new VangrexError(message, {
        status: response.status,
        body,
      });
    }

    return response;
  }

  private async parseErrorBody(response: Response): Promise<unknown> {
    try {
      return await response.json();
    } catch {
      return undefined;
    }
  }
}
