import * as React from "react";
import { SheetTrigger } from "~/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Icons } from "../icons";

export interface AreaProps {
  id: string;
  name: string;
  visible: boolean;
  toggleVisibility: () => void;
}

const AreaCard = React.forwardRef<HTMLDivElement, AreaProps>((area, ref) => {
  return (
    <Card
      title={area.name}
      className="flex h-full w-full flex-col items-center justify-center"
    >
      <Button
        variant="icon"
        size="icon"
        className="absolute right-8 top-2"
        onClick={area.toggleVisibility}
      >
        <div className="h-6 w-6 shrink-0 rounded-full">
          {area.visible ? <Icons.show /> : <Icons.hide />}
        </div>
      </Button>
      <SheetTrigger>
        <div className="absolute right-2 top-2 h-6 w-6 shrink-0 rounded-full hover:bg-accent hover:text-accent-foreground">
          <Icons.info />
        </div>
      </SheetTrigger>
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
});
AreaCard.displayName = "AreaCard";

export { AreaCard };
