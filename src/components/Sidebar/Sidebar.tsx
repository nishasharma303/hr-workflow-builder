import { useWorkflowStore } from '../../store/workflowStore';
import { validateWorkflow } from '../../utils/validation';

const NODE_TYPES = [
  {
    type: 'start',
    label: 'Start Node',
    desc: 'Workflow entry point',
    color: '#10B981',
    bg: '#ECFDF5',
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
        <path d="M4 3l9 5-9 5V3z" />
      </svg>
    ),
  },
  {
    type: 'task',
    label: 'Task Node',
    desc: 'Human task / action',
    color: '#4361EE',
    bg: '#EEF1FD',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
        <path d="M3 8l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    type: 'approval',
    label: 'Approval Node',
    desc: 'Manager approval step',
    color: '#F59E0B',
    bg: '#FFFBEB',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
        <path d="M8 2l1.5 3 3.5.5-2.5 2.5.6 3.5L8 10l-3.1 1.5.6-3.5L3 5.5l3.5-.5z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    type: 'automated',
    label: 'Automated Step',
    desc: 'System-triggered action',
    color: '#06B6D4',
    bg: '#ECFEFF',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
        <path d="M8 2v3M8 11v3M2 8h3M11 8h3M4 4l2 2M10 10l2 2M4 12l2-2M10 6l2-2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    type: 'end',
    label: 'End Node',
    desc: 'Workflow completion',
    color: '#EF4444',
    bg: '#FEF2F2',
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
        <rect x="3" y="3" width="10" height="10" rx="1" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const { nodes, edges, setIsSandboxOpen } = useWorkflowStore();

  const onDragStart = (e: React.DragEvent, nodeType: string) => {
    e.dataTransfer.setData('application/reactflow', nodeType);
    e.dataTransfer.effectAllowed = 'move';
  };

  const errors = validateWorkflow(nodes, edges);
  const errorCount = errors.filter((e) => e.severity === 'error').length;
  const warnCount = errors.filter((e) => e.severity === 'warning').length;

  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        {/* Node palette */}
        <div className="sidebar-sec">
          <span className="sec-label">Node Types</span>
          <div className="node-palette">
            {NODE_TYPES.map((nt) => (
              <div
                key={nt.type}
                className="palette-item"
                draggable
                onDragStart={(e) => onDragStart(e, nt.type)}
                title={`Drag to add a ${nt.label}`}
              >
                <div
                  className="pi-icon"
                  style={{ background: nt.bg, color: nt.color }}
                >
                  {nt.icon}
                </div>
                <div>
                  <div className="pi-name">{nt.label}</div>
                  <div className="pi-desc">{nt.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="sidebar-sec">
          <span className="sec-label">Workflow Stats</span>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-num">{nodes.length}</div>
              <div className="stat-lbl">Nodes</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{edges.length}</div>
              <div className="stat-lbl">Connections</div>
            </div>
            <div className={`stat-card ${errorCount > 0 ? 's-error' : 's-ok'}`}>
              <div className="stat-num">{errorCount}</div>
              <div className="stat-lbl">Errors</div>
            </div>
            <div className={`stat-card ${warnCount > 0 ? 's-warn' : 's-ok'}`}>
              <div className="stat-num">{warnCount}</div>
              <div className="stat-lbl">Warnings</div>
            </div>
          </div>
        </div>

        {/* Validation messages */}
        {errors.length > 0 && (
          <div className="sidebar-sec">
            <span className="sec-label">Validation</span>
            <div className="v-list">
              {errors.map((err, i) => (
                <div key={i} className={`v-item ${err.severity}`}>
                  <div className="v-dot">{err.severity === 'error' ? '✕' : '!'}</div>
                  <span>{err.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="sidebar-footer">
        <button className="btn-primary" onClick={() => setIsSandboxOpen(true)}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13">
            <circle cx="8" cy="8" r="6" /><path d="M8 5v3l2 1.5" strokeLinecap="round" />
          </svg>
          Open Sandbox
        </button>
      </div>
    </aside>
  );
}