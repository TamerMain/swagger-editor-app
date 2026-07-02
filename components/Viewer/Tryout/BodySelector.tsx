"use client";

type BodyType = "JSON" | "Form Data" | "File";

interface BodySelectorProps {
  bodyType: BodyType;
  onChange: (type: BodyType) => void;
}

export default function BodySelector({ bodyType, onChange }: BodySelectorProps) {
  const types: BodyType[] = ["JSON", "Form Data", "File"];

  return (
    <div className="flex gap-2 flex-wrap">
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={`px-3 py-1 text-xs rounded capitalize ${
            bodyType === type
              ? "border-2 border-blue-700  hover:border-blue-700/70 "
              : "bg-neutral-700 hover:bg-neutral-600"
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  );
}