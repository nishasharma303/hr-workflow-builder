import { useWorkflowStore } from '../../store/workflowStore';
import { useAutomations } from '../../hooks/useAutomations';
import { KeyValueEditor } from './KeyValueEditor';
import type { StartNodeData, TaskNodeData, ApprovalNodeData, AutomatedNodeData, EndNodeData } from '../../types';
import { useState, useEffect } from 'react';

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="form-field">
      <label className="form-label">
        {label}
        {required && <span className="form-required">*</span>}
        {hint && <span className="form-hint"> — {hint}</span>}
      </label>
      {children}
    </div>
  );
}

// Start Node Form with local state
export function StartNodeForm({ nodeId, data }: { nodeId: string; data: StartNodeData }) {
  const { updateNodeData } = useWorkflowStore();
  const [localData, setLocalData] = useState(data);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalData(data);
    setHasChanges(false);
  }, [data]);

  const handleSave = () => {
    updateNodeData(nodeId, localData);
    setHasChanges(false);
  };

  return (
    <div className="node-form">
      <Field label="Start Title" required>
        <input 
          className="form-input" 
          value={localData.title} 
          onChange={e => {
            setLocalData({ ...localData, title: e.target.value });
            setHasChanges(true);
          }} 
          placeholder="e.g. Employee Onboarding" 
        />
      </Field>
      <Field label="Metadata" hint="optional key-value pairs">
        <KeyValueEditor 
          pairs={localData.metadata || []} 
          onChange={metadata => {
            setLocalData({ ...localData, metadata });
            setHasChanges(true);
          }} 
        />
      </Field>
      <div className="form-footer">
        <button className="btn btn-primary" onClick={handleSave} disabled={!hasChanges} style={{ flex: 1, opacity: hasChanges ? 1 : 0.5 }}>
          {hasChanges ? 'Save Changes' : 'Saved ✓'}
        </button>
      </div>
    </div>
  );
}

// Task Node Form
export function TaskNodeForm({ nodeId, data }: { nodeId: string; data: TaskNodeData }) {
  const { updateNodeData } = useWorkflowStore();
  const [localData, setLocalData] = useState(data);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalData(data);
    setHasChanges(false);
  }, [data]);

  const handleSave = () => {
    updateNodeData(nodeId, localData);
    setHasChanges(false);
  };

  return (
    <div className="node-form">
      <Field label="Title" required>
        <input 
          className="form-input" 
          value={localData.title} 
          onChange={e => {
            setLocalData({ ...localData, title: e.target.value });
            setHasChanges(true);
          }} 
          placeholder="Task title" 
        />
      </Field>
      <Field label="Description">
        <textarea 
          className="form-input form-textarea" 
          value={localData.description || ''} 
          onChange={e => {
            setLocalData({ ...localData, description: e.target.value });
            setHasChanges(true);
          }} 
          placeholder="Describe what needs to be done..." 
          rows={3} 
        />
      </Field>
      <Field label="Assignee">
        <input 
          className="form-input" 
          value={localData.assignee || ''} 
          onChange={e => {
            setLocalData({ ...localData, assignee: e.target.value });
            setHasChanges(true);
          }} 
          placeholder="e.g. HR Team / John Doe" 
        />
      </Field>
      <Field label="Due Date">
        <input 
          type="date" 
          className="form-input" 
          value={localData.dueDate || ''} 
          onChange={e => {
            setLocalData({ ...localData, dueDate: e.target.value });
            setHasChanges(true);
          }} 
        />
      </Field>
      <Field label="Custom Fields" hint="optional">
        <KeyValueEditor 
          pairs={localData.customFields || []} 
          onChange={customFields => {
            setLocalData({ ...localData, customFields });
            setHasChanges(true);
          }} 
        />
      </Field>
      <div className="form-footer">
        <button className="btn btn-primary" onClick={handleSave} disabled={!hasChanges} style={{ flex: 1, opacity: hasChanges ? 1 : 0.5 }}>
          {hasChanges ? 'Save Changes' : 'Saved ✓'}
        </button>
      </div>
    </div>
  );
}

const ROLES = ['Manager', 'HRBP', 'Director', 'VP', 'C-Suite'];

