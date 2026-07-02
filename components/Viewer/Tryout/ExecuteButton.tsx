"use client";

interface ExecuteButtonProps {
  loading: boolean;
  onClick: () => void;
}

export default function ExecuteButton({ loading, onClick }: ExecuteButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-4 py-2 border-2 border-blue-700 bg-blue-900  hover:border-blue-700/70 hover:bg-blue-900/70 rounded text-white text-sm disabled:opacity-50"
    >
      {loading ? "⏳ Sending..." : "🚀 Execute"}
    </button>
  );
}