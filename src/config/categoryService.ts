// Updated to use direct fetch instead of axios
interface Category {
  _id?: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

const API_URL = 'http://localhost:8001/api';

export const categoryService = {
  // Get all categories
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const result = await response.json();
      console.log('Categories response:', result);
      return result.data || [];
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      throw new Error('Không thể tải danh mục. Vui lòng thử lại sau.');
    }
  },
  
  // Create new category
  createCategory: async (categoryData: Category): Promise<Category> => {
    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tạo danh mục');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error: any) {
      console.error('Error creating category:', error);
      throw error;
    }
  },
  
  // Update category
  updateCategory: async (id: string, categoryData: Partial<Category>): Promise<Category> => {
    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể cập nhật danh mục');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error: any) {
      console.error('Error updating category:', error);
      throw error;
    }
  },
  
  // Delete category
  deleteCategory: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể xóa danh mục');
      }
    } catch (error: any) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
};

export type { Category, ApiError }; 