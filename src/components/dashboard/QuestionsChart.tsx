"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Question = {
  year: number;
};

type Props = {
  questions: Question[];
};

export default function QuestionsChart({ questions }: Props) {
  const data = Object.values(
    questions.reduce((acc, question) => {
      if (!acc[question.year]) {
        acc[question.year] = {
          year: question.year,
          total: 0,
        };
      }

      acc[question.year].total++;

      return acc;
    }, {} as Record<number, { year: number; total: number }>)
  ).sort((a, b) => a.year - b.year);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="mb-6 text-xl font-bold">
        Yıllara Göre Soru Sayısı
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}