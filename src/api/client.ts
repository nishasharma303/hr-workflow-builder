import type { AutomationAction, SimulationResult, SimulationStep } from '../types';
import type { Node, Edge } from 'reactflow';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const MOCK_AUTOMATIONS: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'send_slack', label: 'Send Slack Notification', params: ['channel', 'message'] },
  { id: 'create_ticket', label: 'Create JIRA Ticket', params: ['project', 'summary'] },
  { id: 'update_hris', label: 'Update HRIS Record', params: ['employeeId', 'field', 'value'] },
  { id: 'schedule_meeting', label: 'Schedule Meeting', params: ['attendees', 'duration'] },
];

export const apiClient = {
  async getAutomations(): Promise<AutomationAction[]> {
    await delay(300);
    return MOCK_AUTOMATIONS;
  },

  async simulate(nodes: Node[], edges: Edge[]): Promise<SimulationResult> {
    await delay(800);

    const errors: string[] = [];
    const steps: SimulationStep[] = [];

    // Validate structure
    const startNodes = nodes.filter((n) => n.type === 'start');
    const endNodes = nodes.filter((n) => n.type === 'end');

    if (startNodes.length === 0) {
      errors.push('Workflow must have a Start node.');
    }
    if (startNodes.length > 1) {
      errors.push('Workflow can only have one Start node.');
    }
    if (endNodes.length === 0) {
      errors.push('Workflow must have an End node.');
    }

    // Check for disconnected nodes
    const connectedNodeIds = new Set<string>();
    edges.forEach((e) => {
      connectedNodeIds.add(e.source);
      connectedNodeIds.add(e.target);
    });
    nodes.forEach((n) => {
      if (!connectedNodeIds.has(n.id) && nodes.length > 1) {
        errors.push(`Node "${(n.data as { title?: string; endMessage?: string }).title || n.type}" is not connected.`);
      }
    });

    if (errors.length > 0) {
      return { success: false, steps: [], errors, duration: 0 };
    }

    // Topological sort / BFS traversal
    const adjacency = new Map<string, string[]>();
    nodes.forEach((n) => adjacency.set(n.id, []));
    edges.forEach((e) => {
      adjacency.get(e.source)?.push(e.target);
    });

    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    const visited = new Set<string>();
    const queue: string[] = startNodes.map((n) => n.id);
    const orderedNodes: Node[] = [];

    while (queue.length > 0) {
      const id = queue.shift();
      if (!id || visited.has(id)) continue;
      visited.add(id);
      const node = nodeMap.get(id);
      if (node) orderedNodes.push(node);
      (adjacency.get(id) || []).forEach((nextId) => {
        if (!visited.has(nextId)) queue.push(nextId);
      });
    }

    // Generate mock execution steps
    const startTime = Date.now();
    for (let i = 0; i < orderedNodes.length; i++) {
      const node = orderedNodes[i];
      const data = node.data as { title?: string; endMessage?: string };
      await delay(200);

      const statusMessages: Record<string, string> = {
        start: 'Workflow initiated successfully.',
        task: `Task "${data.title}" assigned and queued.`,
        approval: `Approval request sent to ${(node.data as { approverRole?: string }).approverRole || 'approver'}.`,
        automated: `Automated action "${data.title}" executed via system trigger.`,
        end: data.endMessage || 'Workflow completed.',
      };

      steps.push({
        nodeId: node.id,
        nodeType: node.type as 'start' | 'task' | 'approval' | 'automated' | 'end',
        title: data.title || data.endMessage || node.type || 'Step',
        status: 'success',
        message: statusMessages[node.type || 'task'] || 'Step processed.',
        timestamp: new Date().toISOString(),
      });
    }

    return {
      success: true,
      steps,
      errors: [],
      duration: Date.now() - startTime,
    };
  },
};
