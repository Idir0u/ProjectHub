import React, { useState } from 'react';
import { bulkCompleteTasks, bulkDeleteTasks } from '../services/api';

interface BulkActionsToolbarProps {
  selectedTaskIds: Set<number>;
  onClearSelection: () => void;
  onSuccess: () => void;
}

const BulkActionsToolbar: React.FC<BulkActionsToolbarProps> = ({
  selectedTaskIds,
  onClearSelection,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBulkComplete = async () => {
    if (selectedTaskIds.size === 0) return;

    try {
      setLoading(true);
      setError(null);
      await bulkCompleteTasks(Array.from(selectedTaskIds));
      onSuccess();
      onClearSelection();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to complete tasks';
      setError(errorMessage);
      
      // Auto-hide error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTaskIds.size === 0) return;

    const confirmed = confirm(
      `Are you sure you want to delete ${selectedTaskIds.size} task${selectedTaskIds.size > 1 ? 's' : ''}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setError(null);
      await bulkDeleteTasks(Array.from(selectedTaskIds));
      onSuccess();
      onClearSelection();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete tasks';
      setError(errorMessage);
      
      // Auto-hide error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  if (selectedTaskIds.size === 0) return null;

  return (
    <>
      {/* Floating Toolbar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
        <div className="bg-base-300 shadow-2xl rounded-box border border-base-content/20 p-4 flex items-center gap-4">
          {/* Selection Count */}
          <div className="flex items-center gap-2 px-3">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span className="font-semibold text-base-content">
              {selectedTaskIds.size} task{selectedTaskIds.size > 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="divider divider-horizontal my-0"></div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleBulkComplete}
              disabled={loading}
              className="btn btn-success btn-sm gap-2"
              title="Mark selected tasks as complete"
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              Complete
            </button>

            <button
              onClick={handleBulkDelete}
              disabled={loading}
              className="btn btn-error btn-sm gap-2"
              title="Delete selected tasks"
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
              Delete
            </button>
          </div>

          <div className="divider divider-horizontal my-0"></div>

          {/* Clear Selection */}
          <button
            onClick={onClearSelection}
            disabled={loading}
            className="btn btn-ghost btn-sm btn-circle"
            title="Clear selection"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Error Toast */}
      {error && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActionsToolbar;
