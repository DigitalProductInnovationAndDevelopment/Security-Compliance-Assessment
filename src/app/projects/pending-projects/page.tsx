import { getServerAuthSession } from "~/server/auth";
import Unauthorised from "~/components/unauthorised";

import React from "react";
import ProjectCard from "~/components/ui/projectCard";
import AddProjectCard from "~/components/ui/addProjectCard";

export default async function Page() {
  const session = await getServerAuthSession();
  // mock data for projects
  const projects = [
    {
      project_id: 1,
      project_name: "Project 1",
      project_status: "done",
      overall_compliance_score: 100,
      areas_score: 100,
      artifacts_score: 100,
    },
    {
      project_id: 2,
      project_name: "Project 2",
      project_status: "inprogress",
      overall_compliance_score: 60,
      areas_score: 50,
      artifacts_score: 40,
    },
    {
      project_id: 3,
      project_name: "Project 3",
      project_status: "inprogress",
      overall_compliance_score: 40,
      areas_score: 20,
      artifacts_score: 10,
    },
    {
      project_id: 4,
      project_name: "Project 4",
      project_status: "pending",
      overall_compliance_score: 0,
      areas_score: 0,
      artifacts_score: 0,
    },
  ];
  const pendingProjects = projects.filter(
    (project) => project.project_status === "pending",
  );

  if (!session) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center text-center">
          <Unauthorised />
        </div>
      </div>
    );
  }
  return (
    <div className="relative min-h-full w-full rounded-lg bg-white p-8">
      <div className="flex min-w-full flex-wrap gap-4">
        {/* ProjectCard for Active Projects */}
        {pendingProjects.map((project) => (
          <ProjectCard
            key={project.project_id}
            project_name={project.project_name}
            compliance_score={project.overall_compliance_score}
            areas_score={project.areas_score}
            artifacts_score={project.artifacts_score}
          />
        ))}

        {/* Add Project Card */}
        <AddProjectCard />
      </div>
    </div>
  );
}
