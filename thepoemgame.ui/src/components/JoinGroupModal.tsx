'use client'

import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { userService } from '@/services/userService';

interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupJoined: () => void; // Callback to refresh groups after joining
}

export default function JoinGroupModal({ isOpen, onClose, onGroupJoined }: JoinGroupModalProps) {
  const [inviteCode, setInviteCode] = useState('');
  const { loading, error, execute } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteCode.trim()) return;
    
    await execute(
      () => userService.joinGroup(inviteCode),
      (success) => {
        if (success) {
          onGroupJoined();
          setInviteCode('');
          onClose();
        }
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Join a Group</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="inviteCode" className="block mb-2 font-medium">
              Invite Code
            </label>
            <input
              type="text"
              id="inviteCode"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter invite code"
              required
            />
          </div>
          
          {error && <p className="text-red-500">{error}</p>}
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-foreground rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !inviteCode.trim()}
              className="px-4 py-2 bg-foreground text-background rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Joining...' : 'Join Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}