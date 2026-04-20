import { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../../store/workflowStore';
import { nodeTypes } from '../Nodes';

function CanvasInner() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setSelectedNodeId,
  } = useWorkflowStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      addNode(type, position);
    },
    [screenToFlowPosition, addNode]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  return (
    <div ref={reactFlowWrapper} className="canvas-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode="Delete"
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 },
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#2a2a3e"
        />
        <Controls
          style={{
            background: '#1e1e2e',
            border: '1px solid #2a2a3e',
            borderRadius: '8px',
          }}
        />
        <MiniMap
          style={{
            background: '#1a1a2e',
            border: '1px solid #2a2a3e',
            borderRadius: '8px',
          }}
          nodeColor={(n) => {
            const colors: Record<string, string> = {
              start: '#22c55e',
              task: '#6366f1',
              approval: '#f59e0b',
              automated: '#06b6d4',
              end: '#ef4444',
            };
            return colors[n.type || 'task'] || '#6366f1';
          }}
        />
      </ReactFlow>
      {nodes.length === 0 && (
        <div className="canvas-empty">
          <p className="canvas-empty-title">Drop nodes here</p>
          <p className="canvas-empty-sub">Drag node types from the sidebar to get started</p>
        </div>
      )}
    </div>
  );
}

export function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
