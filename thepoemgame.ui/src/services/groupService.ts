// services/entityService.ts
import { authFetch } from '../utils/authFetch';

const API_BASE_URL = 'http://localhost:5244'; // Update with your .NET API URL

export interface Entity {
  id: string;
  name: string;
}

export interface EntityPostRequest {
  name: string;
}

export interface EntityPutRequest {
  id: string;
  name?: string;
}

export const entityService = {
  // Get all entities
  getAllEntities: async (): Promise<Entity[]> => {
    const response = await authFetch(`${API_BASE_URL}/api/Entity`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch entities: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Get a single entity by ID
  getEntity: async (id: string): Promise<Entity> => {
    const response = await authFetch(`${API_BASE_URL}/api/Entity/${id}`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch entity: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Create a new entity
  createEntity: async (request: EntityPostRequest): Promise<Entity> => {
    const response = await authFetch(`${API_BASE_URL}/api/Entity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create entity: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Update an existing entity
  updateEntity: async (request: EntityPutRequest): Promise<Entity> => {
    const response = await authFetch(`${API_BASE_URL}/api/Entity`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update entity: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Delete an entity
  deleteEntity: async (id: string): Promise<void> => {
    const response = await authFetch(`${API_BASE_URL}/api/Entity/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete entity: ${response.statusText}`);
    }
  },
};