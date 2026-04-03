export type UserContract = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserContract = {
  email: string;
  name?: string | null;
};
