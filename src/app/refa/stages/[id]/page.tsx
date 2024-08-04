import React from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/server";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import CardWrapper from "~/components/ui/cardWrapper";

export default async function Page({
  params,
}: Readonly<{ params: { id: string } }>) {
  const areasWithArtefacts = await api.refa.areasWithArtefactsByStage({
    stageNumber: parseInt(params.id),
  });
  // if the link is not something like refa/stages/1 or refa/stages/2
  // redirect to the first stage

  const { data: session } = useSession();
  const userLoggedIn = !!session; // Check if session is available

  return (
    <div className="relative min-h-full w-full rounded-lg bg-white p-8">
      <div className="flex min-w-full flex-wrap gap-4">
        {areasWithArtefacts?.areas.map((area) => (
          <Sheet key={area.area_id}>
            <CardWrapper
              area={{ id: area.area_id, name: area.area_name }}
              artifacts={area.artefacts.map((artefact) => ({
                id: artefact.artefact_id,
                name: artefact.artefact_name,
              }))}
              // SheetTrigger is in a Area Card now.
              // TODO: Change the logic for sheet trigger and sheet content be in one file
            ></CardWrapper>
            <SheetContent className="lg:min-w-[40vw]">
              <SheetHeader>
                {/* Render only info sheet if not logged in */}
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
                  <Separator className="my-4" />
                  {/* Conditionally render the edit section if logged in */}
                  {userLoggedIn && (
                    <div className="my-4">
                      <SheetTitle className="text-center">
                        <div>Assess Area: </div>
                        {area.area_name}
                      </SheetTitle>
                      <p>Edit assessment about this area.</p>
                      {/* Implement assessment component here */}
                    </div>
                  )}
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        ))}
      </div>
    </div>
  );
}
