import React, { useState } from "react";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, MoreHorizontal } from "lucide-react";
import { useKanbanStore } from "../../store/useKanbanStore";
import { Card } from "./Card";
import { cn } from "../../lib/utils";
import type { KanbanColumn } from "../../types/kanban";

interface ColumnProps {
  column: KanbanColumn;
}

export const Column: React.FC<ColumnProps> = ({ column }) => {
  const { addCard } = useKanbanStore();
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      addCard(column.id, newCardTitle);
      setNewCardTitle("");
      setIsAddingCard(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-col bg-slate-100 rounded-xl w-full h-full min-h-[500px] border border-transparent transition-colors",
        isDragging && "opacity-50 border-blue-500 bg-blue-50",
      )}
    >
      <div
        className="flex items-center justify-between p-4 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-700">{column.title}</h3>
          <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {column.cards.length}
          </span>
        </div>
        <button className="text-slate-400 hover:text-slate-600 p-1 rounded">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col gap-3 p-4 pt-0 overflow-y-auto overflow-x-hidden flex-1">
        <SortableContext
          items={column.cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.map((card) => (
            <Card key={card.id} card={card} columnId={column.id} />
          ))}
        </SortableContext>

        {isAddingCard ? (
          <div className="bg-white p-3 rounded-lg shadow-sm border-2 border-dashed border-blue-200">
            <textarea
              autoFocus
              className="w-full bg-slate-50 border rounded p-1 text-sm outline-none resize-none"
              placeholder="Enter card title..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCard();
                }
                if (e.key === "Escape") setIsAddingCard(false);
              }}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleAddCard}
                className="bg-blue-600 text-white text-[10px] px-3 py-1.5 rounded font-bold hover:bg-blue-700"
              >
                Add Card
              </button>
              <button
                onClick={() => setIsAddingCard(false)}
                className="text-slate-500 text-[10px] px-3 py-1.5 hover:bg-slate-50 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 hover:bg-white p-2 rounded-lg transition-all text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Add a card
          </button>
        )}
      </div>
    </div>
  );
};
