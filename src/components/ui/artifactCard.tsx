"use client";

import * as React from "react";
import { CardDescription, CardHeader } from "./card";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "./dialog";
import { api } from "~/trpc/react";
import Spinner from "./spinner";
import { skipToken } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Sheet } from "lucide-react";
import { SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./sheet";
import { Icons } from "../icons";

export type ArtifactProps = {
  id?: string;
  name?: string;
  isEmpty?: boolean;
};

export const ArtifactDialog = ({
  id,
  name,
  children,
  className,
}: ArtifactProps & { children: React.ReactNode } & { className?: string }) => {
  const { data, isLoading } = api.refa.artefactById.useQuery(
    id ? { artefact_id: id } : skipToken,
  );

  return (
    <Dialog>
      <DialogTrigger className={className}>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>{data?.artefact_name}</DialogTitle>
        {isLoading ? (
          <Spinner />
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
  );
};

const ArtifactCard = React.forwardRef<HTMLDivElement, ArtifactProps>(
  ({ id, name, isEmpty = false }, ref) => {
    const { data: session } = useSession();
    const userLoggedIn = !!session;
    return (
      <>
        {isEmpty ? (
          <div className="rounded-xl bg-card text-card-foreground">
            <CardHeader>No Artifacts</CardHeader>
          </div>
        ) : (
          <ArtifactDialog id={id} name={name} className="w-full">
            <div className="rounded-xl border bg-card text-center text-card-foreground opacity-100 transition-opacity hover:opacity-50">
              {/* If user is logged in, edit icon to trigger assess sheet */}
              {userLoggedIn && (
                <Sheet>
                  <SheetTrigger>
                    <div className="h-4 w-4 shrink-0 rounded-full opacity-50 hover:bg-accent hover:text-accent-foreground">
                      <Icons.edit />
                    </div>
                  </SheetTrigger>
                  <SheetContent className="lg:min-w-[40vw]">
                    <SheetHeader>
                      <SheetTitle className="text-center">
                        <div>Assess Artefact: </div>
                        {name}
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                      <p>TODO: Edit assessment about this artefact.</p>
                      {/* TODO: Implement assessment component here */}
                    </div>
                  </SheetContent>
                </Sheet>
              )}
              <CardHeader className="p-3">
                <span className="text-sm font-bold">{name}</span>
              </CardHeader>
              <CardDescription className="pb-2">{id}</CardDescription>
            </div>
          </ArtifactDialog>
        )}
      </>
    );
  },
);
ArtifactCard.displayName = "ArtifactCard";

export { ArtifactCard };
