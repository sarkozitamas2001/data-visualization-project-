interface PerformanceResult {
  name: string;
  renderTime: number;
  frameTime: number;
  timestamp: number;
}

declare global {
  interface Window {
    perfResults: PerformanceResult[];
  }
}

export {};