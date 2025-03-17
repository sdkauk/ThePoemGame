'use client'

import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { groupService, Group } from '@/services/groupService';
import Link from 'next/link';
import CreateGroupModal from '@/components/CreateGroupModal';
import { useAuth } from '@/auth/use-auth';
import JoinGroupModal from '@/components/JoinGroupModal';
import Button from '@/components/Button/Button';
import styles from './GroupsPage.module.css';

export default function GroupsPage() {
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Groups</h1>
        <div className={styles.buttonContainer}>
          <Button onClick={() => setIsCreateGroupModalOpen(true)}>
            <span>Create Group</span>
          </Button>
          <Button onClick={() => setIsJoinGroupModalOpen(true)}>
            <span>Join with Code</span>
          </Button>
        </div>
      </div>

      {loading && (
        <div className={styles.messageCard}>
          <p className={styles.loadingText}>Loading your groups...</p>
        </div>
      )}
      
      {error && (
        <div className={styles.messageCard}>
          <p className={styles.errorText}>Oops! Something went wrong: {error}</p>
        </div>
      )}

      {!loading && !error && groups?.length === 0 && (
        <div className={styles.messageCard}>
          <h2 className={styles.emptyStateTitle}>No Groups Yet</h2>
          <p className={styles.emptyStateText}>
            Create a new group or join an existing one to get started.
          </p>
          <div className={styles.pencilDoodle}></div>
        </div>
      )}

      {groups && groups.length > 0 && (
        <div className={styles.groupsGrid}>
          {groups.map((group) => (
            <Link key={group.id} href={`/groups/${group.id}`} className={styles.groupLink}>
              <div className={styles.groupCard}>
                <h2 className={styles.groupName}>{group.name}</h2>
                <div className={styles.groupStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>{group.members.length}</span>
                    <span className={styles.statLabel}>members</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>{group.games.length}</span>
                    <span className={styles.statLabel}>games</span>
                  </div>
                </div>
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
        onGroupJoined={fetchGroups}
      />
    </div>
  );
}