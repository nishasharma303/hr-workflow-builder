import { useWorkflowStore } from '../../store/workflowStore';
import { validateWorkflow } from '../../utils/validation';
import { StartNodeForm, TaskNodeForm, ApprovalNodeForm, AutomatedNodeForm, EndNodeForm } from './NodeForms';
import type { WorkflowNodeData, StartNodeData, TaskNodeData, ApprovalNodeData, AutomatedNodeData, EndNodeData } from '../../types';

const NODE_META: Record<string, { label: string; color: string; bg: string }> = {
  start:     { label: 'Start Node',     color: '#065f46', bg: '#ecfdf5' },
  task:      { label: 'Task Node',      color: '#3730a3', bg: '#eef2ff' },
  approval:  { label: 'Approval Node',  color: '#92400e', bg: '#fffbeb' },
  automated: { label: 'Automated Step', color: '#0c4a6e', bg: '#f0f9ff' },
  end:       { label: 'End Node',       color: '#991b1b', bg: '#fef2f2' },
};

const FLOW_OBJECTIVES = [
  { icon: '🔗', name: 'Output Generation',  sub: 'Compiling Delivering Outputs',  chips: [{ l: '15', c: 'fc-blue' }, { l: '55', c: 'fc-green' }, { l: '41', c: 'fc-green' }, { l: '69', c: 'fc-indigo' }] },
  { icon: '📋', name: 'Lorem Ipsum',        sub: 'Lorem Ipsum Sit Dolor',         chips: [{ l: '11', c: 'fc-blue' }, { l: '27', c: 'fc-violet'}, { l: '41', c: 'fc-green' }, { l: '72', c: 'fc-indigo' }] },
  { icon: '⚡', name: 'Action Trigger',     sub: 'Performing Tasks Conditions',   chips: [{ l: '87', c: 'fc-blue' }, { l: '34', c: 'fc-violet'}, { l: '17', c: 'fc-red'   }, { l: '18', c: 'fc-indigo' }] },
  { icon: '✓',  name: 'Data Validation',   sub: 'Ensuring Data Accuracy',        chips: [{ l: '91', c: 'fc-blue' }, { l: '18', c: 'fc-amber' }, { l: '20', c: 'fc-green' }, { l: '21', c: 'fc-indigo' }] },
  { icon: '📄', name: 'Registration Form', sub: 'User registration process',     chips: [{ l: '11', c: 'fc-blue' }, { l: '27', c: 'fc-violet'}, { l: '41', c: 'fc-green' }, { l: '72', c: 'fc-indigo' }] },
];

