import { authFetch } from '../utils/authFetch';

const API_BASE_URL = 'http://localhost:5209';

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
  poems: BasicPoem[];
  players: Player[];
  currentPhase: string;
  createdAt: string;
}

export interface GamePostRequest {
  name: string;
  groupId: string;
}

export const gameService = {
  // Get all games for the current user
  getUserGames: async (): Promise<Game[]> => {
    const response = await authFetch(`${API_BASE_URL}/api/games/user`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user games: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Get a specific game by ID
  getGame: async (id: string): Promise<Game> => {
    const response = await authFetch(`${API_BASE_URL}/api/games/${id}`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch game: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Create a new game
  createGame: async (request: GamePostRequest): Promise<Game> => {
    const response = await authFetch(`${API_BASE_URL}/api/games`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create game: ${response.statusText}`);
    }
    
    return response.json();
  },
};