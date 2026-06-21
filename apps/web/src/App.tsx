// App.tsx
import { JobDetails } from "./components/JobDetails";
import { JobForm } from "./components/JobFrom";
import { JobList } from "./components/JobList";

export function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-gray-900">Проверка URL</h1>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-6 lg:grid-cols-[380px_1fr]">
        <aside className="space-y-6">
          <section>
            <h2 className="mb-2 text-sm font-medium text-gray-700">
              Новое задание
            </h2>
            <JobForm />
          </section>
          <section>
            <h2 className="mb-2 text-sm font-medium text-gray-700">
              История заданий
            </h2>
            <JobList />
          </section>
        </aside>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-medium text-gray-700">
            Активное задание
          </h2>
          <JobDetails />
        </section>
      </main>
    </div>
  );
}
