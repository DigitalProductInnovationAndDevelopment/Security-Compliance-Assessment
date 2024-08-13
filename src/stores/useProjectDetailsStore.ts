import { Stage, Project } from "@prisma/client";
import { create } from "zustand";

interface ProjectDetailsState {
  currentStage: Stage;
  currentProject: Project | null;
  setCurrentStage: (stage: Stage) => void;
  setCurrentProject: (project: Project) => void;
}

const useProjectDetailsStore = create<ProjectDetailsState>()((set) => ({
  currentStage: {
    id: 53,
    name: "Plan Program",
    stageNumber: 1,
  },
  currentProject: null,
  setCurrentStage: (stage: Stage) => set(() => ({ currentStage: stage })),
  setCurrentProject: (project: Project) =>
    set(() => ({ currentProject: project })),
}));

export default useProjectDetailsStore;
