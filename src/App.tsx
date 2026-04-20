import { Sidebar } from './components/Sidebar/Sidebar';
import { Canvas } from './components/Canvas/Canvas';
import { NodeConfigPanel } from './components/Forms/NodeConfigPanel';
import { SandboxPanel } from './components/Sandbox/SandboxPanel';
import { useWorkflowStore } from './store/workflowStore';
import { useSimulation } from './hooks/useSimulation';
import './styles.css';

export default function App() {
  const { exportWorkflow, importWorkflow, setIsSandboxOpen } = useWorkflowStore();
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
    <div className="app-shell">
      {/* ── Top Header ── */}
      <header className="app-header">
        <div className="header-logo">HR</div>
        <div className="header-brand">
          <span className="header-brand-name">Tredence Studio</span>
          <span className="header-brand-sub">AI Agentic Platform</span>
        </div>
        <div className="header-sep" />
        <div className="header-workflow">
          HR Workflow Designer
          <span className="header-badge">Beta</span>
        </div>
        <div className="header-spacer" />
        <div className="header-actions">
          <button className="h-btn" onClick={handleImport} title="Import workflow JSON">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14"><path d="M8 2v8M5 7l3 3 3-3M2 12h12" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Import
          </button>
          <button className="h-btn" onClick={handleExport} title="Export workflow JSON">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14"><path d="M8 10V2M5 5l3-3 3 3M2 12h12" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Export
          </button>
          <button className="h-btn" onClick={() => setIsSandboxOpen(true)}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14"><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 1.5" strokeLinecap="round"/></svg>
            Sandbox
          </button>
          <button className="h-btn primary" onClick={runSimulation}>
            <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12"><path d="M4 3l9 5-9 5V3z"/></svg>
            Run Simulation
          </button>
        </div>
      </header>

      {/* ── 3-panel body ── */}
      <div className="app-layout">
        <Sidebar />
        <main className="canvas-area">
          <Canvas />
        </main>
        <aside className="config-area">
          <NodeConfigPanel />
        </aside>
      </div>

      <SandboxPanel />
    </div>
  );
}