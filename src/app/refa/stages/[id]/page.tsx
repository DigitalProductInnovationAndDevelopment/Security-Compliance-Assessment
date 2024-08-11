import React from "react";
import { api } from "~/trpc/server";
import CardWrapper from "~/components/ui/cardWrapper";
import { AreaSheet } from "~/components/AreaSheet";

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
              area={{ id: area.area_id, name: area.area_name }}
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
