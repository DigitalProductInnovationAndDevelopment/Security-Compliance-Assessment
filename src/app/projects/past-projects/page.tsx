import { getServerAuthSession } from "~/server/auth";
import Unauthorised from "~/components/unauthorised";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";

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
  const activeProjects = projects.filter(
    (project) => project.project_status === "active",
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
        {/* Sheet for Past Projects */}
        <Sheet>
          <SheetTrigger>
            <Card className="m-2 min-w-fit p-2">
              <CardHeader className="flex flex-col items-center justify-center">
                <CardTitle className="text-center">Past Projects</CardTitle>
              </CardHeader>
            </Card>
          </SheetTrigger>
          <SheetContent>
            <div className="p-4">
              {pastProjects.map((project) => (
                <Card
                  key={project.project_id}
                  title={project.project_name}
                  className="m-2 min-w-fit p-2"
                >
                  <CardHeader className="flex flex-col items-center justify-center">
                    <CardTitle className="text-center">
                      {project.project_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        Compliance Score Overview
                      </p>
                      <div className="h-2.5 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2.5 rounded-full bg-blue-600"
                          style={{
                            width: `${project.overall_compliance_score}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {project.overall_compliance_score}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Action Required:</p>
                      <p className="text-sm text-gray-500">
                        Code Phase: {project.code_phase_score}%
                      </p>
                      <p className="text-sm text-gray-500">
                        Build Phase: {project.build_phase_score}%
                      </p>
                      <p className="text-sm text-gray-500">
                        Deploy Phase: {project.deploy_phase_score}%
                      </p>
                    </div>
                    <button className="mt-4 rounded bg-blue-600 px-4 py-2 text-white">
                      Assess Project
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        {/* Add Project Button */}
        <div className="m-2 flex min-w-fit items-center justify-center border-2 border-dashed p-2">
          <button className="flex flex-col items-center justify-center">
            <div className="text-center">Add Project</div>
            <div className="text-center text-4xl text-blue-600">+</div>
          </button>
        </div>
      </div>
    </div>
  );
}
