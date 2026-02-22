import FloatingLines from "@/components/FloatingLines";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
         {/* floating lines background */}
      <div className="absolute inset-0 z-0">
        <FloatingLines
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={5}
          lineDistance={5}
          bendRadius={5}
          bendStrength={-0.7}
          interactive
          parallax
        />
      </div>

      {/* blobs */}
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-purple-300 opacity-30 blur-3xl animate-pulse" />
      <div className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-indigo-300 opacity-30 blur-3xl animate-pulse delay-1000" />

      {/* Page Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}