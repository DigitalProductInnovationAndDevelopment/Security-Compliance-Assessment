"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Icons } from "../icons";
import { useSession } from "next-auth/react";
import { cn } from "~/lib/utils";
import useProjectDetailsStore from "~/stores/useProjectDetailsStore";
import { api } from "~/trpc/react";

interface Area {
  id: number;
  // Add other fields as needed
}

interface Assessment {
  userId: string;
  projectId: number;
  // Add other fields as needed
}

// Define the AreaScore interface
interface AreaScore {
  id: number;
  areaId: number;
  assessmentUserId: string;
  assessmentProjectId: number;
  artefactsCompletenessScore: number;
  areaMaturityScore: number;
  areaCompletenessScore: number;
  targetAreaMaturityScore: number;
  area: Area;
  assessment: Assessment;
}

// Generate mock data for 7 AreaScore entries
const mockAreaScoreData: AreaScore[] = [
  {
    id: 1,
    areaId: 287,
    assessmentUserId: "clzo02vox000212nn4u4ruqgl",
    assessmentProjectId: 3,
    artefactsCompletenessScore: 78.4,
    areaMaturityScore: 10.1,
    areaCompletenessScore: 77.8,
    targetAreaMaturityScore: 80.0,
    area: { id: 287 },
    assessment: { userId: "clzo02vox000212nn4u4ruqgl", projectId: 3 },
  },
  {
    id: 2,
    areaId: 288,
    assessmentUserId: "clzo02vox000212nn4u4ruqgl",
    assessmentProjectId: 3,
    artefactsCompletenessScore: 85.0,
    areaMaturityScore: 24.5,
    areaCompletenessScore: 82.0,
    targetAreaMaturityScore: 84.0,
    area: { id: 288 },
    assessment: { userId: "clzo02vox000212nn4u4ruqgl", projectId: 3 },
  },
  {
    id: 3,
    areaId: 289,
    assessmentUserId: "clzo02vox000212nn4u4ruqgl",
    assessmentProjectId: 3,
    artefactsCompletenessScore: 90.2,
    areaMaturityScore: 45.0,
    areaCompletenessScore: 85.6,
    targetAreaMaturityScore: 87.0,
    area: { id: 289 },
    assessment: { userId: "clzo02vox000212nn4u4ruqgl", projectId: 3 },
  },
  {
    id: 4,
    areaId: 290,
    assessmentUserId: "clzo02vox000212nn4u4ruqgl",
    assessmentProjectId: 3,
    artefactsCompletenessScore: 76.7,
    areaMaturityScore: 67.3,
    areaCompletenessScore: 74.9,
    targetAreaMaturityScore: 78.0,
    area: { id: 290 },
    assessment: { userId: "clzo02vox000212nn4u4ruqgl", projectId: 3 },
  },
  {
    id: 5,
    areaId: 291,
    assessmentUserId: "clzo02vox000212nn4u4ruqgl",
    assessmentProjectId: 3,
    artefactsCompletenessScore: 88.5,
    areaMaturityScore: 85.4,
    areaCompletenessScore: 86.9,
    targetAreaMaturityScore: 85.0,
    area: { id: 291 },
    assessment: { userId: "clzo02vox000212nn4u4ruqgl", projectId: 3 },
  },
  {
    id: 6,
    areaId: 292,
    assessmentUserId: "clzo02vox000212nn4u4ruqgl",
    assessmentProjectId: 3,
    artefactsCompletenessScore: 92.1,
    areaMaturityScore: 100.0,
    areaCompletenessScore: 90.0,
    targetAreaMaturityScore: 90.0,
    area: { id: 292 },
    assessment: { userId: "clzo02vox000212nn4u4ruqgl", projectId: 3 },
  },
  {
    id: 7,
    areaId: 293,
    assessmentUserId: "clzo02vox000212nn4u4ruqgl",
    assessmentProjectId: 3,
    artefactsCompletenessScore: 80.4,
    areaMaturityScore: 77.6,
    areaCompletenessScore: 78.5,
    targetAreaMaturityScore: 79.0,
    area: { id: 293 },
    assessment: { userId: "clzo02vox000212nn4u4ruqgl", projectId: 3 },
  },
];

export interface AreaProps {
  id: string;
  name: string;
  visible?: boolean;
  toggleVisibility?: () => void;
}

const AreaCard = React.forwardRef<HTMLDivElement, AreaProps>((area, ref) => {
  const { data: session } = useSession();
  const userLoggedIn = !!session;

  const { data } = api.refa.areaByAreaId.useQuery({
    area_id: area.id,
  });

  const { currentProject } = useProjectDetailsStore();

  const maturityScore = mockAreaScoreData.find(
    (score) =>
      score.areaId === data?.id &&
      score.assessmentProjectId === currentProject?.id &&
      score.assessmentUserId === session?.user?.id,
  )?.areaMaturityScore!;

  const backgroundColor = userLoggedIn
    ? maturityScore == null || maturityScore < 20
      ? "bg-[hsl(var(--assessment-level-0))]"
      : maturityScore >= 20 && maturityScore < 40
        ? "bg-[hsl(var(--assessment-level-1))]"
        : maturityScore >= 40 && maturityScore < 60
          ? "text-white bg-[hsl(var(--assessment-level-2))]"
          : maturityScore >= 60 && maturityScore < 80
            ? "text-white bg-[hsl(var(--assessment-level-3))]"
            : maturityScore >= 80 && maturityScore < 100
              ? "text-white bg-[hsl(var(--assessment-level-4))]"
              : maturityScore === 100
                ? "text-white bg-[hsl(var(--assessment-level-5))]"
                : ""
    : ""; // if not loggedIn show no color coding

  return (
    <Card
      title={area.name}
      className={cn(
        "flex h-full w-full flex-col items-center justify-center",
        backgroundColor,
      )}
    >
      <div className="absolute right-2 top-2 space-x-1">
        <Button
          variant="outline"
          size="icon"
          className="h-4 w-4 shrink-0 rounded-full opacity-50 hover:bg-accent hover:text-accent-foreground"
          onClick={area.toggleVisibility}
        >
          {area.visible ? <Icons.show /> : <Icons.hide />}
        </Button>
        {/* Info icon to trigger info sheet */}
        <SheetTrigger>
          <div className="h-4 w-4 shrink-0 rounded-full opacity-50 hover:bg-accent hover:text-accent-foreground">
            <Icons.info />
          </div>
        </SheetTrigger>
        {/* If user is logged in, edit icon to trigger assess sheet */}
        {userLoggedIn && (
          <Sheet>
            <SheetTrigger>
              <div className="h-4 w-4 shrink-0 rounded-full opacity-50 hover:bg-accent hover:text-accent-foreground">
                <Icons.edit />
              </div>
            </SheetTrigger>
            <SheetContent className="lg:min-w-[40vw]">
              <SheetHeader>
                <SheetTitle className="text-center">
                  <div>Assess Area: </div>
                  {area.name}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <p>TODO: Edit assessment about this area.</p>
                {/* TODO: Implement assessment component here */}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
      <CardHeader
        className="flex flex-col items-center justify-center"
        title={area.name}
      >
        <CardTitle className="text-center">{area.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="text-center">
          <p className={cn("text-sm text-gray-500", backgroundColor)}>
            {area.id}
          </p>
        </div>
      </CardContent>
    </Card>
  );
});
AreaCard.displayName = "AreaCard";

export { AreaCard };
