"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Icons } from "../icons";
import { useSession } from "next-auth/react";

export interface AreaProps {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
  toggleVisibility?: () => void;
}

const AreaCard = React.forwardRef<HTMLDivElement, AreaProps>((area, ref) => {
  const { data: session } = useSession();
  const userLoggedIn = !!session;

  return (
    <Card
      title={area.name}
      className="flex h-full w-full flex-col items-center justify-center"
    >
      {/* Absolute positioning for icons to ensure visibility */}
      <div className="absolute right-2 top-2 z-20 space-x-1">
        <Button
          variant="outline"
          size="icon"
          className="h-4 w-4 shrink-0 rounded-full opacity-50"
          onClick={area.toggleVisibility}
        >
          {area.visible ? <Icons.show /> : <Icons.hide />}
        </Button>
        {/* Info icon to trigger info sheet */}
        <SheetTrigger>
          <div className="h-4 w-4 shrink-0 rounded-full opacity-50">
            <Icons.info />
          </div>
        </SheetTrigger>
        {/* If user is logged in, edit icon to trigger assess sheet */}
        {userLoggedIn && (
          <Sheet>
            <SheetTrigger>
              <div className="h-4 w-4 shrink-0 rounded-full opacity-50">
                <Icons.edit />
              </div>
            </SheetTrigger>
            <SheetContent className="lg:min-w-[40vw]">
              <SheetHeader>
                <SheetTitle className="text-center">
                  <div>Assess Area: </div>
                  {area.name}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <p>TODO: Edit assessment about this area.</p>
                {/* TODO: Implement assessment component here */}
              </div>
            </SheetContent>
          </Sheet>
        )}
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
        <Tooltip>
          <TooltipTrigger className="flex w-full items-center justify-center">
            {area.type === "Software Engineering" && (
              <Icons.software_engineering />
            )}
            {area.type === "Security-related Software Engineering" && (
              <Icons.security_related_software_engineering />
            )}
          </TooltipTrigger>
          <TooltipContent>
            <p>Area type: {area.type}</p>
          </TooltipContent>
        </Tooltip>
      </CardContent>
    </Card>
  );
});
AreaCard.displayName = "AreaCard";

export { AreaCard };
