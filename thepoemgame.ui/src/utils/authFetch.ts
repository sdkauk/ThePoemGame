// utils/authFetch.ts
import { msalInstance } from '../auth/MsalProvider';
import { loginRequest } from '../auth/msalConfig';

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function authFetch(url: string, options: FetchOptions = {}): Promise<Response> {
  const { requireAuth = true, ...fetchOptions } = options;
  
  if (requireAuth) {
    const activeAccount = msalInstance.getActiveAccount();
    if (!activeAccount) {
      throw new Error('No active account! Verify a user is signed in.');
    }
    
    try {
      // Try to get token silently first
      const response = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: activeAccount
      });
      
      const headers = new Headers(fetchOptions.headers);
      headers.append('Authorization', `Bearer ${response.accessToken}`);
      
      return fetch(url, {
        ...fetchOptions,
        headers
      });
    } catch (error) {
      console.error('Error acquiring token silently:', error);
      
      // If silent token acquisition fails, fallback to interactive
      try {
        const response = await msalInstance.acquireTokenPopup({
          ...loginRequest,
          account: activeAccount
        });
        
        const headers = new Headers(fetchOptions.headers);
        headers.append('Authorization', `Bearer ${response.accessToken}`);
        
        return fetch(url, {
          ...fetchOptions,
          headers
        });
      } catch (interactiveError) {
        console.error('Error acquiring token interactively:', interactiveError);
        throw new Error('Failed to acquire token');
      }
    }
  } else {
    // Non-authenticated request
    return fetch(url, fetchOptions);
  }
}