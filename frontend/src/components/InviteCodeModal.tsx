import { useState } from 'react';
import { generateInviteCode } from '../services/api';

interface InviteCodeModalProps {
  projectId: number;
  isOpen: boolean;
  onClose: () => void;
}

const InviteCodeModal = ({ projectId, isOpen, onClose }: InviteCodeModalProps) => {
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await generateInviteCode(projectId);
      setInviteCode(response.data.inviteCode);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to generate invite code');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setInviteCode(null);
    setCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Project Invite Code</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Share this code with team members to let them join the project instantly
        </p>

        {!inviteCode ? (
          <div className="text-center py-8">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Generating...
                </>
              ) : (
                'Generate Invite Code'
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Invite Code Display */}
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg text-center">
              <div className="text-3xl font-mono font-bold tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                {inviteCode}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Anyone with this code can join as a member
              </p>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="btn btn-outline w-full"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy to Clipboard
                </>
              )}
            </button>

            {/* Warning */}
            <div className="alert alert-warning">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm">Keep this code private. Only share with trusted team members.</span>
            </div>
          </div>
        )}

        <div className="modal-action">
          <button onClick={handleClose} className="btn">
            {inviteCode ? 'Done' : 'Cancel'}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={handleClose}></div>
    </div>
  );
};

export default InviteCodeModal;
