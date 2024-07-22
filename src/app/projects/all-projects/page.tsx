import { getServerAuthSession } from "~/server/auth";
import Unauthorised from "~/components/unauthorised";

import React from "react";
import ProjectCard from "~/components/ui/projectCard";
import NewProjectCard from "~/components/ui/newProjectCard";

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
      team_name: "Team Alpha",
      team_members: [
        { name: "Alice", email: "alice@project1.dev" },
        { name: "Bob", email: "bob@project1.dev" },
      ],
    },
    {
      project_id: 2,
      project_name: "Project 2",
      project_status: "inprogress",
      overall_compliance_score: 60,
      areas_score: 50,
      artifacts_score: 40,
      team_name: "Team Beta",
      team_members: [
        { name: "Charlie", email: "charlie@project2.dev" },
        { name: "Dave", email: "dave@project2.dev" },
      ],
    },
    {
      project_id: 3,
      project_name: "Project 3",
      project_status: "inprogress",
      overall_compliance_score: 40,
      areas_score: 20,
      artifacts_score: 10,
      team_name: "Team Gamma",
      team_members: [
        { name: "Eve", email: "eve@project3.dev" },
        { name: "Frank", email: "frank@project3.dev" },
      ],
    },
    {
      project_id: 4,
      project_name: "Project 4",
      project_status: "pending",
      overall_compliance_score: 0,
      areas_score: 0,
      artifacts_score: 0,
      team_name: "Team Delta",
      team_members: [
        { name: "Grace", email: "grace@project4.dev" },
        { name: "Heidi", email: "heidi@project4.dev" },
      ],
    },
  ];

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
        {projects.map((project) => (
          <ProjectCard
            key={project.project_id}
            project_name={project.project_name}
            compliance_score={project.overall_compliance_score}
            areas_score={project.areas_score}
            artifacts_score={project.artifacts_score}
          />
        ))}

        {/* Add Project Card */}
        <NewProjectCard />
      </div>
    </div>
  );
}
