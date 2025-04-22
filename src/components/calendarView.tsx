import React from "react";
import { CalendarViewProps } from "../app/interfaces/calendarProps";
import { Expense } from "../app/interfaces/expense";
import { monthName } from "../app/utils/monthName";

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

  // Opção: detecta o dia de hoje para highlight
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;
  const todayNum = isCurrentMonth ? today.getDate() : -1;

  // (Opcional) nome dos dias da semana, pode ser removido se preferir sem header
  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

  return (
    <div className="border-black border-2 p-6 rounded-md flex flex-col justify-center mx-auto w-[93vw] bg-white my-4">
      <h2 className="text-xl font-bold mb-4 self-center border-b-2 border-green-500">
        Gastos Mensais em {monthName(month)} de {year}
      </h2>

      {/* Nomes dos dias da semana para grid */}
      <div className="grid grid-cols-7 text-center font-semibold mb-2 text-gray-500">
        {weekDays.map((wd, idx) => (
          <div key={idx}>{wd}</div>
        ))}
      </div>

      {/* Células dos dias */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dailyExpenses = expensesByDay[day] || [];
          const total = dailyExpenses.reduce((sum, e) => sum + e.amount, 0);

          const isToday = day === todayNum;

          // Highlight dias sem gastos ou com valor alto
          let boxClass =
            "border p-2 rounded shadow-sm text-xs min-h-[76px] transition bg-gray-100";
          if (isToday) boxClass += " border-blue-500 bg-blue-50 font-bold";
          if (total >= 200) boxClass += " border-red-400 bg-red-50"; // Valor alto, ajuste o valor se quiser

          return (
            <div
              key={day}
              className={boxClass}
              aria-label={
                dailyExpenses.length > 0
                  ? `Dia ${day}, total de R$ ${total.toFixed(2)}, ${
                      dailyExpenses.length
                    } despesas`
                  : `Dia ${day}, sem gastos`
              }
            >
              <div
                className={
                  "font-semibold mb-1 flex items-center gap-1 justify-center " +
                  (isToday ? "text-blue-600" : "text-gray-800")
                }
              >
                Dia {day} {isToday && <span title="Hoje">⭐</span>}
              </div>
              {dailyExpenses.length > 0 ? (
                <>
                  <div className="text-black mb-1">
                    <span className="text-xs">Total:</span>{" "}
                    <span className="font-bold">R$ {total.toFixed(2)}</span>
                  </div>
                  <ul className="space-y-1">
                    {dailyExpenses.map((exp) => (
                      <li
                        key={exp.id || exp.date + exp.amount}
                        className="text-gray-600"
                        title={exp.note || ""}
                      >
                        - {exp.type.charAt(0).toUpperCase() + exp.type.slice(1)}
                        {exp.note && (
                          <span className="italic text-gray-400">
                            {" "}
                            ({exp.note})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
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
