// Mock server-only module
jest.mock("server-only", () => jest.fn());

// Mock next/headers module
jest.mock("next/headers", () => ({
  headers: jest.fn(),
}));

import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Page from "./page";
import { api } from "~/trpc/server";
import { Suspense } from "react";
import ProjectDetailAssessmentSkeleton from "~/components/ProjectDetailAssessmentSkeleton";
import ProjectDetailAssessment from "~/components/ProjectDetailAssessment";
import { useRouter } from "next/router";

// Mock the API calls
jest.mock("~/trpc/server", () => ({
  api: {
    project: {
      getProject: jest.fn(),
      getProjects: jest.fn(),
    },
  },
}));
jest.mock(
  "next/link",
  () =>
    ({ children }: { children: React.ReactNode }) =>
      children,
);
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const mockParams = { id: "1" };

describe("Page Component", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ query: mockParams });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly when project is found", async () => {
    const mockProject = {
      id: 1,
      name: "Test Project",
      description: "Test Description",
      participants: [
        { id: 1, name: "John Doe", role: "assessor", image: null },
        { id: 2, name: "Jane Doe", role: "assessee", image: null },
      ],
    };
    const mockProjects = [
      { id: 1, name: "Test Project" },
      { id: 2, name: "Another Project" },
    ];

    (api.project.getProject as jest.Mock).mockResolvedValue(mockProject);
    (api.project.getProjects as jest.Mock).mockResolvedValue(mockProjects);

    render(
      <Suspense fallback={<ProjectDetailAssessmentSkeleton />}>
        <Page params={mockParams} />
      </Suspense>,
    );

    await waitFor(() => {
      expect(screen.getByText("Test Project")).toBeInTheDocument();
      expect(screen.getByText("Test Description")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
      expect(screen.getByText("Change Project")).toBeInTheDocument();
    });
  });

  it('renders "Project Not Found" message when no project is found', async () => {
    (api.project.getProject as jest.Mock).mockResolvedValue(null);

    render(<Page params={mockParams} />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Project Not Found or you are not authorized to view this project",
        ),
      ).toBeInTheDocument();
    });
  });

  it("renders dropdown menu with correct project names and links", async () => {
    const mockProject = {
      id: 1,
      name: "Test Project",
      description: "Test Description",
      participants: [],
    };
    const mockProjects = [
      { id: 1, name: "Test Project" },
      { id: 2, name: "Another Project" },
    ];

    (api.project.getProject as jest.Mock).mockResolvedValue(mockProject);
    (api.project.getProjects as jest.Mock).mockResolvedValue(mockProjects);

    render(
      <Suspense fallback={<ProjectDetailAssessmentSkeleton />}>
        <Page params={mockParams} />
      </Suspense>,
    );

    await waitFor(() => {
      expect(screen.getByText("Change Project")).toBeInTheDocument();
      expect(screen.getByText("Test Project")).toBeInTheDocument();
      expect(screen.getByText("Another Project")).toBeInTheDocument();
    });
  });

  it("renders project description correctly", async () => {
    const mockProject = {
      id: 1,
      name: "Test Project",
      description: "Test Description",
      participants: [],
    };

    (api.project.getProjects as jest.Mock).mockResolvedValue(mockProject);

    render(
      <Suspense fallback={<ProjectDetailAssessmentSkeleton />}>
        <Page params={mockParams} />
      </Suspense>,
    );

    await waitFor(() => {
      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });
  });

  it("renders project members correctly with roles and avatars", async () => {
    const mockProject = {
      id: 1,
      name: "Test Project",
      description: "Test Description",
      participants: [
        { id: 1, name: "John Doe", role: "assessor", image: null },
        { id: 2, name: "Jane Doe", role: "assessee", image: null },
      ],
    };

    (api.project.getProjects as jest.Mock).mockResolvedValue(mockProject);

    render(
      <Suspense fallback={<ProjectDetailAssessmentSkeleton />}>
        <Page params={mockParams} />
      </Suspense>,
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
      expect(screen.getByText("assessor")).toBeInTheDocument();
      expect(screen.getByText("assessee")).toBeInTheDocument();
    });
  });

  it("renders ProjectDetailAssessment component with correct project data", async () => {
    const mockProject = {
      id: 1,
      name: "Test Project",
      description: "Test Description",
      participants: [],
    };

    (api.project.getProjects as jest.Mock).mockResolvedValue(mockProject);

    render(
      <Suspense fallback={<ProjectDetailAssessmentSkeleton />}>
        <Page params={mockParams} />
      </Suspense>,
    );

    await waitFor(() => {
      expect(screen.getByText("Test Project")).toBeInTheDocument();
      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });
  });
});
