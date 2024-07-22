'use client';
import React from "react";
import { Card, CardContent } from "./ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { PlusCircleIcon } from "lucide-react";
import { Label } from "./ui/label";

export default function AddNewProjectCard() {
  return (
    <Card className="relative w-full max-w-sm bg-slate-100 sm:flex-1">
      <CardContent className="relative h-full">
        <div className="flex h-full flex-col items-center justify-center">
          <Tooltip>
            <TooltipTrigger onClick={() => alert("Add a new Project")}>
              <PlusCircleIcon className="h-8 w-8 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <Label>Add a new Project</Label>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
}
