//"use client";
import { getServerAuthSession } from "~/server/auth";
import Unauthorised from "~/components/unauthorised";

import React, { useState } from "react";

const projectData = {
  repositories: [
    {
      name: "Security-Compliance-Assessment",
      description:
        "Prototype to address the challenge of a security compliance assessment solution",
      stars: 1,
      forks: 0,
      language: "TypeScript",
    },
    {
      name: "gothub",
      description: "",
      stars: 0,
      forks: 0,
      language: "TypeScript",
    },
    {
      name: "PortfolioOS",
      description: "",
      stars: 0,
      forks: 0,
      language: "TypeScript",
    },
  ],
};

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

export default async function Page() {
  const session = await getServerAuthSession();
  /*const [selectedProject, setSelectedProject] = useState(projects[0]);
  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const projectId = parseInt(e.target.value);
    const project = projects.find(
      (project) => project.project_id === projectId,
    );
    setSelectedProject(project ?? projects[0]);
  };*/
  const selectedProject = projects[2];

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
      <div className="flex min-w-full flex-wrap gap-4" />
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row">
          {/* Project Info Section */}
          <div className="w-full rounded border p-4 shadow-md md:w-1/3">
            <select
              className="w-full rounded border p-2"
              value={selectedProject!.project_id}
              //onChange={handleProjectChange}
            >
              {projects.map((project) => (
                <option key={project.project_id} value={project.project_id}>
                  {project.project_name}
                </option>
              ))}
            </select>
            <h2 className="text-2xl font-semibold">
              {selectedProject!.project_name}
            </h2>
            <p className="mt-2">Status: {selectedProject!.project_status}</p>
            <p className="mt-2">
              <span className="font-semibold">
                Overall Compliance Score:{" "}
                {selectedProject!.overall_compliance_score}
              </span>
            </p>
            <p className="mt-2">
              <span className="font-semibold">
                Areas Score: {selectedProject!.areas_score}
              </span>
            </p>
            <p className="mt-2">
              <span className="font-semibold">
                Artifacts Score: {selectedProject!.artifacts_score}
              </span>
            </p>
            <div className="mt-4">
              <h3 className="font-semibold">
                Team: {selectedProject!.team_name}
              </h3>
              <ul className="mt-2">
                {selectedProject!.team_members.map((member, index) => (
                  <li key={index} className="flex items-center">
                    <span className="font-semibold">{member.name}:</span>
                    <span className="ml-2">{member.email}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Assessment Result Section */}
          <div className="w-full rounded border p-4 shadow-md md:ml-4 md:w-2/3">
            <h2 className="text-2xl font-semibold">Repositories</h2>
            <p className="text-lg">{projectData.repositories.length}</p>
            <input
              type="text"
              placeholder="Search repositories..."
              className="mt-2 w-full rounded border p-2"
            />
            {projectData.repositories.map((repo, index) => (
              <div key={index} className="mt-4">
                <h3 className="text-xl font-semibold">{repo.name}</h3>
                <p>{repo.description}</p>
                <p className="mt-2">
                  <span className="font-semibold">{repo.stars}</span> stars ·{" "}
                  <span className="font-semibold">{repo.forks}</span> forks
                </p>
                <p className="mt-2">
                  <span className="inline-block rounded bg-blue-100 p-1 text-blue-700">
                    {repo.language}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
