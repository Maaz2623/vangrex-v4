import "server-only";

import { Sandbox } from "e2b";

export async function createSandbox() {
  const sandbox = await Sandbox.create();

  console.log("[e2b] sandbox created: ", sandbox.sandboxId);

  return sandbox;
}
