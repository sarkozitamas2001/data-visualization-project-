import { useEffect } from "react";

export function useBenchmark(name: string, runId?: number) {
  useEffect(() => {
    const startTime = performance.now();

    requestAnimationFrame(() => {
      const endTime = performance.now();

      console.log(`${name} render time:`, endTime - startTime);

      requestAnimationFrame(() => {
        const frameTime = performance.now() - endTime;

        console.log(`${name} frame time:`, frameTime);

        window.perfResults = window.perfResults || [];

        window.perfResults.push({
          name: name,
          renderTime: endTime - startTime,
          frameTime: frameTime,
          timestamp: Date.now(),
        });
      });
    });
  }, [name, runId]);
}
