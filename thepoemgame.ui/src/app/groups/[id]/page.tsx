'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { groupService, Group } from '@/services/groupService';
import { userService } from '@/services/userService';
import { AuthGuard } from '@/auth/AuthGuard';
import { useAuth } from '@/auth/use-auth';
import Link from 'next/link';

export default function GroupDetailPage() {
  return (
    <AuthGuard>
      <GroupDetail />
    </AuthGuard>
  );
}

function GroupDetail() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const groupId = params.id as string;
  
  // Use useState directly for the group data
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    loading: leaveLoading, 
    error: leaveError, 
    execute: executeLeave 
  } = useApi();

  // Fetch the group data
  const fetchGroup = async () => {
    if (!groupId || !isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await groupService.getGroup(groupId);
      setGroup(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load group');
      console.error('Error fetching group:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchGroup();
    }
  }, [groupId, isAuthenticated]);

  const handleLeaveGroup = async () => {
    if (confirm('Are you sure you want to leave this group?')) {
      await executeLeave(
        () => userService.leaveGroup(groupId),
        (success) => {
          if (success) {
            router.push('/');
          }
        }
      );
    }
  };

  if (loading) return <div className="container mx-auto p-4">Loading group details...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  if (!group) return <div className="container mx-auto p-4">Group not found</div>;

  // Check if current user is a member
//   const isCurrentUserMember = group.members.some(member => member.id === user?.localAccountId);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Groups
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">{group.name}</h1>
        

          <div className="mt-4 md:mt-0">
            <button
              onClick={handleLeaveGroup}
              disabled={leaveLoading}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
            >
              {leaveLoading ? 'Leaving...' : 'Leave Group'}
            </button>
          </div>

      </div>

      {leaveError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {leaveError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Members Section */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Members ({group.members.length})</h2>
          {group.members.length > 0 ? (
            <ul className="divide-y">
              {group.members.map(member => (
                <li key={member.id} className="py-3 first:pt-0 last:pb-0">
                  {member.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No members yet.</p>
          )}
        </div>

        {/* Invite Code Section */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Invite Code</h2>
          <p className="mb-4">Share this code with friends to invite them to your group:</p>
          <div className="flex items-center">
            <code className="p-3 bg-gray-200 dark:bg-gray-700 rounded-md flex-grow font-mono">
              {group.inviteCode}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(group.inviteCode);
                alert('Invite code copied to clipboard!');
              }}
              className="ml-2 p-2 bg-foreground text-background rounded-md hover:opacity-90"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Games Section */}
        <div className="md:col-span-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Games ({group.games.length})</h2>
          {group.games.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {group.games.map(game => (
                <div key={game.id} className="border rounded-md p-3">
                  <h3 className="font-semibold">{game.name}</h3>
                </div>
              ))}
            </div>
          ) : (
            <p>No games created yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}