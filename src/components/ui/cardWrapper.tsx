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

const CardWrapper: React.FC<CardWrapperProps> = ({
  className,
  area,
  artifacts,
  artifactsView,
}) => {
  //   const [showArtifacts, setShowArtifacts] = useState(artifactsView);

  //   const toggleArtifacts = () => {
  //     setShowArtifacts(!showArtifacts);
  //   };

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
        // <div className="cursor-pointer" onClick={toggleArtifacts}>
        //   <div className="rounded-xl border bg-card p-4 text-card-foreground">
        //     Click to Show Artifacts
        //   </div>
        // </div>
      )}
    </div>
  );
};
CardWrapper.displayName = "CardWrapper";

export { CardWrapper };
