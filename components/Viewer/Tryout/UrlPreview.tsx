"use client";

interface UrlPreviewProps {
  url: string;
}

export default function UrlPreview({ url }: UrlPreviewProps) {
  return (
    <div className="p-2 bg-neutral-800 rounded text-xs">
      <span className="text-neutral-500">Request URL: </span>
      <span className="text-blue-400 font-mono">{url}</span>
    </div>
  );
}