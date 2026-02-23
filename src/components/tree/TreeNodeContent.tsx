import React from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { cn } from "../../lib/utils";

interface TreeNodeContentProps {
  label: string;
  isEditing: boolean;
  editLabel: string;
  onEditLabelChange: (value: string) => void;
  onToggleEdit: (active: boolean) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onAddChild: () => void;
  onDelete: () => void;
  attributes?: any;
  listeners?: any;
}

export const TreeNodeContent: React.FC<TreeNodeContentProps> = ({
  label,
  isEditing,
  editLabel,
  onEditLabelChange,
  onToggleEdit,
  onSaveEdit,
  onCancelEdit,
  onAddChild,
  onDelete,
  attributes,
  listeners,
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 bg-white cursor-grab border border-slate-100 shadow-md rounded-lg py-1.5 px-3 min-w-[120px] transition-all group",
        isEditing && "ring-2 ring-blue-500",
      )}
      {...attributes}
      {...listeners}
    >
      <div
        className="flex-1"
        onDoubleClick={(e) => {
          e.stopPropagation();
          onToggleEdit(true);
        }}
      >
        {isEditing ? (
          <input
            autoFocus
            className="w-full bg-slate-50 border-none rounded px-1 text-sm outline-none font-medium text-slate-700"
            value={editLabel}
            onChange={(e) => onEditLabelChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSaveEdit();
              if (e.key === "Escape") onCancelEdit();
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="text-sm font-semibold text-slate-800">{label}</span>
        )}
      </div>

      <div
        className={cn(
          "flex items-center gap-1 transition-opacity",
          !isEditing && "opacity-0 group-hover:opacity-100",
        )}
      >
        {isEditing ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSaveEdit();
              }}
              className="p-1 hover:bg-green-50 rounded text-green-600 transition-colors"
              title="Save"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancelEdit();
              }}
              className="p-1 hover:bg-red-50 rounded text-red-600 transition-colors"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddChild();
              }}
              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600 transition-colors"
              title="Add child"
            >
              <Plus className="w-4 h-4" />
            </button>
            <div className="flex items-center border-l border-slate-100 ml-1 pl-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleEdit(true);
                }}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
