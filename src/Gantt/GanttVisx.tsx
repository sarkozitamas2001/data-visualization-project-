import { useState } from "react";
import { scaleLinear, scaleBand } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { localPoint } from "@visx/event";
import { type LanguageStage } from "../data/languageEvolution";
import * as d3 from "d3";
import { useBenchmarkRunner } from "../hooks/useBenchmarkRunner";
import { useBenchmark } from "../hooks/useBenchmark";

interface Props {
  data: LanguageStage[];
}

const width = 1300;
const height = 500;

export default function GanttVisx({ data }: Props) {

    const {
    runId,
    runBenchmark
  } = useBenchmarkRunner();

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    data: LanguageStage;
  } | null>(null);

  const [animate, setAnimate] = useState(false);

  const languages = Array.from(
    new Set(data.map(d => d.language))
  );

  const colorScale = d3.scaleOrdinal<string>()
    .domain(languages)
    .range([
      "#8884d8",
      "#82ca9d",
      "#ffc658",
      "#ff7300",
      "#0088fe",
      "#00c49f",
      "#ff8042",
      "#a4de6c"
    ]);

  const xScale = scaleLinear({
    domain: [400, 2025],
    range: [100, width - 300]
  });

  const yScale = scaleBand({
    domain: languages,
    range: [40, height - 40],
    padding: 0.3
  });

  const stagesByLanguage = d3.group(data, d => d.language);

  useBenchmark("GanttVisx", runId);

  return (
    <div>
      <button onClick={() => runBenchmark(50)}>
        Run 50 Benchmarks
      </button>

      <button
        onClick={() => setAnimate(true)}
        style={{
          marginBottom: "10px",
          padding: "8px 16px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        ▶ Play Timeline
      </button>
      <svg 
        key={runId}
        width={width}
        height={height}
      >
        

        {/* BARS */}
        <Group>
          {data
            .slice()
            .sort((a, b) => a.start - b.start)
            .map((d, i) => {

            const stages = stagesByLanguage.get(d.language)!;
            const index = stages.findIndex(s => s.stage === d.stage);

            const t = index / (stages.length - 1 || 1);

            const color = d3.interpolateLab(
              "#ffffff",
              colorScale(d.language)!
            )(0.3 + t * 0.7);

            return (
              <rect
                stroke="#c7bcbc"
                strokeWidth={2}
                opacity={0.7}
                key={i}
                x={xScale(d.start)}
                y={yScale(d.language)}
                height={yScale.bandwidth()}
                fill={color}
                rx={4}

                width={animate ? xScale(d.end) - xScale(d.start) : 0}

                style={{
                  transition: "width 1s ease",
                  transitionDelay: `${i * 200}ms`
                }}

                onMouseMove={(event) => {
                  const coords = localPoint(event);
                  if (!coords) return;

                  setTooltip({
                    x: coords.x,
                    y: coords.y,
                    data: d
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
                onMouseOver={(e) => {
                  d3.select(e.currentTarget).attr("opacity", 1);
                }}
                onMouseOut={(e) => {
                  d3.select(e.currentTarget).attr("opacity", 0.7);
                }}
              />
            );
          })}
        </Group>

        {/* X AXIS */}
        <AxisBottom
          top={height - 40}
          scale={xScale}
          numTicks={10}
        />

        {/* Y AXIS */}
        <AxisLeft
          left={100}
          scale={yScale}
        />

        {/* TOOLTIP */}
        {tooltip && (
          <g transform={`translate(${tooltip.x + 10}, ${tooltip.y - 10})`}>
            <rect
              width={130}
              height={70}
              fill="white"
              stroke="#999"
              rx={4}
            />

            <text x={10} y={20} fontSize={12} fontWeight="bold">
              {tooltip.data.language}
            </text>

            <text x={10} y={40} fontSize={11}>
              {tooltip.data.stage}
            </text>

            <text x={10} y={60} fontSize={11}>
              {tooltip.data.start} – {tooltip.data.end}
            </text>
          </g>
        )}

      </svg>
    </div>
  );
}