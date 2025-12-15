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
    <div className="min-h-screen bg-base-200">
      <Navbar />
      
      <div className="container mx-auto p-6">
        <button className="btn btn-ghost mb-4" onClick={() => navigate('/dashboard')}>
          ← Back to Projects
        </button>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h1 className="card-title text-3xl">{project.title}</h1>
            <p className="text-gray-600">{project.description || 'No description'}</p>
            
            {progress && (
              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-medium">{progress.progressPercentage.toFixed(0)}%</span>
                </div>
                <progress 
                  className="progress progress-primary w-full" 
                  value={progress.progressPercentage} 
                  max="100"
                ></progress>
                <p className="text-sm text-gray-500 mt-2">
                  {progress.completedTasks} of {progress.totalTasks} tasks completed
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Tasks</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Task
          </button>
        </div>

        {project.tasks.length === 0 ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <p className="text-xl text-gray-500 mb-4">No tasks yet</p>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                Create Your First Task
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {project.tasks.map((task) => (
              <div key={task.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary mt-1"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id, task.completed)}
                    />
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-gray-600 mt-1">{task.description}</p>
                      )}
                      {task.dueDate && (
                        <p className="text-sm text-gray-500 mt-2">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <button 
                      className="btn btn-ghost btn-sm text-error"
                      onClick={() => handleDeleteTask(task.id)}
                    >
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
