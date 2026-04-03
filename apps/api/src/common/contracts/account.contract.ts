export type AccountTypeContract = 'checking' | 'savings' | 'credit_card' | 'cash';

export type AccountContract = {
  id: string;
  userId: string;
  name: string;
  type: AccountTypeContract;
  currency: string;
  openingBalanceCents: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateAccountContract = {
  userId: string;
  name: string;
  type: AccountTypeContract;
  currency?: string;
  openingBalanceCents?: number;
};

export type UpdateAccountContract = {
  name?: string;
  type?: AccountTypeContract;
  currency?: string;
  openingBalanceCents?: number;
  isArchived?: boolean;
};
