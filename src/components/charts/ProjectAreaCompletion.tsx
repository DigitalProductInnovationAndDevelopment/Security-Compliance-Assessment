"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";
import { TickItem } from "recharts/types/util/types";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { Card, CardContent } from "../ui/card";
import { Fragment } from "react";
import useProjectDetailsStore from "~/stores/useProjectDetailsStore";

const chartData = [
  { label: "Plan Program", actual: 1, expected: 5 },
  { label: "Plan Team", actual: 3, expected: 1 },
  { label: "Code", actual: 2, expected: 3 },
  { label: "Build", actual: 4.5, expected: 1 },
  { label: "Test", actual: 4, expected: 5 },
  { label: "Release", actual: 2, expected: 4 },
  { label: "Deploy", actual: 2, expected: 4 },
  { label: "Operate", actual: 2, expected: 4 },
  { label: "Monitor", actual: 2, expected: 4 },
];

const chartConfig = {
  actual: {
    label: "Actual",
    color: "hsl(var(--chart-1))",
  },
  expected: {
    label: "Expected",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ProjectAreaCompletion({
  showTitle = false,
}: {
  showTitle?: boolean;
}) {
  const labels = ["sit", "crawl", "walk", "run", "jump", "fly"];
  const { currentStage } = useProjectDetailsStore();

  return (
    <Fragment>
      {showTitle && (
        <h1 className="py-2 text-lg font-bold">
          Asessment of {currentStage.name}
        </h1>
      )}
      <Card className="m-0 w-full pt-6">
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <RadarChart data={chartData}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <PolarAngleAxis dataKey="label" />
              <PolarGrid radialLines={false} />
              <Radar
                dataKey="actual"
                fill="var(--color-actual)"
                fillOpacity={0}
                stroke="var(--color-actual)"
                strokeWidth={2}
              />
              <Radar
                dataKey="expected"
                fill="var(--color-expected)"
                fillOpacity={0}
                stroke="var(--color-expected)"
                strokeWidth={2}
              />
              <PolarRadiusAxis
                angle={60}
                stroke="hsla(var(--foreground))"
                orientation="middle"
                axisLine={false}
                tick={{ fill: "hsla(var(--foreground))" }}
                ticks={[0, 1, 2, 3, 4, 5] as unknown as TickItem[]} // Set ticks manually
                tickFormatter={(value) => {
                  return labels[value as number] ?? (value as string);
                }}
                domain={[0, 5]} // Ensure the domain matches the labels
              />
            </RadarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </Fragment>
  );
}
