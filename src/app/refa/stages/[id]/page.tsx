import React from "react";
import { api } from "~/trpc/server";
import { Sheet } from "~/components/ui/sheet";
import CardWrapper from "~/components/ui/cardWrapper";

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
          <Sheet key={area.area_id}>
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
              // SheetTrigger is in a Area Card now.
              // TODO: Change the logic for sheet trigger and sheet content be in one file
              // This TODO is done, sheet trigger and sheet content are in the same file, see areaCard.tsx and areaCardAssessment.tsx
            ></CardWrapper>
          </Sheet>
        ))}
      </div>
    </div>
  );
}
