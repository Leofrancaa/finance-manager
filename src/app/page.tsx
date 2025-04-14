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
    const totalInstallments = data.installments
      ? parseInt(data.installments)
      : 1;
    const baseDate = new Date(selectedYear, selectedMonth!, parseInt(data.day));
    const valuePerInstallment = parseFloat(data.amount) / totalInstallments;

    const generatedExpenses: Expense[] = Array.from(
      { length: totalInstallments },
      (_, i) => {
        const installmentDate = new Date(baseDate);
        installmentDate.setMonth(baseDate.getMonth() + i); // distribui mês a mês

        return {
          type: data.type,
          date: installmentDate.toISOString(),
          amount: parseFloat(valuePerInstallment.toFixed(2)), // evita quebrar com float maluco
          paymentMethod: data.paymentMethod,
          installments: totalInstallments,
        };
      }
    );

    // Envia cada parcela pro backend e atualiza o estado local
    for (const expense of generatedExpenses) {
      const response = await fetch("/api/expenses", {
        method: "POST",
        body: JSON.stringify(expense),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const saved = await response.json();

      setExpenses((prev) => [...prev, { ...expense, _id: saved.insertedId }]);
    }
  };

  return (
    <main className="w-[80vw] mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciador de Finanças</h1>

      <YearSelector selectedYear={selectedYear} onChange={setSelectedYear} />

      <div className="flex gap-4">
        <div className="w-[40vw]">
          {selectedYear && (
            <MonthButtons
              selectedMonth={selectedMonth}
              onSelect={setSelectedMonth}
            />
          )}

          {selectedMonth !== null && (
            <>
              <ExpenseForm onSubmit={handleAddExpense} />
            </>
          )}
        </div>
        <div className="w-[40vw]">
          {selectedMonth !== null && (
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
          )}
        </div>
      </div>
    </main>
  );
}
