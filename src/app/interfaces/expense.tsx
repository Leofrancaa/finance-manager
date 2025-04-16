export interface Expense {
  _id?: string;
  type: string;
  date: string;
  amount: number;
  paymentMethod: string;
  installments?: number;
  note?: string;
}

export interface MappedExpense extends Omit<Expense, "_id"> {
  id: string;
}

export interface AddExpenseData {
  type: string;
  day: string;
  amount: string;
  paymentMethod: string;
  installments?: string;
  note?: string;
}
