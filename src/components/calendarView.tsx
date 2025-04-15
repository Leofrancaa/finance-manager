import React from "react";

interface Expense {
  date: string;
  amount: number;
  type: string;
  note?: string;
}

interface CalendarViewProps {
  year: number;
  month: number; // de 0 a 11
  expenses: Expense[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  year,
  month,
  expenses,
}) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Agrupa despesas por dia
  const expensesByDay = expenses.reduce<Record<number, Expense[]>>(
    (acc, expense) => {
      const expenseDate = new Date(expense.date);
      const day = expenseDate.getDate();
      if (!acc[day]) acc[day] = [];
      acc[day].push(expense);
      return acc;
    },
    {}
  );

  const monthName = (monthNumber: number) => {
    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return months[monthNumber] || "";
  };

  return (
    <div className="border-black border-2 p-6 rounded-md flex justify-center flex-col">
      <h2 className="text-xl font-bold mb-4 flex self-center border-b-2 border-green-500">
        Gastos Mensais em {monthName(month)}
      </h2>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dailyExpenses = expensesByDay[day] || [];
          const total = dailyExpenses.reduce((sum, e) => sum + e.amount, 0);

          return (
            <div
              key={day}
              className="border p-2 rounded shadow-sm bg-gray-100 text-sm"
            >
              <div className="font-bold">Dia {day}</div>
              {dailyExpenses.length > 0 ? (
                <div>
                  <div>Total: R$ {total.toFixed(2)}</div>
                  {dailyExpenses.map((exp, idx) => (
                    <div key={idx} className="text-xs text-gray-600">
                      - {exp.type} {exp.note && `(${exp.note})`}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400">Sem gastos</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
