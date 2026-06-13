import { VegaEmbed } from "react-vega";
import { RadialTreeSpec } from "./RadialTree";
import { type TreeNode } from "../data/indoEuropeanData";
import { useBenchmark } from "../hooks/useBenchmark";
import { useBenchmarkRunner } from "../hooks/useBenchmarkRunner";

interface Props {
  data: TreeNode[];
}

export default function RadialTreeVegaMeasured({
  data
}: Props) {

  const {
    runId,
    runBenchmark
  } = useBenchmarkRunner();

  useBenchmark("RadialTreeVega", runId);

  return (
    <div>
      <button onClick={() => runBenchmark(50)}>
        Run 50 Benchmarks
      </button>

      <VegaEmbed  key={runId} spec={RadialTreeSpec(data)} />
    </div>
  );
}