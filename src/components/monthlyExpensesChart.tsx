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

interface MonthlyExpensesChartProps {
  expenses: Expense[];
  year: number;
}

export const MonthlyExpensesChart: React.FC<MonthlyExpensesChartProps> = ({
  expenses,
  year,
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

  // Verifica se existem gastos em algum mês
  const hasData = monthlyTotals.some((m) => m.value > 0);

  return (
    <div className="bg-white p-4 rounded-lg shadow-xl w-[93vw] mx-auto flex flex-col border-2 border-black my-6">
      <h2 className="text-xl font-bold mb-4 flex self-center border-b-2 border-green-500">
        Gastos Mensais em {year}
      </h2>
      {hasData ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={monthlyTotals}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
            <Bar dataKey="value">
              {monthlyTotals.map((data, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    data.value === 0 ? "#F1F1F1" : COLORS[index % COLORS.length]
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center text-gray-500 m-12 font-medium">
          Nenhum gasto lançado em {year}.
        </div>
      )}
    </div>
  );
};
