import { useCallback } from 'react';
import { apiClient } from '../api/client';
import { useWorkflowStore } from '../store/workflowStore';
import { validateWorkflow } from '../utils/validation';

export function useSimulation() {
  const {
    nodes,
    edges,
    setSimulationResult,
    setIsSimulating,
    setValidationErrors,
    setIsSandboxOpen,
  } = useWorkflowStore();

  const runSimulation = useCallback(async () => {
    const errors = validateWorkflow(nodes, edges);
    setValidationErrors(errors);

    const hasErrors = errors.some((e) => e.severity === 'error');
    if (hasErrors) {
      setIsSandboxOpen(true);
      setSimulationResult(null);
      return;
    }

    setIsSimulating(true);
    setIsSandboxOpen(true);
    setSimulationResult(null);

    try {
      const result = await apiClient.simulate(nodes, edges);
      setSimulationResult(result);
    } catch {
      setSimulationResult({
        success: false,
        steps: [],
        errors: ['Simulation failed due to an unexpected error.'],
        duration: 0,
      });
    } finally {
      setIsSimulating(false);
    }
  }, [nodes, edges, setSimulationResult, setIsSimulating, setValidationErrors, setIsSandboxOpen]);

  return { runSimulation };
}
