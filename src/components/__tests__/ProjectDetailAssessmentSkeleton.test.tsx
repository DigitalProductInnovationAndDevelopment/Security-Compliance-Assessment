/* eslint-disable testing-library/no-node-access */
import React from "react";
import { render, screen } from "@testing-library/react";
import ProjectDetailAssessmentSkeleton from "~/components/ProjectDetailAssessmentSkeleton";

describe("ProjectDetailAssessmentSkeleton", () => {
  it("renders without crashing", () => {
    render(<ProjectDetailAssessmentSkeleton />);
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<ProjectDetailAssessmentSkeleton />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("contains main elements", () => {
    render(<ProjectDetailAssessmentSkeleton />);

    // Check for DropdownMenu
    expect(
      screen.getByRole("button", { name: /chevron down/i }),
    ).toBeInTheDocument();

    // Check for Accordion
    expect(
      screen.getAllByRole("button", { name: /accordion trigger/i }).length,
    ).toBeGreaterThan(0);

    // Check for ScrollArea
    expect(screen.getAllByRole("region").length).toBeGreaterThan(0);
  });

  it("elements have animate-pulse class", () => {
    render(<ProjectDetailAssessmentSkeleton />);

    // Check for elements with animate-pulse class
    const pulseElements = document.querySelectorAll(".animate-pulse");
    expect(pulseElements.length).toBeGreaterThan(0);
  });
});
