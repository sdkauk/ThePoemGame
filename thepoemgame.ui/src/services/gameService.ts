import { authFetch } from "../utils/authFetch";

const API_BASE_URL = "http://localhost:5209";

export interface Player {
  id: string;
  name: string;
}

export interface BasicPoem {
  id: string;
  title: string;
  author: Player;
}

export interface Game {
  id: string;
  name: string;
  groupId: string;
  createdBy: Player;
  maxPlayers: number;
  linesPerPoem: number;
  players: Player[];
  poems: BasicPoem[];
  status: GameStatus;
  phase: GamePhase;
  createdAt: string;
}

export interface GamePostRequest {
  maxPlayers: number;
  linesPerPoem: number;
  groupId: string;
}

export enum GameStatus {
  WaitingForPlayers = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3,
}

export enum GamePhase {
  CreatePoems = 0,
  RoundRobin = 1,
  Exhibit = 2,
  Awards = 3,
}

export const gameService = {
  getUserGroupGames: async (): Promise<Game[]> => {
    const response = await authFetch(`${API_BASE_URL}/api/games/user/groups`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch user group games: ${response.statusText}`
      );
    }

    return response.json();
  },
  // Get all games for the current user
  getUserGames: async (): Promise<Game[]> => {
    const response = await authFetch(`${API_BASE_URL}/api/games/user`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user games: ${response.statusText}`);
    }

    return response.json();
  },

  // Get all games for a specific group
  getGroupGames: async (groupId: string): Promise<Game[]> => {
    const response = await authFetch(
      `${API_BASE_URL}/api/games/group?groupId=${groupId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch group games: ${response.statusText}`);
    }

    return response.json();
  },

  // Get a specific game by ID
  getGame: async (id: string): Promise<Game> => {
    const response = await authFetch(`${API_BASE_URL}/api/games/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch game: ${response.statusText}`);
    }

    return response.json();
  },

  // Create a new game
  createGame: async (request: GamePostRequest): Promise<Game> => {
    const response = await authFetch(`${API_BASE_URL}/api/games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to create game: ${response.statusText}`);
    }

    return response.json();
  },

  // Add to gameService.ts
  isUserInGame: async (gameId: string): Promise<boolean> => {
    const response = await authFetch(
      `${API_BASE_URL}/api/games/${gameId}/participant`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to check game membership: ${response.statusText}`
      );
    }

    return response.json();
  },

  startGame: async (gameId: string): Promise<boolean> => {
    const response = await authFetch(
      `${API_BASE_URL}/api/games/${gameId}/start`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to start game: ${response.statusText}`);
    }

    return response.json();
  },
};
