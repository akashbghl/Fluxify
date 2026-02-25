import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden pb-16 md:pb-0 md:pl-[var(--sidebar-width)]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 ">
          {children}
        </main>
      </div>
    </div>
  );
}
