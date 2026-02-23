export interface TreeNode {
  id: string;
  label: string;
  children?: string[];
  parentId?: string;
  isExpanded?: boolean;
  isLoading?: boolean;
  isLoaded?: boolean;
}

export type TreeData = Record<string, TreeNode>;

export interface TreeState {
  nodes: TreeData;
  rootIds: string[];
  addNode: (parentId: string | null, label: string) => void;
  removeNode: (id: string) => void;
  updateNode: (id: string, updates: Partial<TreeNode>) => void;
  toggleExpand: (id: string) => Promise<void>;
  moveNode: (
    activeId: string,
    targetParentId: string | null,
    index?: number,
  ) => void;
}
