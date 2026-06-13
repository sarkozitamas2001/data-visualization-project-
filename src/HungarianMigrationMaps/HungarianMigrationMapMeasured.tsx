import { VegaEmbed } from "react-vega";
import { type MigrationPoint } from "../data/hungarianMigrationData";
import { HungarianMigrationMapvega } from "./HungarianMigrationMapvega";
import { useBenchmarkRunner } from "../hooks/useBenchmarkRunner";
import { useBenchmark } from "../hooks/useBenchmark";

interface Props {
    data: MigrationPoint[]
}

export default function HungarianMigrationMapMeasured({
   data
}: Props) {

  const {
    runId,
    runBenchmark
  } = useBenchmarkRunner();

  useBenchmark("FlowMapVega", runId);

  return (
    <div>
      <button onClick={() => runBenchmark(50)}>
        Run 50 Benchmarks
      </button>

      <VegaEmbed key={runId} spec={HungarianMigrationMapvega(data)} />
    </div>
  );
}