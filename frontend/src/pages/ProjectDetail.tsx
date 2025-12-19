import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TaskItem from '../components/TaskItem';
import KanbanBoard from '../components/KanbanBoard';
import MemberManagement from '../components/MemberManagement';
import InviteUserModal from '../components/InviteUserModal';
import InviteCodeModal from '../components/InviteCodeModal';
import TagManager from '../components/TagManager';
import BulkActionsToolbar from '../components/BulkActionsToolbar';
import { projectsApi, tasksApi } from '../services/apiService';
import { getProjectMembers, getProjectTags, createTask as apiCreateTask } from '../services/api';
import { ProjectDetail, ProgressResponse } from '../types';

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    dueDate: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    recurrencePattern: 'NONE' as 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY',
    recurrenceEndDate: '',
    tagIds: [] as number[],
    dependsOnIds: [] as number[]
  });
  const [projectTags, setProjectTags] = useState<Array<{id: number; name: string; color: string}>>([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'status'>('date');
  const [userRole, setUserRole] = useState<string>();
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (id) {
      loadProject();
      loadProgress();
      loadUserRole();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      const data = await projectsApi.getById(Number(id));
      setProject(data);
    } catch (err) {
      console.error('Error loading project:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const data = await projectsApi.getProgress(Number(id));
      setProgress(data);
    } catch (err) {
      console.error('Error loading progress:', err);
    }
  };

  const loadUserRole = async () => {
    try {
      const members = await getProjectMembers(Number(id));
      const currentUserEmail = localStorage.getItem('userEmail');
      const currentMember = members.find(m => m.userEmail === currentUserEmail);
      if (currentMember) {
        setUserRole(currentMember.role);
      }
    } catch (err) {
      console.error('Error loading user role:', err);
    }
  };

  const loadProjectTags = async () => {
    try {
      const tags = await getProjectTags(Number(id));
      setProjectTags(tags);
    } catch (err) {
      console.error('Error loading tags:', err);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    loadProjectTags();
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      await apiCreateTask(Number(id), {
        title: newTask.title,
        description: newTask.description || undefined,
        dueDate: newTask.dueDate || undefined,
        priority: newTask.priority,
        recurrencePattern: newTask.recurrencePattern,
        recurrenceEndDate: newTask.recurrencePattern !== 'NONE' && newTask.recurrenceEndDate ? newTask.recurrenceEndDate : undefined,
        tagIds: newTask.tagIds.length > 0 ? newTask.tagIds : undefined,
        dependsOnIds: newTask.dependsOnIds.length > 0 ? newTask.dependsOnIds : undefined,
      });
      setShowModal(false);
      setNewTask({ 
        title: '', 
        description: '', 
        dueDate: '',
        priority: 'MEDIUM',
        recurrencePattern: 'NONE',
        recurrenceEndDate: '',
        tagIds: [],
        dependsOnIds: []
      });
      setError('');
      loadProject();
      loadProgress();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleToggleTask = async (taskId: number, completed: boolean) => {
    try {
      await tasksApi.update(taskId, { completed: !completed });
      loadProject();
      loadProgress();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await tasksApi.delete(taskId);
      loadProject();
      loadProgress();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  // Bulk selection handlers
  const handleToggleSelection = (taskId: number) => {
    const newSelection = new Set(selectedTasks);
    if (newSelection.has(taskId)) {
      newSelection.delete(taskId);
    } else {
      newSelection.add(taskId);
    }
    setSelectedTasks(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedTasks.size === filteredTasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(filteredTasks.map(t => t.id)));
    }
  };

  const handleClearSelection = () => {
    setSelectedTasks(new Set());
    setSelectionMode(false);
  };

  const handleBulkSuccess = () => {
    loadProject();
    loadProgress();
  };

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    if (!project) return [];

    let filtered = project.tasks.filter((task) => {
      const matchesSearch = 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      
      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'completed' && task.completed) ||
        (statusFilter === 'active' && !task.completed);
      
      return matchesSearch && matchesStatus;
    });

    // Sort tasks
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'status') {
        return Number(a.completed) - Number(b.completed);
      } else {
        // Sort by date - if no dueDate, put at end
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
    });

    return filtered;
  }, [project, searchQuery, statusFilter, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto p-6">
          <p>Project not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      
      <div className="container mx-auto p-4 lg:p-8">
        <button className="btn btn-ghost gap-2 mb-6" onClick={() => navigate('/dashboard')}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </button>

        <div className="card bg-base-200 border border-base-300 mb-8">
          <div className="card-body p-6 lg:p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-3">{project.title}</h1>
                <p className="text-base-content/60 text-lg">{project.description || 'No description'}</p>
              </div>
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
            </div>
            
            {progress && (
              <div className="bg-base-100 rounded-xl p-6 border border-base-300">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold uppercase tracking-wide text-base-content/60">Project Progress</span>
                  <span className="text-2xl font-bold text-primary">{progress.progressPercentage.toFixed(0)}%</span>
                </div>
                <progress 
                  className="progress progress-primary w-full h-3" 
                  value={progress.progressPercentage} 
                  max="100"
                ></progress>
                <div className="flex items-center gap-2 mt-3">
                  <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-base-content/70">
                    <span className="font-semibold">{progress.completedTasks}</span> of <span className="font-semibold">{progress.totalTasks}</span> tasks completed
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Member Management Section */}
        <div className="mb-8">
          <MemberManagement
            projectId={Number(id)}
            onInviteClick={() => setShowInviteModal(true)}
            onGenerateCode={() => setShowCodeModal(true)}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold">Tasks</h2>
            <p className="text-base-content/60">Manage your project tasks</p>
          </div>
          <div className="flex gap-2">
            {/* Selection Mode Toggle - Only show in list view */}
            {viewMode === 'list' && project.tasks.length > 0 && (
              <button
                className={`btn btn-sm gap-2 ${selectionMode ? 'btn-active' : 'btn-ghost'}`}
                onClick={() => {
                  setSelectionMode(!selectionMode);
                  if (selectionMode) {
                    setSelectedTasks(new Set());
                  }
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                {selectionMode ? 'Cancel' : 'Select'}
              </button>
            )}
            
            <button 
              className="btn btn-outline btn-primary gap-2" 
              onClick={() => setShowTagManager(true)}
              title="Manage project tags"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Manage Tags
            </button>
            <button className="btn btn-primary gap-2" onClick={handleOpenModal}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        {project.tasks.length > 0 && (
          <div className="card bg-base-200 border border-base-300 mb-6">
            <div className="card-body p-4">
              <div className="flex flex-col gap-4">
                {/* View Mode Toggle */}
                <div className="flex justify-between items-center">
                  <div className="tabs tabs-boxed">
                    <button
                      className={`tab ${viewMode === 'list' ? 'tab-active' : ''}`}
                      onClick={() => setViewMode('list')}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      List
                    </button>
                    <button
                      className={`tab ${viewMode === 'kanban' ? 'tab-active' : ''}`}
                      onClick={() => setViewMode('kanban')}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                      </svg>
                      Kanban
                    </button>
                  </div>
                </div>

                {/* Search Input - Only show in list view */}
                {viewMode === 'list' && (
                  <div className="flex-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        className="input input-bordered w-full pl-10"
                        placeholder="Search tasks by title or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchQuery && (
                        <button
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setSearchQuery('')}
                        >
                          <svg className="w-5 h-5 text-base-content/40 hover:text-base-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Filters Row - Only show in list view */}
                {viewMode === 'list' && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Status Filter Tabs */}
                    <div className="flex-1">
                    <div className="tabs tabs-boxed bg-base-300">
                      <button
                        className={`tab ${statusFilter === 'all' ? 'tab-active' : ''}`}
                        onClick={() => setStatusFilter('all')}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        All ({project.tasks.length})
                      </button>
                      <button
                        className={`tab ${statusFilter === 'active' ? 'tab-active' : ''}`}
                        onClick={() => setStatusFilter('active')}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Active ({project.tasks.filter(t => !t.completed).length})
                      </button>
                      <button
                        className={`tab ${statusFilter === 'completed' ? 'tab-active' : ''}`}
                        onClick={() => setStatusFilter('completed')}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Completed ({project.tasks.filter(t => t.completed).length})
                      </button>
                    </div>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-base-content/60 whitespace-nowrap">Sort by:</span>
                    <select
                      className="select select-bordered w-full sm:w-auto"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'status')}
                    >
                      <option value="date">Due Date</option>
                      <option value="name">Name (A-Z)</option>
                      <option value="status">Status</option>
                    </select>
                  </div>
                </div>
                )}
              </div>

              {/* Results Counter - Only show in list view */}
              {viewMode === 'list' && (
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-base-300">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <span className="text-sm text-base-content/70">
                      Showing <span className="font-semibold text-primary">{filteredTasks.length}</span> of <span className="font-semibold">{project.tasks.length}</span> task{project.tasks.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {/* Select All button - Only show in selection mode */}
                  {selectionMode && filteredTasks.length > 0 && (
                    <button
                      onClick={handleSelectAll}
                      className="btn btn-sm btn-ghost gap-2"
                    >
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={selectedTasks.size === filteredTasks.length && filteredTasks.length > 0}
                        readOnly
                      />
                      {selectedTasks.size === filteredTasks.length && filteredTasks.length > 0 ? 'Deselect All' : 'Select All'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Task Views */}
        {viewMode === 'kanban' ? (
          // Kanban Board View
          <KanbanBoard
            tasks={project.tasks}
            onTaskUpdate={() => {
              loadProject();
              loadProgress();
            }}
          />
        ) : (
          // List View
          <>
            {filteredTasks.length === 0 && project.tasks.length > 0 ? (
              <div className="card bg-base-200 border border-base-300">
                <div className="card-body text-center py-16">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-base-300 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">No tasks found</h3>
                  <p className="text-base-content/60 mb-6">Try adjusting your search or filters</p>
                  <button className="btn btn-outline" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>
                Clear Filters
              </button>
            </div>
          </div>
        ) : project.tasks.length === 0 ? (
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body text-center py-16">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-base-300 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">No tasks yet</h3>
              <p className="text-base-content/60 mb-6">Start by adding your first task to this project</p>
              <button className="btn btn-primary btn-lg gap-2" onClick={handleOpenModal}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Task
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                projectId={Number(id)}
                currentUserRole={userRole}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                onAssignmentChange={() => {
                  loadProject();
                  loadProgress();
                }}
                selectionMode={selectionMode}
                isSelected={selectedTasks.has(task.id)}
                onSelect={handleToggleSelection}
              />
            ))}
          </div>
        )}
          </>
        )}
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg mb-4">Create New Task</h3>
            
            {/* Title */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Title *</span>
              </label>
              <input
                type="text"
                placeholder="Task title"
                className="input input-bordered"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>

            {/* Description */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-semibold">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Task description (optional)"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
              ></textarea>
            </div>

            {/* Priority */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-semibold">Priority</span>
              </label>
              <select
                className="select select-bordered"
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' })}
              >
                <option value="LOW">🟢 Low</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="HIGH">🔴 High</option>
              </select>
            </div>

            {/* Tags */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-semibold">Tags</span>
              </label>
              <div className="border border-base-300 rounded-lg p-3 min-h-[3rem]">
                {projectTags.length === 0 ? (
                  <p className="text-sm text-base-content/60">No tags available. Create tags first using "Manage Tags" button.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {projectTags.map((tag) => (
                      <label key={tag.id} className="cursor-pointer">
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={newTask.tagIds.includes(tag.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewTask({ ...newTask, tagIds: [...newTask.tagIds, tag.id] });
                            } else {
                              setNewTask({ ...newTask, tagIds: newTask.tagIds.filter(id => id !== tag.id) });
                            }
                          }}
                        />
                        <span
                          className={`badge badge-lg cursor-pointer transition-all ${
                            newTask.tagIds.includes(tag.id) ? 'ring-2 ring-offset-2' : 'opacity-60 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: tag.color, color: '#fff', borderColor: tag.color }}
                        >
                          {newTask.tagIds.includes(tag.id) && '✓ '}
                          {tag.name}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Due Date */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-semibold">Due Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>

            {/* Recurrence */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-semibold">Recurrence</span>
              </label>
              <select
                className="select select-bordered"
                value={newTask.recurrencePattern}
                onChange={(e) => setNewTask({ ...newTask, recurrencePattern: e.target.value as 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' })}
              >
                <option value="NONE">None</option>
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            </div>

            {/* Recurrence End Date - Only show if recurrence is set */}
            {newTask.recurrencePattern !== 'NONE' && (
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text font-semibold">Recurrence End Date</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered"
                  value={newTask.recurrenceEndDate}
                  onChange={(e) => setNewTask({ ...newTask, recurrenceEndDate: e.target.value })}
                />
              </div>
            )}

            {/* Dependencies */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-semibold">Dependencies</span>
                <span className="label-text-alt text-base-content/60">This task depends on:</span>
              </label>
              <div className="border border-base-300 rounded-lg p-3 max-h-40 overflow-y-auto">
                {project && project.tasks.length === 0 ? (
                  <p className="text-sm text-base-content/60">No other tasks available</p>
                ) : (
                  <div className="space-y-2">
                    {project?.tasks.map((task) => (
                      <label key={task.id} className="flex items-center gap-2 cursor-pointer hover:bg-base-200 p-2 rounded">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={newTask.dependsOnIds.includes(task.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewTask({ ...newTask, dependsOnIds: [...newTask.dependsOnIds, task.id] });
                            } else {
                              setNewTask({ ...newTask, dependsOnIds: newTask.dependsOnIds.filter(id => id !== task.id) });
                            }
                          }}
                        />
                        <span className={`text-sm ${task.completed ? 'line-through text-base-content/60' : ''}`}>
                          {task.title}
                        </span>
                        {task.completed && (
                          <span className="badge badge-success badge-xs">Done</span>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="alert alert-error mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="modal-action">
              <button className="btn" onClick={() => {
                setShowModal(false);
                setNewTask({ 
                  title: '', 
                  description: '', 
                  dueDate: '',
                  priority: 'MEDIUM',
                  recurrencePattern: 'NONE',
                  recurrenceEndDate: '',
                  tagIds: [],
                  dependsOnIds: []
                });
                setError('');
              }}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateTask}>
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite User Modal */}
      <InviteUserModal
        projectId={Number(id)}
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSuccess={loadProject}
      />

      {/* Invite Code Modal */}
      <InviteCodeModal
        projectId={Number(id)}
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
      />

      {/* Tag Manager Modal */}
      {showTagManager && (
        <TagManager
          projectId={Number(id)}
          onClose={() => setShowTagManager(false)}
        />
      )}

      {/* Bulk Actions Toolbar */}
      <BulkActionsToolbar
        selectedTaskIds={selectedTasks}
        onClearSelection={handleClearSelection}
        onSuccess={handleBulkSuccess}
      />
    </div>
  );
};

export default ProjectDetailPage;
