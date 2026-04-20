import { useWorkflowStore } from '../../store/workflowStore';
import { useSimulation } from '../../hooks/useSimulation';
import type { SimulationStep } from '../../types';

const NODE_COLORS: Record<string, string> = {
  start: '#10b981', task: '#4f46e5', approval: '#f59e0b', automated: '#0ea5e9', end: '#ef4444',
};
const NODE_BG: Record<string, string> = {
  start: '#ecfdf5', task: '#eef2ff', approval: '#fffbeb', automated: '#f0f9ff', end: '#fef2f2',
};
const NODE_TEXT: Record<string, string> = {
  start: '#065f46', task: '#3730a3', approval: '#92400e', automated: '#0c4a6e', end: '#991b1b',
};

function TlRow({ step, index }: { step: SimulationStep; index: number }) {
  return (
    <div className="tl-row" style={{ animationDelay: `${index * 0.07}s` }}>
      <div className="tl-dot" style={{ background: NODE_COLORS[step.nodeType] }}>✓</div>
      <div className="tl-card">
        <div className="tl-top">
          <span className="tl-name">{step.title}</span>
          <span className="tl-type" style={{ background: NODE_BG[step.nodeType], color: NODE_TEXT[step.nodeType] }}>
            {step.nodeType}
          </span>
        </div>
        <p className="tl-msg">{step.message}</p>
        <p className="tl-time">{new Date(step.timestamp).toLocaleTimeString()}</p>
      </div>
    </div>
  );
}

export function SandboxPanel() {
  const { isSandboxOpen, setIsSandboxOpen, simulationResult, isSimulating, validationErrors } = useWorkflowStore();
  const { runSimulation } = useSimulation();
  if (!isSandboxOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => setIsSandboxOpen(false)}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-icon">▶</div>
            <div>
              <div className="modal-title">Workflow Sandbox</div>
              <div className="modal-sub">Simulate and test step-by-step workflow execution</div>
            </div>
          </div>
          <button className="modal-close" onClick={() => setIsSandboxOpen(false)}>✕</button>
        </div>

        <div className="modal-body">
          {validationErrors.length > 0 && (
            <div>
              <div className="val-section-title">Validation Issues</div>
              <div className="val-list">
                {validationErrors.map((err, i) => (
                  <div key={i} className={`val-item ${err.severity}`}>
                    <span className="val-icon">{err.severity === 'error' ? '✕' : '⚠'}</span>
                    <span>{err.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isSimulating && (
            <div className="sim-loading">
              <div className="spinner" />
              Running simulation…
            </div>
          )}

          {simulationResult && !isSimulating && (
            <>
              <div className={`sim-banner ${simulationResult.success ? 'ok' : 'fail'}`}>
                <span className="sim-banner-icon">{simulationResult.success ? '✓' : '✕'}</span>
                {simulationResult.success ? 'Simulation completed successfully' : 'Simulation failed'}
                {simulationResult.success && <span className="sim-dur">{simulationResult.duration}ms</span>}
              </div>

              {simulationResult.errors.map((err, i) => (
                <div key={i} className="val-item error">
                  <span className="val-icon">✕</span><span>{err}</span>
                </div>
              ))}

              {simulationResult.steps.length > 0 && (
                <div>
                  <div className="timeline-label">
                    Execution Log
                    <span className="timeline-count">{simulationResult.steps.length} steps</span>
                  </div>
                  <div className="timeline">
                    {simulationResult.steps.map((step, i) => (
                      <TlRow key={step.nodeId} step={step} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {!simulationResult && !isSimulating && validationErrors.length === 0 && (
            <div className="sandbox-empty">
              <div className="sandbox-empty-icon">▶</div>
              <p>Click <strong>Run Simulation</strong> to execute and see step-by-step results.</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={runSimulation} disabled={isSimulating}>
            {isSimulating ? 'Running…' : '▶ Run Simulation'}
          </button>
          <button className="btn btn-secondary" onClick={() => setIsSandboxOpen(false)}>Close</button>
        </div>
      </div>
    </div>
  );
}