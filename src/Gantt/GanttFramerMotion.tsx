import { useState } from "react";
import { scaleLinear, scaleBand } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { motion } from "framer-motion";
import { type LanguageStage } from "../data/languageEvolution";
import * as d3 from "d3";
import { useBenchmarkRunner } from "../hooks/useBenchmarkRunner";
import { useBenchmark } from "../hooks/useBenchmark";

interface Props {
  data: LanguageStage[];
}

const width = 1300;
const height = 500;

export default function GanttFramerMotion({ data }: Props) {

  const {
    runId,
    runBenchmark
  } = useBenchmarkRunner();

  const [animate, setAnimate] = useState(false);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    data: LanguageStage;
  } | null>(null);

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
    range: [100, width - 250]
  });

  const yScale = scaleBand({
    domain: languages,
    range: [40, height - 40],
    padding: 0.3
  });

  const stagesByLanguage = d3.group(data, d => d.language);

  useBenchmark("GanttFramerMotion", runId);

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

              const barWidth = xScale(d.end) - xScale(d.start);

              return (
                <motion.rect
                  stroke="#c7bcbc"
                  strokeWidth={2}
                  opacity={0.7}
                  key={i}
                  x={xScale(d.start)}
                  y={yScale(d.language)}
                  height={yScale.bandwidth()}
                  rx={6}
                  fill={color}
                  initial={{ width: 0, opacity: 0 }}
                  animate={
                    animate
                      ? { width: barWidth, opacity: 1 }
                      : { width: 0, opacity: 0 }
                  }
                  transition={{
                    duration: 0.8,
                    delay: i * 0.2,
                    ease: "easeOut"
                  }}
                  onMouseMove={(e) => {
                    setTooltip({
                      x: e.clientX,
                      y: e.clientY,
                      data: d
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })}
        </Group>

        {/* AXES */}
        <AxisBottom
          top={height - 40}
          scale={xScale}
          numTicks={10}
        />

        <AxisLeft
          left={100}
          scale={yScale}
        />

      </svg>

      {/* TOOLTIP */}
      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x + 10,
            top: tooltip.y - 20,
            background: "white",
            border: "1px solid #999",
            borderRadius: "6px",
            padding: "8px 12px",
            fontSize: "13px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            pointerEvents: "none"
          }}
        >
          <strong>{tooltip.data.language}</strong><br />
          {tooltip.data.stage}<br />
          {tooltip.data.start} - {tooltip.data.end}
        </div>
      )}
    </div>
  );
}