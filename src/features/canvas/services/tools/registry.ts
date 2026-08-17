import { createCalculatorTool } from "./calculator.tool";
import { createReadFileTool } from "./read-file.tool";
import { createTerminalTool } from "./terminal.tool";
import { createWeatherTool } from "./weather.tool";
import { createWriteFileTool } from "./write-file.tool";

export const toolRegistry = {
  weather: createWeatherTool,
  read_file: createReadFileTool,
  write_file: createWriteFileTool,
  terminal: createTerminalTool
  // calculator: createCalculatorTool
} as const;
