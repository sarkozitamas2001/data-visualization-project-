import Gantt from "react-gantt-chart";
import { languageEvolution } from "../data/languageEvolution";

const GanttComponent = Gantt as any;

export default function GanttReact() {
  const ganttData = languageEvolution.map((d, i) => ({
    id: i.toString(),
    name: `${d.language} - ${d.stage}`,
    start: new Date(`${d.start}-01-01`),
    end: new Date(`${d.end}-01-01`),
    progress: 100,
  }));

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        background: "#fafafa",
      }}
    >
      {ganttData.length > 0 && (
        <GanttComponent tasks={ganttData} viewMode="Year" />
      )}
    </div>
  );
}
