import { createCalculatorTool } from "./calculator.tool";
import { createReadFileTool } from "./read-file.tool";
import { createWeatherTool } from "./weather.tool";

export const toolRegistry = {
  weather: createWeatherTool,
  read_file: createReadFileTool
  // calculator: createCalculatorTool
} as const;
