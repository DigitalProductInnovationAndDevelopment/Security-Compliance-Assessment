"use client";

import * as React from "react";

import { cn } from "~/lib/utils";
import { ArtifactCard } from "./artifactCard";
import { AreaCard, AreaProps } from "./areaCard";
import { ArtifactProps } from "./artifactCard";
import useViewStore from "../../stores/useViewStore";
import { ARTEFACT_VIEW } from "~/stores/viewTypes";
import { useState } from "react";

type CardWrapperProps = {
  area: AreaProps;
  artifacts: ArtifactProps[];
  className?: string;
};

const CardWrapper = React.forwardRef<HTMLDivElement, CardWrapperProps>(
  ({ className, area, artifacts }, ref) => {
    const currentView = useViewStore((state) => state.currentView);
    const artifactsView = currentView === ARTEFACT_VIEW;
    const [isAreaVisible, setIsAreaVisible] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    const artifactClasses = cn(
      "relative flex flex-col items-center gap-2 p-2",
      {
        "z-1": artifactsView, // Artefacts visible
        "z-0": !artifactsView, // Artefacts hidden
      },
    );

    const areaClasses = cn(
      "absolute w-full h-full inset-0 bg-white hover:opacity-50",
      {
        "z-1": !artifactsView && isAreaVisible, //Area visible
        "z-[-1]": artifactsView || !isAreaVisible, //Area hidden
        "z-10": !artifactsView && !isAreaVisible && isHovered,
      },
    );

    const toggleVisibility = () => {
      setIsAreaVisible(!isAreaVisible);
    };

    return (
      <div
        className={cn(
          `relative flex-grow ${artifactsView || !isAreaVisible ? "rounded-xl border-2 border-dashed" : ""}`,
          className,
        )}
        onMouseEnter={() => {
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
      >
        <div className={artifactClasses}>
          {artifacts.length === 0 ? (
            <ArtifactCard isEmpty />
          ) : (
            artifacts.map((artifact) => (
              <ArtifactCard
                key={artifact.id}
                id={artifact.id}
                name={artifact.name}
              />
            ))
          )}
        </div>
        <div className={areaClasses}>
          <AreaCard
            id={area.id}
            name={area.name}
            visible={isAreaVisible}
            toggleVisibility={toggleVisibility}
          />
        </div>
      </div>
    );
  },
);
CardWrapper.displayName = "CardWrapper";

export default CardWrapper;
