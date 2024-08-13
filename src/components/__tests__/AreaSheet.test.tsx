import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AreaSheet } from "~/components/AreaSheet";
import { Area, Artefact } from "@prisma/client";
import React from "react";

describe("AreaSheet Component", () => {
  const MockChildTrigger = () => <button>Open Area Sheet</button>;

  const mockArea: Area & { artefacts: Artefact[] } = {
    id: 1,
    area_id: "1",
    area_name: "Test Area",
    people: "High",
    process: "Medium",
    technology: "Low",
    people_practices: ["Practice 1", "Practice 2"],
    process_practices: ["Practice 3", "Practice 4"],
    technology_practices: ["Practice 5", "Practice 6"],
    roles: [],
    question: "",
    assessors_guide: null,
    stageId: 0,
    artefacts: [
      {
        id: 1,
        artefact_name: "Artefact 1",
        description: "Description of Artefact 1",
        areaId: 1,
        artefact_id: "",
        stage: "",
        in_project: false,
        origin_standard: false,
        origin_practice: false,
        origin_literature_review: false,
        automation: "",
        artefact_area_id: "",
      },
      {
        id: 2,
        artefact_name: "Artefact 2",
        description: "Description of Artefact 2",
        areaId: 1,
        artefact_id: "",
        stage: "",
        in_project: false,
        origin_standard: false,
        origin_practice: false,
        origin_literature_review: false,
        automation: "",
        artefact_area_id: "",
      },
    ],
  };

  // Mock CardWrapper component
  const MockCardWrapper = ({
    area,
    artifacts,
  }: {
    area: Area;
    artifacts: Artefact[];
  }) => (
    <div>
      <h2>{area.area_name}</h2>
      {artifacts.map((artifact) => (
        <div key={artifact.id}>{artifact.artefact_name}</div>
      ))}
    </div>
  );

  it("renders correctly", async () => {
    const { container } = render(
      <AreaSheet area={mockArea}>
        <MockCardWrapper
          area={mockArea}
          artifacts={mockArea.artefacts.map((artefact) => ({
            id: artefact.id,
            artefact_id: artefact.artefact_id,
            artefact_name: artefact.artefact_name,
            stage: artefact.stage,
            description: artefact.description,
            in_project: artefact.in_project,
            origin_standard: artefact.origin_standard,
            origin_practice: artefact.origin_practice,
            origin_literature_review: artefact.origin_literature_review,
            automation: artefact.automation,
            artefact_area_id: artefact.artefact_area_id,
            areaId: artefact.areaId,
            displayIcons: true,
          }))}
        />
      </AreaSheet>,
    );
    console.log(container.innerHTML); // Log the rendered output
    expect(screen.getByText("Test Area")).toBeInTheDocument();
  });

  it("displays correct content in SheetTitle and SheetDescription when the trigger is clicked", () => {
    render(
      <AreaSheet area={mockArea}>
        <MockChildTrigger />
      </AreaSheet>,
    );
    // Click the trigger to open the sheet
    fireEvent.click(screen.getByText("Open Area Sheet"));
    expect(screen.getByText("People")).toBeInTheDocument();
    expect(screen.getByText("Process")).toBeInTheDocument();
    expect(screen.getByText("Technology")).toBeInTheDocument();
  });

  it("displays correct Badge variants based on area prop values", () => {
    render(<AreaSheet area={mockArea}>Test Children</AreaSheet>);
    const peopleBadge = screen.getByText("High");
    const processBadge = screen.getByText("Medium");
    const technologyBadge = screen.getByText("Low");

    expect(peopleBadge).toHaveClass("destructive");
    expect(processBadge).toHaveClass("secondary");
    expect(technologyBadge).toHaveClass("default");
  });

  it("renders people_practices list correctly", () => {
    render(<AreaSheet area={mockArea}>Test Children</AreaSheet>);
    expect(screen.getByText("Practice 1")).toBeInTheDocument();
    expect(screen.getByText("Practice 2")).toBeInTheDocument();
  });

  it("renders process_practices list correctly", () => {
    render(<AreaSheet area={mockArea}>Test Children</AreaSheet>);
    expect(screen.getByText("Practice 3")).toBeInTheDocument();
    expect(screen.getByText("Practice 4")).toBeInTheDocument();
  });

  it("renders technology_practices list correctly", () => {
    render(<AreaSheet area={mockArea}>Test Children</AreaSheet>);
    expect(screen.getByText("Practice 5")).toBeInTheDocument();
    expect(screen.getByText("Practice 6")).toBeInTheDocument();
  });
});
