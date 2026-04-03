export type SubcategoryContract = {
  id: string;
  userId: string;
  categoryId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateSubcategoryContract = {
  userId: string;
  categoryId: string;
  name: string;
};

export type UpdateSubcategoryContract = {
  categoryId?: string;
  name?: string;
};
