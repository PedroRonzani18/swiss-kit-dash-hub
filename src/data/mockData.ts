export type TransactionType = "income" | "expense";

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface Transaction {
  id: string;
  account: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  subcategoryId: string;
}

export const accounts = ["Nubank", "Mercado Pago"];

export const initialCategories: Category[] = [
  {
    id: "cat-1",
    name: "Trabalhos",
    type: "income",
    subcategories: [
      { id: "sub-1", name: "Salário", categoryId: "cat-1" },
      { id: "sub-2", name: "Mesada", categoryId: "cat-1" },
    ],
  },
  {
    id: "cat-2",
    name: "Bobagem",
    type: "expense",
    subcategories: [
      { id: "sub-3", name: "Tic Tac", categoryId: "cat-2" },
      { id: "sub-4", name: "Pastel", categoryId: "cat-2" },
      { id: "sub-5", name: "Supercoffee", categoryId: "cat-2" },
    ],
  },
  {
    id: "cat-3",
    name: "Dieta",
    type: "expense",
    subcategories: [
      { id: "sub-6", name: "Frango", categoryId: "cat-3" },
      { id: "sub-7", name: "Ovo", categoryId: "cat-3" },
      { id: "sub-8", name: "Banana", categoryId: "cat-3" },
      { id: "sub-9", name: "Aveia", categoryId: "cat-3" },
    ],
  },
  {
    id: "cat-4",
    name: "Casa",
    type: "expense",
    subcategories: [
      { id: "sub-10", name: "Esponja", categoryId: "cat-4" },
      { id: "sub-11", name: "Bombril", categoryId: "cat-4" },
      { id: "sub-12", name: "Faxina", categoryId: "cat-4" },
    ],
  },
  {
    id: "cat-5",
    name: "Transporte",
    type: "expense",
    subcategories: [
      { id: "sub-13", name: "Gasolina", categoryId: "cat-5" },
    ],
  },
];

