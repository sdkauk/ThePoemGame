// services/usersService.ts
import { authFetch } from '../utils/authFetch';

const API_BASE_URL = 'http://localhost:5244'; // Update with your .NET API URL

export interface JoinGroupResult {
  // Define result structure based on your API return type
  success: boolean;
  groupId?: string;
  group?: {
    id: string;
    name: string;
  };
  // Add other properties as needed
}

export interface LeaveGroupResult {
  // Define result structure based on your API return type
  success: boolean;
  groupId?: string;
  // Add other properties as needed
}

export const usersService = {
  // Join a group using an invite code
  joinGroup: async (inviteCode: string): Promise<JoinGroupResult> => {
    const response = await authFetch(`${API_BASE_URL}/api/Users/join?inviteCode=${encodeURIComponent(inviteCode)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to join group: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Leave a group
  leaveGroup: async (groupId: string): Promise<LeaveGroupResult> => {
    const response = await authFetch(`${API_BASE_URL}/api/Users/leave?groupId=${groupId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to leave group: ${response.statusText}`);
    }
    
    return response.json();
  }
};