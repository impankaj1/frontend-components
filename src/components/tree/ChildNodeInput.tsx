import React, { useEffect, useRef } from "react";
import { Check, X } from "lucide-react";

interface ChildNodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ChildNodeInput: React.FC<ChildNodeInputProps> = ({
  value,
  onChange,
  onSave,
  onCancel,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className="flex items-center gap-2 py-2 px-4 ml-14 relative"
      style={{ marginLeft: "56px" }}
    >
      <div className="absolute left-[-28px] top-0 bottom-0 border-l border-dashed border-slate-300" />
      <div className="absolute left-[-28px] top-1/2 w-7 border-t border-dashed border-slate-300" />
      <input
        ref={inputRef}
        className="bg-white border shadow-sm rounded-lg px-2 py-1 text-sm outline-none w-full max-w-[150px]"
        placeholder="Name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave();
          if (e.key === "Escape") onCancel();
        }}
      />
      <button
        onClick={onSave}
        className="text-green-600 p-1 hover:bg-green-50 rounded"
      >
        <Check className="w-4 h-4" />
      </button>
      <button
        onClick={onCancel}
        className="text-red-600 p-1 hover:bg-red-50 rounded"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
