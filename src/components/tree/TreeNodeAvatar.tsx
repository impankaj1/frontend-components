import React from "react";
import { ChevronRight, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface TreeNodeAvatarProps {
  levelLetter: string;
  levelColor: string;
  isLoading?: boolean;
  isExpanded?: boolean;
  canExpand: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

export const TreeNodeAvatar: React.FC<TreeNodeAvatarProps> = ({
  levelLetter,
  levelColor,
  isLoading,
  isExpanded,
  canExpand,
  onToggle,
}) => {
  return (
    <div
      className={cn(
        "relative w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10 cursor-pointer transition-transform active:scale-95 hover:scale-105",
        levelColor,
      )}
      onClick={onToggle}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : levelLetter}
      {canExpand && (
        <div
          className={cn(
            "absolute -right-1 -bottom-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border shadow-sm",
            isExpanded ? "text-blue-500" : "text-slate-400",
          )}
        >
          {isExpanded ? (
            <ChevronDown className="w-2.5 h-2.5" />
          ) : (
            <ChevronRight className="w-2.5 h-2.5" />
          )}
        </div>
      )}
    </div>
  );
};
