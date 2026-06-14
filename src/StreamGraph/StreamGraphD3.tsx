import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useBenchmarkRunner } from "../hooks/useBenchmarkRunner";
import { type languageSpeakersType } from "../data/languageSpeakers";

interface Props {
  data: languageSpeakersType[];
  keys: string[];
}

const width = 800;
const height = 500;

export default function StreamGraphD3({ data, keys }: Props) {
  const { runId, runBenchmark } = useBenchmarkRunner();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const layersRef = useRef<SVGPathElement[]>([]);
  const clipRectRef = useRef<d3.Selection<
    SVGRectElement,
    unknown,
    null,
    undefined
  > | null>(null);

  const startAnimation = () => {
    //if (!layersRef.current || !clipRectRef.current) return;
    if (!clipRectRef.current) return;

    //d3.selectAll(layersRef.current)
    //.attr("clip-path", "url(#clip)");
    // .style("opacity", 0)
    // .transition()
    // .duration(1200)
    // .style("opacity", 0.9);

    clipRectRef.current
      .interrupt()
      .attr("width", 0)
      .transition()
      .duration(2000)
      .attr("width", width);
  };

  useEffect(() => {
    const startTime = performance.now();

    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const stack = d3
      .stack<languageSpeakersType>()
      .keys(keys)
      .offset(d3.stackOffsetWiggle);

    const series = stack(data);

    const x = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([60, width - 20]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(series, (s) => d3.min(s, (d) => d[0]))!,
        d3.max(series, (s) => d3.max(s, (d) => d[1]))!,
      ])
      .range([height - 40, 40]);

    const color = d3
      .scaleOrdinal<string>()
      .domain(keys)
      .range(d3.schemeCategory10);

    const area = d3
      .area<d3.SeriesPoint<languageSpeakersType>>()
      .x((_d, i) => x(i))
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]))
      .curve(d3.curveCatmullRom.alpha(0.5));

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "white")
      .style("padding", "10px 14px")
      .style("border", "1px solid #999")
      .style("border-radius", "6px")
      .style("font-size", "13px")
      .style("box-shadow", "0 2px 6px rgba(0,0,0,0.2)")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // Draw layers
    const layers = svg
      .selectAll("path")
      .data(series)
      .enter()
      .append("path")
      .attr("fill", (d) => color(d.key)!)
      .attr("stroke", "none")
      .attr("opacity", 0.9)
      .attr("d", area);

    layers.style("opacity", 0.9).attr("clip-path", "url(#clip)");

    layersRef.current = layers.nodes();

    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "transparent")
      .on("mousemove", function (event) {
        const [mouseX] = d3.pointer(event);

        const index = Math.round(x.invert(mouseX));

        if (index < 0 || index >= data.length) return;

        const dataPoint = data[index];

        // guide line
        const xPos = x(index);

        svg.selectAll(".guide-line").remove();

        svg
          .append("line")
          .attr("class", "guide-line")
          .attr("x1", xPos)
          .attr("x2", xPos)
          .attr("y1", 40)
          .attr("y2", height - 40)
          .attr("stroke", "#333")
          .attr("stroke-dasharray", "4 4");

        // Tooltip
        let html = `<strong>Year: ${dataPoint.year}</strong><br/><br/>`;

        keys.forEach((k) => {
          html += `${k}: ${dataPoint[k as keyof languageSpeakersType]} M<br/>`;
        });

        tooltip
          .style("opacity", 1)
          .html(html)
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY - 20 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });
    const clip = svg.append("clipPath").attr("id", "clip");

    const clipRect = clip
      .append("rect")
      .attr("width", 0)
      .attr("height", height);

    clipRectRef.current = clipRect;

    layers
      .on("mouseover", function (_event, d) {
        layers.transition().duration(200).style("opacity", 0.2);
        d3.select(this).transition().duration(200).style("opacity", 1);

        tooltip.style("opacity", 1).html(`<strong>${d.key}</strong>`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 20 + "px");
      })
      .on("mouseout", function () {
        layers.transition().duration(200).style("opacity", 0.9);
        tooltip.style("opacity", 0);
      });

    // X axis (years)
    const xAxis = d3
      .axisBottom(x)
      .ticks(data.length)
      .tickFormat((_d, i) => data[i]?.year as string);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - 40})`)
      .call(xAxis);

    // Y axis
    const yAxis = d3.axisLeft(y);

    svg.append("g").attr("transform", `translate(60, 0)`).call(yAxis);

    const endTime = performance.now();

    console.log("Render time:", endTime - startTime);

    let frameTime = 0;

    requestAnimationFrame(() => {
      frameTime = performance.now() - endTime;
      console.log("Frame time:", frameTime);

      window.perfResults = window.perfResults || [];

      window.perfResults.push({
        name: "StreamGraphD3",
        renderTime: endTime - startTime,
        frameTime: frameTime,
        timestamp: Date.now(),
      });
    });
  }, [data, keys, runId]);

  return (
    <div>
      <button
        onClick={startAnimation}
        style={{
          marginBottom: "10px",
          padding: "8px 16px",
          fontSize: "16px",
        }}
      >
        ▶ Play Animation
      </button>
      <svg ref={svgRef} width={width} height={height} />

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
