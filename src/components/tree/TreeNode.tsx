import React, { useState, lazy, Suspense } from "react";
import { useTreeStore } from "../../store/useTreeStore";
import { cn } from "../../lib/utils";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AlertModal } from "../ui/AlertDialog";
import { TreeNodeAvatar } from "./TreeNodeAvatar";
import { TreeNodeContent } from "./TreeNodeContent";
import { ChildNodeInput } from "./ChildNodeInput";

const RecursiveTreeNode = lazy(() => import("./TreeNode"));

const RecursiveLoading = () => (
  <div className="py-1 pl-4 text-[10px] text-slate-400 italic animate-pulse">
    Loading...
  </div>
);

interface TreeNodeProps {
  id: string;
  depth: number;
}

const TreeNodeComponent: React.FC<TreeNodeProps> = ({ id, depth }) => {
  const { nodes, toggleExpand, addNode, removeNode, updateNode } =
    useTreeStore();
  const node = nodes[id];

  const hasChildren = node?.children && node.children.length > 0;
  const canExpand = hasChildren || node?.isLoading;

  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(node?.label || "");
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [newChildLabel, setNewChildLabel] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!node) return null;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canExpand) {
      toggleExpand(id);
    }
  };

  const handleEdit = () => {
    if (editLabel.trim()) {
      updateNode(id, { label: editLabel });
      setIsEditing(false);
    }
  };

  const handleAddChild = () => {
    if (newChildLabel.trim()) {
      addNode(id, newChildLabel);
      setNewChildLabel("");
      setIsAddingChild(false);
    }
  };

  const levelLetter = String.fromCharCode(65 + (depth % 26));
  const levelColors = [
    "bg-blue-500 shadow-blue-200",
    "bg-lime-500 shadow-lime-200",
    "bg-green-500 shadow-green-200",
    "bg-emerald-500 shadow-emerald-200",
  ];
  const levelColor = levelColors[depth % levelColors.length];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("relative", isDragging && "opacity-50")}
    >
      <AlertModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => removeNode(id)}
        title="Delete Node"
        description={`Are you sure you want to delete "${node.label}" and all its contents? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />

      {/* Vertical Line for siblings/depth */}
      {depth > 0 && (
        <div className="absolute -left-6 top-0 bottom-0 border-l border-dashed border-slate-500 transform translate-x-3" />
      )}

      <div className="flex items-center gap-4 relative py-2">
        {/* Horizontal Stem */}
        {depth > 0 && (
          <div className="absolute -left-6 top-1/2 w-6 border-t border-dashed border-slate-500 transform -translate-y-1/2 translate-x-3" />
        )}

        <TreeNodeAvatar
          levelLetter={levelLetter}
          levelColor={levelColor}
          isLoading={!!node.isLoading}
          isExpanded={!!node.isExpanded}
          canExpand={!!canExpand}
          onToggle={handleToggle}
        />

        <TreeNodeContent
          label={node.label}
          isEditing={isEditing}
          editLabel={editLabel}
          onEditLabelChange={setEditLabel}
          onToggleEdit={setIsEditing}
          onSaveEdit={handleEdit}
          onCancelEdit={() => {
            setIsEditing(false);
            setEditLabel(node.label);
          }}
          onAddChild={() => setIsAddingChild(true)}
          onDelete={() => setIsConfirmOpen(true)}
          attributes={attributes}
          listeners={listeners}
        />
      </div>

      {isAddingChild && (
        <ChildNodeInput
          value={newChildLabel}
          onChange={setNewChildLabel}
          onSave={handleAddChild}
          onCancel={() => setIsAddingChild(false)}
        />
      )}

      {/* Children Section */}
      {node.isExpanded && canExpand && (
        <div className="relative ml-14">
          <div className="absolute left-[-36px] top-[-8px] bottom-6 border-l border-dashed border-slate-300 translate-x-5" />
          <div className="space-y-1">
            {hasChildren ? (
              <Suspense fallback={<RecursiveLoading />}>
                <SortableContext
                  items={node.children!}
                  strategy={verticalListSortingStrategy}
                >
                  {node.children!.map((childId) => (
                    <RecursiveTreeNode
                      key={childId}
                      id={childId}
                      depth={depth + 1}
                    />
                  ))}
                </SortableContext>
              </Suspense>
            ) : (
              <div className="py-2 pl-4 text-xs text-slate-400 italic">
                No items
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default TreeNodeComponent;
