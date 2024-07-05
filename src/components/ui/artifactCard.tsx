import * as React from "react";

import { CardDescription, CardHeader } from "./card";

export type ArtifactProps = {
  id?: string;
  name?: string;
  isEmpty?: boolean;
};

const ArtifactCard = React.forwardRef<HTMLDivElement, ArtifactProps>(
  ({ id, name, isEmpty = false }) => {
    return (
      <>
        {isEmpty ? (
          <div className="rounded-xl bg-card text-card-foreground">
            <CardHeader>No Artifacts</CardHeader>
          </div>
        ) : (
          <div className="w-full rounded-xl border bg-card text-center text-card-foreground">
            <CardHeader className="p-3">{name}</CardHeader>
            <CardDescription className="pb-2">{id}</CardDescription>
          </div>
        )}
      </>
    );
  },
);
ArtifactCard.displayName = "ArtifactCard";

export { ArtifactCard };
