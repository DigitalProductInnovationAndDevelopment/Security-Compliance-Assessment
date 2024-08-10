import Link from "next/link";
import AddNewProjectCard from "~/components/ui/addNewProjectCard";
import { ProjectCompletion } from "~/components/charts/ProjectCompletion";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/server";

const project_statuses = ["all-projects", "archived-projects"];
const displayNames: Record<string, string> = {
  "all-projects": "All",
  "archived-projects": "Archived",
};

export default async function Page() {
  const projects = await api.project.getProjects();

  if (projects.length === 0) {
    return (
      // center text
      <div className="flex min-h-[calc(100vh-100px)] w-full flex-col items-center justify-center">
        <div className="text-center">
          <div className="mt-4">
            <AddNewProjectCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="-ml-3 flex min-w-full">
        {project_statuses.map((project_status) => (
          <div key={project_status} className="border-gray-200 py-4">
            <div className="flex flex-row">
              <span className="inline-flex items-center">
                <Link href={"/projects/" + project_status}>
                  <Button variant={"link"} className="text-md font-medium">
                    {displayNames[project_status]}
                  </Button>
                </Link>
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 py-10">
        {projects.map((project, index) => (
          <Card key={index} className="relative w-full max-w-sm sm:flex-1">
            <CardHeader className="bg-slate-100">
              <CardTitle className="text-2xl font-bold">
                {project.name}
              </CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="relative pt-4">
              <CardTitle className="py-4">Compliance Score Overview</CardTitle>
              <ProjectCompletion />
            </CardContent>
            <CardFooter>
              <Link href={"/projects/" + project.id}>
                <Button variant={"outline"}>View Project</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
        <AddNewProjectCard />
      </div>
    </div>
  );
}
