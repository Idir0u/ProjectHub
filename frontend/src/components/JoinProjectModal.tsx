import { useState } from 'react';
import { joinProjectByCode } from '../services/api';

interface JoinProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const JoinProjectModal = ({ isOpen, onClose, onSuccess }: JoinProjectModalProps) => {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteCode.trim()) {
      alert('Please enter an invite code');
      return;
    }

    setLoading(true);
    try {
      await joinProjectByCode(inviteCode.trim().toUpperCase());
      alert('Successfully joined the project!');
      onSuccess();
      handleClose();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Invalid invite code');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setInviteCode('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Join Project</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Enter the invite code shared with you to join a project
        </p>

        <form onSubmit={handleJoin}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Invite Code</span>
            </label>
            <input
              type="text"
              placeholder="e.g., ABC12345"
              className="input input-bordered w-full uppercase"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              maxLength={8}
              autoFocus
            />
            <label className="label">
              <span className="label-text-alt text-gray-500">
                Code is 8 characters long
              </span>
            </label>
          </div>

          <div className="modal-action">
            <button type="button" onClick={handleClose} className="btn btn-ghost">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!inviteCode.trim() || loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Joining...
                </>
              ) : (
                'Join Project'
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={handleClose}></div>
    </div>
  );
};

export default JoinProjectModal;
