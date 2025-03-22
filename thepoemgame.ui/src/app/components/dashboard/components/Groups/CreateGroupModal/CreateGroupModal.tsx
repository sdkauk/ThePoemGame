"use client";

import React, { useState } from "react";
import Modal from "@/components/Modal/modal";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/input";
import Label from "@/components/Label/label";
import { groupService } from "@/services/groupService";
import Form from "@/components/Form/Form";
import FormItem from "@/components/Form/FormItem/FormItem";
import FormFooter from "@/components/Form/FormFooter/FormFooter";

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [groupName, setGroupName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await groupService.createGroup(groupName);

      // Reset form
      setGroupName("");

      // Close modal and trigger success callback
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Failed to create group:", err);
      setError("Failed to create group. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Group" size="sm">
      <Form onSubmit={handleSubmit} spacing="md">
        <FormItem
          label="Group Name"
          htmlFor="groupName"
          required
          error={error || undefined}
        >
          <Input
            id="groupName"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
            fullWidth
            disabled={isSubmitting}
          />
        </FormItem>

        <FormFooter align="right">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Group"}
          </Button>
        </FormFooter>
      </Form>
    </Modal>
  );
};

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default CreateGroupModal;
