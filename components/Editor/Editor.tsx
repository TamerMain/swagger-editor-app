'use client';

import CodeMirror from '@uiw/react-codemirror';
import EditorHeader from '@/components/Editor/EditorHeader';
import { createClient } from '@/lib/supabase/client';
import { json } from '@codemirror/lang-json';
import { yaml } from '@codemirror/lang-yaml';
import { oneDark } from '@codemirror/theme-one-dark';
import { useState, useEffect, useRef } from 'react';
import { parseFormat, convertFormat } from '@/lib/formatParser';
import { FORMAT } from '@/constants/constants';
import { type Format } from '@/types/openapi';

type EditorProps = {
  onSpecChange?: (content: string) => void;
};

export default function Editor({ onSpecChange }: EditorProps) {
  const [code, setCode] = useState('');
  const [format, setFormat] = useState<Format>(FORMAT.YAML);
  const [errors, setErrors] = useState<string[]>([]);
  const isInitialLoad = useRef({ isHydrated: false, isAuth: false });
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  const validateContent = async (content: string) => {
    const result = await parseFormat(content);

    if (result.valid) {
      setErrors([]);
      if (result.format && result.format !== format) {
        setFormat(result.format);
      }
      onSpecChange?.(content);
    } else {
      setErrors([result.error || 'Invalid specification']);
      onSpecChange?.('');
    }
  };

  useEffect(() => {
    if (isInitialLoad.current.isHydrated) {
      return;
    }
    isInitialLoad.current.isHydrated = true;

    const loadSpec = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      try {
        let content;

        if (user && !userError) {
          isInitialLoad.current.isAuth = true;
          const { data } = await supabase
            .from('userschema')
            .select('content')
            .eq('user_id', user.id)
            .maybeSingle();

          if (data?.content) {
            content = data.content;
          }
        }

        if (!content) {
          const res = await fetch('/examples/mockoon.yaml');
          content = await res.text();
        }

        setCode(content);
        await validateContent(content);
      } catch (error) {
        setErrors(['Failed to load specification file']);
      }
    };
    loadSpec();
  }, []);

  const handleChange = async (value: string) => {
    setCode(value);
    await validateContent(value);
  };

  const handleFormatSwitch = () => {
    try {
      const newFormat = format === FORMAT.JSON ? FORMAT.YAML : FORMAT.JSON;
      const converted = convertFormat(code, format, newFormat);
      setCode(converted);
      setFormat(newFormat);
      setErrors([]);
    } catch (error) {
      setErrors(['Failed to convert format']);
    }
  };

  const handleSchemaSave = async () => {
    setIsSaving(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user || errors.length !== 0) {
        setIsSaving(false);
        return;
      }

      const { error } = await supabase.from('userschema').upsert(
        {
          user_id: user.id,
          content: code,
        },
        { onConflict: 'user_id' },
      );

      if (error) throw error;
    } catch (error) {
      setErrors(['Failed to save']);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <EditorHeader
        format={format}
        isAuth={isInitialLoad.current.isAuth}
        isSaving={isSaving}
        errors={errors}
        onSchemaClear={() => {
          setCode('');
          validateContent('');
        }}
        onSchemaSave={handleSchemaSave}
        onFormatSwitch={handleFormatSwitch}
      />

      {/* Code Editor */}
      <div className="flex-1">
        <CodeMirror
          value={code}
          height="100%"
          extensions={[format === FORMAT.JSON ? json() : yaml(), oneDark]}
          onChange={handleChange}
          theme="dark"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            foldGutter: true,
          }}
        />
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="sticky bottom-0 w-full p-3 border-t border-red-500 bg-red-900/50">
          {errors.map((error, index) => (
            <div key={index} className="text-sm text-red-400 font-mono">
              ❌ {error}
              {/* <div className="relative inline-block group">
                <span className="text-xs text-white hover:text-blue-400 cursor-help">
                  Read more
                </span>
                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs rounded p-2 whitespace-pre-wrap z-50 shadow-lg">
                 
                </div>
              </div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
