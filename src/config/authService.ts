import axiosInstance from './axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
  token?: string;
}

export const authService = {
  // Get current user profile
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await axiosInstance.get<AuthResponse>('/auth/profile');
      return response.data.user || null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },
  
  // Check if user is admin
  isAdmin: async (): Promise<boolean> => {
    try {
      const user = await authService.getCurrentUser();
      return user?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },
  
  // Login
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      const response = await fetch('http://localhost:8001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      return data.user || null;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Logout
  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
};

export type { User }; 