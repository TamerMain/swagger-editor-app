"use client";

type BodyType = "json" | "formdata" | "file";

interface BodySelectorProps {
  bodyType: BodyType;
  onChange: (type: BodyType) => void;
}

export default function BodySelector({ bodyType, onChange }: BodySelectorProps) {
  const types: BodyType[] = ["json", "formdata", "file"];

  return (
    <div className="flex gap-2 flex-wrap">
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={`px-3 py-1 text-sm rounded capitalize ${
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