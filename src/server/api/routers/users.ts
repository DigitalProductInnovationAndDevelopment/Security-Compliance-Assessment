import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  getUser: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input, ctx }) => {
      const users = await ctx.db.user.findMany({
        where: {
          OR: [
            {
              name: {
                contains: input.query,
                mode: "insensitive", // Case-insensitive search
              },
            },
            {
              email: {
                contains: input.query,
                mode: "insensitive", // Case-insensitive search
              },
            },
          ],
        },
      });

      if (users.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No users found matching the query",
        });
      }

      return users;
    }),
});
