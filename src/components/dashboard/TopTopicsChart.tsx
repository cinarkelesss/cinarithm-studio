"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Question = {
  topic: string;
};

type Props = {
  questions: Question[];
};

export default function TopTopicsChart({ questions }: Props) {
  const topicMap = questions.reduce((acc, question) => {
    acc[question.topic] = (acc[question.topic] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(topicMap)
    .map(([topic, total]) => ({
      topic,
      total,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="mb-6 text-xl font-bold">
        En Çok Çıkan Konular
      </h2>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <XAxis type="number" />
            <YAxis
              dataKey="topic"
              type="category"
              width={120}
            />
            <Tooltip />
            <Bar dataKey="total" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}