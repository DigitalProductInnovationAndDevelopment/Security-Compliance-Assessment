"use client";

import { usePathname } from "next/navigation";
import * as React from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { SwitchValue, ViewSwitch } from "./viewSwitch";
import useViewStore from "~/stores/useViewStore";
import { AREA_VIEW } from "~/stores/viewTypes";
import Link from "next/link";
import useProjectDetailsStore from "~/stores/useProjectDetailsStore";
import { Project, Stage } from "@prisma/client";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export interface ModelControlPanelProps {
  stages: Stage[];
}

const ModelControlPanel = React.forwardRef<
  HTMLDivElement,
  ModelControlPanelProps
>(({ stages }, ref) => {
  const currentView = useViewStore((state) => state.currentView);
  const toggleView = useViewStore((state) => state.toggleView);

  const pathname = usePathname();
  const selectedStage = parseInt(pathname.match(/\d+$/)?.[0] ?? "1");

  const { currentStage, currentProject, setCurrentStage, setCurrentProject } =
    useProjectDetailsStore();

  const { data: session } = useSession();
  const { data: allProjects } = api.project.getProjects.useQuery();

  useEffect(() => {
    if (currentStage.id === -1 && stages?.[0]) {
      setCurrentStage(stages[0]);
    }
  }, [stages, setCurrentStage]);

  useEffect(() => {
    if (session && currentProject == null) {
      if (allProjects && allProjects.length > 0) {
        // use first project if store doesn't have project set
        setCurrentProject(allProjects[0]!);
      }
    }
  }, [allProjects, setCurrentProject]);

  return (
    <div className="flex items-center justify-between">
      <div className="-ml-3 flex w-full">
        {stages.map((stage) => (
          <div key={stage.name} className="border-gray-200 py-4">
            <div className="flex flex-row">
              <span className="inline-flex items-center">
                <Link href={`/refa/stages/${stage.stageNumber}`}>
                  <Button
                    variant={"link"}
                    className={cn(
                      "text-md font-medium",
                      selectedStage === stage.stageNumber ? "underline" : "",
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
      {session ? (
        <div className="flex w-full">
          {allProjects?.length == 0 ? (
            <div className="overflow-hidden text-center font-semibold">
              This user has no projects assigned.
            </div>
          ) : (
            <div className="flex w-full flex-col items-center text-sm">
              <div className="m-2 flex-shrink-0 overflow-hidden font-bold hover:underline">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={`/projects/${currentProject?.id}`}>
                      <Button variant={"outline"}>
                        {currentProject?.name}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    Go to project details
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="mb-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"outline"}>
                      {currentProject?.name}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {allProjects?.map((project: Project) => (
                      <DropdownMenuItem
                        key={project.id}
                        onSelect={async () => {
                          if (project.id !== currentProject?.id) {
                            setCurrentProject(project);
                          }
                        }}
                      >
                        {project.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
      <ViewSwitch
        value={
          currentView === AREA_VIEW ? SwitchValue.Areas : SwitchValue.Artefacts
        }
        onChange={toggleView}
      ></ViewSwitch>
    </div>
  );
});
ModelControlPanel.displayName = "ModelControlPanel";

export { ModelControlPanel };
