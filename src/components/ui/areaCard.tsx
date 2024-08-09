"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Icons } from "../icons";
import { useSession } from "next-auth/react";
import { useState } from "react";

export interface AreaProps {
  id: string;
  name: string;
  visible?: boolean;
  toggleVisibility?: () => void;
  // New props to determine if this area is currently active
  onPreviousArea?: () => void;
  onNextArea?: () => void;
  isActive?: boolean;
}

const AreaCard = React.forwardRef<HTMLDivElement, AreaProps>((area, ref) => {
  const { data: session } = useSession();
  const userLoggedIn = !!session;

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
        {/* Info icon to trigger info sheet */}
        <SheetTrigger>
          <div className="h-4 w-4 shrink-0 rounded-full opacity-50 hover:bg-accent hover:text-accent-foreground">
            <Icons.info />
          </div>
        </SheetTrigger>
        {/* If user is logged in, edit icon to trigger assess sheet */}
        {userLoggedIn && (
          <Sheet>
            <SheetTrigger>
              <div className="h-4 w-4 shrink-0 rounded-full opacity-50 hover:bg-accent hover:text-accent-foreground">
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
              <p className="text-right opacity-50">
                Your changes will be stored automatically.
              </p>
              <SheetFooter>
                <Button onClick={area.onPreviousArea} disabled={!area.isActive}>
                  Previous Area
                </Button>
                <Button onClick={area.onNextArea} disabled={!area.isActive}>
                  Next Area
                </Button>
              </SheetFooter>
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
      </CardContent>
    </Card>
  );
});
AreaCard.displayName = "AreaCard";

export { AreaCard };
