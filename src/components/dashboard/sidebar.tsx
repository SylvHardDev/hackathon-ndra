import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Home,
  Users,
  FolderKanban,
  ChartNoAxesCombined,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "./theme-provider";
import { ThemeToggle } from "../common/ThemeToggle";
import logoMpa from "@/assets/Logo_MP_Agency-removebg.png";
import { Separator } from "../ui/separator";
import { UserMenu } from "../common/UserMenu";
import { useRole } from "@/hooks/useRole";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "statistique",
    url: "/dashboard",
    icon: ChartNoAxesCombined,
    adminOnly: true,
  },
  {
    title: "Gestion des utilisateurs",
    url: "/users",
    icon: Users,
    adminOnly: true,
  },
  {
    title: "Gestion des projets",
    url: "/projects",
    icon: FolderKanban,
  },
];

export function AppSidebar() {
  const { isAdmin } = useRole();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <div
        className={cn(
          "min-h-screen border-r bg-card px-3 py-4 transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="h-full flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              {!collapsed && (
                <Link to="/">
                  <div className="flex gap-2 items-center">
                    <img src={logoMpa} alt="logo MPA" className="h-12 w-12" />
                    <h2 className="text-lg font-semibold tracking-tight">
                      MPA WorkBoard
                    </h2>
                  </div>
                </Link>
              )}
              <button
                onClick={toggleSidebar}
                className="rounded-lg p-2 hover:bg-accent"
              >
                {collapsed ? (
                  <PanelRightClose color="lightgray" className="h-5 w-5 " />
                ) : (
                  <PanelRightOpen color="lightgray" className="h-5 w-5" />
                )}
              </button>
            </div>
            <Separator orientation="horizontal" className="my-2" />
            <nav className="space-y-2">
              {items
                .filter((item) => !(item.adminOnly && !isAdmin))
                .map((item) => (
                  <NavLink
                    key={item.title}
                    to={item.url}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground",
                        collapsed && "justify-center px-2"
                      )
                    }
                    title={collapsed ? item.title : ""}
                  >
                    <item.icon className="h-5 w-5" />
                    {!collapsed && item.title}
                  </NavLink>
                ))}
            </nav>
          </div>

          <div className="">
            <Separator orientation="horizontal" className="my-2" />
            <div className="flex items-center justify-between">
              <div>
                <UserMenu />
              </div>
              <div>
                {!collapsed && (
                  <div className="">
                    <ThemeToggle />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
