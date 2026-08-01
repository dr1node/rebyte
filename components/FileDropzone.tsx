'use client';

import { useRef, useState, type DragEvent, type KeyboardEvent } from 'react';
import { FileUp } from 'lucide-react';

interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  label: string;
  hint?: string;
  // eslint-disable-next-line no-unused-vars
  onFiles: (fileList: File[]) => void;
}

const matchesAcceptedType = (file: File, accept: string) => {
  if (!accept.trim()) return true;

  return accept.split(',').some((rule) => {
    const normalizedRule = rule.trim().toLowerCase();
    const fileType = file.type.toLowerCase();
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;

    if (normalizedRule.endsWith('/*')) return fileType.startsWith(normalizedRule.slice(0, -1));
    if (normalizedRule.startsWith('.')) return fileExtension === normalizedRule;
    return fileType === normalizedRule;
  });
};

export default function FileDropzone({ accept = '', multiple = false, label, hint, onFiles }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState('');

  const processFiles = (selectedFiles: File[]) => {
    const files = multiple ? selectedFiles : selectedFiles.slice(0, 1);
    const invalidFile = files.find((file) => !matchesAcceptedType(file, accept));

    if (invalidFile) {
      setValidationError(`Unsupported file type. Accepted: ${accept || 'any file'}.`);
      return;
    }

    if (!files.length) return;
    setValidationError('');
    onFiles(files);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    processFiles(Array.from(event.dataTransfer.files));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={handleKeyDown}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        if (event.currentTarget === event.target) setIsDragging(false);
      }}
      onDrop={handleDrop}
      className={`group cursor-pointer rounded-3xl border-2 border-dashed p-6 text-center outline-none transition-all duration-200 focus-visible:ring-4 focus-visible:ring-sky-100 dark:focus-visible:ring-slate-800 ${
        isDragging
          ? 'border-sky-500 bg-sky-50 shadow-lg shadow-sky-500/10 dark:border-sky-400 dark:bg-sky-950/40'
          : 'border-slate-300 bg-slate-50 hover:border-sky-400 hover:bg-sky-50/70 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-500 dark:hover:bg-slate-800'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(event) => {
          processFiles(Array.from(event.target.files ?? []));
          event.target.value = '';
        }}
        className="sr-only"
      />
      <FileUp className={`mx-auto h-8 w-8 transition-colors ${isDragging ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'}`} aria-hidden="true" />
      <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">{isDragging ? 'Drop files here' : label}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{hint ?? `Drag and drop ${multiple ? 'files' : 'a file'} here, or click to browse.`}</p>
      {accept ? <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">Accepted: {accept}</p> : null}
      {validationError ? <p className="mt-3 text-sm font-medium text-rose-600 dark:text-rose-300" role="alert">{validationError}</p> : null}
    </div>
  );
}
