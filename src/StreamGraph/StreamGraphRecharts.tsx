import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { type languageSpeakersType } from "../data/languageSpeakers";
import { useBenchmarkRunner } from "../hooks/useBenchmarkRunner";
import { useBenchmark } from "../hooks/useBenchmark";

interface Props {
  data: languageSpeakersType[];
  keys: string[];
}

export default function StreamGraphRecharts({
  data, 
  keys
}: Props) {

  const {
    runId,
    runBenchmark
  } = useBenchmarkRunner();

  useBenchmark("StreamGraphRecharts", runId);

  return (
    <div style={{ width: "100%", height: 500 }}>
      <ResponsiveContainer 
        key={runId}
        height={480}
        width={760}
      >
        <AreaChart data={data}>

          <XAxis dataKey="year" />

          <YAxis />

          <Tooltip />

          <Legend />

          {keys.map((key) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId="1"
            />
          ))}          

        </AreaChart>
      </ResponsiveContainer>
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