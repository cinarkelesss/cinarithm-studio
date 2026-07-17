"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Question = {
  exam: string;
};

type Props = {
  questions: Question[];
};

const COLORS = ["#3b82f6", "#8b5cf6"];

export default function ExamDistributionChart({
  questions,
}: Props) {
  const tyt = questions.filter((q) => q.exam === "TYT").length;
  const ayt = questions.filter((q) => q.exam === "AYT").length;

  const data = [
    { name: "TYT", value: tyt },
    { name: "AYT", value: ayt },
  ];

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="mb-6 text-xl font-bold">
        TYT / AYT Dağılımı
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={100}
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}