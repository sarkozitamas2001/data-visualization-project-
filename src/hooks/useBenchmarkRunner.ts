import { useState } from "react";
import { exportResults } from "../utils/exportResults";

export function useBenchmarkRunner() {
  const [runId, setRunId] = useState(0);

  const runBenchmark = async (count: number) => {
    window.perfResults = [];

    for (let i = 0; i < count; i++) {
      setRunId((prev) => prev + 1);

      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    exportResults();
  };

  return {
    runId,
    runBenchmark,
  };
}
