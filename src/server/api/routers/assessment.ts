import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const assessmentRouter = createTRPCRouter({
  getAssessments: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input, ctx }) => {
      const assessments = await ctx.db.assessment.findMany({
        where: {
          projectId: input.projectId,
        },
      });
      return assessments;
    }),

  createAssessment: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        projectId: z.number(),
        areasMaturityScore: z.number(), // Should be computed before passing
        artefactCompletenessScore: z.number(), // Should be computed before passing
        areaCompletenessScore: z.number(), // Should be computed before passing
        stageId: z.number(),
        answersArea: z.array(
          z.object({
            questionId: z.number(),
            assessedScore: z.number(),
            targetScore: z.number(),
            answered: z.boolean(),
            comment: z.string().optional(),
          }),
        ),
        answersArtefact: z.array(
          z.object({
            artefactId: z.number(),
            comment: z.string().optional(),
            answered: z.boolean(),
            answer: z.boolean(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const {
        userId,
        projectId,
        areasMaturityScore,
        artefactCompletenessScore,
        areaCompletenessScore,
        stageId,
        answersArea,
        answersArtefact,
      } = input;

      const stage = await ctx.db.stage.findUnique({
        where: { id: stageId },
      });

      if (!stage) {
        throw new Error(`Stage with id ${stageId} does not exist.`);
      }

      const assessment = await ctx.db.assessment.upsert({
        where: {
          userId_projectId: {
            userId,
            projectId,
          },
        },
        update: {
          areasMaturityScore,
          artefactCompletenessScore,
          areaCompletenessScore,
        },
        create: {
          userId,
          projectId,
          areasMaturityScore,
          artefactCompletenessScore,
          areaCompletenessScore,
        },
      });

      await ctx.db.stageScore.upsert({
        where: {
          assessmentUserId_assessmentProjectId_stageId: {
            assessmentUserId: userId,
            assessmentProjectId: projectId,
            stageId: stageId,
          },
        },
        update: {
          areaMaturityScore: areasMaturityScore,
          areaCompletenessScore: areaCompletenessScore,
          artefactsCompletenessScore: artefactCompletenessScore,
        },
        create: {
          assessmentUserId: userId,
          assessmentProjectId: projectId,
          stageId: stageId,
          areaMaturityScore: areasMaturityScore,
          areaCompletenessScore: areaCompletenessScore,
          artefactsCompletenessScore: artefactCompletenessScore,
          targetAreaMaturityScore: 1,
        },
      });

      for (const answer of answersArea) {
        await ctx.db.answerAreaQuestion.upsert({
          where: {
            assessmentUserId_assessmentProjectId_questionId: {
              assessmentUserId: userId,
              assessmentProjectId: projectId,
              questionId: answer.questionId,
            },
          },
          update: {
            assessedScore: answer.assessedScore,
            targetScore: answer.targetScore,
            answered: answer.answered,
            comment: answer.comment || "",
          },
          create: {
            assessmentUserId: userId,
            assessmentProjectId: projectId,
            questionId: answer.questionId,
            assessedScore: answer.assessedScore,
            targetScore: answer.targetScore,
            answered: answer.answered,
            comment: answer.comment || "",
          },
        });
      }

      for (const answer of answersArtefact) {
        await ctx.db.answerArtefact.upsert({
          where: {
            assessmentUserId_assessmentProjectId_artefactId: {
              assessmentUserId: userId,
              assessmentProjectId: projectId,
              artefactId: answer.artefactId,
            },
          },
          update: {
            comment: answer.comment || "",
            answered: answer.answered,
            answer: answer.answer,
          },
          create: {
            assessmentUserId: userId,
            assessmentProjectId: projectId,
            artefactId: answer.artefactId,
            comment: answer.comment || "",
            answered: answer.answered,
            answer: answer.answer,
          },
        });
      }

      return assessment;
    }),
  getExistingAssessment: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        projectId: z.number(),
        stageNumber: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { userId, projectId, stageNumber } = input;

      const assessment = await ctx.db.assessment.findFirst({
        where: {
          userId,
          projectId,
          stagesScores: {
            some: {
              stage: {
                stageNumber,
              },
            },
          },
        },
        include: {
          answersArea: true,
          answersArtefact: true,
        },
      });

      if (!assessment) {
        return null;
      }

      return {
        answersArea: assessment.answersArea.map((answer) => ({
          questionId: answer.questionId,
          assessedScore: answer.assessedScore,
          targetScore: answer.targetScore,
          answered: answer.answered,
          comment: answer.comment,
        })),
        answersArtefact: assessment.answersArtefact.map((answer) => ({
          artefactId: answer.artefactId,
          answered: answer.answered,
          answer: answer.answer,
          comment: answer.comment,
        })),
      };
    }),

  getProjectStatistics: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        stageId: z.number().optional(), // Optional stageId to get stats for a specific stage or all stages
      }),
    )
    .query(async ({ input, ctx }) => {
      const { projectId, stageId } = input;

      // Fetch all areas for the stage
      const areas = await ctx.db.area.findMany({
        where: { stageId },
        select: {
          id: true,
          area_name: true,
          artefacts: {
            select: {
              id: true,
            },
          },
        },
      });

      const areaIds = areas.map((area) => area.id);
      const artefactIds = areas.flatMap((area) =>
        area.artefacts.map((artefact) => artefact.id),
      );

      const assessments = await ctx.db.assessment.findMany({
        where: {
          projectId,
          ...(stageId ? { stagesScores: { some: { stageId } } } : {}),
        },
        include: {
          answersArea: {
            include: {
              question: {
                include: {
                  areas: {
                    where: {
                      stageId: stageId,
                    },
                  },
                },
              },
            },
          },
          answersArtefact: {
            where: {
              artefactId: { in: artefactIds }, // Filter only artefacts belonging to the areas of the current stage
            },
          },
          stagesScores: {
            include: {
              stage: true, // Include stage name
            },
            ...(stageId ? { where: { stageId } } : {}),
          },
        },
      });

      const areaStats: Record<string, any> = {};
      const stageStats: Record<string, any> = {};
      let totalArtefactsHandled = 0;
      let totalArtefacts = artefactIds.length; // Ensure this starts at the total artefacts for the current stage

      for (const assessment of assessments) {
        // Process area scores
        for (const answer of assessment.answersArea) {
          const areaId = answer.question.areas[0]?.id;
          const areaName = answer.question.areas[0]?.area_name;

          if (!areaStats[areaId]) {
            areaStats[areaId!] = {
              name: areaName,
              totalScore: 0,
              expectedScore: 0,
              count: 0,
            };
          }

          areaStats[areaId!].totalScore += answer.assessedScore;
          areaStats[areaId!].expectedScore += answer.targetScore;
          areaStats[areaId!].count += 1;
        }

        // Process artefact scores
        for (const artefactAnswer of assessment.answersArtefact) {
          if (artefactAnswer.answered) {
            totalArtefactsHandled += 1;
          }
          // Note: `totalArtefacts` has been pre-initialized, so no need to increment here
        }

        // Process stage scores
        for (const stageScore of assessment.stagesScores) {
          const stageName = stageScore.stage.name;

          if (!stageStats[stageScore.stageId]) {
            stageStats[stageScore.stageId] = {
              name: stageName,
              totalScore: 0,
              expectedScore: 0,
              count: 0,
              artefactsHandled: 0,
              totalArtefacts: totalArtefacts, // Initialized total artefacts
            };
          }

          stageStats[stageScore.stageId].totalScore +=
            stageScore.areaMaturityScore;
          stageStats[stageScore.stageId].expectedScore +=
            stageScore.areaCompletenessScore;
          stageStats[stageScore.stageId].count += 1;

          // Total artefacts handled in this stage
          stageStats[stageScore.stageId].artefactsHandled =
            totalArtefactsHandled;
        }
      }

      // Ensure all areas are included, even those without assessments
      for (const area of areas) {
        if (!areaStats[area.id]) {
          areaStats[area.id] = {
            name: area.area_name,
            totalScore: 0,
            expectedScore: 0,
            count: 1, // Set to 1 to avoid division by zero
          };
        }
      }

      const areaAverages = Object.keys(areaStats).map((areaId) => {
        const stats = areaStats[areaId];
        return {
          areaId: parseInt(areaId, 10),
          name: stats.name,
          averageScore: parseFloat((stats.totalScore / stats.count).toFixed(2)), // Ensure proper rounding
          expectedScore: parseFloat(
            (stats.expectedScore / stats.count).toFixed(2),
          ),
        };
      });

      const stageAverages = Object.keys(stageStats).map((stageId) => {
        const stats = stageStats[stageId];
        const averageScore = stats.count ? stats.totalScore / stats.count : 0;
        const expectedScore = stats.count
          ? stats.expectedScore / stats.count
          : 0;
        const artefactsHandledPercentage = stats.totalArtefacts
          ? (stats.artefactsHandled / stats.totalArtefacts) * 100
          : 0;

        return {
          stageId: parseInt(stageId, 10),
          name: stats.name,
          averageScore: parseFloat(averageScore.toFixed(2)), // Ensure proper rounding
          expectedScore: parseFloat(expectedScore.toFixed(2)),
          artefactsHandledPercentage,
        };
      });

      const overallArtefactCompletion = totalArtefacts
        ? (totalArtefactsHandled / totalArtefacts) * 100
        : 0;

      return {
        areaAverages,
        stageAverages,
        overallArtefactCompletion,
        artefactsHandledPercentage:
          (totalArtefactsHandled / totalArtefacts) * 100, // New metric
        currentStageId: stageId,
      };
    }),
});
