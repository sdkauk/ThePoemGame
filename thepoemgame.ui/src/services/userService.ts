// services/userService.ts
import { authFetch } from '../utils/authFetch';

const API_BASE_URL = 'http://localhost:5209'; // Updated to match the API reference

export interface JoinGroupRequest {
  inviteCode: string;
}

export interface LeaveGroupRequest {
  groupId: string;
}

export const userService = {
  // Join a group using an invite code
  joinGroup: async (inviteCode: string): Promise<boolean> => {
    const response = await authFetch(`${API_BASE_URL}/api/users/join?inviteCode=${inviteCode}`, {
        method: 'POST',
      });
      
    if (!response.ok) {
      throw new Error(`Failed to join group: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Leave a groupdddddddddddddddddd
  leaveGroup: async (groupId: string): Promise<boolean> => {
    const response = await authFetch(`${API_BASE_URL}/api/users/leave/?groupId=${groupId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to leave group: ${response.statusText}`);
    }
    
    return response.json();
  }
};