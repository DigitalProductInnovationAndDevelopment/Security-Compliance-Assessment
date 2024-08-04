import React from "react";
import { api } from "~/trpc/server";
import { Sheet } from "~/components/ui/sheet";
import CardWrapper from "~/components/ui/cardWrapper";
import { Area, Artefact } from "@prisma/client";

export default async function Page({
  params,
}: Readonly<{ params: { id: string } }>) {
  const areasWithArtefacts = await api.refa.areasWithArtefactsByStage({
    stageNumber: parseInt(params.id),
  });
  // if the link is not something like refa/stages/1 or refa/stages/2
  // redirect to the first stage

  return (
    <div className="relative min-h-full w-full rounded-lg bg-white p-8">
      <div className="flex min-w-full flex-wrap gap-4">
        {areasWithArtefacts?.areas.map((area) => (
          <AreaSheet key={area.area_id} area={area}>
            <CardWrapper
              area={{
                id: area.area_id,
                name: area.area_name,
                people: area.people,
                process: area.process,
                technology: area.technology,
                people_practices: area.people_practices,
                process_practices: area.process_practices,
                technology_practices: area.technology_practices,
              }}
              artifacts={area.artefacts.map((artefact) => ({
                id: artefact.artefact_id,
                name: artefact.artefact_name,
              }))}
            />
          </AreaSheet>
        ))}
      </div>
    </div>
  );
}

export function AreaSheet({
  area,
  children,
}: Readonly<{
  area: Area & { artefacts: Artefact[] };
  children: React.ReactNode;
}>) {
  return (
    <Sheet key={area.area_id}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="lg:min-w-[40vw]">
        <SheetHeader>
          <SheetTitle className="text-center">
            <div>Area Details: </div>
            {area.area_name}
          </SheetTitle>
          <SheetDescription className="text-left">
            <div className="my-4 flex">
              <SheetTitle>People</SheetTitle>
              <Badge
                variant={
                  area.people === "High"
                    ? "destructive"
                    : area.technology === "Medium"
                      ? "secondary"
                      : "default"
                }
                className="ml-2"
              >
                {area.people}
              </Badge>
            </div>
            <ul>
              {area.people_practices.map((practice) => (
                <li key={practice}>{practice}</li>
              ))}
            </ul>
            <Separator className="my-4" />
            <div className="my-4 flex">
              <SheetTitle>Process</SheetTitle>
              <Badge
                variant={
                  area.process === "High"
                    ? "destructive"
                    : area.technology === "Medium"
                      ? "secondary"
                      : "default"
                }
                className="ml-2"
              >
                {area.process}
              </Badge>
            </div>
            <ul>
              {area.process_practices.map((practice) => (
                <li key={practice}>{practice}</li>
              ))}
            </ul>
            <Separator className="my-4" />
            <div className="my-4 flex">
              <SheetTitle>Technology</SheetTitle>
              <Badge
                variant={
                  area.technology === "High"
                    ? "destructive"
                    : area.technology === "Medium"
                      ? "secondary"
                      : "default"
                }
                className="ml-2"
              >
                {area.technology}
              </Badge>
            </div>
            <ul>
              {area.technology_practices.map((practice) => (
                <li key={practice}>{practice}</li>
              ))}
            </ul>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
