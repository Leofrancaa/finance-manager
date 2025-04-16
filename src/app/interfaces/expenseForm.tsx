// interfaces/expenseForm.ts
export interface ExpenseFormData {
  type: string;
  day: string;
  amount: string;
  paymentMethod: string;
  installments: string;
  note: string;
}

export interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
}
