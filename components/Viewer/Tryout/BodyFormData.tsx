"use client";

import { useState } from "react";

interface FormDataBuilderProps {
  values: Record<string, string | File>;
  onChange: (key: string, value: string | File) => void;
  onRemove: (key: string) => void;
}

export default function FormDataBuilder({
  values,
  onChange,
  onRemove,
}: FormDataBuilderProps) {
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const addField = () => {
    if (newKey && newValue) {
      onChange(newKey, newValue);
      setNewKey("");
      setNewValue("");
    }
  };

  return (
    <div className="space-y-2">
      {Object.entries(values).map(([key, value]) => (
        <div key={key} className="flex gap-2">
          <input
            type="text"
            value={key}
            onChange={(e) => {
              const newValues = { ...values };
              delete newValues[key];
              // We'll handle this by removing and re-adding
              // Actually, let's keep it simple - just don't allow key editing
            }}
            placeholder="Key"
            className="flex-1 px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-white text-sm"
            disabled={true} // Disable editing existing keys for simplicity
          />
          {value instanceof File ? (
            <span className="text-xs text-gray-400">{value.name}</span>
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(key, e.target.value)}
              placeholder="Value"
              className="flex-1 px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-white text-sm"
            />
          )}
          <button
            onClick={() => onRemove(key)}
            className="text-red-400 hover:text-red-300"
          >
            ✕
          </button>
        </div>
      ))}
      
      <div className="flex gap-2">
        <input
          type="text"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="New key"
          className="flex-1 px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-white text-sm"
        />
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="New value"
          className="flex-1 px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-white text-sm"
        />
        <button
          onClick={addField}
          className="px-3 py-1 border-2 border-blue-700 bg-blue-900 hover:border-blue-700/70 hover:bg-blue-900/70 rounded text-white text-sm"
        >
          Add
        </button>
      </div>
    </div>
  );
}