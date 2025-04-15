import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

interface Expense {
  date: string;
  type: string;
  amount: number;
  isRecurring?: boolean;
}

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

// Gera cópias dos gastos fixos para o mês selecionado
function getRecurringExpensesForMonth(
  expenses: Expense[],
  year: number,
  month: number
): Expense[] {
  return expenses
    .filter((e) => e.isRecurring)
    .map((e, i) => {
      const originalDate = new Date(e.date);
      return {
        ...e,
        date: new Date(year, month, originalDate.getDate()).toISOString(),
        id: `${e.type}-${month}-${i}`, // cria ID fictício para o gráfico
      };
    });
}

export const ExpenseByTypeChart = ({
  expenses,
  year,
  month,
}: ExpenseSummaryProps) => {
  const filteredExpenses = useMemo(() => {
    if (month === null) return [];

    const recurring = getRecurringExpensesForMonth(expenses, year, month);
    const normal = expenses.filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    return [...normal, ...recurring];
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

  const totalByType: Record<string, number> = {};
  filteredExpenses.forEach((exp) => {
    if (!totalByType[exp.type]) {
      totalByType[exp.type] = 0;
    }
    totalByType[exp.type] += exp.amount;
  });

  let topCategory = "";
  let maxValue = 0;
  let lowestCategory = "";
  let minValue = Infinity;

  for (const [type, total] of Object.entries(totalByType)) {
    if (total > maxValue) {
      maxValue = total;
      topCategory = type;
    }

    if (total < minValue) {
      minValue = total;
      lowestCategory = type;
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-xl w-[93vw] mx-auto flex flex-col justify-center border-2 border-black">
      <h2 className="text-lg font-bold mb-4 flex self-center border-b-2 border-green-500">
        Gastos por Tipo
      </h2>
      <div className="flex">
        <ul className="text-md">
          <li>
            {topCategory && (
              <p className=" text-gray-700 mt-2">
                • Maior gasto no mês: <strong>{topCategory}</strong> com R${" "}
                {maxValue.toFixed(2)}
              </p>
            )}
          </li>

          <li>
            {lowestCategory && (
              <p className=" text-gray-700 mt-1">
                • Menor gasto do mês: <strong>{lowestCategory}</strong> com R${" "}
                {minValue.toFixed(2)}
              </p>
            )}
          </li>
        </ul>

        {/* Gráfico */}
        <div className="-translate-x-8">
          <PieChart width={320} height={350}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Legenda */}
        <div className="flex flex-col justify-start ">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center mb-2 text-sm">
              <div
                className="w-4 h-4 mr-2 rounded"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              {entry.name} – R$ {entry.value.toFixed(2)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
