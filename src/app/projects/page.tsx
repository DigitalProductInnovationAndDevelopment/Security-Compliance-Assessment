import AddNewProjectCard from "~/components/addnewprojectcard";
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

export default async function Page() {
  return (
    <div className="flex flex-wrap gap-4 py-10">
      {[0, 1].map((i, index) => (
        <Card key={index} className="relative w-full max-w-sm sm:flex-1">
          <CardHeader className="bg-slate-100">
            <CardTitle className="text-2xl font-bold">
              Project {index + 1}
            </CardTitle>
            <CardDescription>This is a project description</CardDescription>
          </CardHeader>
          <CardContent className="relative pt-4">
            <CardTitle className="py-4">Compliance Score Overview</CardTitle>
            <ProjectCompletion />
          </CardContent>
          <CardFooter>
            <Button variant={"outline"}>View Project</Button>
          </CardFooter>
        </Card>
      ))}
      <AddNewProjectCard />
    </div>
  );
}
