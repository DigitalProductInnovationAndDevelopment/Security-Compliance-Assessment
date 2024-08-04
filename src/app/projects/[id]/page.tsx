import { ChevronDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/server";
import { ProjectCompletion } from "~/components/charts/ProjectCompletion";
import { Card, CardContent } from "~/components/ui/card";
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

const project_members = [
  "Ziyad Mourabiti",
  "Mohamed El-Sayed",
  "Ahmed El-Sayed",
  "Abdelhakim El-Sayed",
];

export default async function Page({
  params,
}: Readonly<{ params: { id: string } }>) {
  const stages = await api.refa.stages();
  const areas = await api.refa.areasWithArtefactsByStage({ stageNumber: 2 });
  const artefacts = await api.refa.artefactsByStage({ stageNumber: 2 });
  return (
    <div className="mx-2 flex h-screen flex-wrap gap-4 py-16">
      <div className="relative w-full max-w-xl sm:flex-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {"Project Name"}
            {` `}
            {params.id}
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>
                Change Project
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All</DropdownMenuItem>
              <DropdownMenuItem>Archived</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-row gap-4 py-4">
          <div className="text-sm text-gray-500">{"Project Description"}</div>
        </div>
        {/* project members */}
        <div className="gap-4 py-4">
          <h1 className="py-2 text-lg font-bold">Project Members</h1>
          <div className="flex flex-row flex-wrap gap-4">
            {project_members.map((member) => (
              <div
                key={member}
                className="text-md flex items-center gap-4 px-2 py-1"
              >
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-md font-medium">{member}</span>
                  <span className="text-xs text-gray-500">
                    <Badge className="text-xs" variant={"outline"}>
                      Assessor
                    </Badge>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-full gap-4 py-4">
          <div className="flex flex-wrap gap-4">
            <div className="w-full xl:flex-1">
              <h1 className="py-2 text-lg font-bold">
                Your Assessment Progress
              </h1>
              <Card className="m-0 w-full pt-6">
                <CardContent>
                  <ProjectCompletion />
                </CardContent>
              </Card>
            </div>
            <div className="w-full xl:flex-1">
              <h1 className="flex items-center gap-2 py-2 text-lg font-bold">
                <Badge className="text-xs" variant={"destructive"}>
                  Assessor
                </Badge>
                Team Results
              </h1>
              <Card className="m-0 w-full pt-6">
                <CardContent>
                  <ProjectCompletion />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <div className="relative h-full w-full rounded-lg sm:flex-1 sm:px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">
            {"Stage Name"}
            {` `}
            {params.id}
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>
                Change Stage
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {stages.map((stage) => (
                <DropdownMenuItem key={stage.name}>
                  {stage.name}
                </DropdownMenuItem>
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
                <Accordion type="single" collapsible>
                  {areas?.areas.map((area, key) => (
                    <AccordionItem key={key} value={`item-${key}`}>
                      <AccordionTrigger className="text-md flex text-left font-bold">
                        <span className="inline-flex items-center gap-2">
                          {area.area_name}
                          <AreaSheet area={area}>
                            <InfoCircledIcon className="h-5 w-5" />
                          </AreaSheet>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="mb-8 space-y-12 p-4">
                        <div className="space-y-4">
                          <p className="text-sm font-bold">Question 1</p>
                          <p className="text-sm">
                            It is possible to trace security functional
                            requirements with the related code e.g branches?
                          </p>
                          <Slider
                            className="pr-4"
                            defaultValue={[0]}
                            min={0}
                            max={5}
                            step={1}
                          />
                        </div>
                        <div className="space-y-4">
                          <p className="text-sm font-bold">Question 2</p>
                          <p className="text-sm">
                            It is possible to trace security functional
                            requirements with the related code e.g branches?
                          </p>
                          <Slider
                            className="pr-4"
                            defaultValue={[0]}
                            min={0}
                            max={5}
                            step={1}
                          />
                        </div>
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
                <Accordion type="single" collapsible>
                  {artefacts?.map((artefact, key) => (
                    <AccordionItem key={key} value={`item-${key}`}>
                      <AccordionTrigger className="text-md text-left font-bold">
                        <span className="inline-flex items-center gap-2">
                          {artefact.artefact_name}
                          <ArtifactDialog
                            id={artefact.artefact_id}
                            name={artefact.artefact_name}
                          >
                            <InfoCircledIcon className="h-5 w-5" />
                          </ArtifactDialog>
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
    </div>
  );
}
