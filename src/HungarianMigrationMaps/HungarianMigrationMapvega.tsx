import type { Spec } from "vega";
import { type MigrationPoint } from "../data/hungarianMigrationData";

export const HungarianMigrationMapvega = (
  data: MigrationPoint[],
  play: boolean,
): Spec => ({
  $schema: "https://vega.github.io/schema/vega/v5.json",

  width: 700,
  height: 450,

  signals: [
    {
      name: "play",
      value: play,
    },

    {
      name: "step",
      value: 0,
      on: [
        {
          events: { type: "timer", throttle: 1000 }, //800
          update: "play ? step + 1 : step",
        },
      ],
    },
  ],

  projections: [
    {
      name: "projection",
      type: "naturalEarth1",

      //fit: { data: "world" },
      center: [40, 55],

      scale: 150,
      //scale: 900,

      translate: [{ signal: "width/2" }, { signal: "height/2" }],
    },
  ],

  data: [
    {
      name: "world",
      url: "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
      format: { type: "topojson", feature: "countries" },
    },

    {
      name: "migration",
      values: data,
      transform: [
        {
          type: "filter",
          expr: "datum.index <= step",
        },
        {
          type: "geopoint",
          projection: "projection",
          fields: ["lon", "lat"],
          as: ["x", "y"],
        },
      ],
    },
  ],

  marks: [
    {
      type: "shape",
      from: { data: "world" },
      transform: [{ type: "geoshape", projection: "projection" }],
      encode: {
        update: {
          fill: { value: "#f0f0f0" },
          stroke: { value: "#999" },
        },
      },
    },

    {
      type: "line",
      from: { data: "migration" },
      encode: {
        update: {
          x: { field: "x" },
          y: { field: "y" },
          stroke: { value: "#e63946" },
          strokeWidth: { value: 3 },
        },
      },
    },

    {
      type: "symbol",
      from: { data: "migration" },
      encode: {
        enter: {
          size: { value: 120 },
          fill: { value: "#1d3557" },
          stroke: { value: "#fff" },
        },
        update: {
          x: { field: "x" },
          y: { field: "y" },
          tooltip: { signal: "{name: datum.name, year: datum.year}" },
        },
      },
    },
  ],
});
