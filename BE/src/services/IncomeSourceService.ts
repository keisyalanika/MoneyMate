import { incomeSourceRepository } from '../repositories';

export class IncomeSourceService {
  constructor(private readonly incomeSources = incomeSourceRepository) {}

  getIncomeSources(userId: number) {
    return this.incomeSources.findByUser(userId);
  }

  createIncomeSource(data: { user_id: number; source_name: string }) {
    return this.incomeSources.create(data);
  }

  deleteIncomeSource(id: number) {
    return this.incomeSources.remove(id);
  }
}

export const incomeSourceService = new IncomeSourceService();
