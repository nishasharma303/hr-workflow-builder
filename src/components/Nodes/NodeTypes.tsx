import { NodeProps } from 'reactflow';
import { BaseNode } from './BaseNode';
import type {
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
} from '../../types';

const PlayIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11">
    <path d="M4 3l9 5-9 5V3z" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" width="11" height="11">
    <path d="M3 8l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" width="11" height="11">
    <path d="M8 2l1.5 3 3.5.5-2.5 2.5.6 3.5L8 10l-3.1 1.5.6-3.5L3 5.5l3.5-.5z" strokeLinejoin="round" />
  </svg>
);
const BoltIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11">
    <path d="M8 2v3M8 11v3M2 8h3M11 8h3M4 4l2 2M10 10l2 2M4 12l2-2M10 6l2-2" strokeLinecap="round" />
  </svg>
);
const StopIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width="10" height="10">
    <rect x="3" y="3" width="10" height="10" rx="1" />
  </svg>
);

export function StartNode({ id, selected, data }: NodeProps<StartNodeData>) {
  return (
    <BaseNode
      id={id} selected={selected}
      icon={<PlayIcon />} typeLabel="START"
      color="#10B981" colorBg="#ECFDF5" hasTarget={false}
    >
      <p className="node-title">{data.title || 'Start'}</p>
      {data.metadata?.length > 0 && (
        <p className="node-meta">
          <span style={{ color: '#10B981', fontSize: 11 }}>◆</span>
          {data.metadata.length} metadata field{data.metadata.length !== 1 ? 's' : ''}
        </p>
      )}
    </BaseNode>
  );
}

export function TaskNode({ id, selected, data }: NodeProps<TaskNodeData>) {
  return (
    <BaseNode
      id={id} selected={selected}
      icon={<CheckIcon />} typeLabel="TASK"
      color="#4361EE" colorBg="#EEF1FD"
    >
      <p className="node-title">{data.title || 'Task'}</p>
      {data.assignee && (
        <p className="node-meta">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" width="11" height="11">
            <circle cx="8" cy="5" r="3" /><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
          </svg>
          {data.assignee}
        </p>
      )}
      {data.dueDate && (
        <p className="node-meta">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" width="11" height="11">
            <rect x="2" y="3" width="12" height="11" rx="1.5" /><path d="M5 1v3M11 1v3M2 7h12" strokeLinecap="round" />
          </svg>
          {data.dueDate}
        </p>
      )}
    </BaseNode>
  );
}

export function ApprovalNode({ id, selected, data }: NodeProps<ApprovalNodeData>) {
  return (
    <BaseNode
      id={id} selected={selected}
      icon={<StarIcon />} typeLabel="APPROVAL"
      color="#F59E0B" colorBg="#FFFBEB"
    >
      <p className="node-title">{data.title || 'Approval'}</p>
      {data.approverRole && (
        <p className="node-meta">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" width="11" height="11">
            <path d="M2 13c0-2.8 2.2-5 5-5h2c2.8 0 5 2.2 5 5" strokeLinecap="round" />
            <circle cx="8" cy="5" r="3" />
          </svg>
          {data.approverRole}
        </p>
      )}
      {data.autoApproveThreshold > 0 && (
        <p className="node-meta">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" width="11" height="11">
            <path d="M2 12l4-4 3 3 5-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Auto: {data.autoApproveThreshold}%
        </p>
      )}
    </BaseNode>
  );
}

export function AutomatedNode({ id, selected, data }: NodeProps<AutomatedNodeData>) {
  return (
    <BaseNode
      id={id} selected={selected}
      icon={<BoltIcon />} typeLabel="AUTOMATED"
      color="#06B6D4" colorBg="#ECFEFF"
    >
      <p className="node-title">{data.title || 'Automated Step'}</p>
      {data.actionId && (
        <p className="node-meta">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" width="11" height="11">
            <rect x="2" y="5" width="5" height="8" rx="1" /><rect x="9" y="3" width="5" height="10" rx="1" />
          </svg>
          {data.actionId.replace(/_/g, ' ')}
        </p>
      )}
    </BaseNode>
  );
}

export function EndNode({ id, selected, data }: NodeProps<EndNodeData>) {
  return (
    <BaseNode
      id={id} selected={selected}
      icon={<StopIcon />} typeLabel="END"
      color="#EF4444" colorBg="#FEF2F2" hasSource={false}
    >
      <p className="node-title">{data.endMessage || 'Workflow Complete'}</p>
      {data.showSummary && (
        <p className="node-meta">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" width="11" height="11">
            <rect x="2" y="2" width="12" height="12" rx="1.5" />
            <path d="M5 6h6M5 9h4" strokeLinecap="round" />
          </svg>
          Summary report
        </p>
      )}
    </BaseNode>
  );
}