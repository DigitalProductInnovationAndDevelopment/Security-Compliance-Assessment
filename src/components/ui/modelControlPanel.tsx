"use client";

import { usePathname } from "next/navigation";
import * as React from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import useViewStore from "~/stores/useViewStore";
import { AREA_VIEW } from "~/stores/viewTypes";
import Link from "next/link";

export interface ModelControlPanelProps {
  stages: { number: number; name: string }[];
}

const ModelControlPanel = React.forwardRef<
  HTMLDivElement,
  ModelControlPanelProps
>(({ stages }, ref) => {
  const currentView = useViewStore((state) => state.currentView);
  const toggleView = useViewStore((state) => state.toggleView);

  const pathname = usePathname();
  const selectedStage = parseInt(pathname.match(/\d+$/)?.[0] ?? "1");

  return (
    <div className="flex items-center justify-between">
      <div className="-ml-3 -mr-40 flex min-w-full">
        {stages.map((stage) => (
          <div key={stage.name} className="border-gray-200 py-4">
            <div className="flex flex-row">
              <span className="inline-flex items-center">
                <Link href={`/refa/stages/${stage.number}`}>
                  <Button
                    variant={"link"}
                    className={cn(
                      "text-md font-medium",
                      selectedStage === stage.number ? "underline" : "",
                    )}
                  >
                    {stage.name}
                  </Button>
                </Link>
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
