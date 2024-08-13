import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const projectRouter = createTRPCRouter({
  getProjects: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany({
      // show projects that are assigned to the user);
      where: {
        participants: {
          some: {
            id: ctx.session.user.id,
          },
        },
      },
      include: {
        participants: true,
      },
    });

    return projects;
  }),
  getProject: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const project = await ctx.db.project.findUnique({
        where: {
          id: input.id,
          participants: {
            some: {
              id: ctx.session.user.id,
            },
          },
        },
        include: {
          participants: true,
          assessments: {
            include: {
              areasScores: {
                include: {
                  area: true,
                },
              },
              answersArtefact: {
                include: {
                  artefact: true,
                },
              },
              answersArea: {
                include: {
                  question: true,
                },
              },
            },
          },
        },
      });

      if (!project) {
        return null;
      }

      return project;
    }),
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        participants: z.array(z.string()),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const project = await ctx.db.project.create({
        data: {
          name: input.name,
          archived: false,
          description: input.description,
          participants: {
            connect: input.participants.map((id) => ({
              id,
            })),
          },
        },
      });
      return project;
    }),
});
