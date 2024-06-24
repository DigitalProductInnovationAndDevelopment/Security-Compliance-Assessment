import * as React from "react";

import { cn } from "~/lib/utils";
import { ArtifactCard } from "./artifactCard";
import { Card } from "./card";
import { useState } from "react";
import { AreaCard, AreaProps } from "./areaCard";
import { ArtifactProps } from "./artifactCard";

type CardWrapperProps = {
  area: AreaProps;
  artifacts: ArtifactProps[];
  artifactsView: boolean;
  className?: string;
};

const CardWrapper = React.forwardRef<HTMLDivElement, CardWrapperProps>(
  ({ className, area, artifacts, artifactsView }, ref) => {
    return (
      <div className={className}>
        {artifactsView ? (
          // Show Artifact Cards
          <div>
            {artifacts.map((artifact, index) => (
              <ArtifactCard id={artifact.id} name={artifact.name} />
            ))}
          </div>
        ) : (
          // Show Area Card
          <AreaCard id={area.id} name={area.name}></AreaCard>
        )}
      </div>
    );
  },
);
CardWrapper.displayName = "CardWrapper";

export { CardWrapper };
