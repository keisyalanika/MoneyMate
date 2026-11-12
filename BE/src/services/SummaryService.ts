import { summaryRepository } from '../repositories';

export class SummaryService {
  constructor(private readonly summary = summaryRepository) {}

  getUserSummary(userId: number) {
    return this.summary.userSummary(userId);
  }

  getAdminSummary() {
    return this.summary.adminSummary();
  }
}

export const summaryService = new SummaryService();
