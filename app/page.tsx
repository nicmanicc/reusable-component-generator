'use client';

import { useState, useEffect, useMemo } from 'react';
import { ComponentGenerator } from './components/ComponentGenerator';
import { CodeViewer } from './components/CodeViewer';
import { ComponentPreview } from './components/ComponentPreview';
import { ChatInterface } from './components/ChatInterface';
import { Sparkles, Moon, Sun, LogOut, X, Menu } from 'lucide-react';
import {
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import type { SandpackFiles } from '@codesandbox/sandpack-react';
import { generateComponent } from './actions/generateComponent';
import { signout } from '@/lib/auth-actions';
import { createClient } from "@/utils/supabase/client";
import { createComponent, getProject, createProject, deleteProject, deleteComponent, createVersion, createChatMessage, getChatMessages } from '@/lib/prisma-actions';
import { Project, Component, TreeSidebar, Version } from './components/TreeSideBar';

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


export default function App() {
  // Project/Component state
  const [projects, setProjects] = useState<Project[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [versions, setVersions] = useState<GeneratedComponent[]>([]);

  // Selection state
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [updatedCode, setUpdatedCode] = useState<string>('');
  const [refinementSuggestions, setRefinementSuggestions] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [messageInputError, setMessageInputError] = useState(false);


  // Project handlers
  const handleCreateProject = async (name: string) => {
    const newProjectFromDB = await createProject(user.id, name);

    const newProject: Project = {
      id: newProjectFromDB.id,
      name,
      createdAt: new Date(),
    };
    setProjects(prev => [...prev, newProject]);
    setSelectedProjectId(newProject.id);
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleDeleteProject = async (projectId: string) => {
    await deleteProject(projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setComponents(prev => prev.filter(c => c.projectId !== projectId));

    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
      setSelectedComponentId(null);
      setCurrentVersionId(null);
      setChatMessages([]);
    }
  };

  // Component handlers
  const handleCreateComponent = async (name: string) => {
    if (!selectedProjectId) return;
    const newComponentFromDB = await createComponent(selectedProjectId, name);


    const newComponent: Component = {
      id: newComponentFromDB.id,
      projectId: selectedProjectId,
      name,
      createdAt: new Date(),
    };


    setComponents(prev => [...prev, newComponent]);
    setSelectedComponentId(newComponent.id);
    setCurrentVersionId(null);
    setChatMessages([]);
  };

  const handleSelectComponent = async (componentId: string) => {
    setSelectedComponentId(componentId);
    setChatMessages([]);
    await getChatMessages(componentId).then((messages: ChatMessageFromDB[]) => {
      const formattedMessages: ChatMessage[] = messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: msg.created_at as Date,
      }));
      setChatMessages(formattedMessages);
    });

    if (currentVersionId === null || versions.find(v => v.id === currentVersionId)?.componentId !== componentId) {
      const latestVersion = versions
        .filter(v => v.componentId === componentId)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
      if (latestVersion) {
        setCurrentVersionId(latestVersion.id);
      }
    }


  };

  const handleDeleteComponent = async (componentId: string) => {
    await deleteComponent(componentId);
    setComponents(prev => prev.filter(c => c.id !== componentId));
    setVersions(prev => prev.filter(v => v.componentId !== componentId));

    if (selectedComponentId === componentId) {
      setSelectedComponentId(null);
      setCurrentVersionId(null);
      setChatMessages([]);
    }
  };

  const handleSelectVersion = (versionId: string) => {
    setCurrentVersionId(versionId);
    const currentComponentId = versions.find(v => v.id === versionId)?.componentId;
    if (selectedComponentId !== currentComponentId) {
      setSelectedComponentId(currentComponentId as string);
    }
  };


  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    getProject(user.id).then((projects: ProjectWithRelations[]) => {
      const projectData: Project[] = projects.map((proj) => ({
        id: proj.id,
        name: proj.title,
        createdAt: proj.created_at,
      }));

      const allComponents: Component[] = projects.flatMap((proj) =>
        proj.project_components.map((pc: ProjectWithRelations['project_components'][number]) => ({
          id: pc.id,
          projectId: proj.id,
          name: pc.title,
          createdAt: pc.created_at as Date,
        }))
      );

      const allVersions: GeneratedComponent[] = projects.flatMap((proj) =>
        proj.project_components.flatMap((pc: ProjectWithRelations['project_components'][number]) =>
          pc.component_versions.map((cv: ProjectWithRelations['project_components'][number]['component_versions'][number]) => ({
            id: cv.id,
            componentId: pc.id,
            code: cv.generated_code,
            timestamp: cv.created_at as Date,
            prompt: cv.prompt,
          }))
        )
      );
      setProjects(projectData);
      setComponents(allComponents);
      setVersions(allVersions);

    });
  }, [user]);


  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
      }
      return newMode;
    });
  };

  const handleGenerate = async (prompt: string, isRefinement: boolean = false) => {
    setIsGenerating(true);

    const userMessage: ChatMessage = {
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMessage]);
    await createChatMessage(selectedComponentId as string, 'user', prompt);

    const response = JSON.parse(isRefinement ? await generateComponent(prompt, updatedCode) : await generateComponent(prompt));

    var refinedComponent = response.code;
    var assistantMessage: ChatMessage = {
      role: 'assistant',
      content: isRefinement
        ? `I've updated the component based on your request: "${prompt}"`
        : `I've generated a new component based on your prompt: "${prompt}"`,
      timestamp: new Date(),
    }
    if (!response.changed) {
      assistantMessage = {
        role: 'assistant',
        content: `The requested changes could not be applied. Here's the original component code.`,
        timestamp: new Date(),
      }
    } else {
      const versionLength = versions.filter(v => v.componentId === selectedComponentId).length;
      const version = await createVersion(selectedComponentId as string, versionLength + 1, prompt, refinedComponent);

      const newComponent: GeneratedComponent = {
        id: version.id,
        componentId: selectedComponentId as string,
        code: refinedComponent,
        timestamp: new Date(),
        prompt: prompt,
      };
      setVersions(prev => [...prev, newComponent]);
      setCurrentVersionId(newComponent.id);
      setRefinementSuggestions(response.actions || []);
    }

    await createChatMessage(selectedComponentId as string, 'assistant', assistantMessage.content);


    setChatMessages(prev => [...prev, assistantMessage]);
    setIsGenerating(false);
  };

  const handleSave = async () => {
    setIsGenerating(true);
    setSaved(true);
    //Check if updatedCode is different from currentVersion code
    const currentVersion = currentVersionId
      ? versions.find(v => v.id === currentVersionId)
      : null;
    if (!currentVersion || currentVersion.code === updatedCode || messageInput.trim() === '') {
      setIsGenerating(false);
      setSaved(false);
      setMessageInputError(true);
      return;
    }
    const versionLength = versions.filter(v => v.componentId === selectedComponentId).length;
    const version = await createVersion(selectedComponentId as string, versionLength + 1, messageInput, updatedCode);

    const newComponent: GeneratedComponent = {
      id: version.id,
      componentId: selectedComponentId as string,
      code: updatedCode,
      timestamp: new Date(),
      prompt: messageInput,
    };
    setVersions(prev => [...prev, newComponent]);
    setCurrentVersionId(newComponent.id);
    setIsGenerating(false);
    setSaved(false);
    setMessageInput('');
    setMessageInputError(false);
  }

  const currentVersion = currentVersionId
    ? versions.find(v => v.id === currentVersionId)
    : null;

  const sidebarVersions: Version[] = versions.map(v => ({
    id: v.id,
    componentId: v.componentId,
    prompt: v.prompt,
    timestamp: v.timestamp,
  }));

  const sandpackFiles: SandpackFiles | undefined = useMemo(
    () =>
      currentVersion
        ? {
          "/App.tsx": currentVersion
            .code
        }
        : undefined,
    [currentVersion?.id, currentVersion?.code]
  );

  return (
    <div className="min-h-screen bg-linear-to-br dark:from-slate-900 dark:to-slate-800 from-slate-50 to-slate-100  ">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 shadow-sm">
        <div className="mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Toggle sidebar"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="bg-linear-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-slate-900 dark:text-white">AI Component Generator</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Create reusable React components with AI</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className="flex items-center gap-3 pl-3 border-l border-slate-300 dark:border-slate-600">
                <div className="text-right">
                  <p className="text-sm text-slate-900 dark:text-white">{user?.name || user?.identities[0].identity_data.full_name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                </div>
                <button
                  onClick={() => signout()}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>


      {/* Main Workspace - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar - History */}
        <div className={`fixed lg:static inset-y-0 left-0 z-30
              w-64 shrink-0 h-[calc(100vh-5rem)]
              transform transition-transform duration-300 ease-in-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              ${sidebarOpen ? 'h-full' : 'h-[calc(100vh-5rem)]'}`}>
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
                  <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                    <h2 className="text-slate-900 dark:text-white mb-2">Get Started</h2>
                    <p className="text-slate-600 dark:text-slate-400">
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
                  <SandpackProvider template="react-ts" options={{
                    externalResources: ["https://cdn.tailwindcss.com"],
                  }} files={sandpackFiles} theme={isDarkMode ? "dark" : "light"}>
                    <ComponentPreview code={currentVersion.code} />
                    <CodeViewer onCodeChanged={setUpdatedCode} handleSave={handleSave} setMessageInput={setMessageInput} messageInput={messageInput} messageInputError={messageInputError} saved={saved} />
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

