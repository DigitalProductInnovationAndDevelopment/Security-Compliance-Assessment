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
        areasMaturityScore: z.number(),
        artefactCompletenessScore: z.number(),
        areaCompletenessScore: z.number(),
        stageId: z.number(), // Include stageId or stageNumber in the input
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
        stageId, // or stageNumber if that's how you identify stages
        answersArea,
        answersArtefact,
      } = input;

      // Ensure the stage exists
      const stage = await ctx.db.stage.findUnique({
        where: { id: stageId },
      });

      if (!stage) {
        throw new Error(`Stage with id ${stageId} does not exist.`);
      }

      // Step 1: Upsert the assessment record or update if it already exists
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

      // Step 2: Upsert the StageScore record
      await ctx.db.stageScore.upsert({
        where: {
          assessmentUserId_assessmentProjectId_stageId: {
            assessmentUserId: userId,
            assessmentProjectId: projectId,
            stageId: stageId, // Use stageId or stageNumber appropriately
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
          targetAreaMaturityScore: 1, // Adjust this logic if necessary
        },
      });

      // Step 3: Upsert the AnswerAreaQuestion records
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

      // Step 4: Upsert the AnswerArtefact records
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
        stageNumber: z.number(), // Assuming you identify the stage with this
      }),
    )
    .query(async ({ input, ctx }) => {
      const { userId, projectId, stageNumber } = input;

      // Fetch the existing assessment based on userId, projectId, and stageNumber
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

      // Return the assessment data, or null if no assessment exists
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
});
