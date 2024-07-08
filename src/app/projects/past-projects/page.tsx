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
      project_status: "past",
      overall_compliance_score: 100,
      code_phase_score: 100,
      build_phase_score: 100,
      deploy_phase_score: 100,
    },
    {
      project_id: 2,
      project_name: "Project 2",
      project_status: "active",
      overall_compliance_score: 60,
      code_phase_score: 50,
      build_phase_score: 40,
      deploy_phase_score: 20,
    },
    {
      project_id: 3,
      project_name: "Project 3",
      project_status: "active",
      overall_compliance_score: 40,
      code_phase_score: 20,
      build_phase_score: 10,
      deploy_phase_score: 10,
    },
  ];
  const pastProjects = projects.filter(
    (project) => project.project_status === "past",
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
        {/* ProjectCard for Past Projects */}
        {pastProjects.map((project) => (
          <ProjectCard
            key={project.project_id}
            project_name={project.project_name}
            compliance_score={project.overall_compliance_score}
            code_phase={project.code_phase_score}
            build_phase={project.build_phase_score}
            deploy_phase={project.deploy_phase_score}
          />
        ))}

        {/* Add Project Card */}
        <AddProjectCard />
      </div>
    </div>
  );
}
