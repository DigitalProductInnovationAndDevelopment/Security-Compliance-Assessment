import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const refaRouter = createTRPCRouter({
  stages: publicProcedure.query(({ input, ctx }) => {
    return ctx.db.stage.findMany({
      orderBy: { stageNumber: "asc" },
    });
  }),
  areasByStage: publicProcedure
    .input(
      z.object({
        stageNumber: z.number(),
      }),
    )
    .query(({ input, ctx }) => {
      return ctx.db.stage.findFirst({
        where: {
          stageNumber: input.stageNumber,
        },
        include: {
          areas: true,
        },
      });
    }),
  areasWithArtefactsByStage: publicProcedure
    .input(
      z.object({
        stageNumber: z.number(),
      }),
    )
    .query(({ input, ctx }) => {
      return ctx.db.stage.findFirst({
        where: {
          stageNumber: input.stageNumber,
        },
        include: {
          areas: {
            include: {
              artefacts: true,
            },
          },
        },
      });
    }),
});
