// interfaces/recurringExpense.ts
export interface RecurringExpense {
  id: string;
  type: string;
  amount: number;
  note?: string;
  day: number; // dia do mês, ex: 10
  startDate: string; // quando começa (YYYY-MM-DD)
}
