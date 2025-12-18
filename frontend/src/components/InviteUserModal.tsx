import { useState } from 'react';
import { searchUsers, inviteUser, User } from '../services/api';

interface InviteUserModalProps {
  projectId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const InviteUserModal = ({ projectId, isOpen, onClose, onSuccess }: InviteUserModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [role, setRole] = useState<'ADMIN' | 'MEMBER'>('MEMBER');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await searchUsers(query);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleInvite = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      await inviteUser(projectId, selectedUser.email, role);
      alert(`Invitation sent to ${selectedUser.email}!`);
      onSuccess();
      handleClose();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedUser(null);
    setRole('MEMBER');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Invite User to Project</h3>

        {/* Search Input */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Search by email</span>
          </label>
          <input
            type="text"
            placeholder="Enter email..."
            className="input input-bordered w-full"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
          />
        </div>

        {/* Search Results */}
        {searching && (
          <div className="flex justify-center py-4">
            <div className="loading loading-spinner loading-sm"></div>
          </div>
        )}

        {searchResults.length > 0 && !selectedUser && (
          <div className="mb-4 max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg">
            {searchResults.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  setSelectedUser(user);
                  setSearchResults([]);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
              >
                <div className="avatar placeholder">
                  <div className="bg-blue-500 text-white rounded-full w-8">
                    <span className="text-xs">{user.email.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
                <span className="text-sm">{user.email}</span>
              </button>
            ))}
          </div>
        )}

        {/* Selected User */}
        {selectedUser && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-blue-500 text-white rounded-full w-10">
                    <span className="text-sm">{selectedUser.email.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
                <span className="font-medium">{selectedUser.email}</span>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="btn btn-ghost btn-sm btn-circle"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Role Selection */}
        {selectedUser && (
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Role</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={role}
              onChange={(e) => setRole(e.target.value as 'ADMIN' | 'MEMBER')}
            >
              <option value="MEMBER">Member - Can view and complete tasks</option>
              <option value="ADMIN">Admin - Can manage members and tasks</option>
            </select>
          </div>
        )}

        {/* Actions */}
        <div className="modal-action">
          <button onClick={handleClose} className="btn btn-ghost">
            Cancel
          </button>
          <button
            onClick={handleInvite}
            disabled={!selectedUser || loading}
            className="btn btn-primary"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Sending...
              </>
            ) : (
              'Send Invitation'
            )}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={handleClose}></div>
    </div>
  );
};

export default InviteUserModal;
