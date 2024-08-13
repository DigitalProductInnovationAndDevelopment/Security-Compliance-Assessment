import { render, screen, waitFor } from "@testing-library/react";
import Page from "../page";
import { api } from "~/trpc/server";
import "@testing-library/jest-dom";
import React from "react";

// Mock the API calls
jest.mock("~/trpc/server", () => ({
  api: {
    project: {
      getProject: jest.fn(),
      getProjects: jest.fn(),
    },
  },
}));

describe("Page Component", () => {
  const mockProject = {
    id: 1,
    name: "Test Project",
    description: "Test Project Description",
    participants: [
      { id: 1, name: "John Doe", role: "assessor", image: null },
      { id: 2, name: "Jane Smith", role: "assessee", image: null },
    ],
  };

  const mockProjects = [
    { id: 1, name: "Test Project" },
    { id: 2, name: "Another Project" },
  ];

  beforeEach(() => {
    api.project.getProject.mockResolvedValue(mockProject);
    (api.project.getProjects as jest.Mock).mockResolvedValue(mockProjects);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders project details correctly", async () => {
    render(<Page params={{ id: "1" }} />);

    await waitFor(() => {
      expect(screen.getByText("Test Project")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Test Project Description")).toBeInTheDocument();
    });
  });

  it('displays "Project Not Found" message when no project is found', async () => {
    (api.project.getProject as jest.Mock).mockResolvedValueOnce(null);

    render(<Page params={{ id: "999" }} />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Project Not Found or you are not authorized to view this project",
        ),
      ).toBeInTheDocument();
    });
  });

  it("dropdown menu contains correct project names", async () => {
    render(<Page params={{ id: "1" }} />);

    await waitFor(() => {
      expect(screen.getByText("Change Project")).toBeInTheDocument();
    });

    screen.getByText("Change Project").click();

    await waitFor(() => {
      expect(screen.getByText("Test Project")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Another Project")).toBeInTheDocument();
    });
  });

  it("displays project members correctly", async () => {
    render(<Page params={{ id: "1" }} />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });
});
