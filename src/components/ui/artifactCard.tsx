import * as React from "react";

import { cn } from "~/lib/utils";
import { CardHeader } from "./card";

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
          <div className="mb-2 rounded-xl bg-card text-card-foreground">
            <CardHeader>No Artifacts</CardHeader>
          </div>
        ) : (
          <div className="mb-2 rounded-xl border bg-card text-card-foreground">
            <CardHeader>{name}</CardHeader>
          </div>
        )}
      </>
    );
  },
);
ArtifactCard.displayName = "ArtifactCard";

export { ArtifactCard };
