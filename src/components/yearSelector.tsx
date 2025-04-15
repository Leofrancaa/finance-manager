"use client";
import React from "react";

interface YearSelectorProps {
  selectedYear: number;
  onChange: (year: number) => void;
}

export const YearSelector: React.FC<YearSelectorProps> = ({
  selectedYear,
  onChange,
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2024 }, (_, i) => 2025 + i);

  return (
    <select
      className="p-2 border rounded-md bg-white text-black cursor-pointer w-36"
      value={selectedYear}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
};
