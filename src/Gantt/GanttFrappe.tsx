import { useEffect, useRef } from "react";
import Gantt from "frappe-gantt";
import "../../node_modules/frappe-gantt/dist/frappe-gantt.css";
import { useBenchmarkRunner } from "../hooks/useBenchmarkRunner";
import { useBenchmark } from "../hooks/useBenchmark";

export default function GanttFrappe() {
  const { runId, runBenchmark } = useBenchmarkRunner();

  const ganttRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ganttRef.current) return;

    ganttRef.current.innerHTML = "";
    console.log("Creating Frappe Gantt", runId);

    const tasks = [
      // English
      {
        id: "1",
        name: "Old English",
        start: "1999-01-01",
        end: "2005-01-01",
        progress: 100,
      },
      {
        id: "2",
        name: "Middle English",
        start: "2005-01-01",
        end: "2015-01-01",
        progress: 100,
      },
      {
        id: "3",
        name: "Modern English",
        start: "2015-01-01",
        end: "2023-01-01",
        progress: 100,
      },

      // German
      {
        id: "4",
        name: "Old High German",
        start: "2000-01-01",
        end: "2008-01-01",
        progress: 100,
      },
      {
        id: "5",
        name: "Middle High German",
        start: "2008-01-01",
        end: "2018-01-01",
        progress: 100,
      },
      {
        id: "6",
        name: "Modern German",
        start: "2018-01-01",
        end: "2026-01-01",
        progress: 100,
      },

      // French
      {
        id: "7",
        name: "Old French",
        start: "2001-01-01",
        end: "2010-01-01",
        progress: 100,
      },
      {
        id: "8",
        name: "Middle French",
        start: "2010-01-01",
        end: "2018-01-01",
        progress: 100,
      },
      {
        id: "9",
        name: "Modern French",
        start: "2018-01-01",
        end: "2026-01-01",
        progress: 100,
      },
    ];

    new Gantt(ganttRef.current, tasks, {
      view_mode: "Year",
      date_format: "YYYY-MM-DD",
      bar_height: 40,
      padding: 30,
    });
  }, [runId]);

  useBenchmark("GanttFrappe", runId);

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        //overflow: "auto",
        //border: "1px solid #ddd",
        //borderRadius: "8px",
        background: "#fff",
      }}
    >
      <div ref={ganttRef} />
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
