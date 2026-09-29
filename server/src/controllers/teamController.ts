import { Request, Response } from 'express';
import { TeamMember } from '../models/TeamMember.js';
import { isDbConnected } from '../config/db.js';
import { memoryStore } from '../config/mockStore.js';

export const getTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    if (isDbConnected) {
      const team = await TeamMember.find().sort({ order: 1 });
      res.json({ success: true, count: team.length, data: team });
      return;
    }
    res.json({ success: true, count: memoryStore.team.length, data: memoryStore.team });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, role, bio, photoUrl, order } = req.body;

    if (isDbConnected) {
      const member = await TeamMember.create({ name, role, bio, photoUrl, order: order || 0 });
      res.status(201).json({ success: true, message: 'Team member added', data: member });
      return;
    }

    const newMember = {
      _id: `tm-${Date.now()}`,
      name,
      role,
      bio: bio || '',
      photoUrl,
      order: order || memoryStore.team.length + 1,
    };
    memoryStore.team.push(newMember);
    res.status(201).json({ success: true, message: 'Team member added', data: newMember });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (isDbConnected) {
      const member = await TeamMember.findByIdAndUpdate(id, req.body, { new: true });
      if (!member) {
        res.status(404).json({ success: false, message: 'Member not found' });
        return;
      }
      res.json({ success: true, message: 'Member updated', data: member });
      return;
    }

    const index = memoryStore.team.findIndex((m) => m._id === id);
    if (index === -1) {
      res.status(404).json({ success: false, message: 'Member not found' });
      return;
    }
    memoryStore.team[index] = { ...memoryStore.team[index], ...req.body };
    res.json({ success: true, message: 'Member updated', data: memoryStore.team[index] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (isDbConnected) {
      await TeamMember.findByIdAndDelete(id);
      res.json({ success: true, message: 'Team member deleted' });
      return;
    }

    memoryStore.team = memoryStore.team.filter((m) => m._id !== id);
    res.json({ success: true, message: 'Team member deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
