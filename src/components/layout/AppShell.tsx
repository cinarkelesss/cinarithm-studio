import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
  <Topbar />

  <main className="flex-1 p-8">
    {children}
  </main>
</div>
    </div>
  );
}