import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const dataDirectory = './reference_model';

async function seed() {
  const files = fs.readdirSync(dataDirectory);

  for (const file of files) {
    const content = fs.readFileSync(path.join(dataDirectory, file), 'utf-8');
    const data = JSON.parse(content);

    switch (file) {
      case 'build.json':
      case 'code.json':
      case 'deploy.json':
      case 'monitor.json':
      case 'operate.json':
      case 'planProgramm.json':
      case 'planTeam.json':
      case 'release.json':
      case 'test.json':
        await handleStageData(data);
        break;
      default:
        console.log(`No handler defined for ${file}`);
    }
  }

  console.log('Data import complete.');
}

async function handleStageData(data: any) {
  const { stage, areas } = data;

  // Upsert the stage
  const stageModel = await prisma.stage.upsert({
    where: { stage: stage },
    create: { stage: stage },
    update: { stage: stage },
  });

  for (const area of areas) {
    const {
      area_id,
      area_name,
      question = "",
      assessors_guide = "",
      artefacts = [], // Default to an empty array if not provided
      ...rest
    } = area;

    // Upsert the area without artefacts
    const areaModel = await prisma.area.upsert({
      where: { area_id },
      create: {
        area_id,
        area_name,
        question,
        assessors_guide,
        stage: stageModel.stage,
        ...rest,
      },
      update: {
        area_name,
        question,
        assessors_guide,
        stage: stageModel.stage,
        ...rest,
      },
    });

    console.log(`Created/Updated area ${areaModel.area_name}`);

    // Handle related artefacts separately
    for (const artefact of artefacts) {
      const {
        artefact_id,
        artefact_name,
        in_project, // Explicitly handle the in_project field
        standards = [], // Default to an empty array if not provided
        ...artefactRest
      } = artefact;

      // Upsert artefact without standards
      const artefactModel = await prisma.artefact.upsert({
        where: { artefact_id },
        create: {
          artefact_id,
          artefact_name,
          artefact_area_id: areaModel.area_id,
          in_project: in_project === undefined ? null : in_project,
          ...artefactRest,
        },
        update: {
          artefact_name,
          artefact_area_id: areaModel.area_id,
          in_project: in_project === undefined ? null : in_project,
          ...artefactRest,
        },
      });

      console.log(`Created/Updated artefact ${artefactModel.artefact_name}`);

      // Handle related standards separately
      for (const standard of standards) {
        const {
          id,
          practice,
          requirements,
          artefacts: artefactsList,
          ...standardRest
        } = standard;

        await prisma.standard.upsert({
          where: { id },
          create: {
            standard_id: id,
            practice,
            requirements,
            artefactsList,
            artefactArtefact_id: artefactModel.artefact_id,
            ...standardRest,
          },
          update: {
            practice,
            requirements,
            artefactsList,
            artefactArtefact_id: artefactModel.artefact_id,
            ...standardRest,
          },
        });

        console.log(`Created/Updated standard ${id}`);
      }
    }
  }

  console.log(`Created/Updated stage ${stageModel.stage}`);
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