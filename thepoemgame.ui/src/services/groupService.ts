// services/groupService.ts
import { authFetch } from '../utils/authFetch';

const API_BASE_URL = 'http://localhost:5209'; // Updated to match the API reference

export interface Member {
  id: string;
  name: string;
}

export interface Game {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  inviteCode: string;
  members: Member[];
  games: Game[];
}

export interface CreateGroupRequest {
  name: string;
}

export const groupService = {
  // Get all groups for the current user
  getGroups: async (): Promise<Group[]> => {
    const response = await authFetch(`${API_BASE_URL}/api/groups/user`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch groups: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Get a specific group by ID
  getGroup: async (id: string): Promise<Group> => {
    const response = await authFetch(`${API_BASE_URL}/api/groups/${id}`, {
        method: 'GET',
      });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch group: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Create a new group
  createGroup: async (name: string): Promise<Group> => {
    const response = await authFetch(`${API_BASE_URL}/api/groups?name=${name}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create group: ${response.statusText}`);
    }
    
    return response.json();
  },
};