import { useWorkflowStore } from '../../store/workflowStore';

const NODE_TYPES = [
  { type: 'start',     label: 'Start Node',  desc: 'Entry point',    color: '#10b981' },
  { type: 'task',      label: 'Task Node',   desc: 'Human task',     color: '#4f46e5' },
  { type: 'approval',  label: 'Approval',    desc: 'Mgr approval',   color: '#f59e0b' },
  { type: 'automated', label: 'Automated',   desc: 'System action',  color: '#0ea5e9' },
  { type: 'end',       label: 'End Node',    desc: 'Workflow end',   color: '#ef4444' },
];

const TEMPLATES = [
  { label: '📋 Onboarding',    nodes: ['start','task','task','approval','automated','end'] },
  { label: '🏖 Leave Approval', nodes: ['start','task','approval','automated','end'] },
  { label: '📄 Doc Verify',    nodes: ['start','task','automated','approval','end'] },
];

function getDefaultData(type: string): object {
  switch (type) {
    case 'start':     return { type: 'start',     title: 'Start',          metadata: [] };
    case 'task':      return { type: 'task',       title: 'Task',           description: '', assignee: '', dueDate: '', customFields: [] };
    case 'approval':  return { type: 'approval',   title: 'Approval Step',  approverRole: 'Manager', autoApproveThreshold: 0 };
    case 'automated': return { type: 'automated',  title: 'Automated Step', actionId: '', actionParams: {} };
    case 'end':       return { type: 'end',        endMessage: 'Workflow Complete', showSummary: true };
    default: return {};
  }
}

export function PalettePanel() {
  const { setNodes, setEdges } = useWorkflowStore();

  const onDragStart = (e: React.DragEvent, nodeType: string) => {
    e.dataTransfer.setData('application/reactflow', nodeType);
    e.dataTransfer.effectAllowed = 'move';
  };

  const loadTemplate = (template: typeof TEMPLATES[number]) => {
    const newNodes = template.nodes.map((type, i) => ({
      id: `t-${i}-${Date.now()}`,
      type,
      position: { x: 200, y: 60 + i * 160 },
      data: getDefaultData(type),
    }));
    const newEdges = newNodes.slice(0, -1).map((n, i) => ({
      id: `e-${i}`,
      source: n.id,
      target: newNodes[i + 1].id,
      animated: true,
      style: { stroke: '#4f46e5', strokeWidth: 2 },
    }));
    setNodes(newNodes as any);
    setEdges(newEdges);
  };

  return (
    <aside className="palette-panel">
      <div className="palette-header">
        <div className="palette-title">Node Types</div>
        <div className="palette-hint">Drag onto canvas</div>
      </div>

      <div className="palette-list">
        {NODE_TYPES.map(nt => (
          <div
            key={nt.type}
            className="palette-card"
            draggable
            onDragStart={e => onDragStart(e, nt.type)}
            title={`Drag to add ${nt.label}`}
          >
            <span className="palette-dot" style={{ background: nt.color }} />
            <div className="palette-card-info">
              <div className="palette-card-name">{nt.label}</div>
              <div className="palette-card-desc">{nt.desc}</div>
            </div>
            <span className="palette-drag-icon">⠿</span>
          </div>
        ))}
      </div>

      <div className="palette-templates">
        <div className="template-section-label">Templates</div>
        {TEMPLATES.map(t => (
          <button key={t.label} className="template-btn" onClick={() => loadTemplate(t)}>
            {t.label}
          </button>
        ))}
      </div>
    </aside>
  );
}