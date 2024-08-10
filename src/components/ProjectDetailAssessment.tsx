import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Slider } from "~/components/ui/slider";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Checkbox } from "~/components/ui/checkbox";
import { AreaSheet } from "~/app/refa/stages/[id]/page";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { ArtifactDialog } from "~/components/ui/artifactCard";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { Badge } from "./ui/badge";
import { api } from "~/trpc/server";
import { Project } from "@prisma/client";

export default async function ProjectDetailAssessment({
  project,
}: {
  project: Project & { assessments: any[] };
}) {
  const stages = await api.refa.stages();
  const areas = await api.refa.areasWithArtefactsByStage({
    stageNumber: Number(2),
  });
  const artefacts = await api.refa.artefactsByStage({
    stageNumber: Number(2),
  });
  return (
    <div className="relative h-full w-full rounded-lg sm:flex-1 sm:px-4">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">{"Stage Name"}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"}>
              Change Stage
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {stages.map((stage) => (
              <DropdownMenuItem key={stage.name}>{stage.name}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="my-4 h-full w-full rounded-lg bg-white p-4">
        <div className="flex h-full w-full justify-between gap-4">
          {/* Areas */}
          <div className="w-full border-black">
            <ScrollArea className="h-full">
              <Badge className="text-xs" variant={"outline"}>
                Areas
              </Badge>
              <Accordion type="single" collapsible defaultValue="item-1">
                {areas?.areas.map((area, key) => (
                  // <AccordionItem key={key} value={`item-${key}`}>
                  <AccordionItem key={key} value={`item-1`}>
                    <AccordionTrigger className="text-md flex text-left font-bold">
                      <span className="inline-flex items-center gap-2">
                        <AreaSheet area={area}>
                          <InfoCircledIcon className="min-h-5 min-w-5" />
                        </AreaSheet>
                        <span className="line-clamp-1">{area.area_name}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="mb-8 space-y-12 p-4">
                      {area.assessment_questions.map((question, key) => (
                        <div key={question.id} className="space-y-4">
                          <p className="text-sm font-bold">{question.body}</p>
                          <p className="text-sm">{question.body}</p>
                          <Slider
                            className="pr-4"
                            defaultValue={[0]}
                            min={0}
                            max={5}
                            step={1}
                          />
                        </div>
                      ))}
                      <textarea
                        className="mr-2 w-full border-2 p-2"
                        placeholder="Leave your comment here... (optional)"
                        rows={3}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </div>
          {/* Artefacts */}
          <div className="w-full border-black">
            <ScrollArea className="h-full">
              <Badge className="text-xs" variant={"outline"}>
                Artefacts
              </Badge>
              <Accordion type="single" collapsible defaultValue="item-1">
                {artefacts?.map((artefact, key) => (
                  // <AccordionItem key={key} value={`item-${key}`}>
                  <AccordionItem key={key} value={`item-1`}>
                    <AccordionTrigger className="text-md text-left font-bold">
                      <span className="inline-flex items-center gap-2">
                        <ArtifactDialog
                          id={artefact.artefact_id}
                          name={artefact.artefact_name}
                        >
                          <InfoCircledIcon className="min-h-5 min-w-5" />
                        </ArtifactDialog>
                        <span className="line-clamp-1">
                          {artefact.artefact_name}
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="mb-8 space-y-4 p-4">
                      <div className="flex justify-between space-y-4">
                        <div className="items-top flex space-x-2">
                          <Checkbox id="terms1" />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="terms1"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              This artefact is handled
                            </label>
                            <p className="text-sm text-muted-foreground">
                              The project satisfies the requirements of this
                              artefact
                            </p>
                          </div>
                        </div>
                      </div>
                      <textarea
                        className="w-full border-2 p-2"
                        placeholder="Leave your comment here... (optional)"
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
