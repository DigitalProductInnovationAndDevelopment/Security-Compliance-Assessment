"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import useViewStore from "~/stores/useViewStore";
import { AREA_VIEW } from "~/stores/viewTypes";

export interface ModelControlPanelProps {
  stages: { number: number; name: string }[];
}

const ModelControlPanel = React.forwardRef<
  HTMLDivElement,
  ModelControlPanelProps
>(({ stages }, ref) => {
  const [currentStageNumber, setCurrentStageNumber] = useState(1);
  const currentView = useViewStore((state) => state.currentView);
  const toggleView = useViewStore((state) => state.toggleView);
  const router = useRouter();

  useEffect(() => {
    router.push(`/refa/stages/${currentStageNumber}`);
  }, [currentStageNumber, router]);

  const handleStageClick = (stageNumber: number) => {
    setCurrentStageNumber(stageNumber);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="-ml-3 -mr-40 flex min-w-full">
        {stages.map((stage) => (
          <div key={stage.name} className="border-gray-200 py-4">
            <div className="flex flex-row">
              <span className="inline-flex items-center">
                <Button
                  variant={"link"}
                  onClick={() => handleStageClick(stage.number)}
                  className={cn(
                    "text-md font-medium",
                    currentStageNumber === stage.number ? "underline" : "",
                  )}
                >
                  {stage.name}
                </Button>
              </span>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" onClick={toggleView}>
        Change to {currentView === AREA_VIEW ? "Artefacts" : "Areas"}
      </Button>
    </div>
  );
});
ModelControlPanel.displayName = "ModelControlPanel";

export { ModelControlPanel };
