import { Response } from 'express';
import * as reportService from '../services/reportService';
import { AuthRequest } from '../middleware/authMiddleware';

// ---- GET reports ----
export const getReports = async (req: AuthRequest, res: Response) => {
  try {
    const { report_type } = req.query;
    const user_id = req.user!.role === 'admin' ? undefined : req.user!.id;
    const list = await reportService.getReports({ user_id, report_type: report_type as string });
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- CREATE report ----
export const createReport = async (req: AuthRequest, res: Response) => {
  try {
    const { user_id, report_type, title, period_start, period_end, file_url } = req.body;
    if (!report_type) {
      return res.status(400).json({ success: false, message: 'report_type is required' });
    }
    const report = await reportService.createReport({
      user_id: user_id || req.user!.id,
      generated_by: req.user!.id,
      report_type,
      title,
      period_start,
      period_end,
      file_url,
    });
    res.status(201).json({ success: true, data: report, message: 'Report created successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- GET EXPORT SUMMARY (Cashflow, Breakdown, Overbudget) ----
export const getExportSummary = async (req: AuthRequest, res: Response) => {
  try {
    const { start_date, end_date, report_type } = req.query;
    const userId = req.user!.role === 'admin' ? undefined : req.user!.id;

    const summary = await reportService.generateExportSummary({
      user_id: userId,
      period_start: start_date as string,
      period_end: end_date as string,
      report_type: report_type as string,
    });

    res.json({
      success: true,
      data: summary,
      message: 'Financial report export summary generated successfully',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- SCHEDULE AUTOMATIC REPORT ----
export const scheduleReport = async (req: AuthRequest, res: Response) => {
  try {
    const { frequency, time, recipients, subject } = req.body;
    if (!frequency || !time) {
      return res.status(400).json({ success: false, message: 'frequency and time are required' });
    }

    const schedule = await reportService.scheduleAutomaticReport(req.user!.id, {
      frequency,
      time,
      recipients,
      subject,
    });

    res.status(201).json({
      success: true,
      data: schedule,
      message: 'Jadwal laporan otomatis berhasil diaktifkan',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- DELETE report ----
export const deleteReport = async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await reportService.deleteReport(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