// Approval Node Form
export function ApprovalNodeForm({ nodeId, data }: { nodeId: string; data: ApprovalNodeData }) {
  const { updateNodeData } = useWorkflowStore();
  const [localData, setLocalData] = useState(data);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalData(data);
    setHasChanges(false);
  }, [data]);

  const handleSave = () => {
    updateNodeData(nodeId, localData);
    setHasChanges(false);
  };

  return (
    <div className="node-form">
      <Field label="Title" required>
        <input 
          className="form-input" 
          value={localData.title} 
          onChange={e => {
            setLocalData({ ...localData, title: e.target.value });
            setHasChanges(true);
          }} 
          placeholder="Approval step title" 
        />
      </Field>
      <Field label="Approver Role">
        <select 
          className="form-input form-select" 
          value={localData.approverRole || 'Manager'} 
          onChange={e => {
            setLocalData({ ...localData, approverRole: e.target.value });
            setHasChanges(true);
          }}
        >
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </Field>
      <Field label="Auto-Approve Threshold %" hint="0 = disabled">
        <input 
          type="number" 
          className="form-input" 
          min={0} 
          max={100} 
          value={localData.autoApproveThreshold || 0} 
          onChange={e => {
            setLocalData({ ...localData, autoApproveThreshold: Number(e.target.value) });
            setHasChanges(true);
          }} 
        />
      </Field>
      <div className="form-footer">
        <button className="btn btn-primary" onClick={handleSave} disabled={!hasChanges} style={{ flex: 1, opacity: hasChanges ? 1 : 0.5 }}>
          {hasChanges ? 'Save Changes' : 'Saved ✓'}
        </button>
      </div>
    </div>
  );
}

// Automated Node Form
export function AutomatedNodeForm({ nodeId, data }: { nodeId: string; data: AutomatedNodeData }) {
  const { updateNodeData } = useWorkflowStore();
  const { automations, loading } = useAutomations();
  const [localData, setLocalData] = useState(data);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalData(data);
    setHasChanges(false);
  }, [data]);

  const handleSave = () => {
    updateNodeData(nodeId, localData);
    setHasChanges(false);
  };

  const selected = automations.find(a => a.id === localData.actionId);

  return (
    <div className="node-form">
      <Field label="Title" required>
        <input 
          className="form-input" 
          value={localData.title} 
          onChange={e => {
            setLocalData({ ...localData, title: e.target.value });
            setHasChanges(true);
          }} 
          placeholder="Automated step title" 
        />
      </Field>
      <Field label="Action">
        {loading ? <p className="form-loading">Loading actions from API…</p> : (
          <select 
            className="form-input form-select" 
            value={localData.actionId || ''} 
            onChange={e => {
              setLocalData({ ...localData, actionId: e.target.value, actionParams: {} });
              setHasChanges(true);
            }}
          >
            <option value="">— Select an action —</option>
            {automations.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
          </select>
        )}
      </Field>
      {selected && selected.params && selected.params.length > 0 && (
        <Field label="Action Parameters">
          <div className="param-group">
            {selected.params.map(param => (
              <div key={param} className="param-item">
                <div className="param-key">{param}</div>
                <input 
                  className="form-input" 
                  value={localData.actionParams?.[param] || ''} 
                  onChange={e => {
                    setLocalData({ 
                      ...localData, 
                      actionParams: { ...(localData.actionParams || {}), [param]: e.target.value } 
                    });
                    setHasChanges(true);
                  }} 
                  placeholder={`Enter ${param}…`} 
                />
              </div>
            ))}
          </div>
        </Field>
      )}
      <div className="form-footer">
        <button className="btn btn-primary" onClick={handleSave} disabled={!hasChanges} style={{ flex: 1, opacity: hasChanges ? 1 : 0.5 }}>
          {hasChanges ? 'Save Changes' : 'Saved ✓'}
        </button>
      </div>
    </div>
  );
}

// End Node Form
export function EndNodeForm({ nodeId, data }: { nodeId: string; data: EndNodeData }) {
  const { updateNodeData } = useWorkflowStore();
  const [localData, setLocalData] = useState(data);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalData(data);
    setHasChanges(false);
  }, [data]);

  const handleSave = () => {
    updateNodeData(nodeId, localData);
    setHasChanges(false);
  };

  return (
    <div className="node-form">
      <Field label="End Message">
        <input 
          className="form-input" 
          value={localData.endMessage || ''} 
          onChange={e => {
            setLocalData({ ...localData, endMessage: e.target.value });
            setHasChanges(true);
          }} 
          placeholder="e.g. Onboarding complete!" 
        />
      </Field>
      <div className="form-field">
        <div className="form-label toggle-row">
          <span>Show Summary Report</span>
          <button 
            type="button" 
            className={`toggle-switch${localData.showSummary ? ' on' : ''}`} 
            onClick={() => {
              setLocalData({ ...localData, showSummary: !localData.showSummary });
              setHasChanges(true);
            }}
          >
            <span className="toggle-knob" />
          </button>
        </div>
      </div>
      <div className="form-footer">
        <button className="btn btn-primary" onClick={handleSave} disabled={!hasChanges} style={{ flex: 1, opacity: hasChanges ? 1 : 0.5 }}>
          {hasChanges ? 'Save Changes' : 'Saved ✓'}
        </button>
      </div>
    </div>
  );
}