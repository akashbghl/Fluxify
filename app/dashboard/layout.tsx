import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen overflow-hidden pb-16 md:pb-0 md:pl-[var(--sidebar-width)]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="relative flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-4 md:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.08),_transparent_35%)]" />
          <div className="relative text-black">{children}</div>
        </main>
      </div>
    </div>
  );
}
