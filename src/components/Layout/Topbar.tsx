import { useWorkflowStore } from '../../store/workflowStore';
import { useSimulation } from '../../hooks/useSimulation';

export function Topbar() {
  const { nodes, edges, exportWorkflow, importWorkflow, setIsSandboxOpen } = useWorkflowStore();
  const { runSimulation } = useSimulation();

  const handleExport = () => {
    const json = exportWorkflow();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'workflow.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => importWorkflow(ev.target?.result as string);
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <header className="topbar">
      {/* Undo/Redo */}
      <div className="topbar-history-btns">
        <button className="topbar-icon-btn" title="Undo" disabled>↩</button>
        <button className="topbar-icon-btn" title="Redo" disabled>↪</button>
      </div>

      {/* Title */}
      <div className="topbar-title-block">
        <div className="topbar-name">
          User Automation
          <span className="topbar-chevron">∨</span>
        </div>
        <div className="topbar-sub">
          Overview of User Workflows. &nbsp;·&nbsp; {nodes.length} nodes &nbsp;·&nbsp; {edges.length} edges
        </div>
      </div>

      <div className="topbar-divider" />

      {/* Right actions */}
      <div className="topbar-actions">
        <button className="topbar-icon-only" title="Table view">⊞</button>
        <button className="topbar-btn success" onClick={runSimulation} title="Run simulation">
          ▶
        </button>
        <button className="topbar-icon-only" title="Settings">⚙</button>
        <div className="topbar-divider" />
        <button className="topbar-btn" onClick={handleImport}>↑ Import</button>
        <button className="topbar-btn" onClick={handleExport}>↓ Export</button>
        <button className="topbar-btn primary" onClick={() => setIsSandboxOpen(true)}>
          ◉ Sandbox
        </button>
      </div>
    </header>
  );
}