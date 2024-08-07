import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Icons } from "../icons";

export interface AreaProps {
  id: string;
  name: string;
  visible?: boolean;
  toggleVisibility?: () => void;
}

const AreaCardAssessment = React.forwardRef<HTMLDivElement, AreaProps>(
  (area, ref) => {
    return (
      <Card
        title={area.name}
        className="relative flex h-full w-full flex-col items-center justify-center"
        ref={ref}
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

          {/* Info icon to trigger info sheet */}
          <SheetTrigger>
            <Button
              variant="outline"
              size="icon"
              className="h-4 w-4 shrink-0 rounded-full opacity-50 hover:bg-accent hover:text-accent-foreground"
            >
              <Icons.info />
            </Button>
          </SheetTrigger>

          {/* Edit icon to trigger assess sheet */}
          <Sheet>
            <SheetTrigger>
              <div className="h-4 w-4 shrink-0 rounded-full opacity-50 hover:bg-accent hover:text-accent-foreground">
                <Icons.edit />
              </div>
            </SheetTrigger>
            <SheetContent className="lg:min-w-[40vw]">
              <SheetHeader>
                <SheetTitle className="text-center">
                  <div>Area Details: </div>
                  {area.name}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <p>TODO: Edit assessment about this area.</p>
                {/* TODO: Implement assessment component here */}
              </div>
            </SheetContent>
          </Sheet>
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
      </Card>
    );
  },
);
AreaCardAssessment.displayName = "AreaCardAssessment";

export { AreaCardAssessment };
