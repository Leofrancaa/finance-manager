"use client";
import React from "react";

interface MonthButtonsProps {
  selectedMonth: number;
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
}) => (
  <div className="grid grid-cols-3 gap-3 mt-4 text-black">
    {months.map((month, i) => (
      <button
        key={i}
        onClick={() => onSelect(i)}
        aria-pressed={selectedMonth === i}
        className={`p-2 rounded-md cursor-pointer transition-colors duration-300 outline-none 
          ${
            selectedMonth === i
              ? "bg-black text-white"
              : "bg-transparent border-2 border-black hover:bg-blue-500 hover:text-white"
          } 
          focus:ring-2 focus:ring-blue-400`}
      >
        {month}
      </button>
    ))}
  </div>
);
