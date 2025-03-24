import { authFetch } from "../utils/authFetch";

const API_BASE_URL = "http://localhost:5209";

export interface Author {
  id: string;
  name: string;
}

export interface Line {
  id: string;
  author: Author;
  content: string;
  lineNumber: number;
  kudos: number;
  lineType: LineType;
}

export interface Poem {
  id: string;
  title: string;
  Author: Author;
  gameId: string;
  lines: Line[];
  createdAt: string;
}

export interface PoemPostRequest {
  gameId: string;
  title: string;
  firstLineContent: string;
  paperType: PaperType;
}

export interface LinePostRequest {
  content: string;
  poemId: string;
  gameId: string;
  lineType: LineType;
}

export enum LineType {
  Call = 0,
  Response = 1,
}

export interface WaitingPoem {
  poemId: string;
  title: string;
  author: Author;
  lineCount: number;
  gameId: string;
  gameName: string;
}

export const poemService = {
  // Add the endpoint method
  getUserWaitingPoems: async (): Promise<WaitingPoem[]> => {
    const response = await authFetch(`${API_BASE_URL}/api/poems/waiting`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch waiting poems: ${response.statusText}`);
    }

    return response.json();
  },

  // Get a specific poem by ID
  getPoem: async (id: string): Promise<Poem> => {
    const response = await authFetch(`${API_BASE_URL}/api/poems/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch poem: ${response.statusText}`);
    }

    return response.json();
  },

  // Create a new poem
  createPoem: async (request: PoemPostRequest): Promise<Poem> => {
    const response = await authFetch(`${API_BASE_URL}/api/poems/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to create poem: ${response.statusText}`);
    }

    return response.json();
  },

  // Add a line to an existing poem
  addLineToPoem: async (request: LinePostRequest): Promise<void> => {
    const response = await authFetch(`${API_BASE_URL}/api/poems/addLine`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to add line to poem: ${response.statusText}`);
    }
  },
};
