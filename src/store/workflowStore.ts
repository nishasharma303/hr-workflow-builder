import { create } from 'zustand';
import {
  Node,
  Edge,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Connection,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import type { WorkflowNodeData, ValidationError, SimulationResult } from '../types';

interface WorkflowStore {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  validationErrors: ValidationError[];
  simulationResult: SimulationResult | null;
  isSandboxOpen: boolean;
  isSimulating: boolean;

  // Actions
  setNodes: (nodes: Node<WorkflowNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: string, position: { x: number; y: number }) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  setValidationErrors: (errors: ValidationError[]) => void;
  setSimulationResult: (result: SimulationResult | null) => void;
  setIsSandboxOpen: (open: boolean) => void;
  setIsSimulating: (loading: boolean) => void;
  exportWorkflow: () => string;
  importWorkflow: (json: string) => void;
}

const DEFAULT_NODE_DATA: Record<string, WorkflowNodeData> = {
  start: { type: 'start', title: 'Start', metadata: [] },
  task: { type: 'task', title: 'New Task', description: '', assignee: '', dueDate: '', customFields: [] },
  approval: { type: 'approval', title: 'Approval Step', approverRole: 'Manager', autoApproveThreshold: 0 },
  automated: { type: 'automated', title: 'Automated Step', actionId: '', actionParams: {} },
  end: { type: 'end', endMessage: 'Workflow Complete', showSummary: true },
};

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  validationErrors: [],
  simulationResult: null,
  isSandboxOpen: false,
  isSimulating: false,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as Node<WorkflowNodeData>[],
    })),

  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),

  onConnect: (connection) =>
    set((state) => ({
      edges: addEdge(
        { ...connection, animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
        state.edges
      ),
    })),

  addNode: (type, position) => {
    const newNode: Node<WorkflowNodeData> = {
      id: uuidv4(),
      type,
      position,
      data: { ...DEFAULT_NODE_DATA[type] } as WorkflowNodeData,
    };
    set((state) => ({ nodes: [...state.nodes, newNode] }));
  },

  updateNodeData: (nodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } as WorkflowNodeData } : n
      ),
    })),

  deleteNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    })),

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setValidationErrors: (errors) => set({ validationErrors: errors }),
  setSimulationResult: (result) => set({ simulationResult: result }),
  setIsSandboxOpen: (open) => set({ isSandboxOpen: open }),
  setIsSimulating: (loading) => set({ isSimulating: loading }),

  exportWorkflow: () => {
    const { nodes, edges } = get();
    return JSON.stringify({ nodes, edges }, null, 2);
  },

  importWorkflow: (json) => {
    try {
      const { nodes, edges } = JSON.parse(json);
      set({ nodes, edges, selectedNodeId: null });
    } catch {
      alert('Invalid workflow JSON');
    }
  },
}));
