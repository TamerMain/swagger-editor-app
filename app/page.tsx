"use client";

import { useState } from "react";
import Editor from "@/components/Editor";
import Viewer from "@/components/Viewer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { parseFormat } from "@/lib/formatParser";
import type { OpenAPISpec } from "@/types/openapi";

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
    <>
      <Header />
      <div className="flex">
        <div className="w-1/2">
          <Editor onSpecChange={handleEditorChange} />
        </div>
        <div className="w-1/2 border-l border-gray-700 overflow-y-auto p-4">
          <Viewer spec={spec} isValid={isValid} />
        </div>
      </div>
      <Footer />
    </>
  );
}
