import { api } from '../lib/api';

const personnelService = {
  /**
   * Get active personnel within a specific radius of a location on a given date
   * @param {Object} params - Query parameters
   * @param {number} params.lat - Latitude
   * @param {number} params.lon - Longitude
   * @param {number} params.radius - Radius in kilometers
   * @param {string} params.date - Date in YYYY-MM-DD format
   * @returns {Promise<Array>} - Array of personnel data
   */
  getActivePersonnel: async (params) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`active-personnel?${queryString}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching active personnel:', error);
      return [];
    }
  }
};

export default personnelService;