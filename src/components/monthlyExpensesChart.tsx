import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#a0522d",
  "#8a2be2",
  "#00ced1",
  "#ff1493",
  "#2e8b57",
  "#ff6347",
  "#20b2aa",
  "#9370db",
];

interface Expense {
  date: string;
  amount: number;
}

export const MonthlyExpensesChart = ({
  expenses,
  year,
}: {
  expenses: Expense[];
  year: number;
}) => {
  // Agrupa os gastos por mês
  const monthlyTotals = Array.from({ length: 12 }, (_, month) => {
    const total = expenses
      .filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      name: new Date(0, month).toLocaleString("pt-BR", { month: "short" }),
      value: total,
    };
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow-xl w-[80vw] mx-auto flex flex-col justify-center border-2 border-black">
      <h2 className="text-xl font-bold mb-4">Gastos Mensais em {year}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyTotals}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value">
            {monthlyTotals.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
