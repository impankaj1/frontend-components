import React from "react";

interface PageSectionProps {
  title: string;
  children: React.ReactNode;
}

export const PageSection: React.FC<PageSectionProps> = ({
  title,
  children,
}) => {
  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-2">
        <div className="h-8 w-1 bg-blue-600 rounded-full" />
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      </div>
      {children}
    </section>
  );
};
