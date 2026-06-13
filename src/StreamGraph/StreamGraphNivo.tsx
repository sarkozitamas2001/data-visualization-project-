import { ResponsiveStream } from "@nivo/stream";
import { type languageSpeakersType } from "../data/languageSpeakers";
import { useBenchmarkRunner } from "../hooks/useBenchmarkRunner";
import { useBenchmark } from "../hooks/useBenchmark";

interface Props {
  data: languageSpeakersType[];
  keys: string[];
}

export default function StreamGraphNivo({
  data,
  keys
}: Props) {

  const {
    runId,
    runBenchmark
  } = useBenchmarkRunner();

  useBenchmark("StreamGraphNivo", runId);  

  return (
    <div style={{ height: "500px", width: "800px" }}>
      <button onClick={() => runBenchmark(50)}>
        Run 50 Benchmarks
      </button>

      <ResponsiveStream
        key={runId}
        data={data}
        keys={keys}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}

        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          legend: "Year",
          legendOffset: 36,
          format: (value) => data[value]?.year || ""
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          legend: "Speakers (millions)",
          legendOffset: -40
        }}

        offsetType="wiggle" 

        colors={{ scheme: "nivo" }}

        fillOpacity={0.85}
        borderColor={{ theme: "background" }}

        animate={true}
        motionConfig="gentle"

        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            translateX: 100,
            itemWidth: 80,
            itemHeight: 20,
            symbolSize: 12
          }
        ]}
      />
    </div>
  );
}