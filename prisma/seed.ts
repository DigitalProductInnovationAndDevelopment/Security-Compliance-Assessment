import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const dataDirectory = "./reference_model";

async function seed() {
  await prisma.answerArtefact.deleteMany();
  await prisma.answerAreaQuestion.deleteMany();
  await prisma.stageScore.deleteMany();
  await prisma.areaScore.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.question.deleteMany();
  await prisma.project.deleteMany();
  await prisma.standard.deleteMany();
  await prisma.artefact.deleteMany();
  await prisma.area.deleteMany();
  await prisma.stage.deleteMany();

  const files = fs.readdirSync(dataDirectory);

  for (const file of files) {
    const content = fs.readFileSync(path.join(dataDirectory, file), "utf-8");
    const data = JSON.parse(content);

    switch (file) {
      case "build.json":
      case "code.json":
      case "deploy.json":
      case "monitor.json":
      case "operate.json":
      case "planProgramm.json":
      case "planTeam.json":
      case "release.json":
      case "test.json":
        await handleStageData(data);
        break;
      default:
        console.log(`No handler defined for ${file}`);
    }
  }

  console.log("Data import complete.");
}

async function handleStageData(data: any) {
  const { stage, areas, stageNumber } = data;

  // Upsert the stage
  const stageModel = await prisma.stage.upsert({
    where: { name: stage },
    create: { name: stage, stageNumber: stageNumber },
    update: { name: stage, stageNumber: stageNumber },
  });

  for (const area of areas) {
    const {
      area_id,
      area_name,
      question = "",
      assessors_guide = "",
      artefacts = [], // Default to an empty array if not provided
      people,
      process,
      technology,
      people_practices,
      process_practices,
      technology_practices,
      roles,
    } = area;

    // Upsert the area without artefacts
    const areaModel = await prisma.area.upsert({
      where: {
        area_id_area_name_stageId: {
          area_id,
          area_name,
          stageId: stageModel.id,
        },
      },
      create: {
        area_id,
        area_name,
        question,
        assessors_guide,
        stage: { connect: { id: stageModel.id } },
        people,
        process,
        technology,
        people_practices,
        process_practices,
        technology_practices,
        roles,
      },
      update: {
        area_name,
        question,
        assessors_guide,
        stage: { connect: { id: stageModel.id } },
        people,
        process,
        technology,
        people_practices,
        process_practices,
        technology_practices,
        roles,
      },
    });

    console.log(`Created/Updated area ${areaModel.area_name}`);

    // Handle related artefacts separately
    for (const artefact of artefacts) {
      const {
        artefact_id,
        artefact_name,
        stage,
        in_project, // Explicitly handle the in_project field
        standards = [], // Default to an empty array if not provided
        ...artefactRest
      } = artefact;

      // Upsert artefact without standards
      const artefactModel = await prisma.artefact.upsert({
        where: {
          artefact_id_artefact_name_stage: {
            artefact_id,
            artefact_name,
            stage,
          },
        },
        create: {
          artefact_id,
          artefact_name,
          stage,
          areaId: areaModel.id,
          in_project: in_project === undefined ? null : in_project,
          ...artefactRest,
        },
        update: {
          artefact_name,
          stage,
          areaId: areaModel.id,
          in_project: in_project === undefined ? null : in_project,
          ...artefactRest,
        },
      });

      console.log(`Created/Updated artefact ${artefactModel.artefact_name}`);

      // Handle related standards separately
      for (const standard of standards) {
        const {
          id: standard_id,
          practice,
          requirements,
          artefacts: artefactsList,
        } = standard;

        await prisma.standard.upsert({
          where: {
            standard_id_practice_artefactId: {
              standard_id,
              practice,
              artefactId: artefactModel.id,
            },
          },
          create: {
            standard_id,
            practice,
            requirements,
            artefacts: artefactsList,
            artefact: { connect: { id: artefactModel.id } },
          },
          update: {
            practice,
            requirements,
            artefacts: artefactsList,
            artefact: { connect: { id: artefactModel.id } },
          },
        });

        console.log(`Created/Updated standard ${standard_id} - ${practice}`);
      }
    }
  }

  console.log(`Created/Updated stage ${stageModel.name}`);
}

async function main() {
  try {
    await seed();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
main();
