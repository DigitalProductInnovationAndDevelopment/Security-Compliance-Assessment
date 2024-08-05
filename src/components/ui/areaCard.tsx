import * as React from "react";
import { SheetTrigger } from "~/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Icons } from "../icons";

export interface AreaProps {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
  toggleVisibility?: () => void;
}

const AreaCard = React.forwardRef<HTMLDivElement, AreaProps>((area, ref) => {
  return (
    <Card
      title={area.name}
      className="flex h-full w-full flex-col items-center justify-center"
    >
      <div className="absolute right-2 top-2 space-x-1">
        <Button
          variant="outline"
          size="icon"
          className="h-4 w-4 shrink-0 rounded-full opacity-50 hover:bg-accent hover:text-accent-foreground"
          onClick={area.toggleVisibility}
        >
          {area.visible ? <Icons.show /> : <Icons.hide />}
        </Button>
        <SheetTrigger>
          <div className="h-4 w-4 shrink-0 rounded-full opacity-50 hover:bg-accent hover:text-accent-foreground">
            <Icons.info />
          </div>
        </SheetTrigger>
      </div>
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
      <CardFooter>
        <Tooltip>
          <TooltipTrigger>
            {area.type === "Software Engineering" && (
              <div className="h-4 w-4 shrink-0 rounded-full opacity-100">
                <Icons.software_engineering />
              </div>
            )}
            {area.type === "Security-related Software Engineering" && (
              <div className="h-4 w-4 shrink-0 rounded-full opacity-100">
                <Icons.security_related_software_engineering />
              </div>
            )}
          </TooltipTrigger>
          <TooltipContent>
            <p>Area type: {area.type}</p>
          </TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  );
});
AreaCard.displayName = "AreaCard";

export { AreaCard };
