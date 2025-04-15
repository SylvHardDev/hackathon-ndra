import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Calendar, ChevronLeft, ChevronRight, Home, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "./theme-provider";
import { ThemeToggle } from "../common/ThemeToggle";

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Profile",
    url: "/profiledashboard",
    icon: Users,
  },
  {
    title: "Gestion des utilisateurs",
    url: "/users",
    icon: Users,
  },
  {
    title: "Gestion des projets",
    url: "/projects",
    icon: Calendar,
  },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <ThemeProvider
     defaultTheme="system" storageKey="ui-theme">
      <div 
        className={cn(
          "min-h-screen border-r bg-card px-3 py-4 transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="mb-8 flex justify-between items-center">
          {!collapsed && (
            <h2 className="px-4 text-lg font-semibold tracking-tight">
              Dashboard
            </h2>
          )}
          <button 
            onClick={toggleSidebar} 
            className="rounded-lg p-2 hover:bg-accent"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
        {!collapsed && (
          <div className="mb-4 px-4">
            <ThemeToggle />
          </div>
        )}
        <nav className="space-y-2">
          {items.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  collapsed && "justify-center px-2"
                )
              }
              title={collapsed ? item.title : ""}
            >
              <item.icon className="h-4 w-4" />
              {!collapsed && item.title}
            </NavLink>
          ))}
        </nav>
      </div>
    </ThemeProvider>
  );
}
