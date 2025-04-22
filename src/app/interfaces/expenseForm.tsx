// interfaces/expenseForm.ts
export interface ExpenseFormData {
  type: string;
  day: string; // Pode ser string no form; no submit converta para number
  amount: string; // Mesmo caso
  paymentMethod: string;
  installments: string;
  note?: string;
  fixed?: boolean;
}
export interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
}
