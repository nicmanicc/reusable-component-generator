import { useState } from 'react';
import {
  FolderOpen,
  Folder,
  ChevronRight,
  ChevronDown,
  Box,
  Plus,
  MoreVertical,
  Trash2,
  Clock,
  Circle,
  CheckCircle2
} from 'lucide-react';

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Component {
  id: string;
  projectId: string;
  name: string;
  createdAt: Date;
}

export interface Version {
  id: string;
  componentId: string;
  prompt: string;
  timestamp: Date;
}

interface TreeSidebarProps {
  projects: Project[];
  components: Component[];
  versions: Version[];
  selectedProjectId: string | null;
  selectedComponentId: string | null;
  selectedVersionId: string | null;
  onSelectProject: (projectId: string) => void;
  onSelectComponent: (componentId: string) => void;
  onSelectVersion: (versionId: string) => void;
  onCreateProject: (name: string) => void;
  onCreateComponent: (name: string) => void;
  onDeleteProject: (projectId: string) => void;
  onDeleteComponent: (componentId: string) => void;
  darkMode: boolean;
}

export function TreeSidebar({
  projects,
  components,
  versions,
  selectedProjectId,
  selectedComponentId,
  selectedVersionId,
  onSelectProject,
  onSelectComponent,
  onSelectVersion,
  onCreateProject,
  onCreateComponent,
  onDeleteProject,
  onDeleteComponent,
  darkMode,
}: TreeSidebarProps) {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [expandedComponents, setExpandedComponents] = useState<Set<string>>(new Set());
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [creatingComponentForProject, setCreatingComponentForProject] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [menuOpen, setMenuOpen] = useState<{ type: 'project' | 'component'; id: string } | null>(null);

  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const toggleComponent = (componentId: string) => {
    const newExpanded = new Set(expandedComponents);
    if (newExpanded.has(componentId)) {
      newExpanded.delete(componentId);
    } else {
      newExpanded.add(componentId);
    }
    setExpandedComponents(newExpanded);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      onCreateProject(newItemName.trim());
      setNewItemName('');
      setIsCreatingProject(false);
    }
  };

  const handleCreateComponent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim() && creatingComponentForProject) {
      onCreateComponent(newItemName.trim());
      setNewItemName('');
      setCreatingComponentForProject(null);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h3 className="text-sm text-slate-900 dark:text-white uppercase tracking-wider">Explorer</h3>
        <button
          onClick={() => setIsCreatingProject(true)}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          title="New project"
        >
          <Plus className="w-4 h-4 text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      {/* Tree View */}
      <div className="flex-1 overflow-y-auto">
        {/* New Project Form */}
        {isCreatingProject && (
          <form onSubmit={handleCreateProject} className="px-2 py-2">
            <div className="flex items-center gap-1 pl-0">
              <Folder className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Project name..."
                autoFocus
                className="flex-1 px-2 py-1 text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded border border-indigo-500 focus:outline-none"
                onBlur={() => {
                  if (!newItemName.trim()) {
                    setIsCreatingProject(false);
                  }
                }}
              />
            </div>
          </form>
        )}

        {/* Projects List */}
        {projects.length === 0 && !isCreatingProject ? (
          <div className="px-4 py-8 text-center">
            <FolderOpen className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">No projects yet</p>
            <button
              onClick={() => setIsCreatingProject(true)}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Create your first project
            </button>
          </div>
        ) : (
          <div>
            {projects.map((project) => {
              const isExpanded = expandedProjects.has(project.id);
              const isSelected = project.id === selectedProjectId;
              const projectComponents = components.filter(c => c.projectId === project.id);
              const componentCount = projectComponents.length;

              return (
                <div key={project.id}>
                  {/* Project Row */}
                  <div
                    className={`group flex items-center gap-1 px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${isSelected ? 'bg-slate-100 dark:bg-slate-800' : ''
                      }`}
                  >
                    <button
                      onClick={() => toggleProject(project.id)}
                      className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      )}
                    </button>
                    {isExpanded ? (
                      <FolderOpen className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    ) : (
                      <Folder className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                    <span
                      onClick={() => {
                        onSelectProject(project.id);
                        if (!isExpanded) toggleProject(project.id);
                      }}
                      className="flex-1 text-sm text-slate-900 dark:text-white truncate"
                    >
                      {project.name}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 mr-1">
                      {componentCount}
                    </span>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(menuOpen?.id === project.id ? null : { type: 'project', id: project.id });
                        }}
                        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-all"
                      >
                        <MoreVertical className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                      </button>
                      {menuOpen?.type === 'project' && menuOpen.id === project.id && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCreatingComponentForProject(project.id);
                              onSelectProject(project.id);
                              if (!isExpanded) toggleProject(project.id);
                              setMenuOpen(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                          >
                            <Plus className="w-3 h-3" />
                            New Component
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteProject(project.id);
                              setMenuOpen(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Components under this project */}
                  {isExpanded && (
                    <div className="ml-4">
                      {/* New Component Form */}
                      {creatingComponentForProject === project.id && (
                        <form onSubmit={handleCreateComponent} className="px-2 py-1.5">
                          <div className="flex items-center gap-1 pl-4">
                            <Box className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <input
                              type="text"
                              value={newItemName}
                              onChange={(e) => setNewItemName(e.target.value)}
                              placeholder="Component name..."
                              autoFocus
                              className="flex-1 px-2 py-1 text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded border border-indigo-500 focus:outline-none"
                              onBlur={() => {
                                if (!newItemName.trim()) {
                                  setCreatingComponentForProject(null);
                                }
                              }}
                            />
                          </div>
                        </form>
                      )}

                      {projectComponents.length === 0 && creatingComponentForProject !== project.id ? (
                        <div className="px-2 py-2 pl-8 text-xs text-slate-400 dark:text-slate-500 italic">
                          No components
                        </div>
                      ) : (
                        projectComponents.map((component) => {
                          const isComponentExpanded = expandedComponents.has(component.id);
                          const isComponentSelected = component.id === selectedComponentId;
                          const componentVersions = versions.filter(v => v.componentId === component.id);
                          const versionCount = componentVersions.length;

                          return (
                            <div key={component.id}>
                              {/* Component Row */}
                              <div
                                className={`group flex items-center gap-1 px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${isComponentSelected ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''
                                  }`}
                              >
                                <button
                                  onClick={() => toggleComponent(component.id)}
                                  className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                                >
                                  {isComponentExpanded ? (
                                    <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                  )}
                                </button>
                                <Box className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                <span
                                  onClick={() => {
                                    onSelectComponent(component.id);
                                    if (!isComponentExpanded) toggleComponent(component.id);
                                  }}
                                  className={`flex-1 text-sm truncate ${isComponentSelected ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-900 dark:text-white'
                                    }`}
                                >
                                  {component.name}
                                </span>
                                <span className="text-xs text-slate-400 dark:text-slate-500 mr-1">
                                  {versionCount}
                                </span>
                                <div className="relative">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setMenuOpen(menuOpen?.id === component.id ? null : { type: 'component', id: component.id });
                                    }}
                                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-all"
                                  >
                                    <MoreVertical className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                                  </button>
                                  {menuOpen?.type === 'component' && menuOpen.id === component.id && (
                                    <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 z-20">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onDeleteComponent(component.id);
                                          setMenuOpen(null);
                                        }}
                                        className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Versions under this component */}
                              {isComponentExpanded && (
                                <div className="ml-8">
                                  {componentVersions.length === 0 ? (
                                    <div className="px-2 py-2 pl-4 text-xs text-slate-400 dark:text-slate-500 italic">
                                      No versions
                                    </div>
                                  ) : (
                                    [...componentVersions].reverse().map((version, index) => {
                                      const isVersionSelected = version.id === selectedVersionId;
                                      const versionNumber = componentVersions.length - index;

                                      return (
                                        <div
                                          key={version.id}
                                          onClick={() => onSelectVersion(version.id)}
                                          className={`group flex items-center gap-2 px-2 py-1.5 pl-4 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${isVersionSelected ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''
                                            }`}
                                        >
                                          {isVersionSelected ? (
                                            <CheckCircle2 className="w-3 h-3 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                                          ) : (
                                            <Circle className="w-3 h-3 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                                          )}
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                                v{versionNumber}
                                              </span>
                                              <span className="text-xs text-slate-400 dark:text-slate-500">
                                                {formatTime(version.timestamp)}
                                              </span>
                                            </div>
                                            <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
                                              {version.prompt}
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
