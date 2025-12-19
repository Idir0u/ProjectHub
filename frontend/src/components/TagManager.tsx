import React, { useState, useEffect } from 'react';
import { getProjectTags, createTag, deleteTag, Tag } from '../services/api';

interface TagManagerProps {
  projectId: number;
  onClose: () => void;
}

const TagManager: React.FC<TagManagerProps> = ({ projectId, onClose }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Form state
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('#3b82f6'); // Default blue color
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadTags();
  }, [projectId]);

  const loadTags = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProjectTags(projectId);
      setTags(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tagName.trim()) {
      setError('Tag name is required');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      const response = await createTag(projectId, tagName.trim(), tagColor);
      setTags([...tags, response.data]);
      
      // Reset form
      setTagName('');
      setTagColor('#3b82f6');
      setShowCreateForm(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create tag');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTag = async (tagId: number) => {
    if (!confirm('Are you sure you want to delete this tag? It will be removed from all tasks.')) {
      return;
    }

    try {
      setError(null);
      await deleteTag(projectId, tagId);
      setTags(tags.filter(tag => tag.id !== tagId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete tag');
    }
  };

  // Predefined color palette
  const colorPalette = [
    '#ef4444', // red
    '#f97316', // orange
    '#f59e0b', // amber
    '#eab308', // yellow
    '#84cc16', // lime
    '#22c55e', // green
    '#10b981', // emerald
    '#14b8a6', // teal
    '#06b6d4', // cyan
    '#0ea5e9', // sky
    '#3b82f6', // blue
    '#6366f1', // indigo
    '#8b5cf6', // violet
    '#a855f7', // purple
    '#d946ef', // fuchsia
    '#ec4899', // pink
  ];

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Manage Tags</h3>
          <button 
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            ✕
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Create Tag Button */}
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary btn-sm mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Tag
          </button>
        )}

        {/* Create Tag Form */}
        {showCreateForm && (
          <form onSubmit={handleCreateTag} className="card bg-base-200 p-4 mb-4">
            <div className="flex flex-col gap-3">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Tag Name</span>
                </label>
                <input
                  type="text"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  placeholder="e.g., Bug, Feature, Enhancement"
                  className="input input-bordered w-full"
                  maxLength={20}
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">Tag Color</span>
                </label>
                
                {/* Color Palette */}
                <div className="grid grid-cols-8 gap-2 mb-2">
                  {colorPalette.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setTagColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                        tagColor === color ? 'border-base-content ring-2 ring-base-content' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>

                {/* Custom Color Picker */}
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={tagColor}
                    onChange={(e) => setTagColor(e.target.value)}
                    className="w-12 h-12 cursor-pointer rounded border border-base-300"
                  />
                  <span className="text-sm text-base-content/60">
                    Custom color: {tagColor}
                  </span>
                </div>
              </div>

              {/* Preview */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Preview</span>
                </label>
                <div className="flex items-center gap-2">
                  <span
                    className="badge badge-lg font-semibold"
                    style={{ backgroundColor: tagColor, color: '#fff', borderColor: tagColor }}
                  >
                    {tagName || 'Tag Name'}
                  </span>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-2 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setTagName('');
                    setTagColor('#3b82f6');
                    setError(null);
                  }}
                  className="btn btn-ghost btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !tagName.trim()}
                  className="btn btn-primary btn-sm"
                >
                  {creating ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Creating...
                    </>
                  ) : (
                    'Create Tag'
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tags List */}
        <div className="divider">Existing Tags ({tags.length})</div>

        {loading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : tags.length === 0 ? (
          <div className="text-center py-8 text-base-content/60">
            <svg className="w-16 h-16 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <p>No tags created yet</p>
            <p className="text-sm">Create your first tag to organize tasks</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between p-3 rounded-lg bg-base-200 hover:bg-base-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="badge badge-lg font-semibold"
                    style={{ backgroundColor: tag.color, color: '#fff', borderColor: tag.color }}
                  >
                    {tag.name}
                  </span>
                  <span className="text-xs text-base-content/60">{tag.color}</span>
                </div>
                
                <button
                  onClick={() => handleDeleteTag(tag.id)}
                  className="btn btn-ghost btn-sm btn-circle text-error hover:bg-error/20"
                  title="Delete tag"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-4 text-xs text-base-content/60 bg-base-200 p-3 rounded">
          <strong>💡 Tip:</strong> Tags help categorize and filter tasks. Use different colors for different categories like Bug (red), Feature (blue), Documentation (green), etc.
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default TagManager;
