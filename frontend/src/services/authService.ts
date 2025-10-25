import { api } from '../lib/api';
import { LogoutReasonPayload } from '../types/LogoutReason';

export const logout = async (logoutData: LogoutReasonPayload): Promise<any> => {
  try {
    const response = await api.post('/logout', logoutData);
    
    // Clear local storage - api.setToken already handles token removal
    api.setToken(null);
    localStorage.removeItem('user');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};