import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TaskItem from '../components/TaskItem';
import KanbanBoard from '../components/KanbanBoard';
import MemberManagement from '../components/MemberManagement';
import InviteUserModal from '../components/InviteUserModal';
import InviteCodeModal from '../components/InviteCodeModal';
import { projectsApi, tasksApi } from '../services/apiService';
import { getProjectMembers } from '../services/api';
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
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'status'>('date');
  const [userRole, setUserRole] = useState<string>();
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

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

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      await tasksApi.create(Number(id), {
        title: newTask.title,
        description: newTask.description || undefined,
        dueDate: newTask.dueDate || undefined,
      });
      setShowModal(false);
      setNewTask({ title: '', description: '', dueDate: '' });
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
          <button className="btn btn-primary gap-2" onClick={() => setShowModal(true)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>
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
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-base-300">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span className="text-sm text-base-content/70">
                    Showing <span className="font-semibold text-primary">{filteredTasks.length}</span> of <span className="font-semibold">{project.tasks.length}</span> task{project.tasks.length !== 1 ? 's' : ''}
                  </span>
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
              <button className="btn btn-primary btn-lg gap-2" onClick={() => setShowModal(true)}>
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
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Create New Task</h3>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title *</span>
              </label>
              <input
                type="text"
                placeholder="Task title"
                className="input input-bordered"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Task description (optional)"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              ></textarea>
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Due Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>

            {error && (
              <div className="alert alert-error mt-4">
                <span>{error}</span>
              </div>
            )}

            <div className="modal-action">
              <button className="btn" onClick={() => {
                setShowModal(false);
                setNewTask({ title: '', description: '', dueDate: '' });
                setError('');
              }}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateTask}>
                Create
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
    </div>
  );
};

export default ProjectDetailPage;
