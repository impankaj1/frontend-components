import { Routes, Route, Navigate } from "react-router-dom";
import { TreeView } from "./components/tree/TreeView";
import { KanbanBoard } from "./components/kanban/KanbanBoard";
import { MainLayout } from "./components/layout/MainLayout";
import { PageSection } from "./components/layout/PageSection";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/tree" replace />} />
        <Route
          path="/tree"
          element={
            <PageSection title="Tree View Component">
              <div className="flex justify-start">
                <TreeView />
              </div>
            </PageSection>
          }
        />
        <Route
          path="/kanban"
          element={
            <PageSection title="Kanban Board Component">
              <KanbanBoard />
            </PageSection>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
