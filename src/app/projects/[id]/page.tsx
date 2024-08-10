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
import { Card, CardContent } from "~/components/ui/card";

import { ProjectAreaCompletion } from "~/components/charts/ProjectAreaCompletion";
import ProjectDetailAssessment from "~/components/ProjectDetailAssessment";
import Link from "next/link";
import { Suspense } from "react";
import ProjectDetailAssessmentSkeleton from "~/components/ProjectDetailAssessmentSkeleton";

export default async function Page({
  params,
}: Readonly<{ params: { id: string } }>) {
  const project = await api.project.getProject({ id: Number(params.id) });
  if (!project) {
    return (
      <div className="flex min-h-[calc(100vh-100px)] w-full flex-col items-center justify-center">
        <div className="text-center">
          Project Not Found or you are not authorized to view this project
        </div>
      </div>
    );
  }
  const allProjects = await api.project.getProjects();

  return (
    <div className="mx-2 flex h-screen flex-wrap gap-4 py-16">
      <div className="relative w-full max-w-xl sm:flex-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>
                Change Project
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {allProjects.map((project) => (
                <DropdownMenuItem key={project.id}>
                  <Link prefetch href={`/projects/${project.id}`}>
                    {project.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-row gap-4 py-4">
          <div className="text-sm text-gray-500">{project.description}</div>
        </div>
        <div className="gap-4 py-4">
          <div className="flex flex-wrap gap-4">
            <div className="w-full xl:flex-1">
              <h1 className="py-2 text-lg font-bold">
                Asessment of Stage Name
              </h1>
              <Card className="m-0 w-full pt-6">
                <CardContent>
                  <ProjectAreaCompletion />
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
                  <ProjectAreaCompletion />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        {/* project members */}
        <div className="gap-4 py-4">
          <h1 className="py-2 text-lg font-bold">Project Members</h1>
          <div className="flex flex-row flex-wrap gap-4">
            {project.participants.map((member) => (
              <div
                key={member.id}
                className="text-md flex items-center gap-4 px-2 py-1"
              >
                <Avatar>
                  <AvatarImage
                    src={member.image ?? "https://github.com/shadcn.png"}
                    alt="@shadcn"
                  />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-md font-medium">{member.name}</span>
                  <span className="text-xs text-gray-500">
                    <Badge
                      className="text-xs capitalize"
                      variant={
                        member.role === "assessee" ? "outline" : "destructive"
                      }
                    >
                      {member.role}
                    </Badge>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Suspense fallback={<ProjectDetailAssessmentSkeleton />}>
        <ProjectDetailAssessment project={project} />
      </Suspense>
    </div>
  );
}
