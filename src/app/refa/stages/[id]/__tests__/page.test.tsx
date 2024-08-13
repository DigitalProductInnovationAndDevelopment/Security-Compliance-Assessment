import React from "react";
import { render, screen } from "@testing-library/react";
import Page from "../page";
import { api } from "~/trpc/server";

// Mock the API call
jest.mock("~/trpc/server", () => ({
  api: {
    refa: {
      areasWithArtefactsByStage: jest.fn().mockResolvedValue({
        areas: [
          {
            area_id: "1",
            area_name: "Area 1",
            artefacts: [
              { artefact_id: "1", artefact_name: "Artefact 1" },
              { artefact_id: "2", artefact_name: "Artefact 2" },
            ],
          },
          {
            area_id: "2",
            area_name: "Area 2",
            artefacts: [{ artefact_id: "3", artefact_name: "Artefact 3" }],
          },
        ],
      }),
    },
  },
}));

describe("Page Component", () => {
  const mockParams = { params: { id: "1" } };
  const mockData = {
    areas: [
      {
        area_id: "1",
        area_name: "Area 1",
        artefacts: [
          { artefact_id: "1", artefact_name: "Artefact 1" },
          { artefact_id: "2", artefact_name: "Artefact 2" },
        ],
      },
      {
        area_id: "2",
        area_name: "Area 2",
        artefacts: [{ artefact_id: "3", artefact_name: "Artefact 3" }],
      },
    ],
  };

  beforeEach(() => {
    (api.refa.areasWithArtefactsByStage as jest.Mock).mockResolvedValue(
      mockData,
    );
  });

  it("renders without crashing", async () => {
    render(<Page {...mockParams} />);
    expect(await screen.findByText("Area 1")).toBeInTheDocument();
  });

  it("calls the API with correct parameters", async () => {
    render(<Page {...mockParams} />);
    expect(api.refa.areasWithArtefactsByStage).toHaveBeenCalledWith({
      stageNumber: 1,
    });
  });

  it("renders the correct number of AreaSheet and CardWrapper components", async () => {
    render(<Page {...mockParams} />);
    const areaSheets = await screen.findAllByTestId("area-sheet");
    const cardWrappers = await screen.findAllByTestId("card-wrapper");

    expect(areaSheets).toHaveLength(mockData.areas.length);
    expect(cardWrappers).toHaveLength(
      mockData.areas.reduce((acc, area) => acc + area.artefacts.length, 0),
    );
  });
});
