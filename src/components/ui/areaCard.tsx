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
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";

export interface AreaProps {
  id: string;
  name: string;
  visible?: boolean;
  toggleVisibility?: () => void;
  people: string;
  process: string;
  technology: string;
  people_practices: string[];
  process_practices: string[];
  technology_practices: string[];
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

        {/* Info sheet */}
        <Sheet>
          <SheetTrigger>
            <Button
              variant="outline"
              size="icon"
              className="h-4 w-4 shrink-0 rounded-full opacity-50 hover:bg-accent hover:text-accent-foreground"
            >
              <Icons.info />
            </Button>
          </SheetTrigger>
          <SheetContent className="lg:min-w-[40vw]">
            <SheetHeader>
              <SheetTitle className="text-center">
                <div>Area Details: </div>
                {area.name}
              </SheetTitle>
              <SheetDescription className="text-left">
                <div className="my-4 flex">
                  <SheetTitle>People</SheetTitle>
                  <Badge
                    variant={
                      area.people === "High"
                        ? "destructive"
                        : area.people === "Medium"
                          ? "secondary"
                          : "default"
                    }
                    className="ml-2"
                  >
                    {area.people}
                  </Badge>
                </div>
                <ul>
                  {area.people_practices.map((practice) => (
                    <li key={practice}>{practice}</li>
                  ))}
                </ul>
                <Separator className="my-4" />
                <div className="my-4 flex">
                  <SheetTitle>Process</SheetTitle>
                  <Badge
                    variant={
                      area.process === "High"
                        ? "destructive"
                        : area.process === "Medium"
                          ? "secondary"
                          : "default"
                    }
                    className="ml-2"
                  >
                    {area.process}
                  </Badge>
                </div>
                <ul>
                  {area.process_practices.map((practice) => (
                    <li key={practice}>{practice}</li>
                  ))}
                </ul>
                <Separator className="my-4" />
                <div className="my-4 flex">
                  <SheetTitle>Technology</SheetTitle>
                  <Badge
                    variant={
                      area.technology === "High"
                        ? "destructive"
                        : area.technology === "Medium"
                          ? "secondary"
                          : "default"
                    }
                    className="ml-2"
                  >
                    {area.technology}
                  </Badge>
                </div>
                <ul>
                  {area.technology_practices.map((practice) => (
                    <li key={practice}>{practice}</li>
                  ))}
                </ul>
                <Separator className="my-4" />
              </SheetDescription>
            </SheetHeader>
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
});
AreaCard.displayName = "AreaCard";

export { AreaCard };
