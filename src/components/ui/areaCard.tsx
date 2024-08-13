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

export interface AreaProps {
  id: string;
  name: string;
  visible?: boolean;
  toggleVisibility?: () => void;
}

const AreaCard = React.forwardRef<HTMLDivElement, AreaProps>((area, ref) => {
  const { data: session } = useSession();
  const userLoggedIn = !!session;

  const { data: areaDetails } = api.refa.areaByAreaId.useQuery({
    area_id: area.id,
  });

  const { currentProject } = useProjectDetailsStore();

  const { data: areaScore } = api.assessment.getAreaScore.useQuery(
    {
      projectId: currentProject?.id || -1,
      areaId: areaDetails?.id || -1,
    },
    {
      enabled: userLoggedIn && !!currentProject?.id && !!areaDetails?.id,
    },
  );

  // Default values if areaScore is undefined
  const areaMaturityScore = areaScore?.areaMaturityScore ?? 0;
  const targetAreaMaturityScore = areaScore?.targeAreaMaturityScore ?? 1;

  // Calculate the scores on a 100% scale
  const maturityScore = (areaMaturityScore / targetAreaMaturityScore) * 100;

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
