import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { useKanbanStore } from "../../store/useKanbanStore";
import { Column } from "./Column";
import { Card } from "./Card";
import type { KanbanCard, KanbanColumn } from "../../types/kanban";

export const KanbanBoard: React.FC = () => {
  const { columns, moveCard, reorderColumn } = useKanbanStore();
  const [activeColumn, setActiveColumn] = useState<KanbanColumn | null>(null);
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current;

    if (data?.type === "Column") {
      setActiveColumn(data.column);
    } else if (data?.type === "Card") {
      // Find which column the card belongs to
      const column = columns.find((col) =>
        col.cards.some((c) => c.id === active.id),
      );
      if (column) {
        setActiveCard(data.card);
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isActiveACard = active.data.current?.type === "Card";

    if (isActiveACard) {
      moveCard(activeId, overId);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveColumn(null);
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (active.data.current?.type === "Column") {
      reorderColumn(activeId, overId);
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 min-h-[600px] px-2 overflow-x-auto min-w-max md:min-w-0 md:grid md:grid-cols-3">
          <SortableContext
            items={columns.map((col) => col.id)}
            strategy={horizontalListSortingStrategy}
          >
            {columns.map((column) => (
              <Column key={column.id} column={column} />
            ))}
          </SortableContext>
        </div>

        {createPortal(
          <DragOverlay
            dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: {
                  active: {
                    opacity: "0.5",
                  },
                },
              }),
            }}
          >
            {activeColumn && <Column column={activeColumn} />}
            {activeCard && (
              <div className="w-[300px]">
                <Card
                  card={activeCard}
                  columnId={
                    columns.find((col) =>
                      col.cards.some((c) => c.id === activeCard.id),
                    )?.id || ""
                  }
                />
              </div>
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  );
};
