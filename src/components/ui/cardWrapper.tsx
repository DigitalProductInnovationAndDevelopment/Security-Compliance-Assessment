"use client";

import * as React from "react";

import { cn } from "~/lib/utils";
import { ArtifactCard } from "./artifactCard";
import { Card } from "./card";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
    const artifactClasses = cn("relative m-2", {
      "z-1": artifactsView,
      "z-[-1]": !artifactsView,
    });

    const areaClasses = cn("absolute w-full h-full inset-0 bg-white", {
      "z-1": !artifactsView,
      "z-[-1]": artifactsView,
    });

    return (
      <div className={cn("relative", className)}>
        <div className={artifactClasses}>
          {artifacts.map((artifact) => (
            <ArtifactCard
              key={artifact.id}
              id={artifact.id}
              name={artifact.name}
            />
          ))}
        </div>
        <div className={areaClasses}>
          <AreaCard id={area.id} name={area.name} />
        </div>
      </div>
    );
  },
);
CardWrapper.displayName = "CardWrapper";

export default CardWrapper;
