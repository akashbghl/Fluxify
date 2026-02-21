import { Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';

const Mnavbar = () => {
    const router = useRouter();
      const [loggedIn, setLoggedIn] = useState(false);
    
      useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
          setLoggedIn(true);
        }
      }, []);
  return (
    <div>
      <header className="sticky top-0 z-40  backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-white" size={22} />
            <span className="text-lg font-bold tracking-tight text-white cursor-pointer" onClick={() => router.push("/")}>
              Fluxify.io
            </span>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-gray-100 md:flex">
            <a href="#features" className="hover:text-gray-400">
              Features
            </a>
            <a href="#how" className="hover:text-gray-400">
              How it works
            </a>
            <a href="#pricing" className="hover:text-gray-400">
              Pricing
            </a>
            <a href="#faq" className="hover:text-gray-400">
              FAQ
            </a>
          </nav>

          {
            loggedIn ?
              <div>
                <PrimaryButton onClick={() => router.push("/dashboard")}>
                  Go to Dashboard
                </PrimaryButton>
              </div>
              :
              <div className="flex gap-3">
                <button
                  onClick={() => router.push("/login")}
                  className="rounded-md px-4 py-2 text-sm font-medium text-white hover:text-gray-200 hover:bg-gray-950 cursor-pointer"
                >
                  Login
                </button>

                <button
                  onClick={() => router.push("/register")}
                  className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 cursor-pointer"
                >
                  Get Started
                </button>
              </div>

          }
        </div>
      </header>
    </div>
  )
}
function PrimaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition"
    >
      {children}
    </button>
  );
}
export default Mnavbar
