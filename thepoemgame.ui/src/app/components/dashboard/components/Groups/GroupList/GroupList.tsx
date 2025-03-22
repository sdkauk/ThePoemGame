"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/Card/card";
import Button from "@/components/Button/Button";
import { Group, groupService } from "@/services/groupService";

interface GroupListProps {
  onCreateGroup: () => void;
  onJoinGroup: () => void;
  onViewGroup?: (groupId: string) => void;
}

const GroupList: React.FC<GroupListProps> = ({
  onCreateGroup,
  onJoinGroup,
  onViewGroup,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const fetchedGroups = await groupService.getGroups();
        setGroups(fetchedGroups);
        setError(null);
      } catch (err) {
        setError("Failed to load groups.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleGroupClick = (groupId: string) => {
    if (onViewGroup) {
      onViewGroup(groupId);
    }
  };

  return (
    <Card>
      <h2>My Groups</h2>
      {loading ? (
        <p>Loading groups...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        groups.map((group) => (
          <div key={group.id}>
            <p>{group.name}</p>
            <p>{group.members.length} members</p>
            <p>{group.inviteCode}</p>
          </div>
        ))
      )}

      <div className="flex gap-2 mt-4">
        <Button
          onClick={onJoinGroup}
          variant="outline"
          className="flex-1 text-sm"
        >
          Join Group
        </Button>
        <Button
          onClick={onCreateGroup}
          variant="primary"
          className="flex-1 text-sm"
        >
          Create Group
        </Button>
      </div>
    </Card>
  );
};

export default GroupList;
