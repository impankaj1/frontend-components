export interface KanbanCard {
  id: string;
  title: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

export interface KanbanState {
  columns: KanbanColumn[];
  addCard: (columnId: string, title: string) => void;
  removeCard: (columnId: string, cardId: string) => void;
  updateCard: (columnId: string, cardId: string, title: string) => void;
  moveCard: (activeId: string, overId: string) => void;
  reorderColumn: (activeId: string, overId: string) => void;
}
