import axiosInstance from './axios';

export type Lesson = {
  _id: string;
  course: string | {
    _id: string;
    title: string;
    [key: string]: any;
  };
  title: string;
  theory: string;
  audio?: string;
  exercise: Array<{
    question: string;
    answers: string[];
    correctAnswer: string;
  }>;
  category: 'Pronunciation' | 'Grammar' | 'Chatbot' | 'Final';
  createdAt?: string;
  updatedAt?: string;
};

type LessonInput = Omit<Lesson, '_id' | 'createdAt' | 'updatedAt'>;
type LessonUpdateInput = Partial<LessonInput>;

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

class LessonService {
  private baseUrl = 'http://localhost:8001/api/english';
  
  async getAllLessons(): Promise<ApiResponse<Lesson[]>> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/all-lessons`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  async getLessonById(id: string): Promise<ApiResponse<Lesson>> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/lesson/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  async getLessonsByCategory(category: string): Promise<ApiResponse<Lesson[]>> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/lessons-by-category`, {
        params: { category }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  async createLesson(lessonData: LessonInput, audioFile?: File): Promise<ApiResponse<Lesson>> {
    try {
      const formData = new FormData();
      
      // Append lesson data
      Object.entries(lessonData).forEach(([key, value]) => {
        if (key === 'exercise') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      });
      
      // Append audio file if provided
      if (audioFile) {
        formData.append('audio', audioFile);
      }
      
      const response = await axiosInstance.post(`${this.baseUrl}/create-lesson`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  async updateLesson(id: string, lessonData: LessonUpdateInput, audioFile?: File): Promise<ApiResponse<Lesson>> {
    try {
      const formData = new FormData();
      
      
      Object.entries(lessonData).forEach(([key, value]) => {
      if (key === 'exercise') {
        formData.append(key, JSON.stringify(value));
      } else if (key === 'category' && typeof value === 'string') {
        formData.append(key, value.toLowerCase());
      } else if (value !== undefined) {
        formData.append(key, value as string);
      }
    });
    
      if (audioFile) {
        formData.append('audio', audioFile);
      }
      
      const response = await axiosInstance.put(`${this.baseUrl}/lesson/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  async deleteLesson(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await axiosInstance.delete(`${this.baseUrl}/lesson/${id}`, {
        method: 'DELETE'
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  private handleError(error: any): Error {
    if (error.response) {
     
      return new Error(error.response.data.message || 'An error occurred with the response');
    } else if (error.request) {
      return new Error('No response received from server');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export const lessonService = new LessonService(); 