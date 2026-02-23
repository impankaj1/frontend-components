import { create } from "zustand";
import { nanoid } from "nanoid";
import type { TreeState, TreeData, TreeNode } from "../types/tree";
import { simulateApiCall } from "../lib/utils";

const initialNodes: TreeData = {
  "1": {
    id: "1",
    label: "Documents",
    children: ["2", "3"],
    isExpanded: true,
    isLoaded: true,
  },
  "2": {
    id: "2",
    label: "Work",
    children: ["4"],
    parentId: "1",
    isLoaded: true,
  },
  "3": { id: "3", label: "Personal", parentId: "1", isLoaded: true },
  "4": { id: "4", label: "Project A", parentId: "2", isLoaded: true },
};

export const useTreeStore = create<TreeState>((set, get) => ({
  nodes: initialNodes,
  rootIds: ["1"],

  addNode: (parentId, label) => {
    const id = nanoid();
    const newNode: TreeNode = {
      id,
      label,
      parentId: parentId || undefined,
      children: [],
      isLoaded: true,
    };

    set((state) => {
      const newNodes = { ...state.nodes, [id]: newNode };
      let newRootIds = [...state.rootIds];

      if (parentId && state.nodes[parentId]) {
        const parent = state.nodes[parentId];
        newNodes[parentId] = {
          ...parent,
          children: [...(parent.children || []), id],
          isExpanded: true,
        };
      } else {
        newRootIds.push(id);
      }

      return { nodes: newNodes, rootIds: newRootIds };
    });
  },

  removeNode: (id) => {
    set((state) => {
      const nodeToRemove = state.nodes[id];
      if (!nodeToRemove) return state;

      const newNodes = { ...state.nodes };
      const removeRecursive = (nodeId: string) => {
        const node = newNodes[nodeId];
        if (node?.children) {
          node.children.forEach(removeRecursive);
        }
        delete newNodes[nodeId];
      };

      removeRecursive(id);

      // Remove from parent's children list
      if (nodeToRemove.parentId && newNodes[nodeToRemove.parentId]) {
        const parent = newNodes[nodeToRemove.parentId];
        newNodes[nodeToRemove.parentId] = {
          ...parent,
          children: parent.children?.filter((childId) => childId !== id),
        };
      }

      const newRootIds = state.rootIds.filter((rootId) => rootId !== id);
      return { nodes: newNodes, rootIds: newRootIds };
    });
  },

  updateNode: (id, updates) => {
    set((state) => ({
      nodes: {
        ...state.nodes,
        [id]: { ...state.nodes[id], ...updates },
      },
    }));
  },

  toggleExpand: async (id) => {
    const node = get().nodes[id];
    if (!node) return;

    if (node.isExpanded) {
      get().updateNode(id, { isExpanded: false });
      return;
    }

    if (!node.isLoaded) {
      get().updateNode(id, { isLoading: true });

      const mockChildren: TreeNode[] = [
        {
          id: nanoid(),
          label: `Lazy Child 1 of ${node.label}`,
          parentId: id,
          isLoaded: true,
          children: [],
        },
        {
          id: nanoid(),
          label: `Lazy Child 2 of ${node.label}`,
          parentId: id,
          isLoaded: true,
          children: [],
        },
      ];

      await simulateApiCall(mockChildren);

      set((state) => {
        const newNodes = { ...state.nodes };
        const childIds = mockChildren.map((c) => c.id);

        mockChildren.forEach((child) => {
          newNodes[child.id] = child;
        });

        newNodes[id] = {
          ...newNodes[id],
          children: childIds,
          isExpanded: true,
          isLoading: false,
          isLoaded: true,
        };

        return { nodes: newNodes };
      });
    } else {
      get().updateNode(id, { isExpanded: true });
    }
  },

  moveNode: (activeId, targetParentId, index) => {
    set((state) => {
      const activeNode = state.nodes[activeId];
      if (!activeNode) return state;

      const newNodes = { ...state.nodes };
      let newRootIds = [...state.rootIds];

      // 1. Remove from existing parent/root
      if (activeNode.parentId && newNodes[activeNode.parentId]) {
        const oldParent = newNodes[activeNode.parentId];
        newNodes[activeNode.parentId] = {
          ...oldParent,
          children: (oldParent.children || []).filter((id) => id !== activeId),
        };
      } else {
        newRootIds = newRootIds.filter((id) => id !== activeId);
      }

      // 2. Add to new parent or root
      if (targetParentId && newNodes[targetParentId]) {
        const targetParent = newNodes[targetParentId];
        const children = [...(targetParent.children || [])];

        // If it was already in this parent, reorder
        const existingIndex = children.indexOf(activeId);
        if (existingIndex !== -1) {
          children.splice(existingIndex, 1);
        }

        if (typeof index === "number") {
          children.splice(index, 0, activeId);
        } else {
          children.push(activeId);
        }

        newNodes[targetParentId] = {
          ...targetParent,
          children,
          isExpanded: true,
        };
        newNodes[activeId] = { ...activeNode, parentId: targetParentId };
      } else if (targetParentId === null) {
        // Root move
        const existingIndex = newRootIds.indexOf(activeId);
        if (existingIndex !== -1) {
          newRootIds.splice(existingIndex, 1);
        }

        if (typeof index === "number") {
          newRootIds.splice(index, 0, activeId);
        } else {
          newRootIds.push(activeId);
        }
        newNodes[activeId] = { ...activeNode, parentId: undefined };
      }

      return { nodes: newNodes, rootIds: newRootIds };
    });
  },
}));
