import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AreaSheet } from "~/components/AreaSheet";
import { Area, Artefact } from "@prisma/client";
import React from "react";

describe("AreaSheet Component", () => {
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
    artefacts: [],
  };

  it("renders correctly", () => {
    const { container } = render(
      <AreaSheet area={mockArea}>Test Children</AreaSheet>,
    );
    console.log(container.innerHTML); // Log the rendered output
    expect(
      screen.getByText((content, element) => content.includes("Test Area")),
    ).toBeInTheDocument();
  });

  it("displays correct content in SheetTitle and SheetDescription", () => {
    render(<AreaSheet area={mockArea}>Test Children</AreaSheet>);
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
