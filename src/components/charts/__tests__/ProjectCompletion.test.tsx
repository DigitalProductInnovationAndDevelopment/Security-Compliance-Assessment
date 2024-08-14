// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;

import { render, screen } from "@testing-library/react";
import React from "react";
import { ProjectCompletion } from "../ProjectCompletion";

describe("ProjectCompletion Component", () => {
  it("renders without crashing", () => {
    render(<ProjectCompletion />);
  });

  it("renders RadarChart component", () => {
    const { container } = render(<ProjectCompletion />);
    const radarChart = container.querySelector('[data-chart="chart-r1"]');
    expect(radarChart).toBeInTheDocument();
  });
});
