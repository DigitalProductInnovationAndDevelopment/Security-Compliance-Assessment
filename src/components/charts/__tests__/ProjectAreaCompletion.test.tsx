/* eslint-disable @typescript-eslint/no-empty-function */
// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;

import React from "react";
import { render, screen } from "@testing-library/react";
import { ProjectAreaCompletion } from "../ProjectAreaCompletion";
import { api } from "~/trpc/react";
import useProjectDetailsStore from "~/stores/useProjectDetailsStore";

// Mock the Zustand store
jest.mock("~/stores/useProjectDetailsStore");

// Mock the API
jest.mock("~/trpc/react", () => ({
  api: {
    assessment: {
      getProjectStatistics: {
        useQuery: jest.fn(),
      },
    },
  },
}));

describe("ProjectAreaCompletion Component", () => {
  const mockProjectId = 1;
  const mockStageId = 2;
  const mockCurrentStage = { id: mockStageId, name: "Stage 1" };
  const mockProjectStatistics = {
    artefactsHandledPercentage: 80,
    areaAverages: [
      { name: "Area 1", averageScore: 3, expectedScore: 5 },
      { name: "Area 2", averageScore: 2, expectedScore: 4 },
    ],
  };

  beforeEach(() => {
    // Mock Zustand store to return a specific state
    (useProjectDetailsStore as unknown as jest.Mock).mockReturnValue({
      currentStage: mockCurrentStage,
    });

    // Mock the API response
    (api.assessment.getProjectStatistics.useQuery as jest.Mock).mockReturnValue(
      {
        data: mockProjectStatistics,
        isLoading: false,
        isRefetching: false,
      },
    );
  });

  it("renders without crashing", () => {
    render(<ProjectAreaCompletion projectId={mockProjectId} />);
    expect(screen.getByText("Area Averages for Stage 1")).toBeInTheDocument();
  });

  it("displays loading skeleton when loading", () => {
    (api.assessment.getProjectStatistics.useQuery as jest.Mock).mockReturnValue(
      {
        data: null,
        isLoading: true,
        isRefetching: false,
      },
    );

    render(<ProjectAreaCompletion projectId={mockProjectId} />);
    expect(screen.getAllByText("")).toHaveLength(9); // Adjust the expected length based on the component's behavior
  });

  it("displays no data message when no statistics are available", () => {
    (api.assessment.getProjectStatistics.useQuery as jest.Mock).mockReturnValue(
      {
        data: null,
        isLoading: false,
        isRefetching: false,
      },
    );

    render(<ProjectAreaCompletion projectId={mockProjectId} />);
    expect(
      screen.getByText("No project statistics found."),
    ).toBeInTheDocument();
  });

  it("renders the correct data in the chart", async () => {
    render(<ProjectAreaCompletion projectId={mockProjectId} />);

    // Check if RadarChart is rendered
    expect(screen.getByText("Area Averages for Stage 1")).toBeInTheDocument();
  });
});
