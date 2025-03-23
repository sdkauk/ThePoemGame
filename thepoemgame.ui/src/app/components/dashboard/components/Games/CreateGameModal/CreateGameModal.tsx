import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal/modal";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/input";
import Label from "@/components/Label/label";
import { gameService, GamePostRequest } from "@/services/gameService";
import { Group, groupService } from "@/services/groupService";
import Form from "@/components/Form/Form";
import FormItem from "@/components/Form/FormItem/FormItem";
import FormFooter from "@/components/Form/FormFooter/FormFooter";

interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateGameModal: React.FC<CreateGameModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [linesPerPoem, setLinesPerPoem] = useState(8);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's groups when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchGroups();
    }
  }, [isOpen]);

  //TODO we should be fetching groups at the Dashboard level and passing them in
  const fetchGroups = async () => {
    try {
      setIsLoadingGroups(true);
      const userGroups = await groupService.getGroups();
      setGroups(userGroups);

      // Set the first group as selected by default if available
      if (userGroups.length > 0 && !selectedGroupId) {
        setSelectedGroupId(userGroups[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch groups:", err);
      setError("Failed to load your groups. Please try again.");
    } finally {
      setIsLoadingGroups(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGroupId) {
      setError("Please select a group");
      return;
    }

    if (maxPlayers < 4 || maxPlayers > 20) {
      setError("Number of players must be between 4 and 20");
      return;
    }

    if (linesPerPoem < 4 || linesPerPoem > 16) {
      setError("Lines per poem must be between 4 and 16");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const gameRequest: GamePostRequest = {
        maxPlayers,
        linesPerPoem,
        groupId: selectedGroupId,
      };

      await gameService.createGame(gameRequest);

      // Reset form
      setMaxPlayers(8);
      setLinesPerPoem(8);
      setSelectedGroupId("");

      // Close modal and trigger success callback
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Failed to create game:", err);
      setError("Failed to create game. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  //TODO clean up inline css
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Game" size="sm">
      <Form onSubmit={handleSubmit} spacing="md">
        <FormItem
          label="Group"
          htmlFor="groupSelect"
          required
          error={error && selectedGroupId === "" ? error : undefined}
        >
          {isLoadingGroups ? (
            <div>Loading groups...</div>
          ) : groups.length === 0 ? (
            <div>You don't have any groups. Create a group first.</div>
          ) : (
            <select
              id="groupSelect"
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
              disabled={isSubmitting}
            >
              <option value="" disabled>
                Select a group
              </option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          )}
        </FormItem>

        <FormItem
          label="Maximum Players"
          htmlFor="maxPlayers"
          required
          error={(error && maxPlayers < 2) || maxPlayers > 10 ? error : null}
          helpText="Number of players allowed in the game (2-10)"
        >
          <Input
            id="maxPlayers"
            type="number"
            value={maxPlayers.toString()}
            onChange={(e) => setMaxPlayers(parseInt(e.target.value, 10))}
            min={2}
            max={10}
            fullWidth
            disabled={isSubmitting}
          />
        </FormItem>

        <FormItem
          label="Lines Per Poem"
          htmlFor="linesPerPoem"
          required
          helpText="Number of lines each poem will have (4-20)"
        >
          <Input
            id="linesPerPoem"
            type="number"
            value={linesPerPoem.toString()}
            onChange={(e) => setLinesPerPoem(parseInt(e.target.value, 10))}
            min={4}
            max={20}
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
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || groups.length === 0 || !selectedGroupId}
          >
            {isSubmitting ? "Creating..." : "Create Game"}
          </Button>
        </FormFooter>
      </Form>
    </Modal>
  );
};

export default CreateGameModal;
