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
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm disabled:opacity-50"
    >
      {loading ? "⏳ Sending..." : "🚀 Execute"}
    </button>
  );
}