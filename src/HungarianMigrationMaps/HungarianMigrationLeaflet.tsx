import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { type MigrationPoint } from "../data/hungarianMigrationData";
import L from "leaflet";
import { useBenchmarkRunner } from "../hooks/useBenchmarkRunner";
import { useBenchmark } from "../hooks/useBenchmark";

import "leaflet/dist/leaflet.css";

interface Props {
  data: MigrationPoint[];
}

// Fix default marker icons
delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function HungarianMigrationLeaflet({ data }: Props) {
  const route = data.map((p) => [p.lat, p.lon] as [number, number]);

  const bounds: L.LatLngBoundsExpression = [
    [35, -10],
    [70, 90],
  ];

  const { runId, runBenchmark } = useBenchmarkRunner();

  useBenchmark("FlowMapLeaflet", runId);

  return (
    <div>
      <div style={{ width: "1020px", height: "600px" }}>
        <MapContainer
          key={runId}
          bounds={bounds}
          maxBounds={bounds}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Polyline
            positions={route}
            pathOptions={{ color: "#e63946", weight: 3 }}
          />

          {data.map((point, index) => (
            <Marker key={index} position={[point.lat, point.lon]}>
              <Popup>
                <strong>{point.name}</strong>
                <br />
                Year: {point.year}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
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
