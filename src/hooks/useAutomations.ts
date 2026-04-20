import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import type { AutomationAction } from '../types';

export function useAutomations() {
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    apiClient
      .getAutomations()
      .then((data) => {
        if (mounted) {
          setAutomations(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setError('Failed to load automations');
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { automations, loading, error };
}
