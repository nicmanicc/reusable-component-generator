import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createComponent,
  createProject,
  deleteComponent,
  deleteProject,
} from "@/lib/prisma-actions";

interface UseDashboardMutationsParams {
  userId?: string;
  selectedProjectId: string | null;
  selectedComponentId: string | null;
  setSelectedProjectId: (projectId: string | null) => void;
  setSelectedComponentId: (componentId: string | null) => void;
  setCurrentVersionId: (versionId: string | null) => void;
}

export function useDashboardMutations({
  userId,
  selectedProjectId,
  selectedComponentId,
  setSelectedProjectId,
  setSelectedComponentId,
  setCurrentVersionId,
}: UseDashboardMutationsParams) {
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: ({ userId, name }: { userId: string; name: string }) =>
      createProject(userId, name),
    onSuccess: (newProjectFromDB) => {
      if (!newProjectFromDB) {
        toast.error("Failed to create project");
        return;
      }

      toast.success("Project created successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects", userId] });
      setSelectedProjectId(newProjectFromDB.id);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: ["projects", userId] });
      if (selectedProjectId === projectId) {
        setSelectedProjectId(null);
        setSelectedComponentId(null);
        setCurrentVersionId(null);
      }
    },
  });

  const createComponentMutation = useMutation({
    mutationFn: ({ projectId, name }: { projectId: string; name: string }) =>
      createComponent(projectId, name),
    onSuccess: (newComponentFromDB) => {
      if (!newComponentFromDB) {
        toast.error("Failed to create component");
        return;
      }

      toast.success("Component created successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects", userId] });
      setSelectedComponentId(newComponentFromDB.id);
      setCurrentVersionId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteComponentMutation = useMutation({
    mutationFn: deleteComponent,
    onSuccess: (_, componentId) => {
      queryClient.invalidateQueries({ queryKey: ["projects", userId] });
      if (selectedComponentId === componentId) {
        setSelectedComponentId(null);
        setCurrentVersionId(null);
      }
    },
  });

  return {
    createProjectMutation,
    deleteProjectMutation,
    createComponentMutation,
    deleteComponentMutation,
  };
}
