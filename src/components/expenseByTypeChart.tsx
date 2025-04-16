import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
} from "recharts";

import { Expense } from "@/app/interfaces/expense"; // 👈 ajuste o caminho se necessário

interface ExpenseSummaryProps {
  expenses: Expense[];
  year: number;
  month: number | null;
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#d0ed57",
  "#a4de6c",
];

export const ExpenseByTypeChart = ({
  expenses,
  year,
  month,
}: ExpenseSummaryProps) => {
  const filteredExpenses = useMemo(() => {
    if (month === null) return [];

    return expenses.filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [expenses, year, month]);

  const data = useMemo(() => {
    const totals: Record<string, number> = {};
    filteredExpenses.forEach((e) => {
      if (!totals[e.type]) totals[e.type] = 0;
      totals[e.type] += e.amount;
    });

    return Object.entries(totals).map(([type, total]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: total,
    }));
  }, [filteredExpenses]);

  let topCategory = "";
  let maxValue = 0;
  let lowestCategory = "";
  let minValue = Infinity;

  for (const { name, value } of data) {
    if (value > maxValue) {
      maxValue = value;
      topCategory = name;
    }
    if (value < minValue) {
      minValue = value;
      lowestCategory = name;
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-xl w-[93vw] mx-auto flex flex-col justify-center items-center border-2 border-black">
      <h2 className="text-lg font-bold mb-4 border-b-2 border-green-500">
        Gastos por Tipo
      </h2>
      <div className="flex w-full justify-between px-16">
        <ul className="text-md w-1/3">
          <li>
            {topCategory && (
              <p className="text-gray-700 mt-2">
                • Maior gasto no mês: <strong>{topCategory}</strong> com R${" "}
                {maxValue.toFixed(2)}
              </p>
            )}
          </li>
          <li>
            {lowestCategory && (
              <p className="text-gray-700 mt-1">
                • Menor gasto do mês: <strong>{lowestCategory}</strong> com R${" "}
                {minValue.toFixed(2)}
              </p>
            )}
          </li>
        </ul>

        <div className="w-2/3 h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 20, right: 40, bottom: 20, left: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
