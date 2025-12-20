import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPendingInvitations, acceptInvitation, declineInvitation } from '../services/api';
import { useToast } from '../context/ToastContext';

interface Invitation {
  id: number;
  projectId: number;
  projectTitle: string;
  inviteeId: number;
  inviteeEmail: string;
  inviterId: number;
  inviterEmail: string;
  role: string;
  status: string;
  invitedAt: string;
  respondedAt?: string;
}

const InvitationsPage = () => {
  const navigate = useNavigate();
  const [receivedInvitations, setReceivedInvitations] = useState<Invitation[]>([]);
  const [sentInvitations, setSentInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');
  const toast = useToast();

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    setLoading(true);
    try {
      // Load received invitations
      const response = await getPendingInvitations();
      const received = response.data || response;
      setReceivedInvitations(Array.isArray(received) ? received : []);

      // Load sent invitations - we'll need to fetch from all user's projects
      // For now, we'll just show received. We can enhance this later if needed.
      setSentInvitations([]);
    } catch (err) {
      console.error('Error loading invitations:', err);
      toast.error('Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: number) => {
    try {
      await acceptInvitation(id);
      toast.success('Invitation accepted! You can now access the project.');
      loadInvitations();
    } catch (err) {
      console.error('Error accepting invitation:', err);
      toast.error('Failed to accept invitation');
    }
  };

  const handleDecline = async (id: number) => {
    try {
      await declineInvitation(id);
      toast.success('Invitation declined');
      loadInvitations();
    } catch (err) {
      console.error('Error declining invitation:', err);
      toast.error('Failed to decline invitation');
    }
  };

  const filteredReceivedInvitations = receivedInvitations.filter(inv => {
    if (statusFilter === 'all') return true;
    return inv.status.toLowerCase() === statusFilter;
  });

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'OWNER': return 'badge-primary';
      case 'ADMIN': return 'badge-secondary';
      case 'MEMBER': return 'badge-ghost';
      default: return 'badge-ghost';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'badge-warning';
      case 'accepted': return 'badge-success';
      case 'declined': return 'badge-error';
      case 'cancelled': return 'badge-ghost';
      default: return 'badge-ghost';
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Invitations</h1>
            <p className="text-base-content/60">Manage your project invitations</p>
          </div>
          <button
            className="btn btn-ghost gap-2"
            onClick={() => navigate(-1)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs tabs-boxed bg-base-200 mb-6">
          <button
            className={`tab tab-lg ${activeTab === 'received' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('received')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Received ({receivedInvitations.length})
          </button>
          <button
            className={`tab tab-lg ${activeTab === 'sent' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Sent ({sentInvitations.length})
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm font-medium">Filter by status:</span>
          <div className="btn-group">
            <button
              className={`btn btn-sm ${statusFilter === 'all' ? 'btn-active' : 'btn-ghost'}`}
              onClick={() => setStatusFilter('all')}
            >
              All
            </button>
            <button
              className={`btn btn-sm ${statusFilter === 'pending' ? 'btn-active' : 'btn-ghost'}`}
              onClick={() => setStatusFilter('pending')}
            >
              Pending
            </button>
            <button
              className={`btn btn-sm ${statusFilter === 'accepted' ? 'btn-active' : 'btn-ghost'}`}
              onClick={() => setStatusFilter('accepted')}
            >
              Accepted
            </button>
            <button
              className={`btn btn-sm ${statusFilter === 'declined' ? 'btn-active' : 'btn-ghost'}`}
              onClick={() => setStatusFilter('declined')}
            >
              Declined
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : activeTab === 'received' ? (
          <div className="space-y-4">
            {filteredReceivedInvitations.length === 0 ? (
              <div className="card bg-base-200 border border-base-300">
                <div className="card-body text-center py-16">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-base-300 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">No invitations</h3>
                  <p className="text-base-content/60">
                    {statusFilter === 'all'
                      ? "You don't have any project invitations yet"
                      : `No ${statusFilter} invitations found`}
                  </p>
                </div>
              </div>
            ) : (
              filteredReceivedInvitations.map((invitation) => (
                <div key={invitation.id} className="card bg-base-200 border border-base-300 hover:border-primary/50 transition-all">
                  <div className="card-body">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{invitation.projectTitle}</h3>
                          <div className={`badge ${getRoleBadgeClass(invitation.role)}`}>
                            {invitation.role}
                          </div>
                          <div className={`badge ${getStatusBadgeClass(invitation.status)}`}>
                            {invitation.status}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-base-content/60 mb-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>From: <span className="font-medium">{invitation.inviterEmail}</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-base-content/60">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Invited: {new Date(invitation.invitedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {invitation.respondedAt && (
                          <div className="flex items-center gap-2 text-sm text-base-content/60 mt-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Responded: {new Date(invitation.respondedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        )}
                      </div>
                      {invitation.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            className="btn btn-success btn-sm gap-2"
                            onClick={() => handleAccept(invitation.id)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Accept
                          </button>
                          <button
                            className="btn btn-error btn-sm gap-2"
                            onClick={() => handleDecline(invitation.id)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body text-center py-16">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-base-300 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Sent invitations</h3>
              <p className="text-base-content/60">
                View sent invitations from individual project pages
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitationsPage;