export const initialTransactions: Transaction[] = [
  // --- Janeiro 2026 ---
  { id: "t-j1", account: "Nubank", date: "2026-01-05", description: "Salário mensal", amount: 4500, type: "income", categoryId: "cat-1", subcategoryId: "sub-1" },
  { id: "t-j2", account: "Mercado Pago", date: "2026-01-06", description: "Mesada avó", amount: 200, type: "income", categoryId: "cat-1", subcategoryId: "sub-2" },
  { id: "t-j3", account: "Nubank", date: "2026-01-07", description: "Tic Tac menta", amount: 3, type: "expense", categoryId: "cat-2", subcategoryId: "sub-3" },
  { id: "t-j4", account: "Nubank", date: "2026-01-10", description: "Pastel de frango", amount: 7.5, type: "expense", categoryId: "cat-2", subcategoryId: "sub-4" },
  { id: "t-j5", account: "Mercado Pago", date: "2026-01-12", description: "Supercoffee vanilla", amount: 34, type: "expense", categoryId: "cat-2", subcategoryId: "sub-5" },
  { id: "t-j6", account: "Nubank", date: "2026-01-14", description: "2kg Peito de frango", amount: 48, type: "expense", categoryId: "cat-3", subcategoryId: "sub-6" },
  { id: "t-j7", account: "Nubank", date: "2026-01-16", description: "Cartela de ovo 30un", amount: 20, type: "expense", categoryId: "cat-3", subcategoryId: "sub-7" },
  { id: "t-j8", account: "Mercado Pago", date: "2026-01-18", description: "Banana prata 2kg", amount: 11, type: "expense", categoryId: "cat-3", subcategoryId: "sub-8" },
  { id: "t-j9", account: "Nubank", date: "2026-01-20", description: "Aveia flocos 1kg", amount: 15, type: "expense", categoryId: "cat-3", subcategoryId: "sub-9" },
  { id: "t-j10", account: "Nubank", date: "2026-01-22", description: "Esponja 6un", amount: 9, type: "expense", categoryId: "cat-4", subcategoryId: "sub-10" },
  { id: "t-j11", account: "Mercado Pago", date: "2026-01-24", description: "Diarista faxina", amount: 180, type: "expense", categoryId: "cat-4", subcategoryId: "sub-12" },
  { id: "t-j12", account: "Nubank", date: "2026-01-26", description: "Gasolina tanque cheio", amount: 290, type: "expense", categoryId: "cat-5", subcategoryId: "sub-13" },
  { id: "t-j13", account: "Nubank", date: "2026-01-28", description: "Gasolina complemento", amount: 130, type: "expense", categoryId: "cat-5", subcategoryId: "sub-13" },

  // --- Fevereiro 2026 ---
  { id: "t-f1", account: "Nubank", date: "2026-02-03", description: "Salário mensal", amount: 4500, type: "income", categoryId: "cat-1", subcategoryId: "sub-1" },
  { id: "t-f2", account: "Mercado Pago", date: "2026-02-04", description: "Mesada avó", amount: 200, type: "income", categoryId: "cat-1", subcategoryId: "sub-2" },
  { id: "t-f3", account: "Nubank", date: "2026-02-05", description: "Tic Tac morango", amount: 3.5, type: "expense", categoryId: "cat-2", subcategoryId: "sub-3" },
  { id: "t-f4", account: "Nubank", date: "2026-02-08", description: "Pastel de carne", amount: 8, type: "expense", categoryId: "cat-2", subcategoryId: "sub-4" },
  { id: "t-f5", account: "Nubank", date: "2026-02-10", description: "1kg Peito de frango", amount: 26, type: "expense", categoryId: "cat-3", subcategoryId: "sub-6" },
  { id: "t-f6", account: "Nubank", date: "2026-02-12", description: "Cartela de ovo 30un", amount: 21, type: "expense", categoryId: "cat-3", subcategoryId: "sub-7" },
  { id: "t-f7", account: "Mercado Pago", date: "2026-02-14", description: "Banana prata 1.5kg", amount: 8, type: "expense", categoryId: "cat-3", subcategoryId: "sub-8" },
  { id: "t-f8", account: "Nubank", date: "2026-02-16", description: "Aveia flocos 500g", amount: 8.5, type: "expense", categoryId: "cat-3", subcategoryId: "sub-9" },
  { id: "t-f9", account: "Nubank", date: "2026-02-18", description: "Bombril 8un", amount: 4, type: "expense", categoryId: "cat-4", subcategoryId: "sub-11" },
  { id: "t-f10", account: "Mercado Pago", date: "2026-02-20", description: "Diarista faxina", amount: 180, type: "expense", categoryId: "cat-4", subcategoryId: "sub-12" },
  { id: "t-f11", account: "Nubank", date: "2026-02-22", description: "Gasolina tanque cheio", amount: 270, type: "expense", categoryId: "cat-5", subcategoryId: "sub-13" },
  { id: "t-f12", account: "Nubank", date: "2026-02-25", description: "Supercoffee chocolate", amount: 32, type: "expense", categoryId: "cat-2", subcategoryId: "sub-5" },

  // --- Março 2026 ---
  { id: "t-1", account: "Nubank", date: "2026-03-01", description: "Salário mensal", amount: 4500, type: "income", categoryId: "cat-1", subcategoryId: "sub-1" },
  { id: "t-2", account: "Mercado Pago", date: "2026-03-02", description: "Mesada avó", amount: 200, type: "income", categoryId: "cat-1", subcategoryId: "sub-2" },
  { id: "t-3", account: "Nubank", date: "2026-03-03", description: "Tic Tac morango", amount: 3.5, type: "expense", categoryId: "cat-2", subcategoryId: "sub-3" },
  { id: "t-4", account: "Nubank", date: "2026-03-04", description: "Pastel de carne", amount: 8, type: "expense", categoryId: "cat-2", subcategoryId: "sub-4" },
  { id: "t-5", account: "Mercado Pago", date: "2026-03-05", description: "Supercoffee chocolate", amount: 32, type: "expense", categoryId: "cat-2", subcategoryId: "sub-5" },
  { id: "t-6", account: "Nubank", date: "2026-03-06", description: "1kg Peito de frango", amount: 25, type: "expense", categoryId: "cat-3", subcategoryId: "sub-6" },
  { id: "t-7", account: "Nubank", date: "2026-03-08", description: "Cartela de ovo 30un", amount: 22, type: "expense", categoryId: "cat-3", subcategoryId: "sub-7" },
  { id: "t-8", account: "Mercado Pago", date: "2026-03-10", description: "Banana prata 1kg", amount: 6, type: "expense", categoryId: "cat-3", subcategoryId: "sub-8" },
  { id: "t-9", account: "Nubank", date: "2026-03-11", description: "Aveia flocos 500g", amount: 8.5, type: "expense", categoryId: "cat-3", subcategoryId: "sub-9" },
  { id: "t-10", account: "Nubank", date: "2026-03-13", description: "Esponja multiuso 3un", amount: 5, type: "expense", categoryId: "cat-4", subcategoryId: "sub-10" },
  { id: "t-11", account: "Nubank", date: "2026-03-15", description: "Bombril 8un", amount: 4, type: "expense", categoryId: "cat-4", subcategoryId: "sub-11" },
  { id: "t-12", account: "Mercado Pago", date: "2026-03-17", description: "Diarista faxina mensal", amount: 180, type: "expense", categoryId: "cat-4", subcategoryId: "sub-12" },
  { id: "t-13", account: "Nubank", date: "2026-03-20", description: "Gasolina tanque cheio", amount: 280, type: "expense", categoryId: "cat-5", subcategoryId: "sub-13" },
  { id: "t-14", account: "Nubank", date: "2026-03-22", description: "Pastel de queijo", amount: 7, type: "expense", categoryId: "cat-2", subcategoryId: "sub-4" },
  { id: "t-15", account: "Mercado Pago", date: "2026-03-25", description: "Gasolina complemento", amount: 150, type: "expense", categoryId: "cat-5", subcategoryId: "sub-13" },
];
