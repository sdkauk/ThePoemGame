'use client'

import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { groupService, Group } from '@/services/groupService';
import Link from 'next/link';
import CreateGroupModal from './CreateGroupModal';
import { useAuth } from '@/auth/use-auth';
import JoinGroupModal from './JoinGroupModal';

export default function Dashboard() {
    const { data: groups, loading, error, execute, setData } = useApi<Group[]>([]);
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [isJoinGroupModalOpen, setIsJoinGroupModalOpen] = useState(false);
    const { isAuthenticated } = useAuth();

  // Fetch all entities on load
  const fetchGroups = async () => {
    execute(
      () => groupService.getGroups(),
      (result) => setData(result)
    );
  };

  useEffect(() => {
    if (isAuthenticated) {
        fetchGroups();
    }
  }, [isAuthenticated]);

    const handleGroupCreated = (newGroup: Group) => {
        setData([...(groups || []), newGroup]);
    };

    return (
        <div>
            {loading && <p>Loading groups...</p>}
            {error && <p>Error: {error}</p>}

            {!loading && !error && groups?.length === 0 && (
                <div>
                    <p>You don't belong to any groups yet.</p>
                </div>
            )}

<div>
                    <button 
                    onClick={() => setIsCreateGroupModalOpen(true)} 
                    className="px-4 py-2 bg-foreground text-background rounded-md hover:opacity-90"
                >
                    Create Group
                </button>
                <button 
                            onClick={() => setIsJoinGroupModalOpen(true)}
                            className="px-4 py-2 border border-foreground rounded-md hover:bg-foreground hover:text-background"
                        >
                            Join with Invite Code
                        </button>
                    </div>

            {groups && groups.length > 0 && (
                <div>
                    {groups.map((group) => (
                        <Link key={group.id} href={`/groups/${group.id}`}>
                            <div>
                                <h2>{group.name}</h2>
                                <p>{group.members.length} members</p>
                                <p>{group.games.length} games</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

                <CreateGroupModal 
                isOpen={isCreateGroupModalOpen}
                onClose={() => setIsCreateGroupModalOpen(false)}
                onGroupCreated={handleGroupCreated}
            />

<JoinGroupModal 
                isOpen={isJoinGroupModalOpen}
                onClose={() => setIsJoinGroupModalOpen(false)}
                onGroupJoined={fetchGroups} // Refetch all groups after joining
            />
        </div>
    );
}
function setData(arg0: Group[]) {
    throw new Error('Function not implemented.');
}

