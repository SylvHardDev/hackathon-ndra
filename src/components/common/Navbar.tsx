import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

const Navbar = ({ className }: HeaderProps) => {
  return (
    <header
      className={cn(
        "fixed top-0 left-0  w-full z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-10",
        className
      )}
    >
      <div className="w-full flex h-16 items-center justify-between">
        <Link
          to="#"
          className="flex items-center space-x-2 font-bold text-xl hover:text-primary transition-colors"
        >
          MPA Workboard
        </Link>

        <div className="flex items-center gap-4">
          <UserMenu />
          <div className="flex items-center gap-3">
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link to="/create-account">Get Started</Link>
              </Button>
            </>
          </div>
          <div className="border-l pl-4 dark:border-gray-800">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
