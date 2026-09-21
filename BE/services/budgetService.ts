import { budgets } from '../models/mockDb';
import { Budget } from '../models/types';

export const getBudgets = (): Budget[] => budgets;
