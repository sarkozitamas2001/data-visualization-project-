interface resultsType {
  name: string,
  renderTime: number,
  frameTime: number,
  timestamp: number
}

export function exportResults() {

  const results =
    window.perfResults || [];

  const headers = [
    "name",
    "renderTime",
    "frameTime",
    "timestamp"
  ];

  const rows = results.map((r: resultsType) =>
    [
      r.name,
      r.renderTime,
      r.frameTime,
      r.timestamp
    ].join(",")
  );

  const csv = [
    headers.join(","),
    ...rows
  ].join("\n");

  const blob = new Blob(
    [csv],
    { type: "text/csv" }
  );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download =
    `${results[0]?.name ?? "benchmark"}-${Date.now()}.csv`;

  a.click();

  URL.revokeObjectURL(url);
}