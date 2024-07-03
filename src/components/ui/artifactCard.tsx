import * as React from "react";

import { cn } from "~/lib/utils";
import { CardContent, CardHeader } from "./card";

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
          <div className="rounded-xl border bg-card text-card-foreground w-full text-center">
            <CardHeader>{name}</CardHeader>
          </div>
        )}
      </>
    );
  },
);
ArtifactCard.displayName = "ArtifactCard";

export { ArtifactCard };
