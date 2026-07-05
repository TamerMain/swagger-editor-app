import { useState } from 'react';
import { Operation } from '@/types/openapi';
import { BODY_TYPES, TRY_IT_OUT_FIELDS } from '@/constants/constants';
import { BodyTypes } from '@/types/openapi';

type FormDataField = { key: string; value: string | File };

type TryBodyProps = {
  requestBody: Operation['requestBody'];
  method: string;
};

export default function TryBody({ requestBody, method }: TryBodyProps) {
  const [bodyType, setBodyType] = useState<BodyTypes>(BODY_TYPES.JSON);
  const [body, setBody] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Record<string, FormDataField>>({});

  if (!requestBody || ['get', 'delete'].includes(method.toLowerCase())) {
    return null;
  }

  const addField = () => {
    const id =
      Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    setFormData({ ...formData, [id]: { key: '', value: '' } });
  };

  const deleteField = (id: string) => {
    const newData = { ...formData };
    delete newData[id];
    setFormData(newData);
  };

  const updateField = (id: string, field: Partial<FormDataField>) => {
    setFormData({
      ...formData,
      [id]: { ...formData[id], ...field },
    });
  };

  return (
    <div>
      <label className="text-xs text-neutral-400 block mb-1">
        Request Body{' '}
        {requestBody.required && <span className="text-red-400">*</span>}
      </label>
      <input
        type="hidden"
        name={TRY_IT_OUT_FIELDS.BODY.CURRENT_TYPE}
        value={bodyType}
      />
      <div className="flex gap-1 mb-2">
        {Object.values(BODY_TYPES).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setBodyType(type)}
            className={`px-2 py-0.5 text-xs border-2 rounded capitalize ${
              bodyType === type
                ? 'border-blue-600'
                : 'bg-neutral-800 hover:bg-neutral-900 border-neutral-700 hover:border-neutral-800'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Body inputs */}
      {bodyType === BODY_TYPES.JSON && (
        <textarea
          name={TRY_IT_OUT_FIELDS.BODY.JSON}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={'{\n  "key": "value"\n}'}
          className="w-full h-24 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white text-xs font-mono"
        />
      )}

      {bodyType === BODY_TYPES.TEXT && (
        <textarea
          name={TRY_IT_OUT_FIELDS.BODY.TEXT}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Plain text content"
          className="w-full h-24 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white text-xs font-mono"
        />
      )}

      {bodyType === BODY_TYPES.FILE && (
        <input
          name={TRY_IT_OUT_FIELDS.BODY.FILE}
          type="file"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white text-xs"
        />
      )}

      {bodyType === BODY_TYPES.FORM_DATA && (
        <div className="space-y-1">
          {Object.entries(formData).map(([id, field]) => (
            <div key={id} className="flex gap-2">
              <input
                name={`${TRY_IT_OUT_FIELDS.BODY.FORM_DATA.KEY}_${id}`}
                type="text"
                value={field.key}
                onChange={(e) => updateField(id, { key: e.target.value })}
                placeholder="key"
                className="flex-1 px-2 py-1 bg-neutral-900 border border-neutral-700 rounded text-white text-xs"
              />
              <input
                name={`${TRY_IT_OUT_FIELDS.BODY.FORM_DATA.VALUE}_${id}`}
                type="text"
                value={
                  field.value instanceof File
                    ? field.value.name
                    : String(field.value)
                }
                onChange={(e) => updateField(id, { value: e.target.value })}
                placeholder="value"
                className="flex-1 px-2 py-1 bg-neutral-900 border border-neutral-700 rounded text-white text-xs"
              />
              <button
                type="button"
                onClick={() => deleteField(id)}
                className="text-red-400 text-xs"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addField}
            className="text-white hover:text-blue-400 text-xs"
          >
            + Add Field
          </button>
        </div>
      )}
    </div>
  );
}
