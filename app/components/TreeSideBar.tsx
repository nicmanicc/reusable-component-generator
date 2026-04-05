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
  CheckCircle2,
} from 'lucide-react';

export interface Project {
  id: string;
  name: string;
  createdAt: Date | null;
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
}: TreeSidebarProps) {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set(),
  );
  const [expandedComponents, setExpandedComponents] = useState<Set<string>>(
    new Set(),
  );
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [creatingComponentForProject, setCreatingComponentForProject] =
    useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [menuOpen, setMenuOpen] = useState<{
    type: 'project' | 'component';
    id: string;
  } | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [projectDuplicate, setProjectDuplicate] = useState(false);

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
    if (!projectDuplicate && newItemName.trim()) {
      onCreateProject(newItemName.trim());
      setNewItemName('');
      setIsCreatingProject(false);
      setProjectDuplicate(false);
    }
  };

  const handleCreateComponent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled && newItemName.trim() && creatingComponentForProject) {
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
    <div className="bg-parchment border-r border-rule h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-rule flex items-center justify-between">
        <span className="text-[0.58rem] tracking-[0.22em] uppercase text-mid font-medium">
          Explorer
        </span>
        <button
          onClick={() => setIsCreatingProject(true)}
          className="p-1 hover:text-teal transition-colors text-mid bg-transparent border-none cursor-pointer"
          title="New project"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Tree View */}
      <div className="flex-1 overflow-y-auto">
        {/* New Project Form */}
        {isCreatingProject && (
          <form onSubmit={handleCreateProject} className="px-2 py-2">
            <div className="flex items-center flex-wrap gap-1 pl-0">
              <div className="w-full">
                {projectDuplicate && (
                  <span className="text-red-500 text-xs block">
                    Duplicate name
                  </span>
                )}
              </div>
              <Folder className="w-4 h-4 text-mid shrink-0" />
              <input
                type="text"
                value={newItemName}
                onChange={(e) => {
                  setNewItemName(e.target.value);
                  if (e.target.value.trim()) {
                    const duplicate = projects.find(
                      (p) =>
                        p.name.toLowerCase() ===
                        e.target.value.trim().toLowerCase(),
                    );
                    setProjectDuplicate(!!duplicate);
                  } else {
                    setProjectDuplicate(false);
                  }
                }}
                placeholder="Project name..."
                autoFocus
                className={`flex-1 px-2 py-1 text-[0.72rem] font-dm-mono bg-parchment text-ink border ${projectDuplicate ? 'border-red-500' : 'border-teal'} focus:outline-none`}
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
            <FolderOpen className="w-8 h-8 mx-auto mb-2 text-rule" />
            <p className="text-[0.68rem] tracking-widest text-mid mb-2">
              No projects yet
            </p>
            <button
              onClick={() => setIsCreatingProject(true)}
              className="text-[0.62rem] tracking-widest uppercase text-teal hover:text-ink transition-colors bg-transparent border-none cursor-pointer"
            >
              Create first project
            </button>
          </div>
        ) : (
          <div>
            {projects.map((project) => {
              const isExpanded = expandedProjects.has(project.id);
              const isSelected = project.id === selectedProjectId;
              const projectComponents = components.filter(
                (c) => c.projectId === project.id,
              );
              const componentCount = projectComponents.length;

              return (
                <div key={project.id}>
                  {/* Project Row */}
                  <div
                    className={`group flex items-center gap-1 px-2 py-1.5 hover:bg-teal/5 cursor-pointer border-l-2 transition-colors ${
                      isSelected
                        ? 'border-teal bg-teal/5'
                        : 'border-transparent'
                    }`}
                  >
                    <button
                      onClick={() => toggleProject(project.id)}
                      className="p-0.5 hover:text-teal transition-colors text-mid bg-transparent border-none cursor-pointer"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    {isExpanded ? (
                      <FolderOpen className="w-4 h-4 text-teal shrink-0" />
                    ) : (
                      <Folder className="w-4 h-4 text-mid shrink-0" />
                    )}
                    <span
                      onClick={() => {
                        onSelectProject(project.id);
                        if (!isExpanded) toggleProject(project.id);
                      }}
                      className="flex-1 text-[0.75rem] font-dm-mono text-ink truncate"
                    >
                      {project.name}
                    </span>
                    <span className="text-[0.6rem] text-mid mr-1">
                      {componentCount}
                    </span>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(
                            menuOpen?.id === project.id
                              ? null
                              : { type: 'project', id: project.id },
                          );
                        }}
                        className="p-1 opacity-0 group-hover:opacity-100 hover:text-teal transition-all text-mid bg-transparent border-none cursor-pointer"
                      >
                        <MoreVertical className="w-3 h-3" />
                      </button>
                      {menuOpen?.type === 'project' &&
                        menuOpen.id === project.id && (
                          <div className="absolute right-0 top-full mt-1 w-40 bg-parchment border border-rule shadow-md py-1 z-20">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCreatingComponentForProject(project.id);
                                onSelectProject(project.id);
                                if (!isExpanded) toggleProject(project.id);
                                setMenuOpen(null);
                              }}
                              className="w-full px-3 py-2 text-left text-[0.68rem] font-dm-mono tracking-wide text-ink hover:bg-teal/5 hover:text-teal flex items-center gap-2 bg-transparent border-none cursor-pointer"
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
                              className="w-full px-3 py-2 text-left text-[0.68rem] font-dm-mono tracking-wide text-red-600 hover:bg-red-50 flex items-center gap-2 bg-transparent border-none cursor-pointer"
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
                        <form
                          onSubmit={handleCreateComponent}
                          className="px-2 py-1.5"
                        >
                          <div className="flex items-center flex-wrap gap-1 pl-4">
                            <div className="w-full">
                              {disabled && (
                                <span className="text-red-500 text-xs block">
                                  Duplicate name
                                </span>
                              )}
                            </div>
                            <Box className="w-4 h-4 text-mid shrink-0" />
                            <input
                              type="text"
                              value={newItemName}
                              onChange={(e) => {
                                setNewItemName(e.target.value);
                                if (e.target.value.trim()) {
                                  const duplicate = components.find(
                                    (c) =>
                                      c.name.toLowerCase() ===
                                      e.target.value.trim().toLowerCase(),
                                  );
                                  setDisabled(!!duplicate);
                                } else {
                                  setDisabled(false);
                                }
                              }}
                              placeholder="Component name..."
                              autoFocus
                              className={`flex-1 px-2 py-1 text-[0.72rem] font-dm-mono bg-parchment text-ink border border-teal focus:outline-none ${disabled ? 'border-red-500' : ''}`}
                              onBlur={() => {
                                if (!newItemName.trim()) {
                                  setCreatingComponentForProject(null);
                                }
                              }}
                            />
                          </div>
                        </form>
                      )}

                      {projectComponents.length === 0 &&
                      creatingComponentForProject !== project.id ? (
                        <div className="px-2 py-2 pl-8 text-[0.6rem] tracking-wide text-mid italic">
                          No components
                        </div>
                      ) : (
                        projectComponents.map((component) => {
                          const isComponentExpanded = expandedComponents.has(
                            component.id,
                          );
                          const isComponentSelected =
                            component.id === selectedComponentId;
                          const componentVersions = versions.filter(
                            (v) => v.componentId === component.id,
                          );
                          const versionCount = componentVersions.length;

                          return (
                            <div key={component.id}>
                              {/* Component Row */}
                              <div
                                className={`group flex items-center gap-1 px-2 py-1.5 hover:bg-teal/5 cursor-pointer border-l-2 transition-colors ml-4 ${
                                  isComponentSelected
                                    ? 'border-teal bg-teal/5'
                                    : 'border-transparent'
                                }`}
                              >
                                <button
                                  onClick={() => toggleComponent(component.id)}
                                  className="p-0.5 hover:text-teal transition-colors text-mid bg-transparent border-none cursor-pointer"
                                >
                                  {isComponentExpanded ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </button>
                                <Box className="w-4 h-4 text-teal shrink-0" />
                                <span
                                  onClick={() => {
                                    onSelectComponent(component.id);
                                    if (!isComponentExpanded)
                                      toggleComponent(component.id);
                                  }}
                                  className={`flex-1 text-[0.75rem] font-dm-mono truncate ${
                                    isComponentSelected
                                      ? 'text-teal'
                                      : 'text-ink'
                                  }`}
                                >
                                  {component.name}
                                </span>
                                <span className="text-[0.6rem] text-mid mr-1">
                                  {versionCount}
                                </span>
                                <div className="relative">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setMenuOpen(
                                        menuOpen?.id === component.id
                                          ? null
                                          : {
                                              type: 'component',
                                              id: component.id,
                                            },
                                      );
                                    }}
                                    className="p-1 opacity-0 group-hover:opacity-100 hover:text-teal transition-all text-mid bg-transparent border-none cursor-pointer"
                                  >
                                    <MoreVertical className="w-3 h-3" />
                                  </button>
                                  {menuOpen?.type === 'component' &&
                                    menuOpen.id === component.id && (
                                      <div className="absolute right-0 top-full mt-1 w-32 bg-parchment border border-rule shadow-md py-1 z-20">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteComponent(component.id);
                                            setMenuOpen(null);
                                          }}
                                          className="w-full px-3 py-2 text-left text-[0.68rem] font-dm-mono tracking-wide text-red-600 hover:bg-red-50 flex items-center gap-2 bg-transparent border-none cursor-pointer"
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
                                    <div className="px-2 py-2 pl-4 text-[0.6rem] tracking-wide text-mid italic">
                                      No versions
                                    </div>
                                  ) : (
                                    [...componentVersions]
                                      .reverse()
                                      .map((version, index) => {
                                        const isVersionSelected =
                                          version.id === selectedVersionId;
                                        const versionNumber =
                                          componentVersions.length - index;

                                        return (
                                          <div
                                            key={version.id}
                                            onClick={() =>
                                              onSelectVersion(version.id)
                                            }
                                            className={`group flex items-center gap-2 px-2 py-1.5 pl-4 hover:bg-teal/5 cursor-pointer border-l-2 transition-colors ml-8 ${
                                              isVersionSelected
                                                ? 'border-teal bg-teal/5'
                                                : 'border-transparent'
                                            }`}
                                          >
                                            {isVersionSelected ? (
                                              <CheckCircle2 className="w-3 h-3 text-teal shrink-0" />
                                            ) : (
                                              <Circle className="w-3 h-3 text-rule shrink-0" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center gap-2">
                                                <span className="text-[0.58rem] text-teal">
                                                  v{versionNumber}
                                                </span>
                                                <span className="text-[0.58rem] text-mid">
                                                  {formatTime(
                                                    version.timestamp,
                                                  )}
                                                </span>
                                              </div>
                                              <p className="text-[0.65rem] font-dm-mono text-mid truncate">
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
