import React from "react";
import { useJobsStore } from "../store/jobs.store";

const defaultUrls = [
  "https://google.com",
  "htpps://github.com",
  "https://yandex.ru",
  "https://mail.ru",
  "https://vk.com",
  "https://ya.ru",
  "https://hubr.com",
  "https://habr.com",
  "https://youtube.com",
  "https://nestjs.com",
  "https://t.me",
];

export function JobForm(): React.ReactElement {
  const [text, setText] = React.useState(defaultUrls.join("\n"));
  const createJob = useJobsStore((s) => s.createJob);
  const isSubmitting = useJobsStore((s) => s.isSubitting);
  const handleSumbit = (e: React.SubmitEvent) => {
    e.preventDefault();
    const urls = text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (urls.length === 0) return;

    createJob(urls);
    setText(defaultUrls.join("\n"));
  };

  return (
    <form onSubmit={handleSumbit} className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="https://google.com&#10;htpps://github.com"
        rows={6}
        className="w-full rounded-lg border border-gray-500 p-3 text-sm focus:border-b-blue-900 focus:outline-none"
      />
      <button
        type="submit"
        disabled={isSubmitting || text.trim().length === 0}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {isSubmitting ? "Загрузка..." : "Запустить проверку"}
      </button>
    </form>
  );
}
