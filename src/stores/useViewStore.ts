import { create } from "zustand";
import { ARTEFACT_VIEW, AREA_VIEW } from "./viewTypes";

interface ViewState {
  currentView: string;
  toggleView: () => void;
  setArtefactView: () => void;
  setAreaView: () => void;
}

const useViewStore = create<ViewState>()((set) => ({
  currentView: AREA_VIEW,
  toggleView: () =>
    set((state) => ({
      currentView: state.currentView === AREA_VIEW ? ARTEFACT_VIEW : AREA_VIEW,
    })),
  setArtefactView: () => set(() => ({ currentView: ARTEFACT_VIEW })),
  setAreaView: () => set(() => ({ currentView: AREA_VIEW })),
}));

export default useViewStore;
