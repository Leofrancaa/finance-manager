export interface Expense {
  id?: string;
  type: string;
  date: string;
  amount: number;
  paymentMethod: string;
  installments?: number;
  note?: string;
  fixed?: boolean; // novo campo! (opcional)
  _id?: string; // Optional property
  startDate?: string; // Para gastos fixos, a data de início
  day?: number; // Para gastos fixos, o dia do mês
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
  fixed?: boolean; // novo campo! (opcional)
  startDate?: string; // Para gastos fixos, a data de início
}

export interface Income {
  id: string;
  type: string; // Ex: "Salário", "Freelance", "Outros"
  amount: number;
  date: string; // ISO string
  note?: string;
  source?: string; // Opcional, se quiser detalhar
}
