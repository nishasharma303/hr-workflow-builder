import React from 'react';
import { Handle, Position } from 'reactflow';
import { useWorkflowStore } from '../../store/workflowStore';

interface BaseNodeProps {
  id: string;
  selected: boolean;
  children: React.ReactNode;
  icon: React.ReactNode;
  typeLabel: string;
  color: string;
  colorBg: string;
  hasSource?: boolean;
  hasTarget?: boolean;
}

export function BaseNode({
  id,
  selected,
  children,
  icon,
  typeLabel,
  color,
  colorBg,
  hasSource = true,
  hasTarget = true,
}: BaseNodeProps) {
  const { deleteNode, setSelectedNodeId } = useWorkflowStore();

  return (
    <div
      className={`base-node ${selected ? 'selected' : ''}`}
      style={{ '--node-color': color } as React.CSSProperties}
      onClick={() => setSelectedNodeId(id)}
    >
      {hasTarget && (
        <Handle
          type="target"
          position={Position.Top}
          style={{ background: color, border: '2px solid white' }}
        />
      )}

      {/* colour stripe */}
      <div className="node-stripe" style={{ background: color }} />

      <div className="node-head">
        <div
          className="pi-icon"
          style={{ width: 22, height: 22, background: colorBg, color, borderRadius: 4, fontSize: 11 }}
        >
          {icon}
        </div>
        <span
          className="node-type-tag"
          style={{ background: colorBg, color }}
        >
          {typeLabel}
        </span>
        <button
          className="node-del"
          onClick={(e) => { e.stopPropagation(); deleteNode(id); }}
          title="Delete node"
        >
          ×
        </button>
      </div>

      <div className="node-body">{children}</div>

      {hasSource && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: color, border: '2px solid white' }}
        />
      )}
    </div>
  );
}