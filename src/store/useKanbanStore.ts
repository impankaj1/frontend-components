import { create } from "zustand";
import { nanoid } from "nanoid";
import type { KanbanState, KanbanColumn } from "../types/kanban";
import { arrayMove } from "@dnd-kit/sortable";

const initialColumns: KanbanColumn[] = [
  {
    id: "todo",
    title: "Todo",
    cards: [
      { id: "1", title: "Task 1" },
      { id: "2", title: "Task 2" },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    cards: [{ id: "3", title: "Task 3" }],
  },
  { id: "done", title: "Done", cards: [] },
];

export const useKanbanStore = create<KanbanState>((set) => ({
  columns: initialColumns,

  addCard: (columnId, title) => {
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === columnId
          ? { ...col, cards: [...col.cards, { id: nanoid(), title }] }
          : col,
      ),
    }));
  },

  removeCard: (columnId, cardId) => {
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter((card) => card.id !== cardId) }
          : col,
      ),
    }));
  },

  updateCard: (columnId, cardId, title) => {
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.map((card) =>
                card.id === cardId ? { ...card, title } : card,
              ),
            }
          : col,
      ),
    }));
  },

  moveCard: (activeId, overId) => {
    set((state) => {
      const activeCol = state.columns.find((col) =>
        col.cards.some((card) => card.id === activeId),
      );
      const overCol = state.columns.find(
        (col) =>
          col.id === overId || col.cards.some((card) => card.id === overId),
      );

      if (!activeCol || !overCol) return state;

      const activeIndex = activeCol.cards.findIndex(
        (card) => card.id === activeId,
      );
      const overIndex =
        overCol.id === overId
          ? overCol.cards.length
          : overCol.cards.findIndex((card) => card.id === overId);

      const activeCard = activeCol.cards[activeIndex];

      if (activeCol.id === overCol.id) {
        return {
          columns: state.columns.map((col) =>
            col.id === activeCol.id
              ? { ...col, cards: arrayMove(col.cards, activeIndex, overIndex) }
              : col,
          ),
        };
      }

      return {
        columns: state.columns.map((col) => {
          if (col.id === activeCol.id) {
            return {
              ...col,
              cards: col.cards.filter((card) => card.id !== activeId),
            };
          }
          if (col.id === overCol.id) {
            const newCards = [...col.cards];
            newCards.splice(overIndex, 0, activeCard);
            return { ...col, cards: newCards };
          }
          return col;
        }),
      };
    });
  },

  reorderColumn: (activeId, overId) => {
    set((state) => {
      const activeIndex = state.columns.findIndex((col) => col.id === activeId);
      const overIndex = state.columns.findIndex((col) => col.id === overId);
      return {
        columns: arrayMove(state.columns, activeIndex, overIndex),
      };
    });
  },
}));
