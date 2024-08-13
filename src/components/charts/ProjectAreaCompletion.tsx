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
import { api } from "~/trpc/react";

// Configuration for chart styling
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

// Helper function to truncate long labels
function truncateLabel(label: string, maxLength: number = 10): string {
  return label.length > maxLength ? `${label.slice(0, maxLength)}...` : label;
}

export function ProjectAreaCompletion({
  showTitle = false,
  projectId,
  labels = ["sit", "crawl", "walk", "run", "jump", "fly"],
  title,
}: {
  showTitle?: boolean;
  projectId: number;
  labels?: string[];
  title?: string;
}) {
  const { currentStage } = useProjectDetailsStore();
  const { data: projectStatistics, isLoading } = api.assessment.getProjectStatistics.useQuery({
    projectId: projectId,
    stageId: currentStage.id, // Use current stage ID from the store
  });

  if (isLoading) return <div>Loading...</div>;

  if (!projectStatistics) {
    return <div>No project statistics found.</div>;
  }

  const areaChartData = projectStatistics.areaAverages
    .map((area) => ({
      label: area.name,
      actual: Math.round(area.averageScore) || 0,
      expected: Math.round(area.expectedScore) || 0,
    }))
    .filter(data => data.label && data.actual != null && data.expected != null); // Filter out incomplete data

  return (
    <Fragment>
      {showTitle && <h1 className="py-2 text-lg font-bold">Area Averages for {currentStage.name}</h1>}
      <Card className="m-0 w-full pt-6">
        <CardContent>
          <ChartContainer config={chartConfig} className="mx-auto max-w-full">
            <RadarChart data={areaChartData}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <PolarAngleAxis
                dataKey="label"
                tickFormatter={(label) => truncateLabel(label, 15)}
              />
              <PolarGrid radialLines={false} />
              <Radar
                dataKey="actual"
                fill="var(--color-actual)"
                fillOpacity={0.2} // Adjusted for visibility
                stroke="var(--color-actual)"
                strokeWidth={2}
              />
              <Radar
                dataKey="expected"
                fill="var(--color-expected)"
                fillOpacity={0.2} // Adjusted for visibility
                stroke="var(--color-expected)"
                strokeWidth={2}
              />
              <PolarRadiusAxis
                angle={60}
                stroke="hsla(var(--foreground))"
                orientation="middle"
                axisLine={false}
                tick={{ fill: "hsla(var(--foreground))" }}
                ticks={[0, 1, 2, 3, 4, 5] as unknown as TickItem[]}
                tickFormatter={(value) => labels[value as number] ?? (value as string)}
                domain={[0, 5]}
              />
            </RadarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </Fragment>
  );
}
