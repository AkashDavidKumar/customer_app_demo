import axios from 'axios';

/**
 * Parses unknown errors and Axios errors into a user-friendly string message.
 */
export const extractErrorMessage = (error: unknown, fallbackMessage = 'An unexpected error occurred'): string => {
  if (axios.isAxiosError(error)) {
    // Check if backend provided a specific error message
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    // Handle network errors
    if (error.code === 'ECONNABORTED' || error.message.toLowerCase().includes('network')) {
      return 'Network error. Please check your internet connection.';
    }
    // Default Axios error message
    if (error.message) {
      return error.message;
    }
  }

  // Handle standard JS errors
  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};
