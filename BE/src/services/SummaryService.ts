import { summaryRepository } from '../repositories';

export class SummaryService {
  constructor(private readonly summary = summaryRepository) {}

  getUserSummary(userId: number) {
    return this.summary.userSummary(userId);
  }

  getAdminSummary() {
    return this.summary.adminSummary();
  }

  getAdminDashboard() {
    return this.summary.adminDashboard();
  }
}

export const summaryService = new SummaryService();
