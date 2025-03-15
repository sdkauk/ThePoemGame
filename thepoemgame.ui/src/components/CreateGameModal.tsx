'use client'

import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { gameService, Game } from '@/services/gameService';

// Update to match server-side request structure
interface GamePostRequest {
  maxPlayers: number;
  linesPerPoem: number;
  groupId: string;
}

interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameCreated: (game: Game) => void;
  groupId: string;
}

export default function CreateGameModal({ isOpen, onClose, onGameCreated, groupId }: CreateGameModalProps) {
  const [maxPlayers, setMaxPlayers] = useState(10);
  const [linesPerPoem, setLinesPerPoem] = useState(10);
  const { loading, error, execute } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
        
    const request: GamePostRequest = {
      maxPlayers: maxPlayers,
      linesPerPoem: linesPerPoem,
      groupId: groupId
    };
    
    await execute(
      () => gameService.createGame(request),
      (newGame) => {
        onGameCreated(newGame);
        onClose();
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create a New Game</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
    <label htmlFor="maxPlayers" className="block mb-2 font-medium">
      Maximum Players
    </label>
    <input
      type="number"
      id="maxPlayers"
      value={maxPlayers}
      onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
      min="1"
      required
    />
  </div>
  
  <div>
    <label htmlFor="linesPerPoem" className="block mb-2 font-medium">
      Lines Per Poem
    </label>
    <input
      type="number"
      id="linesPerPoem"
      value={linesPerPoem}
      onChange={(e) => setLinesPerPoem(parseInt(e.target.value))}
      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
      min="1"
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
              disabled={loading}
              className="px-4 py-2 bg-foreground text-background rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Game'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}