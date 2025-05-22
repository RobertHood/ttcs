interface Course {
  _id?: string;
  title: string;
  description: string;
  category: string | {
    _id: string;
    name: string;
  };
  instructor: string;
  duration: number;
  content: string;
  headerImage?: string | File;
  users_enrolled?: string[];
  roadmap?: []
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const API_URL = 'http://localhost:8001/api';

export const courseService = {
  // Get all courses
  getAllCourses: async (): Promise<ApiResponse<Course[]>> => {
    try {
      const response = await fetch(`${API_URL}/courses`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      
      const result = await response.json();
      console.log('Courses response:', result);
      return result;
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      throw new Error('Không thể tải khóa học. Vui lòng thử lại sau.');
    }
  },
  
  // Get course by ID
  getCourseById: async (id: string): Promise<Course> => {
    try {
      const response = await fetch(`${API_URL}/courses/${id}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch course');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error: any) {
      console.error('Error fetching course:', error);
      throw new Error('Không thể tải thông tin khóa học');
    }
  },
  
  // Create new course - handles file upload
  createCourse: async (courseData: FormData): Promise<Course> => {
    try {
      const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        credentials: 'include',
        body: courseData,
        // Don't set Content-Type header with FormData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tạo khóa học');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error: any) {
      console.error('Error creating course:', error);
      throw error;
    }
  },
  
  // Update course - handles file upload
  updateCourse: async (id: string, courseData: FormData): Promise<Course> => {
    try {
      const response = await fetch(`${API_URL}/courses/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: courseData,
        // Don't set Content-Type header with FormData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể cập nhật khóa học');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error: any) {
      console.error('Error updating course:', error);
      throw error;
    }
  },
  
  // Delete course
  deleteCourse: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/courses/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể xóa khóa học');
      }
    } catch (error: any) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }
};

export type { Course, ApiResponse }; 