export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">Cinarithm Studio</h1>

        <p className="mt-4 text-xl text-zinc-400">
          AI Powered Math Content Management System
        </p>

        <button
          className="
            mt-8
            rounded-xl
            bg-white
            px-6
            py-3
            font-semibold
            text-black
            transition
            hover:scale-105
          "
        >
          Başlayalım 🚀
        </button>
      </div>
    </main>
  );
}