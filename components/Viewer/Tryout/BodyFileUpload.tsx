"use client";

interface FileUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

export default function FileUpload({ file, onChange }: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-600 rounded p-4 text-center">
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer text-blue-400 hover:text-blue-300"
      >
        {file ? `📎 ${file.name}` : "Click to select file"}
      </label>
      {file && (
        <div className="text-xs text-gray-400 mt-1">
          Size: {(file.size / 1024).toFixed(1)} KB
        </div>
      )}
    </div>
  );
}