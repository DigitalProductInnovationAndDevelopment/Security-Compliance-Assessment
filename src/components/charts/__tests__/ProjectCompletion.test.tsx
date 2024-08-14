import { render, screen } from "@testing-library/react";
import React from "react";
import { ProjectCompletion } from "../ProjectCompletion";

describe("ProjectCompletion Component", () => {
  it("renders without crashing", () => {
    render(<ProjectCompletion />);
  });

  it("renders RadarChart component", () => {
    render(<ProjectCompletion />);
    const radarChart = screen.getByTestId("radar-chart");
    expect(radarChart).toBeInTheDocument();
  });
});
