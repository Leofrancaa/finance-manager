"use client";
import React from "react";

interface MonthButtonsProps {
  selectedMonth: number | null;
  onSelect: (month: number) => void;
}

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

export const MonthButtons: React.FC<MonthButtonsProps> = ({
  selectedMonth,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-3 gap-2 mt-4 text-black">
      {months.map((month, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`p-2 rounded-md cursor-pointer hover:bg-blue-500 ${
            selectedMonth === i ? "bg-blue-500 text-black" : "bg-gray-200"
          }`}
        >
          {month}
        </button>
      ))}
    </div>
  );
};
