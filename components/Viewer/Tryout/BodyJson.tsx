"use client";

interface JsonBodyProps {
  value: string;
  onChange: (value: string) => void;
}

export default function JsonBody({ value, onChange }: JsonBodyProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-32 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm font-mono"
      placeholder='{"key": "value"}'
    />
  );
}