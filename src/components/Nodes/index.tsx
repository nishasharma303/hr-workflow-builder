import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useWorkflowStore } from '../../store/workflowStore';
import type { StartNodeData, TaskNodeData, ApprovalNodeData, AutomatedNodeData, EndNodeData } from '../../types';

const NODE_CFG = {
  start:     { color: '#10b981', bg: '#ecfdf5', textColor: '#065f46', icon: '▶', label: 'Start'     },
  task:      { color: '#4f46e5', bg: '#eef2ff', textColor: '#3730a3', icon: '✓', label: 'Task'      },
  approval:  { color: '#f59e0b', bg: '#fffbeb', textColor: '#92400e', icon: '✦', label: 'Approval'  },
  automated: { color: '#0ea5e9', bg: '#f0f9ff', textColor: '#0c4a6e', icon: '⚡', label: 'Auto'    },
  end:       { color: '#ef4444', bg: '#fef2f2', textColor: '#991b1b', icon: '■', label: 'End'       },
} as const;

type NodeTypeKey = keyof typeof NODE_CFG;

interface BaseNodeProps {
  id: string;
  selected: boolean;
  nodeType: NodeTypeKey;
  children: React.ReactNode;
  metrics?: React.ReactNode;
  hasTarget?: boolean;
  hasSource?: boolean;
}

function BaseNode({ id, selected, nodeType, children, metrics, hasTarget = true, hasSource = true }: BaseNodeProps) {
  const cfg = NODE_CFG[nodeType];
  const { deleteNode, setSelectedNodeId } = useWorkflowStore();

  return (
    <div
      className={`wf-node${selected ? ' selected' : ''}`}
      onClick={() => setSelectedNodeId(id)}
      style={selected ? { borderColor: cfg.color } : {}}
    >
      {hasTarget && (
        <Handle type="target" position={Position.Top}
          style={{ background: cfg.color, top: -5 }} />
      )}

      {/* Header row */}
      <div className="wf-node-top">
        <div className="wf-node-icon" style={{ background: cfg.bg, color: cfg.color }}>
          {cfg.icon}
        </div>
        <span className="wf-node-type-label" style={{ color: cfg.color }}>
          {cfg.label}
        </span>
        <button className="wf-node-menu" onClick={e => e.stopPropagation()} title="Options">⋮</button>
        <button
          className="wf-node-delete"
          onClick={e => { e.stopPropagation(); deleteNode(id); }}
          title="Delete"
        >×</button>
      </div>

      <div className="wf-node-divider" />

      {/* Body */}
      <div className="wf-node-body">{children}</div>

      {/* Metrics chips */}
      {metrics && <div className="wf-node-metrics">{metrics}</div>}

      {hasSource && (
        <Handle type="source" position={Position.Bottom}
          style={{ background: cfg.color, bottom: -5 }} />
      )}
    </div>
  );
}

function Metric({ val, cls }: { val: string | number; cls: string }) {
  return <span className={`wf-metric ${cls}`}>{val}</span>;
}

// ---- Node components ----

export function StartNode({ id, selected, data }: NodeProps<StartNodeData>) {
  return (
    <BaseNode id={id} selected={selected} nodeType="start" hasTarget={false}
      metrics={<>
        <Metric val={data.metadata?.length || 0} cls="wm-green" />
        <Metric val="meta" cls="wm-blue" />
      </>}
    >
      <div className="wf-node-title">{data.title || 'Start'}</div>
      <div className="wf-node-sub">Workflow entry point</div>
    </BaseNode>
  );
}

export function TaskNode({ id, selected, data }: NodeProps<TaskNodeData>) {
  return (
    <BaseNode id={id} selected={selected} nodeType="task"
      metrics={<>
        <Metric val={11}  cls="wm-blue" />
        <Metric val={27}  cls="wm-violet" />
        <Metric val={41}  cls="wm-green" />
        <Metric val={72}  cls="wm-indigo" />
      </>}
    >
      <div className="wf-node-title">{data.title || 'Task'}</div>
      <div className="wf-node-sub">{data.description || (data.assignee ? `Assigned to ${data.assignee}` : 'Human task step')}</div>
    </BaseNode>
  );
}

export function ApprovalNode({ id, selected, data }: NodeProps<ApprovalNodeData>) {
  return (
    <BaseNode id={id} selected={selected} nodeType="approval"
      metrics={<>
        <Metric val={91}  cls="wm-blue" />
        <Metric val={18}  cls="wm-amber" />
        <Metric val={20}  cls="wm-green" />
        <Metric val={21}  cls="wm-indigo" />
      </>}
    >
      <div className="wf-node-title">{data.title || 'Approval Step'}</div>
      <div className="wf-node-sub">{data.approverRole || 'Manager'} approval</div>
    </BaseNode>
  );
}

export function AutomatedNode({ id, selected, data }: NodeProps<AutomatedNodeData>) {
  return (
    <BaseNode id={id} selected={selected} nodeType="automated"
      metrics={<>
        <Metric val={87}  cls="wm-blue" />
        <Metric val={34}  cls="wm-violet" />
        <Metric val={17}  cls="wm-red" />
        <Metric val={18}  cls="wm-indigo" />
      </>}
    >
      <div className="wf-node-title">{data.title || 'Automated Step'}</div>
      <div className="wf-node-sub">{data.actionId ? data.actionId.replace(/_/g, ' ') : 'System-triggered action'}</div>
    </BaseNode>
  );
}

export function EndNode({ id, selected, data }: NodeProps<EndNodeData>) {
  return (
    <BaseNode id={id} selected={selected} nodeType="end" hasSource={false}
      metrics={<>
        <Metric val={data.showSummary ? '✓ Summary' : 'No summary'} cls={data.showSummary ? 'wm-green' : 'wm-amber'} />
      </>}
    >
      <div className="wf-node-title">{data.endMessage || 'End'}</div>
      <div className="wf-node-sub">Workflow complete</div>
    </BaseNode>
  );
}

export const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};