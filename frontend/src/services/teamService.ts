const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export interface Team {
  id: number;
  title: string;
  state: boolean;
}

export interface TeamsResponse {
  status: string;
  count: number;
  data: Team[];
}

/**
 * Get all teams
 * @returns Promise with teams response
 */
const getTeams = async (): Promise<TeamsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/teams`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch teams: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

/**
 * Get active teams only
 * @returns Promise with active teams
 */
const getActiveTeams = async (): Promise<Team[]> => {
  try {
    const teamsResponse = await getTeams();
    return teamsResponse.data.filter(team => team.state === true);
  } catch (error) {
    console.error('Error fetching active teams:', error);
    return [];
  }
};

/**
 * Service for handling team-related API calls
 */
const teamService = {
  getTeams,
  getActiveTeams
};

export default teamService;

