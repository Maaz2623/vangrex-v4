import { autopilotExecutor } from "./autopilot-executor";

async function main() {
  const execute = await autopilotExecutor(
    "d361665c-728b-4dae-827a-3964d319426c",
    "Create a real estate saas basic nextjs app. Don't use sandbox node. add terminal tool node.",
  );

  console.log(execute);
}

main();
