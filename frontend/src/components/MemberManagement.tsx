import { useState, useEffect } from 'react';
import { getProjectMembers, removeMember, updateMemberRole, ProjectMember } from '../services/api';

interface MemberManagementProps {
  projectId: number;
  onInviteClick: () => void;
  onGenerateCode: () => void;
}

const MemberManagement = ({ projectId, onInviteClick, onGenerateCode }: MemberManagementProps) => {
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadMembers();
  }, [projectId]);

  const loadMembers = async () => {
    try {
      const response = await getProjectMembers(projectId);
      setMembers(response.data);
    } catch (error) {
      console.error('Failed to load members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId: number, userEmail: string) => {
    if (!confirm(`Remove ${userEmail} from this project?`)) return;

    try {
      await removeMember(projectId, userId);
      await loadMembers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleChangeRole = async (userId: number, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'MEMBER' : 'ADMIN';
    
    try {
      await updateMemberRole(projectId, userId, newRole as 'ADMIN' | 'MEMBER');
      await loadMembers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update role');
    }
  };

  const currentUserMember = members.find(m => m.userId === currentUser.id);
  const canManageMembers = currentUserMember?.role === 'OWNER' || currentUserMember?.role === 'ADMIN';

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="loading loading-spinner loading-md"></div>
      </div>
    );
  }

  return (
    <div className="card bg-base-200 border border-base-300 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-base-content">
          Team Members ({members.length})
        </h2>
        {canManageMembers && (
          <div className="flex gap-2">
            <button
              onClick={onGenerateCode}
              className="btn btn-sm btn-outline"
              title="Generate invite code"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Code
            </button>
            <button
              onClick={onInviteClick}
              className="btn btn-sm btn-primary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Invite
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 bg-base-100 rounded-lg border border-base-300"
          >
            <div className="flex items-center gap-3">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-10">
                  <span className="text-sm">{member.userEmail.charAt(0).toUpperCase()}</span>
                </div>
              </div>
              <div>
                <p className="font-medium text-base-content">
                  {member.userEmail}
                  {member.userId === currentUser.id && (
                    <span className="ml-2 text-xs opacity-60">(You)</span>
                  )}
                </p>
                <p className="text-xs opacity-60">
                  Joined {new Date(member.joinedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Role Badge */}
              <span className={`badge ${
                member.role === 'OWNER' ? 'badge-primary' :
                member.role === 'ADMIN' ? 'badge-secondary' :
                'badge-ghost'
              }`}>
                {member.role}
              </span>

              {/* Actions */}
              {canManageMembers && member.role !== 'OWNER' && member.userId !== currentUser.id && (
                <div className="dropdown dropdown-end">
                  <button tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    {currentUserMember?.role === 'OWNER' && (
                      <li>
                        <a onClick={() => handleChangeRole(member.userId, member.role)}>
                          Change to {member.role === 'ADMIN' ? 'Member' : 'Admin'}
                        </a>
                      </li>
                    )}
                    <li>
                      <a
                        onClick={() => handleRemoveMember(member.userId, member.userEmail)}
                        className="text-error"
                      >
                        Remove
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberManagement;
