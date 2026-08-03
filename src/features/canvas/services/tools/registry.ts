import { createCalculatorTool } from "./calculator.tool";
import { createWeatherTool } from "./weather.tool";

export const toolRegistry = {
  weather: createWeatherTool,
  // calculator: createCalculatorTool
} as const;
