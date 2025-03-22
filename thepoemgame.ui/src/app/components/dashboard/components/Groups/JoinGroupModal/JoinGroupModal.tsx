"use client";

import React, { useState } from "react";
import Modal from "@/components/Modal/modal";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/input";
import Label from "@/components/Label/label";
import { userService } from "@/services/userService";

interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const JoinGroupModal: React.FC<JoinGroupModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [inviteCode, setInviteCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inviteCode.trim()) {
      setError("Invite code is required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const success = await userService.joinGroup(inviteCode);

      if (success) {
        // Reset form
        setInviteCode("");

        // Close modal and trigger success callback
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(
          "Failed to join group. Please check the invite code and try again."
        );
      }
    } catch (err) {
      console.error("Failed to join group:", err);
      setError("Failed to join group. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Join Group" size="sm">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="inviteCode" required>
            Invite Code
          </Label>
          <Input
            id="inviteCode"
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Enter invite code"
            fullWidth
            error={error || undefined}
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Joining..." : "Join Group"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default JoinGroupModal;
