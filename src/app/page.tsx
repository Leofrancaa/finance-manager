"use client";

import { useEffect, useState } from "react";
import { YearSelector } from "@/components/yearSelector";
import { MonthButtons } from "@/components/monthButton";
import { ExpenseForm } from "@/components/expenseForm";
import { ExpenseSummary } from "@/components/expenseSummary";

interface Expense {
  _id?: string;
  type: string;
  date: string;
  amount: number;
  paymentMethod: string;
  installments?: number;
}

export default function HomePage() {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // 👉 Carrega as despesas ao iniciar
  useEffect(() => {
    fetch("/api/expenses")
      .then((res) => res.json())
      .then((data) => setExpenses(data));
  }, []);

  const handleAddExpense = async (data: {
    type: string;
    day: string;
    amount: string;
    paymentMethod: string;
    installments?: string;
  }) => {
    const fullDate = new Date(selectedYear, selectedMonth!, parseInt(data.day));

    const newExpense: Expense = {
      type: data.type,
      date: fullDate.toISOString(),
      amount: parseFloat(data.amount),
      paymentMethod: data.paymentMethod,
      installments: data.installments ? parseInt(data.installments) : undefined,
    };

    // 👉 Salva no MongoDB via POST
    const response = await fetch("/api/expenses", {
      method: "POST",
      body: JSON.stringify(newExpense),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const saved = await response.json();

    setExpenses((prev) => [...prev, { ...newExpense, _id: saved.insertedId }]);
  };

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciador de Finanças</h1>

      <YearSelector selectedYear={selectedYear} onChange={setSelectedYear} />

      {selectedYear && (
        <MonthButtons
          selectedMonth={selectedMonth}
          onSelect={setSelectedMonth}
        />
      )}

      {selectedMonth !== null && (
        <>
          <ExpenseForm onSubmit={handleAddExpense} />
          <ExpenseSummary
            expenses={expenses.map(({ _id, ...rest }) => ({
              id: _id || "",
              ...rest,
            }))}
            year={selectedYear}
            month={selectedMonth}
            onDelete={async (id) => {
              // 1. Tenta remover do MongoDB
              await fetch(`/api/expenses/${id}`, {
                method: "DELETE",
              });

              // 2. Atualiza o estado local
              setExpenses((prev) =>
                prev.filter((expense) => expense._id !== id)
              );
            }}
          />
        </>
      )}
    </main>
  );
}
