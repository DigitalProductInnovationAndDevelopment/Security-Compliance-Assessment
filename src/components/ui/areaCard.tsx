import * as React from "react";

import { cn } from "~/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

export type AreaProps = {
  id: string;
  name: string;
};

const AreaCard: React.FC<AreaProps> = (area) => {
  return (
    <Card title={area.name} className="m-2 min-w-fit p-2">
      <CardHeader
        className="flex flex-col items-center justify-center"
        title={area.name}
      >
        <CardTitle className="text-center">{area.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-500">{area.id}</p>
        </div>
      </CardContent>
    </Card>
  );
};
AreaCard.displayName = "ArtifactCard";

export { AreaCard };
