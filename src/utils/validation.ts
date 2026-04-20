import type { Node, Edge } from 'reactflow';
import type { ValidationError } from '../types';

export function validateWorkflow(nodes: Node[], edges: Edge[]): ValidationError[] {
  const errors: ValidationError[] = [];

  const startNodes = nodes.filter((n) => n.type === 'start');
  const endNodes = nodes.filter((n) => n.type === 'end');

  if (startNodes.length === 0) {
    errors.push({ message: 'Workflow must have at least one Start node.', severity: 'error' });
  }
  if (startNodes.length > 1) {
    errors.push({ message: 'Workflow can only have one Start node.', severity: 'error' });
  }
  if (endNodes.length === 0) {
    errors.push({ message: 'Workflow must have at least one End node.', severity: 'error' });
  }

  if (nodes.length > 1) {
    const connectedNodeIds = new Set<string>();
    edges.forEach((e) => {
      connectedNodeIds.add(e.source);
      connectedNodeIds.add(e.target);
    });
    nodes.forEach((n) => {
      if (!connectedNodeIds.has(n.id)) {
        const data = n.data as { title?: string };
        errors.push({
          nodeId: n.id,
          message: `Node "${data.title || n.type}" is disconnected.`,
          severity: 'warning',
        });
      }
    });
  }

  // Detect cycles using DFS
  if (hasCycle(nodes, edges)) {
    errors.push({ message: 'Workflow contains a cycle. Cycles are not allowed.', severity: 'error' });
  }

  return errors;
}

function hasCycle(nodes: Node[], edges: Edge[]): boolean {
  const adjacency = new Map<string, string[]>();
  nodes.forEach((n) => adjacency.set(n.id, []));
  edges.forEach((e) => adjacency.get(e.source)?.push(e.target));

  const visited = new Set<string>();
  const inStack = new Set<string>();

  const dfs = (nodeId: string): boolean => {
    visited.add(nodeId);
    inStack.add(nodeId);
    for (const neighbor of adjacency.get(nodeId) || []) {
      if (!visited.has(neighbor) && dfs(neighbor)) return true;
      if (inStack.has(neighbor)) return true;
    }
    inStack.delete(nodeId);
    return false;
  };

  for (const node of nodes) {
    if (!visited.has(node.id) && dfs(node.id)) return true;
  }
  return false;
}
