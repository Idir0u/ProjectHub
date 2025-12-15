import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { projectsApi } from '../services/apiService';
import { Project } from '../types';

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectsApi.getAll();
      setProjects(data);
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      await projectsApi.create(newProject);
      setShowModal(false);
      setNewProject({ title: '', description: '' });
      setError('');
      loadProjects();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project');
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

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Projects</h1>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 mb-4">No projects yet</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div className="card-body">
                  <h2 className="card-title">{project.title}</h2>
                  <p className="text-gray-600">{project.description || 'No description'}</p>
                  <div className="card-actions justify-end mt-4">
                    <span className="text-sm text-gray-500">
                      Created: {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Create New Project</h3>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title *</span>
              </label>
              <input
                type="text"
                placeholder="Project title"
                className="input input-bordered"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Project description (optional)"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              ></textarea>
            </div>

            {error && (
              <div className="alert alert-error mt-4">
                <span>{error}</span>
              </div>
            )}

            <div className="modal-action">
              <button className="btn" onClick={() => {
                setShowModal(false);
                setNewProject({ title: '', description: '' });
                setError('');
              }}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateProject}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
