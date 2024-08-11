import { Stage } from "@prisma/client";
import { create } from "zustand";

interface ProjectDetailsState {
  currentStage: Stage;
  setCurrentStage: (stage: Stage) => void;
}

const useProjectDetailsStore = create<ProjectDetailsState>()((set) => ({
  currentStage: {
    id: 1,
    name: "Plan Program",
    stageNumber: 1,
  },
  setCurrentStage: (stage: Stage) => set(() => ({ currentStage: stage })),
}));

export default useProjectDetailsStore;
