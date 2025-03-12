// services/userService.ts
import { authFetch } from '../utils/authFetch';

const API_BASE_URL = 'http://localhost:5209'; // Updated to match the API reference

export interface JoinGroupRequest {
  inviteCode: string;
}

export interface LeaveGroupRequest {
  groupId: string;
}

export interface JoinGameRequest {
  inviteCode: string;
}

export interface LeaveGameRequest {
  gameId: string;
}

export const userService = {
  // Join a group using an invite code
  joinGroup: async (inviteCode: string): Promise<boolean> => {
    const response = await authFetch(`${API_BASE_URL}/api/users/group/join?inviteCode=${inviteCode}`, {
        method: 'POST',
      });
      
    if (!response.ok) {
      throw new Error(`Failed to join group: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Leave a group
  leaveGroup: async (groupId: string): Promise<boolean> => {
    const response = await authFetch(`${API_BASE_URL}/api/users/group/leave/?groupId=${groupId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to leave group: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Join a game using an invite code
  joinGameByInviteCode: async (inviteCode: string): Promise<boolean> => {
    const response = await authFetch(`${API_BASE_URL}/api/users/game/join/invite/${inviteCode}`, {
        method: 'POST',
      });
      
    if (!response.ok) {
      throw new Error(`Failed to join game: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Join a game using its ID
  joinGameById: async (gameId: string): Promise<boolean> => {
    const response = await authFetch(`${API_BASE_URL}/api/users/game/join/id/${gameId}`, {
        method: 'POST',
      });
      
    if (!response.ok) {
      throw new Error(`Failed to join game: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Leave a game
  leaveGame: async (gameId: string): Promise<boolean> => {
    const response = await authFetch(`${API_BASE_URL}/api/users/game/leave/?gameId=${gameId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to leave game: ${response.statusText}`);
    }
    
    return response.json();
  }
};