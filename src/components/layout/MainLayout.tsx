import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { cn } from "../../lib/utils";

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Component Suite
            </h1>
            <p className="text-slate-500 mt-1">
              Interactive React Implementations
            </p>
          </div>

          <nav className="flex gap-2 bg-slate-200/50 p-1 rounded-lg self-start">
            <NavLink
              to="/tree"
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all",
                  isActive
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200",
                )
              }
            >
              Tree View
            </NavLink>
            <NavLink
              to="/kanban"
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all",
                  isActive
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200",
                )
              }
            >
              Kanban Board
            </NavLink>
          </nav>
        </header>

        <main className="min-h-[600px]">
          <Outlet />
        </main>

        <footer className="pt-12 border-t text-center text-slate-400 text-sm">
          Built with React, TypeScript, Zustand, and DnD Kit
        </footer>
      </div>
    </div>
  );
};
