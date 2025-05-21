import axiosInstance from './axios';

export interface User {
  _id?: string;
  email: string;
  profileName: string;
  role: string;
  level?: number;
  language?: string;
  avatarUrl?: string;
  strengths?: {
    pronunciation: number;
    grammar: number;
    vocabulary: number;
    fluency: number;
  };
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  userXP?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const API_URL = 'http://localhost:8001/api';

export const userService = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await fetch(`${API_URL}/user/all-users`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const result = await response.json();
      return result.data || [];
    } catch (error: any) {
      console.error('Error fetching users:', error);
      throw new Error('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
    }
  },
  
  // Get user by ID
  getUserById: async (userId: string): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/user/user-by-id?_id=${userId}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error: any) {
      console.error('Error fetching user:', error);
      throw new Error('Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
    }
  },
  
  // Update user
  updateUser: async (userId: string, userData: Partial<User>): Promise<User> => {
    try {
      console.log('Sending update request with data:', userData);
      const response = await fetch(`${API_URL}/user/update-user?_id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: userData.profileName,
          email: userData.email,
          role: userData.role,
          verified: userData.verified,
          // Don't send level if it's not a number
          level: typeof userData.level === 'number' ? userData.level : undefined
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể cập nhật người dùng');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error: any) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
  
  // Delete user
  deleteUser: async (userId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/user/delete-user?_id=${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể xóa người dùng');
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
  
  // Get dashboard statistics
  getDashboardStats: async (): Promise<{
    totalUsers: number;
    totalCourses: number;
    totalCategories: number;
    recentUsers: User[];
  }> => {
    try {
      const response = await fetch(`${API_URL}/dashboard/stats`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard statistics');
      }
      
      const result = await response.json();
      return result.data || {
        totalUsers: 0,
        totalCourses: 0,
        totalCategories: 0,
        recentUsers: []
      };
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      // Fall back to getting individual stats if dashboard endpoint fails
      try {
        const [users, courses, categories] = await Promise.all([
          userService.getAllUsers(),
          fetch(`${API_URL}/courses`).then(r => r.json()).then(d => d.data || []),
          fetch(`${API_URL}/categories`).then(r => r.json()).then(d => d.data || [])
        ]);
        
        return {
          totalUsers: users.length,
          totalCourses: courses.length,
          totalCategories: categories.length,
          recentUsers: users.slice(0, 5) // Get the 5 most recent users
        };
      } catch (fallbackError) {
        console.error('Error fetching fallback stats:', fallbackError);
        throw new Error('Không thể tải thống kê. Vui lòng thử lại sau.');
      }
    }
  }
}; 