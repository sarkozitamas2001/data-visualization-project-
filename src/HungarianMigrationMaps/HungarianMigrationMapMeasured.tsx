import { VegaEmbed } from "react-vega";
import { type MigrationPoint } from "../data/hungarianMigrationData";
import { HungarianMigrationMapvega } from "./HungarianMigrationMapvega";
import { useBenchmarkRunner } from "../hooks/useBenchmarkRunner";
import { useBenchmark } from "../hooks/useBenchmark";
import { useState } from "react";

interface Props {
  data: MigrationPoint[];
}

export default function HungarianMigrationMapMeasured({ data }: Props) {
  const { runId, runBenchmark } = useBenchmarkRunner();

  const [play, setPlay] = useState(false);

  useBenchmark("FlowMapVega", runId);

  return (
    <div>
      <button
        onClick={() => setPlay(true)}
        style={{
          marginBottom: "10px",
          padding: "8px 16px",
          fontSize: "16px",
        }}
      >
        ▶ Play Migration
      </button>
      <VegaEmbed key={runId} spec={HungarianMigrationMapvega(data, play)} />
      <button
        onClick={() => runBenchmark(50)}
        style={{
          marginTop: "35px",
        }}
      >
        Run 50 Benchmarks
      </button>
    </div>
  );
}
