import type { TransactionTypeContract } from './transaction.contract';

export type CategoryContract = {
  id: string;
  userId: string;
  name: string;
  type: TransactionTypeContract;
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryContract = {
  userId: string;
  name: string;
  type: TransactionTypeContract;
};

export type UpdateCategoryContract = {
  name?: string;
  type?: TransactionTypeContract;
};
