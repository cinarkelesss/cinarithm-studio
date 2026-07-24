"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Bir hata oluştu.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-4 text-xl font-bold">
        🤖 Hüso AI
      </h2>

      <div className="mb-4 h-72 overflow-y-auto space-y-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.role === "user"
                ? "text-right"
                : "text-left"
            }
          >
            <div className="inline-block rounded-xl bg-black/30 px-4 py-2">
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Bu ders hakkında soru sor..."
        className="w-full rounded-xl bg-black/20 p-3 outline-none"
      />

      <button
        onClick={sendMessage}
        disabled={loading}
        className="mt-4 w-full rounded-xl bg-sky-500 py-3 font-semibold hover:bg-sky-400 disabled:opacity-50"
      >
        {loading ? "Düşünüyor..." : "Gönder"}
      </button>
    </div>
  );
}