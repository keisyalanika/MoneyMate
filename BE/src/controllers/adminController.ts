import { Response } from 'express';
import * as userService from '../services/userService';
import * as auditService from '../services/auditService';
import { AuthRequest } from '../middleware/authMiddleware';

// ---- GET all users (admin) ----
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ success: true, data: users });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- GET user by ID (admin) ----
export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await userService.getUserById(Number(req.params.id));
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- TOGGLE user active (admin) ----
export const toggleUserActive = async (req: AuthRequest, res: Response) => {
  try {
    const { is_active } = req.body;
    const updated = await userService.toggleUserActive(Number(req.params.id), is_active);
    // Log audit
    await auditService.logAction({
      admin_id: req.user!.id,
      action: is_active ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
      target_table: 'users',
      target_id: Number(req.params.id),
      description: `Admin ${is_active ? 'activated' : 'deactivated'} user #${req.params.id}`,
    });
    res.json({ success: true, data: updated, message: `User ${is_active ? 'activated' : 'deactivated'} successfully` });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- DELETE user (admin) ----
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await userService.deleteUser(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await auditService.logAction({
      admin_id: req.user!.id,
      action: 'DELETE_USER',
      target_table: 'users',
      target_id: Number(req.params.id),
      description: `Admin deleted user #${req.params.id}`,
    });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- GET audit logs (admin) ----
export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const { action, limit } = req.query;
    const logs = await auditService.getAuditLogs({
      action: action as string,
      limit: limit ? Number(limit) : 100,
    });
    res.json({ success: true, data: logs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
