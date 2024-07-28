"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

const chartData = [
  { phase: "Plan Program", artefact: 186, area: 80 },
  { phase: "Plan Team", artefact: 305, area: 200 },
  { phase: "Code", artefact: 237, area: 120 },
  { phase: "Build", artefact: 73, area: 190 },
  { phase: "Test", artefact: 209, area: 130 },
  { phase: "Release", artefact: 214, area: 140 },
  { phase: "Deploy", artefact: 214, area: 140 },
  { phase: "Operate", artefact: 214, area: 140 },
  { phase: "Monitor", artefact: 214, area: 140 },
];

const chartConfig = {
  artefact: {
    label: "Artefact",
    color: "hsl(var(--chart-1))",
  },
  area: {
    label: "Area",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ProjectCompletion() {
  return (
    <ChartContainer config={chartConfig}>
      <RadarChart
        data={chartData}
        margin={{
          top: -40,
          bottom: -10,
        }}
      >
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <PolarAngleAxis dataKey="phase" />
        <PolarGrid />
        <Radar
          dataKey="artefact"
          fill="var(--color-artefact)"
          fillOpacity={0.6}
        />
        <Radar dataKey="area" fill="var(--color-area)" />
        <ChartLegend className="mt-8" content={<ChartLegendContent />} />
      </RadarChart>
    </ChartContainer>
  );
}
