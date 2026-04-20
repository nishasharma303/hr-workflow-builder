import type { KeyValuePair } from '../../types';

interface KeyValueEditorProps {
  pairs: KeyValuePair[];
  onChange: (pairs: KeyValuePair[]) => void;
  label?: string;
}

export function KeyValueEditor({ pairs, onChange, label = 'Custom Fields' }: KeyValueEditorProps) {
  const addPair = () => onChange([...pairs, { key: '', value: '' }]);

  const removePair = (index: number) => onChange(pairs.filter((_, i) => i !== index));

  const updatePair = (index: number, field: 'key' | 'value', val: string) => {
    const updated = pairs.map((p, i) => (i === index ? { ...p, [field]: val } : p));
    onChange(updated);
  };

  return (
    <div className="form-section">
      <div className="form-label-row">
        <label className="form-label">{label}</label>
        <button className="btn-add" onClick={addPair} type="button">+ Add</button>
      </div>
      {pairs.map((pair, i) => (
        <div key={i} className="kv-row">
          <input
            className="form-input kv-input"
            placeholder="Key"
            value={pair.key}
            onChange={(e) => updatePair(i, 'key', e.target.value)}
          />
          <input
            className="form-input kv-input"
            placeholder="Value"
            value={pair.value}
            onChange={(e) => updatePair(i, 'value', e.target.value)}
          />
          <button className="btn-remove" onClick={() => removePair(i)} type="button">×</button>
        </div>
      ))}
    </div>
  );
}
