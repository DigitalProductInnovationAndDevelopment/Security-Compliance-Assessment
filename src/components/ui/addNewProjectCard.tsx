"use client";
import React, { useState } from "react";
import { PlusCircleIcon, XCircleIcon } from "lucide-react";
import { Label } from "./label";
import { Input } from "./input";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { User } from "@prisma/client";
import { api } from "~/trpc/react"; // Assuming you're using tRPC for data fetching
import { useToast } from "./use-toast";
import { useRouter } from "next/navigation";

export default function AddNewProjectCard() {
  const { toast } = useToast();
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const router = useRouter()

  // Fetch users based on query
  const { data: users, isLoading } = api.user.getUser.useQuery(
    { query },
    {
      enabled: !!query, // Only fetch when there is a query
    },
  );

  const {refetch: refetchAssignedProjects} = api.project.getProjects.useQuery();

  // Mutation to create a project
  const { mutate: createProject, isPending: isCreatingProject } =
    api.project.createProject.useMutation({
      onSuccess: (data) => {
        toast({
          title: "Project created successfully!",
          description: "Redirecting to the project page...",
        });
        // Clear the form after success
        setProjectName("");
        setDescription("");
        setSelectedParticipants([]);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        refetchAssignedProjects();
        router.push("/projects/" + data.id);
      },
      onError: (error) => {
        toast({
          title: "Error creating project",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  const handleCreateProject = () => {
    // Trigger the mutation to create the project
    createProject({
      name: projectName,
      description,
      participants: selectedParticipants.map((p) => p.id),
    });
    
  };

  const handleParticipantSelect = (user: User) => {
    if (!selectedParticipants.find((p) => p.id === user.id)) {
      setSelectedParticipants([...selectedParticipants, user]);
    }
    setShowResults(false); // Hide results after selection
  };

  const handleParticipantRemove = (userId: string) => {
    setSelectedParticipants(
      selectedParticipants.filter((p) => p.id !== userId),
    );
  };

  return (
    <Card className="relative w-full max-w-sm sm:flex-1">
      <CardHeader className="bg-slate-100">
        <CardTitle className="text-center text-2xl font-bold">
          Add a New Project
        </CardTitle>
        <CardDescription className="text-center opacity-0">
          Create a new project
        </CardDescription>
      </CardHeader>
      <CardContent className="relative h-[70%]">
        <div className="flex h-full flex-col items-center justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <PlusCircleIcon className="h-8 w-8 cursor-pointer text-muted-foreground mt-8" />
            </DialogTrigger>
            <DialogContent className="z-50">
              <DialogTitle>Add a New Project</DialogTitle>
              <DialogDescription>
                Enter the project details and add participants.
              </DialogDescription>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateProject();
                }}
              >
                <div className="my-4">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    required
                    disabled={isCreatingProject}
                  />
                </div>
                <div className="my-4">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isCreatingProject}
                  />
                </div>
                <div className="relative my-4">
                  <Label htmlFor="participants">Participants</Label>

                  {/* Selected Participants */}
                  <div className="mb-2 flex flex-wrap gap-2">
                    {selectedParticipants.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center rounded-full bg-gray-100 px-2 py-1"
                      >
                        <img
                          src={user.image || "/default-avatar.png"} // Replace with your default avatar image
                          alt={`${user.name}'s avatar`}
                          className="mr-2 h-6 w-6 rounded-full"
                        />
                        <span className="mr-2 text-sm font-medium">
                          {user.name}
                        </span>
                        <XCircleIcon
                          onClick={() => handleParticipantRemove(user.id)}
                          className="h-4 w-4 cursor-pointer text-red-500"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Search Input */}
                  <Input
                    id="participants"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShowResults(true);
                    }}
                    placeholder="Search for participants..."
                    disabled={isCreatingProject}
                  />
                  {showResults && (
                    <div className="absolute z-10 max-h-40 w-full overflow-y-auto rounded border border-gray-300 bg-white shadow-lg">
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <div
                            key={index}
                            className="flex animate-pulse items-center p-2"
                          >
                            <div className="mr-3 h-8 w-8 rounded-full bg-gray-300" />
                            <div className="flex-1">
                              <div className="mb-2 h-4 w-3/4 rounded bg-gray-300"></div>
                              <div className="h-3 w-1/2 rounded bg-gray-200"></div>
                            </div>
                          </div>
                        ))
                      ) : users?.length === 0 ? (
                        <div className="p-2 text-gray-500">No users found.</div>
                      ) : (
                        users?.map((user) => (
                          <div
                            key={user.id}
                            onClick={() => handleParticipantSelect(user)}
                            className="flex cursor-pointer items-center p-2 hover:bg-gray-200"
                          >
                            <img
                              src={user.image ?? "/default-avatar.png"} // Replace with your default avatar image
                              alt={`${user.name}'s avatar`}
                              className="mr-3 h-8 w-8 rounded-full"
                            />
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-gray-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <DialogClose asChild>
                    <Button type="submit" disabled={isCreatingProject}>
                      Create Project
                    </Button>
                  </DialogClose>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
