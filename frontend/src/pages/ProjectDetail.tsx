import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { projectsApi, tasksApi } from '../services/apiService';
import { ProjectDetail, Task, ProgressResponse } from '../types';

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadProject();
      loadProgress();
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

        {project.tasks.length === 0 ? (
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
            {project.tasks.map((task) => (
              <div key={task.id} className="card bg-base-200 border border-base-300 hover:border-primary/50 transition-all duration-300">
                <div className="card-body p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 pt-1">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary checkbox-lg"
                        checked={task.completed}
                        onChange={() => handleToggleTask(task.id, task.completed)}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-semibold mb-1 ${task.completed ? 'line-through text-base-content/40' : 'text-base-content'}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className={`text-sm mb-3 ${task.completed ? 'text-base-content/30' : 'text-base-content/60'}`}>
                          {task.description}
                        </p>
                      )}
                      {task.dueDate && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-base-content/60">
                            Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      )}
                    </div>
                    <button 
                      className="btn btn-ghost btn-sm text-error hover:bg-error/10 gap-2 flex-shrink-0"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
    </div>
  );
};

export default ProjectDetailPage;
