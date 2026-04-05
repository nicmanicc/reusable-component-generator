'use client';

import { useState, useMemo } from 'react';
import { ComponentGenerator } from '../components/ComponentGenerator';
import { CodeViewer } from '../components/CodeViewer';
import { ComponentPreview } from '../components/ComponentPreview';
import { ChatInterface } from '../components/ChatInterface';
import { LogOut, X, Menu } from 'lucide-react';
import { SandpackProvider } from '@codesandbox/sandpack-react';
import type { SandpackFiles } from '@codesandbox/sandpack-react';
import { generateComponent } from '../actions/generateComponent';
import { signout } from '@/lib/auth-actions';
import { createClient } from '@/utils/supabase/client';
import {
  createComponent,
  getProject,
  createProject,
  deleteProject,
  deleteComponent,
  createVersion,
  createChatMessage,
  getChatMessages,
} from '@/lib/prisma-actions';
import {
  Project,
  Component,
  TreeSidebar,
  Version,
} from '../components/TreeSideBar';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type ProjectWithRelations = Awaited<ReturnType<typeof getProject>>[number];
type ChatMessageFromDB = Awaited<ReturnType<typeof getChatMessages>>[number];
export interface GeneratedComponent {
  id: string;
  componentId: string;
  code: string;
  timestamp: Date;
  prompt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

function transformProjectData(projects: ProjectWithRelations[]) {
  const projectData: Project[] = projects.map((proj) => ({
    id: proj.id,
    name: proj.title,
    createdAt: proj.created_at,
  }));

  const allComponents: Component[] = projects.flatMap((proj) =>
    proj.project_components.map(
      (pc: ProjectWithRelations['project_components'][number]) => ({
        id: pc.id,
        projectId: proj.id,
        name: pc.title,
        createdAt: pc.created_at as Date,
      }),
    ),
  );

  const allVersions: GeneratedComponent[] = projects.flatMap((proj) =>
    proj.project_components.flatMap(
      (pc: ProjectWithRelations['project_components'][number]) =>
        pc.component_versions.map(
          (
            cv: ProjectWithRelations['project_components'][number]['component_versions'][number],
          ) => ({
            id: cv.id,
            componentId: pc.id,
            code: cv.generated_code,
            timestamp: cv.created_at as Date,
            prompt: cv.prompt,
          }),
        ),
    ),
  );

  return { projectData, allComponents, allVersions };
}

export default function App() {
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const supabase = createClient();

  // Auth query
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
  });

  // Projects query (includes components + versions)
  const { data: projectData } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: () => getProject(user!.id),
    enabled: !!user,
    select: transformProjectData,
  });

  const projects = projectData?.projectData ?? [];
  const components = projectData?.allComponents ?? [];
  const versions = projectData?.allVersions ?? [];

  // Selection state
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null,
  );
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [updatedCode, setUpdatedCode] = useState<string>('');
  const [refinementSuggestions, setRefinementSuggestions] = useState<string[]>(
    [],
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [messageInputError, setMessageInputError] = useState(false);

  // Chat messages query
  const { data: chatMessages = [] } = useQuery({
    queryKey: ['chatMessages', selectedComponentId],
    queryFn: async () => {
      const messages = await getChatMessages(selectedComponentId!);
      return messages.map((msg: ChatMessageFromDB) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: msg.created_at as Date,
      }));
    },
    enabled: !!selectedComponentId,
  });

  // Mutations
  const createProjectMutation = useMutation({
    mutationFn: ({ userId, name }: { userId: string; name: string }) =>
      createProject(userId, name),
    onSuccess: (newProjectFromDB) => {
      if (!newProjectFromDB) {
        toast.error('Failed to create project');
        return;
      }
      toast.success('Project created successfully!');
      queryClient.invalidateQueries({ queryKey: ['projects', user?.id] });
      setSelectedProjectId(newProjectFromDB.id);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: ['projects', user?.id] });
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
        toast.error('Failed to create component');
        return;
      }
      toast.success('Component created successfully!');
      queryClient.invalidateQueries({ queryKey: ['projects', user?.id] });
      setSelectedComponentId(newComponentFromDB.id);
      setCurrentVersionId(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteComponentMutation = useMutation({
    mutationFn: deleteComponent,
    onSuccess: (_, componentId) => {
      queryClient.invalidateQueries({ queryKey: ['projects', user?.id] });
      if (selectedComponentId === componentId) {
        setSelectedComponentId(null);
        setCurrentVersionId(null);
      }
    },
  });

  // Project handlers
  const handleCreateProject = (name: string) => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }
    createProjectMutation.mutate({ userId: user.id, name });
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedComponentId(null);
    setCurrentVersionId(null);
    setSelectedProjectId(projectId);
  };

  const handleDeleteProject = (projectId: string) => {
    deleteProjectMutation.mutate(projectId);
  };

  // Component handlers
  const handleCreateComponent = (name: string) => {
    if (!selectedProjectId) return;
    createComponentMutation.mutate({ projectId: selectedProjectId, name });
  };

  const handleSelectComponent = (componentId: string) => {
    setCurrentVersionId(null);
    setMessageInputError(false);
    setMessageInput('');
    setSelectedComponentId(componentId);

    if (
      currentVersionId === null ||
      versions.find((v) => v.id === currentVersionId)?.componentId !==
        componentId
    ) {
      const latestVersion = versions
        .filter((v) => v.componentId === componentId)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
      if (latestVersion) {
        setCurrentVersionId(latestVersion.id);
      }
    }
  };

  const handleDeleteComponent = (componentId: string) => {
    deleteComponentMutation.mutate(componentId);
  };

  const handleSelectVersion = (versionId: string) => {
    setCurrentVersionId(versionId);
    setMessageInputError(false);
    setMessageInput('');
    const currentComponentId = versions.find(
      (v) => v.id === versionId,
    )?.componentId;
    if (selectedComponentId !== currentComponentId) {
      setSelectedComponentId(currentComponentId as string);
    }
  };

  const handleGenerate = async (
    prompt: string,
    isRefinement: boolean = false,
  ) => {
    setIsGenerating(true);

    await createChatMessage(selectedComponentId as string, 'user', prompt);

    const response = JSON.parse(
      isRefinement
        ? await generateComponent(prompt, updatedCode)
        : await generateComponent(prompt),
    );

    const refinedComponent = response.code;
    let assistantMessage: ChatMessage = {
      role: 'assistant',
      content: isRefinement
        ? `I've updated the component based on your request: "${prompt}"`
        : `I've generated a new component based on your prompt: "${prompt}"`,
      timestamp: new Date(),
    };
    if (!response.changed) {
      assistantMessage = {
        role: 'assistant',
        content: `The requested changes could not be applied. Here's the original component code.`,
        timestamp: new Date(),
      };
    } else {
      const versionLength = versions.filter(
        (v) => v.componentId === selectedComponentId,
      ).length;
      const version = await createVersion(
        selectedComponentId as string,
        versionLength + 1,
        prompt,
        refinedComponent,
      );

      setCurrentVersionId(version.id);
      setRefinementSuggestions(response.actions || []);
      queryClient.invalidateQueries({ queryKey: ['projects', user?.id] });
    }

    await createChatMessage(
      selectedComponentId as string,
      'assistant',
      assistantMessage.content,
    );

    queryClient.invalidateQueries({
      queryKey: ['chatMessages', selectedComponentId],
    });
    setIsGenerating(false);
  };

  const handleSave = async () => {
    setIsGenerating(true);
    setSaved(true);
    //Check if updatedCode is different from currentVersion code
    const currentVersion = currentVersionId
      ? versions.find((v) => v.id === currentVersionId)
      : null;
    if (
      !currentVersion ||
      currentVersion.code === updatedCode ||
      messageInput.trim() === ''
    ) {
      setIsGenerating(false);
      setSaved(false);
      setMessageInputError(true);
      return;
    }
    const versionLength = versions.filter(
      (v) => v.componentId === selectedComponentId,
    ).length;
    const version = await createVersion(
      selectedComponentId as string,
      versionLength + 1,
      messageInput,
      updatedCode,
    );

    queryClient.invalidateQueries({ queryKey: ['projects', user?.id] });
    setCurrentVersionId(version.id);
    setIsGenerating(false);
    setSaved(false);
    setMessageInput('');
    setMessageInputError(false);
  };

  const currentVersion = currentVersionId
    ? versions.find((v) => v.id === currentVersionId)
    : null;

  const sidebarVersions: Version[] = versions.map((v) => ({
    id: v.id,
    componentId: v.componentId,
    prompt: v.prompt,
    timestamp: v.timestamp,
  }));

  const sandpackFiles: SandpackFiles | undefined = useMemo(
    () =>
      currentVersion
        ? {
            '/App.tsx': currentVersion.code,
          }
        : undefined,
    [currentVersion],
  );

  return (
    <div className="font-dm-mono bg-parchment text-ink min-h-dvh flex flex-col lp-crosshatch">
      {/* Header */}
      <header className="z-40 bg-parchment border-b border-rule sticky top-0 flex items-center justify-between px-6 h-13">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-mid hover:text-ink transition-colors bg-transparent border-none p-0 cursor-pointer"
            title="Toggle sidebar"
          >
            {sidebarOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
          <div className="font-dm-mono text-[0.78rem] font-medium tracking-[0.22em] uppercase text-ink flex items-center gap-2.5">
            <span className="text-teal text-[1.05rem]">[/]</span>
            ShareUI
          </div>
          <span className="text-[0.6rem] tracking-[0.14em] uppercase text-mid border-l border-rule pl-4 hidden sm:block">
            Component Studio
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[0.65rem] tracking-widest text-ink">
              {user?.user_metadata?.full_name || user?.email}
            </p>
          </div>
          <button
            onClick={() => signout()}
            className="font-dm-mono text-[0.65rem] tracking-widest uppercase text-mid hover:text-ink flex items-center gap-1.5 bg-transparent border-none cursor-pointer transition-colors"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* Main Workspace - Split View */}
      <div className="relative z-10 flex-1 flex overflow-hidden">
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar - History */}
        <div
          className={`fixed lg:static inset-y-0 left-0 z-30
              w-64 shrink-0 h-screen
              transform transition-transform duration-300 ease-in-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          <TreeSidebar
            projects={projects}
            components={components}
            versions={sidebarVersions}
            selectedProjectId={selectedProjectId}
            selectedComponentId={selectedComponentId}
            selectedVersionId={currentVersionId}
            onSelectProject={handleSelectProject}
            onSelectComponent={handleSelectComponent}
            onSelectVersion={handleSelectVersion}
            onCreateProject={handleCreateProject}
            onCreateComponent={handleCreateComponent}
            onDeleteProject={handleDeleteProject}
            onDeleteComponent={handleDeleteComponent}
          />
        </div>

        {/* Center - Preview & Code */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {!currentVersion ? (
              /* Initial State - Show prompt */
              <div className="max-w-3xl mx-auto">
                {selectedComponentId ? (
                  <ComponentGenerator
                    onGenerate={(prompt) => handleGenerate(prompt, false)}
                    isGenerating={isGenerating}
                  />
                ) : (
                  <div className="border border-rule p-12 text-center">
                    <div className="font-dm-serif italic text-teal text-[2.8rem] leading-none mb-6 opacity-20">
                      [/]
                    </div>
                    <p className="text-[0.62rem] tracking-[0.28em] uppercase text-teal mb-2 lp-label-line inline-flex items-center gap-2">
                      {!selectedProjectId
                        ? 'Select a project'
                        : 'Select a component'}
                    </p>
                    <p className="text-[0.75rem] text-mid mt-4">
                      {!selectedProjectId
                        ? 'Create or select a project to begin'
                        : 'Create or select a component to start generating'}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                <div className="lg:col-span-2 space-y-6">
                  <SandpackProvider
                    template="react-ts"
                    options={{
                      externalResources: ['https://cdn.tailwindcss.com'],
                    }}
                    files={sandpackFiles}
                    theme={theme ? 'dark' : 'light'}
                  >
                    <ComponentPreview code={currentVersion.code} />
                    <CodeViewer
                      onCodeChanged={setUpdatedCode}
                      handleSave={handleSave}
                      setMessageInput={setMessageInput}
                      messageInput={messageInput}
                      messageInputError={messageInputError}
                      saved={saved}
                    />
                  </SandpackProvider>
                </div>

                {/* Right Sidebar - Chat Refinement */}
                <div className="lg:col-span-1">
                  <ChatInterface
                    messages={chatMessages}
                    onSendMessage={(message) => handleGenerate(message, true)}
                    isGenerating={isGenerating}
                    refinementSuggestions={refinementSuggestions}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
