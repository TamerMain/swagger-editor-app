'use client';

import { useState } from 'react';
import Editor from '@/components/Editor/Editor';
import Viewer from '@/components/Viewer/Viewer';
import { parseFormat } from '@/lib/formatParser';
import { Spec } from '@/types/openapi';

export default function Home() {
  const [spec, setSpec] = useState<Spec | null>(null);
  const [isValid, setIsValid] = useState(false);

  const handleEditorChange = async (content: string) => {
    const result = await parseFormat(content);

    if (result.valid && result.data) {
      setSpec(result.data);
      setIsValid(true);
    } else {  
      setSpec(null);
      setIsValid(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row landscape:flex-row flex-1 overflow-hidden ">
      <div className="w-full lg:w-1/2 landscape:w-1/2 h-1/2 lg:h-full landscape:h-full scroll-container overflow-auto scrollbar-thin scrollbar-thumb-neutral-400">
        <Editor onSpecChange={handleEditorChange} />
      </div>
      <div className="w-full lg:w-1/2 landscape:w-1/2 h-1/2 lg:h-full landscape:h-full p-4 border-t lg:border-t-0 lg:border-l landscape:border-l border-gray-700 scroll-container overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-400">
        <Viewer spec={spec} isValid={isValid} />
      </div>
    </div>
  );
}
