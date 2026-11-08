"use client";

import { CheckCircle2 } from "lucide-react";

import { useAppState } from "@/components/providers/app-state-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";

type Task = {
  id: string;
  title: string;
  subtitle: string;
  completed: boolean;
};

type TodayTasksCardProps = {
  tasks: readonly Task[];
};

export function TodayTasksCard({ tasks }: TodayTasksCardProps) {
  const { toggleDailyTask } = useAppState();
  const completedCount = tasks.filter((task) => task.completed).length;

  const completionRate = Math.round((completedCount / tasks.length) * 100);

  return (
    <Card className="surface-glow border-border bg-card backdrop-blur-xl">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="font-heading text-xl text-white">
            Bugünkü Görevler
          </CardTitle>
          <Badge className="bg-white/10 text-white/72">
            {completedCount}/{tasks.length} tamamlandı
          </Badge>
        </div>

        <Progress value={completionRate} className="gap-2">
          <div className="flex w-full items-center gap-3">
            <ProgressLabel className="text-xs uppercase tracking-[0.2em] text-white/40">
              Günlük ilerleme
            </ProgressLabel>
            <ProgressValue className="text-xs text-white/55" />
          </div>
        </Progress>
      </CardHeader>

      <CardContent className="space-y-3">
        {tasks.map((task) => (
          <label
            key={task.id}
            className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 transition-colors hover:bg-white/[0.05]"
          >
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => toggleDailyTask(task.id)}
              className="mt-0.5"
            />

            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2 font-medium text-white">
                {task.title}
                {task.completed ? (
                  <CheckCircle2 className="size-4 text-zinc-300" />
                ) : null}
              </span>
              <span className="mt-1 block text-sm leading-6 text-white/45">
                {task.subtitle}
              </span>
            </span>
          </label>
        ))}
      </CardContent>
    </Card>
  );
}
