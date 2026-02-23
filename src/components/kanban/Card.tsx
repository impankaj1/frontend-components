import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, Edit2, Check, X } from "lucide-react";
import { useKanbanStore } from "../../store/useKanbanStore";
import { cn } from "../../lib/utils";
import type { KanbanCard } from "../../types/kanban";
import { AlertModal } from "../ui/AlertDialog";

interface CardProps {
  card: KanbanCard;
  columnId: string;
}

export const Card: React.FC<CardProps> = ({ card, columnId }) => {
  const { removeCard, updateCard } = useKanbanStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "Card",
      card,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const handleEdit = () => {
    if (editTitle.trim()) {
      updateCard(columnId, card.id, editTitle);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white p-3 rounded-lg shadow-sm border border-slate-200 group relative select-none cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 ring-2 ring-blue-500",
      )}
      {...attributes}
      {...listeners}
    >
      <AlertModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => removeCard(columnId, card.id)}
        title="Delete Card"
        description={`Are you sure you want to delete "${card.title}"? This task will be permanently removed.`}
        confirmText="Delete"
        variant="danger"
      />
      {isEditing ? (
        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <textarea
            autoFocus
            className="w-full bg-slate-50 border rounded p-1 text-sm outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEdit();
              if (e.key === "Escape") setIsEditing(false);
            }}
          />
          <div className="flex flex-col gap-1">
            <button
              onClick={handleEdit}
              className="text-green-600 hover:bg-green-50 p-1 rounded"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-red-600 hover:bg-red-50 p-1 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-start gap-2">
          <p className="text-sm font-medium text-slate-700">{card.title}</p>
          <div
            className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsEditing(true)}
              className="text-slate-400 hover:text-blue-600 p-1 rounded"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsConfirmOpen(true)}
              className="text-slate-400 hover:text-red-600 p-1 rounded"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
