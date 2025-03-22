"use client";

import React, { useState } from "react";
import GroupList from "../GroupList/GroupList";
import CreateGroupModal from "../CreateGroupModal/CreateGroupModal";
import JoinGroupModal from "../JoinGroupModal/JoinGroupModal";

interface GroupSectionProps {
  onViewGroup?: (groupId: string) => void;
}

const GroupSection: React.FC<GroupSectionProps> = ({ onViewGroup }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // We'll trigger a refresh of the GroupList component when a group is created or joined
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshGroups = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      {/* Group List Component */}
      <GroupList
        key={refreshTrigger} // Force re-mount when refreshTrigger changes
        onCreateGroup={() => setShowCreateModal(true)}
        onJoinGroup={() => setShowJoinModal(true)}
        onViewGroup={onViewGroup}
      />

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={refreshGroups}
      />

      {/* Join Group Modal */}
      <JoinGroupModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onSuccess={refreshGroups}
      />
    </>
  );
};

export default GroupSection;
