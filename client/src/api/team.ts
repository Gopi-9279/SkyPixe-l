import api from './client.js';
import { TeamMember } from '../types/index.js';

export const fetchTeam = async (): Promise<TeamMember[]> => {
  const res = await api.get('/team');
  return res.data.data;
};

export const createTeamMember = async (data: Partial<TeamMember>): Promise<TeamMember> => {
  const res = await api.post('/team', data);
  return res.data.data;
};

export const deleteTeamMember = async (id: string): Promise<void> => {
  await api.delete(`/team/${id}`);
};
