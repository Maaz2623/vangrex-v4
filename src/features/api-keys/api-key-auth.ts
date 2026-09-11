import { authenticateApiKey } from "./api-key-service";

export async function requireApiKey(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization) {
    throw new Error("Missing authorization header");
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new Error("Invalid authorization header");
  }

  if (!token.startsWith("vgx_live_")) {
    throw new Error("Invalid API key");
  }

  const apiKey = await authenticateApiKey(token);

  if (!apiKey) {
    throw new Error("Invalid or revoked API key");
  }

  return apiKey;
}
