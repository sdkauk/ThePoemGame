import React, { useState } from "react";
import Modal from "@/components/Modal/modal";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/input";
import Label from "@/components/Label/label";
import { gameService, GamePostRequest } from "@/services/gameService";
import Form from "@/components/Form/Form";
import FormItem from "@/components/Form/FormItem/FormItem";
import FormFooter from "@/components/Form/FormFooter/FormFooter";

interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  groupId: string;
}

const CreateGameModal: React.FC<CreateGameModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  groupId,
}) => {
  const [maxPlayers, setMaxPlayers] = useState(6);
  const [linesPerPoem, setLinesPerPoem] = useState(8);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (maxPlayers < 2 || maxPlayers > 10) {
      setError("Number of players must be between 2 and 10");
      return;
    }

    if (linesPerPoem < 4 || linesPerPoem > 20) {
      setError("Lines per poem must be between 4 and 20");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const gameRequest: GamePostRequest = {
        maxPlayers,
        linesPerPoem,
        groupId,
      };

      await gameService.createGame(gameRequest);

      // Reset form
      setMaxPlayers(6);
      setLinesPerPoem(8);

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Game" size="sm">
      <Form onSubmit={handleSubmit} spacing="md">
        <FormItem
          label="Maximum Players"
          htmlFor="maxPlayers"
          required
          error={error || undefined}
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
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Game"}
          </Button>
        </FormFooter>
      </Form>
    </Modal>
  );
};

export default CreateGameModal;
