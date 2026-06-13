import React, { useState } from "react";
import "./App.css";

// Radial Tree
import RadialTreeD3 from "./RadialTree/RadialTreeD3";
import RadialTreeVegaMeasured from "./RadialTree/RadialTreeVegaMeasured";

// Flow Map
import HungarianMigrationLeaflet from "./HungarianMigrationMaps/HungarianMigrationLeaflet";
import HungarianMigrationMap from "./HungarianMigrationMaps/HungarianMigrationMap";
import HungarianMigrationMapMeasured from "./HungarianMigrationMaps/HungarianMigrationMapMeasured";

// Stream Graph
import StreamGraphNivo from "./StreamGraph/StreamGraphNivo";
import StreamGraphRecharts from "./StreamGraph/StreamGraphRecharts";
import StreamGraphD3 from "./StreamGraph/StreamGraphD3";
import StreamGraphVisx from "./StreamGraph/StreamGraphVisx";

// Gantt
import GanttVisx from "./Gantt/GanttVisx";
import GanttFramerMotion from "./Gantt/GanttFramerMotion";
import GanttFrappe from "./Gantt/GanttFrappe";
// import GanttReact from "./Gantt/GanttReact";

//data
import Papa from "papaparse";
import { indoEuropeanData, type TreeNode } from "./data/indoEuropeanData";
import { hungarianMigration, type MigrationPoint } from "./data/hungarianMigrationData";
import { languageSpeakersNivo, type languageSpeakersType } from "./data/languageSpeakers";
import { languageEvolution, type LanguageStage } from "./data/languageEvolution";

