import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ProjectDetailAssessment from "../ProjectDetailAssessment";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import useProjectDetailsStore from "~/stores/useProjectDetailsStore";

// Mock the required modules and data
jest.mock("~/trpc/react");
jest.mock("next-auth/react");
jest.mock("~/stores/useProjectDetailsStore");

describe("ProjectDetailAssessment", () => {
  const mockProject = {
    id: 1,
    name: "Project 1",
    description: "A sample project",
    archived: false,
    created_at: new Date(),
    assessments: [],
  };

  const mockStages = [{ id: 1, name: "Stage 1", stageNumber: 1 }];
  const mockAreas = {
    areas: [
      {
        area_name: "Area 1",
        assessment_questions: [{ id: 1, body: "Question 1" }],
      },
    ],
  };
  const mockArtefacts = [
    { id: 1, artefact_name: "Artefact 1", artefact_id: 1 },
  ];
  const mockAssessment = {
    answersArea: [],
    answersArtefact: [],
  };

  beforeEach(() => {
    (api.refa.stages.useQuery as jest.Mock).mockReturnValue({
      data: mockStages,
      isLoading: false,
    });
    (api.refa.areasWithArtefactsByStage.useQuery as jest.Mock).mockReturnValue({
      data: mockAreas,
      isLoading: false,
      refetch: jest.fn(),
    });
    (api.refa.artefactsByStage.useQuery as jest.Mock).mockReturnValue({
      data: mockArtefacts,
      isLoading: false,
      refetch: jest.fn(),
    });
    (
      api.assessment.getExistingAssessment.useQuery as jest.Mock
    ).mockReturnValue({
      data: mockAssessment,
      isLoading: false,
      refetch: jest.fn(),
    });
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { id: "1" } },
    });
    (useProjectDetailsStore as unknown as jest.Mock).mockReturnValue({
      currentStage: mockStages[0],
      setCurrentStage: jest.fn(),
    });
  });

  it("renders without crashing", () => {
    render(<ProjectDetailAssessment project={mockProject} />);
    expect(screen.getByText("Stage 1")).toBeInTheDocument();
  });

  it("allows changing stages", async () => {
    render(<ProjectDetailAssessment project={mockProject} />);

    const changeStageButton = screen.getByText("Change Stage");
    fireEvent.click(changeStageButton);

    const stageOption = screen.getByText("Stage 1");
    fireEvent.click(stageOption);

    await waitFor(() =>
      expect(useProjectDetailsStore().setCurrentStage).toHaveBeenCalledWith(
        mockStages[0],
      ),
    );
  });

  it("submits the assessment", async () => {
    const mockCreateAssessment = jest.fn();
    const mockCreateAreasScores = jest.fn();

    (api.assessment.createAssessment.useMutation as jest.Mock).mockReturnValue({
      mutateAsync: mockCreateAssessment,
      isPending: false,
    });
    (api.assessment.createAreasScores.useMutation as jest.Mock).mockReturnValue(
      {
        mutateAsync: mockCreateAreasScores,
      },
    );

    render(<ProjectDetailAssessment project={mockProject} />);

    const submitButton = screen.getByText("Submit Assessment");
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockCreateAssessment).toHaveBeenCalled());
    await waitFor(() => expect(mockCreateAreasScores).toHaveBeenCalled());
  });
});
