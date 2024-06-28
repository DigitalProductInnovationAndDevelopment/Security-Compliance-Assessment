"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";

export interface ModelControlPanelProps {
  stages: { number: number; name: string }[];
}

const ModelControlPanel = React.forwardRef<
  HTMLDivElement,
  ModelControlPanelProps
>(({ stages }, ref) => {
  const [currentStageNumber, setCurrentStageNumber] = useState(1);
  const [isAreaView, setIsAreaView] = useState(true);
  const router = useRouter();

  useEffect(() => {
    router.push(
      `/refa/stages/${currentStageNumber}?view=${isAreaView ? "areas" : "artefacts"}`,
    );
  }, [currentStageNumber, isAreaView, router]);

  const handleToggle = () => {
    setIsAreaView(!isAreaView);
  };

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
      <Button variant="outline" onClick={handleToggle}>
        Change to {isAreaView ? "Artefacts" : "Areas"}
      </Button>
    </div>
  );
});
ModelControlPanel.displayName = "ModelControlPanel";

export { ModelControlPanel };
