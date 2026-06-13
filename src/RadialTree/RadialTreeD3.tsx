import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { type TreeNode } from "../data/indoEuropeanData";
import { useBenchmarkRunner } from "../hooks/useBenchmarkRunner";

interface Props {
  data: TreeNode[];
}

const width = 900;
const height = 900;

export default function RadialTreeD3({ data }: Props) {

  const {
    runId,
    runBenchmark
  } = useBenchmarkRunner();

  const svgRef = useRef<SVGSVGElement | null>(null);

  const [radius, setRadius] = useState(380);
  const [extent, setExtent] = useState(360);
  const [rotation, setRotation] = useState(0);
  const [layoutType, setLayoutType] = useState("tree");
  const [linkType, setLinkType] = useState("straight");
  const [showLabels, setShowLabels] = useState(true);

  useEffect(() => {

    const startTime = performance.now();

    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr(
        "transform",
        `translate(${width / 2},${height / 2}) rotate(${rotation})`
      );

    // hierarchy
    const stratify = d3
      .stratify<TreeNode>()
      .id(d => d.id)
      .parentId(d => d.parent ?? undefined);

    const root = stratify(data);

    // layout
    const layout =
      layoutType === "cluster"
        ? d3.cluster<TreeNode>()
        : d3.tree<TreeNode>();

    layout.size([(extent * Math.PI) / 180, radius]);

    layout(root);

    const radialPoint = (x: number, y: number) => [
      y * Math.cos(x - Math.PI / 2),
      y * Math.sin(x - Math.PI / 2)
    ];

    // links
    if (linkType === "curved") {

    const link = d3.linkRadial<
      d3.HierarchyPointLink<TreeNode>,
      d3.HierarchyPointNode<TreeNode>
      >()
        .angle(d => d.x!)
        .radius(d => d.y!);

    g.append("g")
      .selectAll("path")
      .data(root.links() as d3.HierarchyPointLink<TreeNode>[])
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "#999")
      .attr("stroke-width", 1)
      .attr("d", link);

    } else {

      g.append("g")
        .selectAll("path")
        .data(root.links())
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", "#999")
        .attr("stroke-width", 1)
        .attr("d", d => {
          const [sx, sy] = radialPoint(d.source.x!, d.source.y!);
          const [tx, ty] = radialPoint(d.target.x!, d.target.y!);
          return `M${sx},${sy}L${tx},${ty}`;
        });
    }

    // nodes
    const node = g
      .append("g")
      .selectAll("g")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr(
        "transform",
        d => `rotate(${(d.x! * 180) / Math.PI - 90}) translate(${d.y},0)`
      );

    node.append("circle")
      .attr("r", d => (d.children ? 3 : 4))
      .attr("fill", "#69b3a2");

    // labels
    if (showLabels) {

      node.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => (d.x! < Math.PI ? 10 : -10))
        .attr("text-anchor", d => (d.x! < Math.PI ? "start" : "end"))
        .attr("transform", d => (d.x! >= Math.PI ? "rotate(180)" : null))
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text(d => d.data.name);
    }

    const endTime = performance.now();

    console.log("Render time:", endTime - startTime);

    let frameTime = 0;

    requestAnimationFrame(() => {
      frameTime = performance.now() - endTime;
      console.log("Frame time:", frameTime);
    

      window.perfResults = window.perfResults || [];

      window.perfResults.push({
        name: "RadialTreeD3",
        renderTime: endTime - startTime,
        frameTime: frameTime,
        timestamp: Date.now()
      });
    });

  }, [data, radius, extent, rotation, layoutType, linkType, showLabels, runId]);

  return (

    <div>
      <svg
        key={runId} 
        ref={svgRef}
      ></svg>

      <div style={{ marginBottom: 5 }}>

        <label>
          <input
            type="checkbox"
            checked={showLabels}
            onChange={e => setShowLabels(e.target.checked)}
          />
          labels
        </label>

        <br/>

        radius
        <input
          type="range"
          min="200"
          max="450"
          value={radius}
          onChange={e => setRadius(+e.target.value)}
        />

        <br/>

        extent
        <input
          type="range"
          min="90"
          max="360"
          value={extent}
          onChange={e => setExtent(+e.target.value)}
        />

        <br/>

        rotate
        <input
          type="range"
          min="-180"
          max="180"
          value={rotation}
          onChange={e => setRotation(+e.target.value)}
        />

        <br/>

        layout

        <label>
          <input
            type="radio"
            checked={layoutType === "tree"}
            onChange={() => setLayoutType("tree")}
          />
          tidy
        </label>

        <label>
          <input
            type="radio"
            checked={layoutType === "cluster"}
            onChange={() => setLayoutType("cluster")}
          />
          cluster
        </label>

        <br/>

        links

        <select
          value={linkType}
          onChange={e => setLinkType(e.target.value)}
        >
          <option value="straight">straight</option>
          <option value="curved">diagonal</option>
        </select>

      </div>

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