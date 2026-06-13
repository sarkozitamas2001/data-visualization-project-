import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { type MigrationPoint } from "../data/hungarianMigrationData";
import * as topojson from "topojson-client";
import type { Topology } from "topojson-specification";
import { useBenchmarkRunner } from "../hooks/useBenchmarkRunner";
import countriesData from "../data/countries-110m.json";

interface Props {
  data: MigrationPoint[];
}

const width = 900;
const height = 600;

export default function HungarianMigrationMap({ data }: Props) {

  const {
    runId,
    runBenchmark
  } = useBenchmarkRunner();

  const svgRef = useRef<SVGSVGElement | null>(null);

  const startAnimation = () => {

    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    const path = svg.select(".migration-line");

    const totalLength = (path.node() as SVGPathElement).getTotalLength();

    const eventList = d3.select("#migration-events");

    eventList.html("");

    path
      .style("opacity", 1)
      .attr("stroke-dasharray", totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(4000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    const stepDuration = 4000 / (data.length - 1);

    data.forEach((point, i) => {

    setTimeout(() => {

        // Show point
        svg.select(`#point-${i}`)
        .transition()
        .duration(300)
        .attr("r", 6);

        // Update info panel
        eventList
            .append("div")
            .style("margin-bottom", "6px")
            .style("opacity", 0)
            .html(`
                <strong>${point.name}</strong><br/>
                Year: ${point.year}
            `)
            .transition()
            .duration(300)
            .style("opacity", 1);

        d3.select("#migration-info")
            .style("opacity", 1);

    }, i * stepDuration);

    });
  };

  useEffect(() => {

    const startTime = performance.now();

    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();

    const projection = d3.geoNaturalEarth1()
      .scale(600)
      .center([35, 55])
      .translate([width / 2, height / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    const g = svg.append("g");

    const tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("background", "white")
        .style("padding", "6px 10px")
        .style("border", "1px solid #999")
        .style("border-radius", "4px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("opacity", 0); // 0

    const infoPanel = d3.select("body")
        .append("div")
        .attr("id", "migration-info")
        .style("position", "absolute")
        .style("left", "40px")
        .style("top", "300px")
        .style("background", "white")
        .style("padding", "12px 16px")
        .style("border", "1px solid #aaa")
        .style("border-radius", "6px")
        .style("box-shadow", "0 2px 6px rgba(0,0,0,0.2)")
        .style("font-family", "sans-serif")
        .style("font-size", "14px")
        .style("opacity", 0); //0

    infoPanel.html(`
        <div style="font-weight:bold;margin-bottom:6px">
            Migration Timeline
        </div>
        <div id="migration-events"></div>
    `);

    const topologyData = countriesData as unknown as Topology;

    const countries = topojson.feature(
      topologyData!,
      topologyData!.objects.countries
    ) as unknown as GeoJSON.FeatureCollection;

    g.selectAll("path")
      .data(countries.features)
      .enter()
      .append("path")
      .attr("d", d => pathGenerator(d)!)
      .attr("fill", "#f0f0f0")
      .attr("stroke", "rgb(0, 34, 255)");

    const projectedPoints = data.map(p =>
      projection([p.lon, p.lat]) as [number, number]
    );

    const lineGenerator = d3.line<[number, number]>()
      .curve(d3.curveCatmullRom.alpha(0.5));

    g.append("path")
      .datum(projectedPoints)
      .attr("class", "migration-line")
      .attr("d", lineGenerator)
      .attr("fill", "none")
      .attr("stroke", "#e63946")
      .attr("stroke-width", 3)
      .style("opacity", 0); //1

    // Points
    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("id", (_, i) => `point-${i}`)
      .attr("cx", d => projection([d.lon, d.lat])![0])
      .attr("cy", d => projection([d.lon, d.lat])![1])
      .attr("r", 0) //6
      .attr("fill", "#1d3557")
      .on("mouseover", function(_event, d) {
      
                  d3.select(this).attr("r", 7);
      
                  tooltip
                    .style("opacity", 1)
                    .html(`<strong>${d.name}</strong><br/>Year: ${d.year}`);
                })
      
                .on("mousemove", function(event) {
      
                  tooltip
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 20) + "px");
      
                })
      
                .on("mouseout", function() {
      
                  d3.select(this).attr("r", 5);
                  tooltip.style("opacity", 1); //1
      
                });

    const endTime = performance.now();

    console.log("Render time:", endTime - startTime);

    let frameTime = 0;

    requestAnimationFrame(() => {
      frameTime = performance.now() - endTime;
      console.log("Frame time:", frameTime);
    

      window.perfResults = window.perfResults || [];

      window.perfResults.push({
        name: "FlowMapD3",
        renderTime: endTime - startTime,
        frameTime: frameTime,
        timestamp: Date.now()
      });

    });

    return () => {

      d3.select("#migration-info").remove();

      tooltip.remove();
    };

  }, [data, runId]);

  return (
    <div>
      <button
        onClick={startAnimation}
        style={{
          marginBottom: "10px",
          padding: "8px 16px",
          fontSize: "16px"
        }}
      >
        ▶ Play Migration
      </button>

      <svg
        ref={svgRef}
        width={width}
        height={height}
      />

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