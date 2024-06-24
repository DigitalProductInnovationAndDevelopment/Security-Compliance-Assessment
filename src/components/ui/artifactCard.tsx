import * as React from "react";

import { cn } from "~/lib/utils";
import { CardHeader } from "./card";

export type ArtifactProps = {
  id: string;
  name: string;
};

const ArtifactCard = React.forwardRef<HTMLDivElement, ArtifactProps>(
  (artifact) => {
    return (
      <div className="mb-2 rounded-xl border bg-card text-card-foreground">
        <CardHeader>{artifact.name}</CardHeader>
      </div>
    );
  },
);
ArtifactCard.displayName = "ArtifactCard";

export { ArtifactCard };