function App() {
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [selectedLib, setSelectedLib] = useState<string | null>(null);
  const [treeData, setTreeData] = useState<TreeNode[]>(indoEuropeanData);
  const [migrationData, setMigrationData] = useState<MigrationPoint[]>(hungarianMigration);
  const [streamData, setStreamData] = useState<languageSpeakersType[]>(languageSpeakersNivo);
  const [ganttData, setGanttData] = useState<LanguageStage[]>(languageEvolution);

  const streamKeys = 
    streamData.length > 0
     ? Object.keys(streamData[0]).filter(key => key !== "year")
     : [];

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  const handleTreeCsvUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    Papa.parse<TreeNode>(file, {
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        const parsed = results.data.map(row => ({
          id: row.id,
          name: row.name,
          parent: row.parent || null
        }));

        setTreeData(parsed);
      }
    });
  };

  const handleMigrationCsvUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    Papa.parse<MigrationPoint>(file, {
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        const parsed = results.data.map((row, index: number) => ({
          index,
          name: row.name,
          lat: Number(row.lat),
          lon: Number(row.lon),
          year: Number(row.year)
        }));

        setMigrationData(parsed);
      }
    });
  };

  const handleStreamCsvUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        const parsed = results.data.map((row: Record<string, string>) => {
          const converted: languageSpeakersType = {
            year: ""
          };

          Object.keys(row).forEach(key => {
            converted[key] =
              key === "year"
                ? row[key]
                : Number(row[key]);
          });

          return converted;
        });

        setStreamData(parsed);
      }
    });
  };

  const handleGanttCsvUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    Papa.parse<LanguageStage>(file, {
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        const parsed = results.data.map(row => ({
          language: row.language,
          stage: row.stage,
          start: Number(row.start),
          end: Number(row.end)
        }));

        setGanttData(parsed);
      }
    });
  };

  return (
    <div className="container">

      <div className="tabs">
        <button
          className={`tab ${selectedTab === "tree" ? "active" : ""}`}
          onClick={() => handleTabClick("tree")}
        >
          Radial Tree
        </button>
        <span> | </span>

        <button
          className={`tab ${selectedTab === "flow-map" ? "active" : ""}`}
          onClick={() => handleTabClick("flow-map")}
        >
          Flow Map
        </button>
        <span> | </span>

        <button
          className={`tab ${selectedTab === "stream-graph" ? "active" : ""}`}
          onClick={() => handleTabClick("stream-graph")}
        >
          Stream Graph
        </button>
        <span> | </span>

        <button
          className={`tab ${selectedTab === "gantt-chart" ? "active" : ""}`}
          onClick={() => handleTabClick("gantt-chart")}
        >
          Gantt Chart
        </button>
      </div>

      <div style={{ margin: "20px 0" }}>
        {selectedTab === "tree" && (
          <>
            <button onClick={() => setSelectedLib("d3-tree")}>D3</button>
            <button onClick={() => setSelectedLib("vega-tree")}>Vega</button>
            <div style={{marginTop: "10px" }}>
              <input
                type="file"
                accept=".csv"
                onChange={handleTreeCsvUpload}
              />
            <button onClick={() => setTreeData(indoEuropeanData)}>
              Load Default Dataset
            </button>
            </div>
          </>
        )}

        {selectedTab === "flow-map" && (
          <>
            <button onClick={() => setSelectedLib("d3-map")}>D3</button>
            <button onClick={() => setSelectedLib("vega-map")}>Vega</button>
            <button onClick={() => setSelectedLib("leaflet-map")}>Leaflet</button>
            <div style={{marginTop: "10px" }}>
              <input
                type="file"
                accept=".csv"
                onChange={handleMigrationCsvUpload}
              />
            <button onClick={() => setMigrationData(hungarianMigration)}>
              Load Default Dataset
            </button>
            </div>            
          </>
        )}

        {selectedTab === "stream-graph" && (
          <>
            <button onClick={() => setSelectedLib("d3-stream")}>D3</button>
            <button onClick={() => setSelectedLib("visx-stream")}>Visx</button>
            <button onClick={() => setSelectedLib("nivo-stream")}>Nivo</button>
            <button onClick={() => setSelectedLib("recharts-stream")}>Recharts</button>        
            <div style={{marginTop: "10px" }}>
              <input
                type="file"
                accept=".csv"
                onChange={handleStreamCsvUpload}
              />
            <button onClick={() => setStreamData(languageSpeakersNivo)}>
              Load Default Dataset
            </button>
            </div>
          </>
        )}

        {selectedTab === "gantt-chart" && (
          <>
            <button onClick={() => setSelectedLib("visx-gantt")}>Visx</button>
            <button onClick={() => setSelectedLib("framer-gantt")}>Framer Motion</button>
            <button onClick={() => setSelectedLib("frappe-gantt")}>Frappe</button>
            <div style={{marginTop: "10px" }}>
              <input
                type="file"
                accept=".csv"
                onChange={handleGanttCsvUpload}
              />
            <button onClick={() => setGanttData(languageEvolution)}>
              Load Default Dataset
            </button>
            </div>
          </>
        )}
      </div>


      {selectedTab === "tree" && (
        <div>
          <h2>Indo-European Language Tree</h2>

          {selectedLib === "vega-tree" && (
            <RadialTreeVegaMeasured 
            key="vega"
            data={treeData} />
          )}

          {selectedLib === "d3-tree" && (
            <RadialTreeD3 
            key="d3"
            data={treeData}
            />
          )}
        </div>
      )}

      {selectedTab === "flow-map" && (
        <div>
          <h2>Migration Map</h2>

          {selectedLib === "d3-map" && (
            <HungarianMigrationMap 
            key="d3"
            data={migrationData}
            />
          )}

          {selectedLib === "leaflet-map" && (
            <HungarianMigrationLeaflet 
            key="leaflet"
            data={migrationData}
            />
          )}

          {selectedLib === "vega-map" && (
            <HungarianMigrationMapMeasured
              key="vega"
              data={migrationData}
            />
          )}
        </div>
      )}

      {selectedTab === "stream-graph" && (
        <div>
          <h2>Stream Graph</h2>

          {selectedLib === "nivo-stream" && (
            <StreamGraphNivo 
            key="nivo"
            data={streamData}
            keys={streamKeys}
            />
          )}

          {selectedLib === "recharts-stream" && (
            <StreamGraphRecharts 
            key="recharts"
            data={streamData}
            keys={streamKeys}
            />
          )}

          {selectedLib === "d3-stream" && (
            <StreamGraphD3 
            key="d3"
            data={streamData}
            keys={streamKeys}
            />
          )}

          {selectedLib === "visx-stream" && (
            <StreamGraphVisx 
            key="visx"
            data={streamData}
            keys={streamKeys}
            />
          )}
        </div>
      )}

      {selectedTab === "gantt-chart" && (
        <div>
          <h2>Gantt Chart</h2>

          {selectedLib === "visx-gantt" && (
            <GanttVisx 
            key="visx"
            data={ganttData}
            />
          )}

          {selectedLib === "framer-gantt" && (
            <GanttFramerMotion 
            key="framer"
            data={ganttData}
            />
          )}

          {selectedLib === "frappe-gantt" && (
            <GanttFrappe key="frappe" />
          )}
        </div>
      )}

    </div>
  );
}

export default App;