export function NodeConfigPanel() {
  const { nodes, edges, selectedNodeId, setSelectedNodeId, deleteNode } = useWorkflowStore();
  const errors = validateWorkflow(nodes, edges);
  const errorCount = errors.filter(e => e.severity === 'error').length;
  const warnCount  = errors.filter(e => e.severity === 'warning').length;
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  /* ---- NODE EDIT MODE ---- */
  if (selectedNode) {
    const nodeType = selectedNode.type || 'task';
    const meta = NODE_META[nodeType];
    const data = selectedNode.data as WorkflowNodeData;

    const renderForm = () => {
      switch (nodeType) {
        case 'start':     return <StartNodeForm nodeId={selectedNode.id}     data={data as StartNodeData}     />;
        case 'task':      return <TaskNodeForm nodeId={selectedNode.id}       data={data as TaskNodeData}      />;
        case 'approval':  return <ApprovalNodeForm nodeId={selectedNode.id}  data={data as ApprovalNodeData}  />;
        case 'automated': return <AutomatedNodeForm nodeId={selectedNode.id} data={data as AutomatedNodeData} />;
        case 'end':       return <EndNodeForm nodeId={selectedNode.id}       data={data as EndNodeData}       />;
        default: return null;
      }
    };

    return (
      <aside className="config-panel">
        <div className="config-topbar">
          <span className="config-node-badge" style={{ background: meta.bg, color: meta.color }}>
            {meta.label}
          </span>
          <button className="btn-del" style={{ padding: '3px 8px', fontSize: 10 }} onClick={() => deleteNode(selectedNode.id)}>
            🗑
          </button>
          <button className="config-close-btn" onClick={() => setSelectedNodeId(null)} title="Close">✕</button>
        </div>
        <div className="config-body">{renderForm()}</div>
      </aside>
    );
  }

  /* ---- DEFAULT PANEL — Performance Overview ---- */
  return (
    <aside className="config-panel">
      {/* Top bar */}
      <div className="config-topbar">
        <div>
          <div className="config-topbar-label">Performance Overview</div>
          <div className="config-topbar-sub">Overview Performance Time</div>
        </div>
        <button className="config-close-btn">+</button>
      </div>

      <div className="config-body">

        {/* Insight Metrics */}
        <div className="panel-section">
          <div className="panel-section-title">
            Insight Metrics
            <button className="panel-icon-btn">+</button>
          </div>
          <div className="insight-search">
            <span className="insight-search-icon">🔍</span>
            <span className="insight-search-text">Search Here...</span>
            <span className="insight-search-kbd">⌘K</span>
          </div>
        </div>

        {/* Automation Coverage */}
        <div className="panel-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-1)' }}>Automation Coverage</span>
            <button className="panel-icon-btn" style={{ fontSize: 12 }}>×</button>
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginBottom: 4 }}>
            Your last week is better <span style={{ fontWeight: 700, color: 'var(--text-1)' }}>72%</span>
          </div>
          <div className="coverage-bar-track">
            <div className="coverage-bar-fill" style={{ width: '72%' }} />
          </div>
        </div>

        {/* Workflow A */}
        <div className="panel-section">
          <div className="flow-list">
            <div className="flow-item">
              <div className="flow-item-header">
                <div>
                  <div className="flow-item-name">Workflow A</div>
                  <div className="flow-item-sub">Triggered by User Actions</div>
                </div>
                <button className="panel-icon-btn">+</button>
              </div>
              <div className="flow-progress">
                <div className="flow-progress-seg" style={{ width: '38%', background: '#ef4444' }} />
                <div className="flow-progress-seg" style={{ width: '35%', background: '#0ea5e9' }} />
                <div className="flow-progress-seg" style={{ width: '27%', background: '#10b981' }} />
              </div>
              <div className="flow-chips">
                <span className="flow-chip fc-blue">● Task: 29</span>
                <span className="flow-chip fc-indigo">● Exec: 10</span>
                <span className="flow-chip fc-green">● Done: 13</span>
              </div>
            </div>

            {/* Workflow B */}
            <div className="flow-item">
              <div className="flow-item-header">
                <div>
                  <div className="flow-item-name">Workflow B</div>
                  <div className="flow-item-sub">Scheduled Automation</div>
                </div>
                <button className="panel-icon-btn">+</button>
              </div>
              <div className="flow-progress">
                <div className="flow-progress-seg" style={{ width: '28%', background: '#ef4444' }} />
                <div className="flow-progress-seg" style={{ width: '42%', background: '#0ea5e9' }} />
                <div className="flow-progress-seg" style={{ width: '30%', background: '#10b981' }} />
              </div>
              <div className="flow-chips">
                <span className="flow-chip fc-blue">● Task: 10</span>
                <span className="flow-chip fc-indigo">● Exec: 33</span>
                <span className="flow-chip fc-green">● Done: 17</span>
              </div>
            </div>
          </div>
        </div>

        {/* Validation */}
        {errors.length > 0 && (
          <div className="panel-section">
            <div className="panel-section-title">Validation Issues</div>
            <div className="val-list">
              {errors.map((err, i) => (
                <div key={i} className={`val-item ${err.severity}`}>
                  <span className="val-icon">{err.severity === 'error' ? '✕' : '⚠'}</span>
                  <span>{err.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="panel-section">
          <div className="panel-section-title">Workflow Stats</div>
          <div className="stats-grid">
            <div className={`stat-card s-accent`}>
              <div className="stat-num">{nodes.length}</div>
              <div className="stat-label">Nodes</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{edges.length}</div>
              <div className="stat-label">Edges</div>
            </div>
            <div className={`stat-card ${errorCount > 0 ? 's-error' : ''}`}>
              <div className="stat-num">{errorCount}</div>
              <div className="stat-label">Errors</div>
            </div>
            <div className={`stat-card ${warnCount > 0 ? 's-warn' : ''}`}>
              <div className="stat-num">{warnCount}</div>
              <div className="stat-label">Warnings</div>
            </div>
          </div>
        </div>

        {/* Flow Objectives */}
        <div className="panel-section">
          <div className="panel-section-title">
            Flow Objectives
            <button className="panel-icon-btn">+</button>
          </div>
          {FLOW_OBJECTIVES.map((obj) => (
            <div key={obj.name} className="obj-item">
              <div className="obj-icon">{obj.icon}</div>
              <div className="obj-info">
                <div className="obj-name">{obj.name}</div>
                <div className="obj-sub">{obj.sub}</div>
                <div className="obj-chips">
                  {obj.chips.map((c, i) => (
                    <span key={i} className={`flow-chip ${c.c}`}>{c.l}</span>
                  ))}
                </div>
              </div>
              <button className="obj-more">⋮</button>
            </div>
          ))}
        </div>

        {nodes.length === 0 && (
          <div className="config-empty">
            <div className="config-empty-icon">🎯</div>
            <div className="config-empty-title">Select a node to configure</div>
            <div className="config-empty-sub">Click any node on the canvas to edit its properties here.</div>
          </div>
        )}
      </div>
    </aside>
  );
}