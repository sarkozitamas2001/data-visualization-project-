import { useEffect, useState } from "react";
import { Group } from "@visx/group";
import { AreaStack } from "@visx/shape";
import { scaleLinear, scaleOrdinal } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { localPoint } from "@visx/event";
import { curveCatmullRom } from "d3-shape";
import { type languageSpeakersType } from "../data/languageSpeakers";
import { useBenchmarkRunner } from "../hooks/useBenchmarkRunner";
import { useBenchmark } from "../hooks/useBenchmark";

interface Props {
  data: languageSpeakersType[];
  keys: string[];
}

const width = 1000;
const height = 500;

export default function StreamGraphVisx({ data, keys }: Props) {
  const { runId, runBenchmark } = useBenchmarkRunner();

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [activeKeys, setActiveKeys] = useState<string[]>(keys);
  const [clipWidth, setClipWidth] = useState(0);

  useEffect(() => {
    setActiveKeys(keys);
  }, [keys]);

  const xScale = scaleLinear({
    domain: [0, data.length - 1],
    range: [60, width - 200],
  });

  const yScale = scaleLinear({
    domain: [-120, 320],
    range: [height - 40, 40],
  });

  const colorScale = scaleOrdinal<string, string>({
    domain: keys,
    range: [
      "#8884d8",
      "#82ca9d",
      "#ffc658",
      "#ff7300",
      "#0088fe",
      "#00c49f",
      "#ff8042",
      "#a4de6c",
      "#d0ed57",
      "#8dd1e1",
    ],
  });

  // Legend toogle
  const toggleKey = (key: string) => {
    setActiveKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  // Tooltip positioning
  const legendStartX = width - 200;
  const tooltipWidth = 150;

  const tooltipX =
    hoverIndex !== null
      ? xScale(hoverIndex) > legendStartX - 20
        ? xScale(hoverIndex) - tooltipWidth - 20
        : xScale(hoverIndex) + 10
      : 0;

  useBenchmark("StreamChartVisx", runId);

  return (
    <div>
      <button
        onClick={() => {
          setClipWidth(0);

          requestAnimationFrame(() => {
            setClipWidth(width);
          });
        }}
      >
        ▶ Play Animation
      </button>

      <svg key={runId} width={width} height={height}>
        {/* Animation */}
        <defs>
          <clipPath id="clip">
            <rect
              width={clipWidth}
              height={height}
              style={{
                transition: "width 2s linear",
              }}
            />
          </clipPath>
        </defs>

        {/* Stream Graph */}
        <Group clipPath="url(#clip)">
          <AreaStack
            data={data}
            keys={activeKeys}
            x={(_d, i) => xScale(i) ?? 0}
            y0={(d) => yScale(d[0]) ?? 0}
            y1={(d) => yScale(d[1]) ?? 0}
            curve={curveCatmullRom}
            offset="wiggle"
          >
            {({ stacks, path }) =>
              stacks.map((stack) => (
                <path
                  key={stack.key}
                  d={path(stack) ?? ""}
                  fill={colorScale(stack.key)}
                  opacity={0.9}
                  style={{
                    transition: "opacity 0.2s",
                    opacity: hoverIndex !== null ? 0.6 : 0.9,
                  }}
                />
              ))
            }
          </AreaStack>
        </Group>

        {/* Axes */}
        <AxisBottom
          top={height - 40}
          scale={xScale}
          tickFormat={(d) => data[d as number]?.year ?? ""}
        />

        <AxisLeft left={60} scale={yScale} label="Speakers (millions)" />

        {/* Hover */}
        <rect
          width={width}
          height={height}
          fill="transparent"
          onMouseMove={(event) => {
            const point = localPoint(event);
            if (!point) return;

            const index = Math.round(xScale.invert(point.x));

            if (index >= 0 && index < data.length) {
              setHoverIndex(index);
            }
          }}
          onMouseLeave={() => setHoverIndex(null)}
        />

        {/* Vertical Guide */}
        {hoverIndex !== null && (
          <line
            x1={xScale(hoverIndex)}
            x2={xScale(hoverIndex)}
            y1={40}
            y2={height - 40}
            stroke="black"
            strokeDasharray="4 4"
          />
        )}

        {/* Tooltip */}
        {hoverIndex !== null && (
          <g transform={`translate(${tooltipX}, 50)`}>
            <rect width={150} height={120} fill="white" stroke="#999" rx={4} />

            <text x={10} y={20} fontSize={12} fontWeight="bold">
              Year: {data[hoverIndex].year}
            </text>

            {keys.map((k, i) => (
              <text key={k} x={10} y={40 + i * 15} fontSize={11}>
                {k}: {data[hoverIndex][k]}M
              </text>
            ))}
          </g>
        )}

        {/* Legend */}
        <g transform={`translate(${width - 180}, 60)`}>
          {keys.map((key, i) => (
            <g
              key={key}
              transform={`translate(0, ${i * 25})`}
              onClick={() => toggleKey(key)}
              style={{ cursor: "pointer" }}
            >
              <rect
                width={14}
                height={14}
                fill={colorScale(key)}
                opacity={activeKeys.includes(key) ? 1 : 0.3}
              />
              <text x={20} y={12} fontSize={12}>
                {key}
              </text>
            </g>
          ))}
        </g>
      </svg>
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
