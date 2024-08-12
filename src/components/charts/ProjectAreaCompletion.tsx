'use client';
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
  data,
  labels = ["sit", "crawl", "walk", "run", "jump", "fly"],
  title,
}: {
  showTitle?: boolean;
  data: Array<{ label: string; actual: number; expected: number }>;
  labels?: string[];
  title?: string;
}) {
  return (
    <Fragment>
      {showTitle && (
        <h1 className="py-2 text-lg font-bold">
          {title}
        </h1>
      )}
      <Card className="m-0 w-full pt-6">
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="mx-auto max-w-full"
          >
            <RadarChart data={data}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <PolarAngleAxis 
                dataKey="label"
                tickFormatter={(label) => truncateLabel(label, 15)} // Truncate labels to 15 characters
              />
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
