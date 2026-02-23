import React, { lazy, Suspense, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { useTreeStore } from "../../store/useTreeStore";
import { Plus, Loader2 } from "lucide-react";

const TreeNodeComponent = lazy(() => import("./TreeNode"));

const LoadingFallback = () => (
  <div className="flex items-center gap-2 p-4 text-slate-400">
    <Loader2 className="w-5 h-5 animate-spin" />
    <span className="text-sm italic">Loading...</span>
  </div>
);

export const TreeView: React.FC = () => {
  const { rootIds, nodes, moveNode, addNode } = useTreeStore();
  const [activeId, setActiveId] = useState<string | null>(null);

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
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const activeId = active.id as string;
      const overId = over.id as string;

      const overNode = nodes[overId];

      if (!overNode) {
        moveNode(activeId, null);
        return;
      }

      const targetParentId = overNode.parentId || null;
      const parentChildren = targetParentId
        ? nodes[targetParentId].children || []
        : rootIds;

      let overIndex = parentChildren.indexOf(overId);
      if (overIndex === -1) {
        overIndex = parentChildren.length;
      }

      moveNode(activeId, targetParentId, overIndex);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Tree Structure
        </h2>
        <button
          onClick={() => addNode(null, "New Node")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Root
        </button>
      </div>

      <div className="pl-4 space-y-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {rootIds.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No items yet. Click "Add Root" to start.
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              <Suspense fallback={<LoadingFallback />}>
                <SortableContext
                  items={rootIds}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-1">
                    {rootIds.map((id) => (
                      <TreeNodeComponent key={id} id={id} depth={0} />
                    ))}
                  </div>
                </SortableContext>
              </Suspense>
            </div>
          )}

          {createPortal(
            <DragOverlay>
              {activeId ? (
                <div className="opacity-80">
                  <TreeNodeComponent id={activeId} depth={0} />
                </div>
              ) : null}
            </DragOverlay>,
            document.body,
          )}
        </DndContext>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 italic text-[10px] text-slate-400">
        * Double-click to edit. Drag to reorder. Hover for actions.
      </div>
    </div>
  );
};
