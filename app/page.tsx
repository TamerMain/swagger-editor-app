'use client';

import { useState } from 'react';
import FormatEditor from '@/components/FormatEditor';
import FormatViewer from '@/components/FormatViewer';
import { parseFormat } from '@/lib/formatParser';
import type { OpenAPISpec } from '@/types/openapi';

export default function Home() {
  const [spec, setSpec] = useState<OpenAPISpec | null>(null);
  const [isValid, setIsValid] = useState(false);

  const handleEditorChange = async (content: string) => {
    const result = await parseFormat(content);
    
    if (result.valid) {
      setSpec(result.data);
      setIsValid(true);
    } else {  
      setSpec(null);
      setIsValid(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2">
        <FormatEditor onSpecChange={handleEditorChange} />
      </div>
      <div className="w-1/2 border-l border-gray-700 overflow-y-auto p-4">
        <FormatViewer spec={spec} isValid={isValid} />
      </div>
    </div>
  );
}