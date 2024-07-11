"use client";

import * as React from "react";

import { CardDescription, CardHeader } from "./card";
import { Icons } from "../icons";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "./dialog";
import { api } from "~/trpc/react";
import Loading from "~/app/refa/stages/loading";

export type ArtifactProps = {
  id?: string;
  name?: string;
  isEmpty?: boolean;
};

const ArtifactCard = React.forwardRef<HTMLDivElement, ArtifactProps>(
  ({ id, name, isEmpty = false }, ref) => {
    const { data, loading, error } = api.refa.artefactById.useQuery({
      artefact_id: id,
    });

    return (
      <>
        {isEmpty ? (
          <div className="rounded-xl bg-card text-card-foreground">
            <CardHeader>No Artifacts</CardHeader>
          </div>
        ) : (
          <div className="relative w-full rounded-xl border bg-card text-center text-card-foreground">
            <CardHeader className="p-3">
              <span className="mr-5">{name}</span>
              <Dialog>
                <DialogTrigger>
                  <div className="absolute right-1 top-2 h-6 w-6">
                    <Icons.expand />
                  </div>
                </DialogTrigger>

                <DialogContent>
                  <DialogTitle>{data?.artefact_name}</DialogTitle>
                  {loading ? (
                    <Loading />
                  ) : (
                    <div className="p-3">
                      <div>{data?.description}</div>
                      <div className="py-3">
                        <span className="font-medium">Artefact Id</span>:{" "}
                        {data?.artefact_id}
                      </div>
                      <div>
                        <span className="font-medium">Automation</span>:{" "}
                        {data?.automation}
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardDescription className="pb-2">{id}</CardDescription>
          </div>
        )}
      </>
    );
  },
);
ArtifactCard.displayName = "ArtifactCard";

export { ArtifactCard };
