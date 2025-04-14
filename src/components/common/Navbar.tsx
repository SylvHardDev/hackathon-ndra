import { ReactNode } from "react";

interface NavbarProps {
  children?: ReactNode;
}

export default function Navbar({ children }: NavbarProps) {
  return (
    <header className="bg-white shadow px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">MPA WorkBoard</h1>
        {children}
      </div>
    </header>
  );
}
