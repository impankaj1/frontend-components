# Frontend Components Library

A collection of high-performance, beautiful, and accessible React components built with TypeScript, Tailwind CSS, and dnd-kit.

## 🚀 Features

### 🌲 Advanced Tree View
- **Nested Hierarchy**: Support for infinite deep structures with a unified node model.
- **Drag & Drop**: Seamlessly reorder siblings or move nodes between parents using `@dnd-kit`.
- **Lazy Loading**: Optimized performance using `React.lazy` and `Suspense` for recursive rendering.
- **Inline Editing**: Double-click to edit labels with interactive Save/Cancel actions.
- **Dynamic Avatars**: Unique level-based avatars with expansion indicators.
- **Modular Design**: Cleanly refactored into focused sub-components (`TreeNodeAvatar`, `TreeNodeContent`, `ChildNodeInput`).

### 📋 Kanban Board
- **Cross-Column Dragging**: Intuitive task management with smooth drag and drop.
- **State Management**: Centralized logic powered by Zustand for high performance.
- **Responsive Layout**: Designed to fit into any modern dashboard or workspace.

## 🛠️ Tech Stack
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Drag & Drop**: [dnd-kit](https://dndkit.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Type Safety**: TypeScript

## 🏁 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## 📂 Project Structure
```text
src/
├── components/
│   ├── tree/          # Advanced Tree View components
│   ├── kanban/        # Kanban Board components
│   ├── layout/        # Shared layout wrappers
│   └── ui/            # Reusable primitive UI components
├── store/             # Zustand state management
├── types/             # TypeScript interfaces and enums
└── lib/               # Shared utility functions
```

