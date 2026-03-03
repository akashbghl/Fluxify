import FloatingLines from "@/components/FloatingLines";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06070b]">

      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_15%_20%,rgba(20,184,166,0.14),transparent_32%),radial-gradient(circle_at_85%_10%,rgba(56,189,248,0.12),transparent_30%),radial-gradient(circle_at_70%_90%,rgba(45,212,191,0.1),transparent_28%)]" />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
