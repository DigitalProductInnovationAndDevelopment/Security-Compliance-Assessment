"use client";

import * as React from "react";
import { Card, CardDescription, CardHeader } from "./card";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "./dialog";
import { api } from "~/trpc/react";
import Spinner from "./spinner";
import { skipToken } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { Icons } from "../icons";

export type ArtifactProps = {
  id?: string;
  name?: string;
  isEmpty?: boolean;
  displayIcons: boolean;
};

type ArtifactDialogProps = {
  id?: string;
};

export const ArtifactDialog = ({
  id,
  children,
  className,
}: ArtifactDialogProps & { children: React.ReactNode } & {
  className?: string;
}) => {
  const { data, isLoading } = api.refa.artefactById.useQuery(
    id ? { artefact_id: id } : skipToken,
  );

  return (
    <Dialog>
      <DialogTrigger asChild className={className}>
        {children}
      </DialogTrigger>
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
  ({ id, name, displayIcons, isEmpty = false }, ref) => {
    const { data: session } = useSession();
    const userLoggedIn = !!session;
    return (
      <>
        {isEmpty ? (
          <div className="rounded-xl bg-card text-card-foreground">
            <CardHeader>No Artefacts</CardHeader>
          </div>
        ) : (
          <Card className="flex h-full w-full flex-col items-center justify-center">
            {displayIcons && (
              <div className="absolute right-1 top-1 z-20 space-x-1 p-1">
                <div className="flex items-center justify-center space-x-0.5">
                  {/* Info icon that triggers pop-up */}
                  <ArtifactDialog id={id}>
                    <div className="h-4 w-4 shrink-0 rounded-full opacity-50 hover:bg-accent hover:text-accent-foreground">
                      <Icons.info />
                    </div>
                  </ArtifactDialog>
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
                            <span>{name}</span>
                          </SheetTitle>
                        </SheetHeader>
                        <div className="mt-4">
                          <p>TODO: Edit assessment about this artefact.</p>
                          {/* TODO: Implement assessment component here */}
                        </div>
                      </SheetContent>
                    </Sheet>
                  )}
                </div>
              </div>
            )}
            <div className="text-center opacity-100 transition-opacity">
              <CardHeader>
                <div className="text-sm font-bold">{name}</div>
              </CardHeader>
              <CardDescription className="pb-2">
                <span>{id}</span>
              </CardDescription>
            </div>
          </Card>
        )}
      </>
    );
  },
);
ArtifactCard.displayName = "ArtifactCard";

export { ArtifactCard };
