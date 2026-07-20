'use client';

import CodeMirror from '@uiw/react-codemirror';
import EditorHeader from '@/components/Editor/EditorHeader';
import { json } from '@codemirror/lang-json';
import { yaml } from '@codemirror/lang-yaml';
import { oneDark } from '@codemirror/theme-one-dark';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { parseFormat, convertFormat } from '@/lib/formatParser';
import { FORMAT } from '@/constants/constants';
import { type Format } from '@/types/openapi';
import { useToast } from '@/lib/context/ToastContext';
import { useAuth } from '@/lib/context/AuthContext';
import { loadSchema, saveSchema } from '@/app/actions/editor';
import { debounce } from '@/lib/debounce';
import { useTranslations } from 'next-intl';

type EditorProps = {
  onSpecChange?: (content: string) => void;
};

export default function Editor({ onSpecChange }: EditorProps) {
  const t = useTranslations('Editor');
  const [code, setCode] = useState('');
  const [format, setFormat] = useState<Format>(FORMAT.YAML);
  const [errors, setErrors] = useState<string[]>([]);
  const isInitialLoad = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const { showErrorToast, showSuccessToast } = useToast();
  const { user } = useAuth();

  const validateContent = useCallback(
    async (content: string) => {
      const result = await parseFormat(content);

      if (result.valid) {
        setErrors([]);
        if (result.format && result.format !== format) {
          setFormat(result.format);
        }
        onSpecChange?.(content);
      } else {
        setErrors([result.error || t('errors.invalidSpec')]);
        onSpecChange?.('');
      }
    },
    [format, onSpecChange, t],
  );

  const loadSpec = useCallback(async () => {
    try {
      let content;
      if (user) {
        const data = await loadSchema();
        if (data) {
          content = data;
        }
      }
      if (!content) {
        const res = await fetch('/examples/mockoon.yaml');
        content = await res.text();
      }

      setCode(content);
      await validateContent(content);
    } catch {
      setErrors([t('errors.loadFailed')]);
    }
  }, [user, validateContent, t]);

  useEffect(() => {
    if (isInitialLoad.current) return;
    isInitialLoad.current = true;
    loadSpec();
  }, [loadSpec]);

  const handleCodeChange = useMemo(
    () =>
      debounce(async (value: string) => {
        setCode(value);
        await validateContent(value);
      }, 300),
    [validateContent],
  );

  const handleFormatSwitch = () => {
    try {
      const newFormat = format === FORMAT.JSON ? FORMAT.YAML : FORMAT.JSON;
      const converted = convertFormat(code, format, newFormat);
      setCode(converted);
      setFormat(newFormat);
      setErrors([]);
    } catch {
      setErrors([t('errors.convertFailed')]);
    }
  };

  const handleSchemaSave = async () => {
    setIsSaving(true);
    try {
      if (!user) {
        showErrorToast(t('toasts.signInToSave'));
        return;
      }
      if (errors.length > 0) {
        showErrorToast(t('toasts.cantSaveWithErrors'));
        return;
      }
      await saveSchema(code);
      showSuccessToast(t('toasts.saved'));
    } catch {
      showErrorToast(t('toasts.saveFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <EditorHeader
        format={format}
        isAuth={!!user}
        isSaving={isSaving}
        errors={errors}
        onSchemaClear={() => {
          setCode('');
          validateContent('');
        }}
        onSchemaSave={handleSchemaSave}
        onFormatSwitch={handleFormatSwitch}
      />

      <div className="flex-1">
        <CodeMirror
          key={format}
          value={code}
          height="100%"
          extensions={[format === FORMAT.JSON ? json() : yaml(), oneDark]}
          onChange={handleCodeChange}
          theme="dark"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            foldGutter: true,
          }}
        />
      </div>

      {errors.length > 0 && (
        <div className="sticky bottom-0 w-full p-3 border-t border-red-500 bg-red-950">
          {errors.map((error, index) => (
            <div key={index} className="text-sm text-red-400 font-mono">
              {t('validationFailed')}{' '}
              <div className="relative inline-block group">
                <span className="text-sm text-white hover:text-blue-400 cursor-help">
                  {t('readMore')}
                </span>
                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-[#282c34] border border-neutral-800 text-gray-400 text-xs rounded p-2 whitespace-pre-wrap z-50 shadow-lg">
                  {error}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
