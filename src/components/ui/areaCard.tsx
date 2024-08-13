"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Icons } from "../icons";
import { useSession } from "next-auth/react";
import { cn } from "~/lib/utils";
import useProjectDetailsStore from "~/stores/useProjectDetailsStore";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";

export interface AreaProps {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
  toggleVisibility?: () => void;
}

const AreaCard = React.forwardRef<HTMLDivElement, AreaProps>((area, ref) => {
  const { data: session } = useSession();
  const userLoggedIn = !!session;
  const [loading, setLoading] = useState(true);

  const { data: areaDetails, isFetched: isAreaFetched } =
    api.refa.areaByAreaId.useQuery({
      area_id: area.id,
    });

  const { currentProject } = useProjectDetailsStore();

  const { data: areaScore, isFetched: isScoreFetched } =
    api.assessment.getAreaScore.useQuery(
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
      ? "text-black bg-[hsl(var(--assessment-level-0))]"
      : maturityScore >= 20 && maturityScore < 40
        ? "text-black bg-[hsl(var(--assessment-level-1))]"
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

  useEffect(() => {
    if (isAreaFetched && isScoreFetched) {
      setLoading(false);
    }
  }, [isAreaFetched, isScoreFetched]);

  return (
    <>
      {loading ? (
        <div className="flex animate-pulse items-center justify-center p-4">
          <div className="h-16 w-full max-w-md rounded bg-gray-100"></div>
        </div>
      ) : (
        <Card
          title={area.name}
          className={cn(
            "flex h-full w-full flex-col items-center justify-center",
            backgroundColor,
          )}
        >
          {/* Absolute positioning for icons to ensure visibility */}
          <div className="absolute right-2 top-2 mr-2 h-7 space-x-1 rounded-xl bg-white p-1">
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
          <div
            className={cn(
              "text-bold absolute bottom-2 right-2 space-x-1 text-sm",
              backgroundColor,
            )}
          >
            {maturityScore.toFixed(0)}%
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
            <Tooltip>
              <TooltipTrigger className="flex w-full items-center justify-center">
                {area.type === "Software Engineering" && (
                  <Icons.software_engineering />
                )}
                {area.type === "Security-related Software Engineering" && (
                  <Icons.security_related_software_engineering />
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>Area type: {area.type}</p>
              </TooltipContent>
            </Tooltip>
          </CardContent>
        </Card>
      )}
    </>
  );
});
AreaCard.displayName = "AreaCard";

export { AreaCard };
