import { ChevronDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/server";
import { ProjectCompletion } from "~/components/charts/ProjectCompletion";
import { Card, CardContent } from "~/components/ui/card";

const project_members = [
  "Ziyad Mourabiti",
  "Mohamed El-Sayed",
  "Ahmed El-Sayed",
  "Abdelhakim El-Sayed",
];

export default async function Page({
  params,
}: Readonly<{ params: { id: string } }>) {
  const stages = await api.refa.stages();
  return (
    <div className="mx-2 flex h-screen flex-wrap gap-4 py-16">
      <div className="relative w-full max-w-2xl sm:flex-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {"Project Name"}
            {` `}
            {params.id}
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>
                Change Project
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All</DropdownMenuItem>
              <DropdownMenuItem>Archived</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-row gap-4 py-4">
          <div className="text-sm text-gray-500">{"Project Description"}</div>
        </div>
        {/* project members */}
        <div className="gap-4 py-4">
          <h1 className="py-2 text-lg font-bold">Project Members</h1>
          <div className="flex flex-row flex-wrap gap-4">
            {project_members.map((member) => (
              <div
                key={member}
                className="text-md flex items-center gap-4 px-2 py-1"
              >
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-md font-medium">{member}</span>
                  <span className="text-xs text-gray-500">
                    <Badge className="text-xs" variant={"outline"}>
                      Assessor
                    </Badge>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-full gap-4 py-4">
          <div className="flex flex-wrap gap-4">
            <div className="w-full xl:flex-1">
              <h1 className="py-2 text-lg font-bold">
                Your Assessment Progress
              </h1>
              <Card className="m-0 w-full pt-6">
                <CardContent>
                  <ProjectCompletion />
                </CardContent>
              </Card>
            </div>
            <div className="w-full xl:flex-1">
              <h1 className="flex items-center gap-2 py-2 text-lg font-bold">
                <Badge className="text-xs" variant={"destructive"}>
                  Assessor
                </Badge>
                Team Results
              </h1>
              <Card className="m-0 w-full pt-6">
                <CardContent>
                  <ProjectCompletion />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <div className="relative h-full w-full rounded-lg sm:flex-1 sm:px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">
            {"Stage Name"}
            {` `}
            {params.id}
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>
                Change Stage
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {stages.map((stage) => (
                <DropdownMenuItem key={stage.name}>
                  {stage.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="my-4 h-full w-full rounded-lg bg-white">
          <div className="flex h-full w-full justify-between gap-4">
            <div className="w-full border-black">yo</div>
            <div className="w-full border-black">yo</div>
          </div>
        </div>
      </div>
    </div>
  );
}
