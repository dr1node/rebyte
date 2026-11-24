'use client';

import { useState } from 'react';
import FileDropzone from '../FileDropzone';
import { useLanguage } from '../../lib/LanguageContext';
import { downloadBlob } from '../../lib/downloadFile';

function escapeXmlText(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeXmlAttribute(value: string) {
  return escapeXmlText(value)
    .replace(/"/g, '&quot;')
    .replace(/\t/g, '&#x9;')
    .replace(/\n/g, '&#xA;')
    .replace(/\r/g, '&#xD;');
}

function serializeXmlNode(node: Node, depth: number, indent: string, serializer: XMLSerializer): string {
  const padding = indent.repeat(depth);
  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element;
    const attributes = Array.from(element.attributes)
      .map((attribute) => ` ${attribute.name}="${escapeXmlAttribute(attribute.value)}"`)
      .join('');
    const children = Array.from(element.childNodes);
    if (!children.length) return `${padding}<${element.tagName}${attributes}/>`;

    const hasElements = children.some((child) => child.nodeType === Node.ELEMENT_NODE);
    const hasText = children.some(
      (child) => child.nodeType === Node.TEXT_NODE && Boolean(child.nodeValue?.trim()),
    );
    if (hasElements && hasText) return `${padding}${serializer.serializeToString(element)}`;

    const openTag = `<${element.tagName}${attributes}>`;
    const closeTag = `</${element.tagName}>`;
    if (!hasElements) {
      return `${padding}${openTag}${children.map((child) => serializeXmlNode(child, 0, '', serializer)).join('')}${closeTag}`;
    }

    const formattedChildren = children
      .filter((child) => child.nodeType !== Node.TEXT_NODE || Boolean(child.nodeValue?.trim()))
      .map((child) => serializeXmlNode(child, depth + 1, indent, serializer));
    if (!formattedChildren.length) return `${padding}<${element.tagName}${attributes}/>`;
    return `${padding}${openTag}\n${formattedChildren.join('\n')}\n${padding}${closeTag}`;
  }

  if (node.nodeType === Node.TEXT_NODE) return escapeXmlText(node.nodeValue ?? '');
  if (node.nodeType === Node.CDATA_SECTION_NODE) return `<![CDATA[${node.nodeValue ?? ''}]]>`;
  if (node.nodeType === Node.COMMENT_NODE) return `${padding}<!--${node.nodeValue ?? ''}-->`;
  if (node.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
    const instruction = node as ProcessingInstruction;
    return `${padding}<?${instruction.target}${instruction.data ? ` ${instruction.data}` : ''}?>`;
  }
  if (node.nodeType === Node.DOCUMENT_TYPE_NODE) return `${padding}${serializer.serializeToString(node)}`;
  return '';
}

function formatXml(source: string, indentation: number) {
  const document = new DOMParser().parseFromString(source, 'application/xml');
  const root = document.documentElement;
  if (
    root?.localName === 'parsererror' &&
    root.namespaceURI === 'http://www.mozilla.org/newlayout/xml/parsererror.xml'
  ) {
    throw new Error('Invalid XML document.');
  }

  const serializer = new XMLSerializer();
  const indent = ' '.repeat(indentation);
  const declaration = source.match(/^\uFEFF?\s*(<\?xml\b[^?]*\?>)/i)?.[1];
  const content = Array.from(document.childNodes)
    .filter((node) => node.nodeType !== Node.TEXT_NODE || Boolean(node.nodeValue?.trim()))
    .map((node) => serializeXmlNode(node, 0, indent, serializer))
    .filter(Boolean)
    .join('\n');

  return declaration ? `${declaration}\n${content}` : content;
}

export default function XmlFormatterTool() {
  const { language } = useLanguage();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentation, setIndentation] = useState(2);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [copied, setCopied] = useState(false);

  const labels = language === 'id'
    ? {
        description: 'Rapikan XML dengan indentasi yang mudah dibaca atau validasi strukturnya. Semua pemeriksaan dilakukan lokal di browser.',
        input: 'Input XML',
        output: 'Hasil XML',
        placeholder: 'Tempel XML di sini...',
        upload: 'Unggah file XML',
        fileHint: 'File XML diproses lokal di browser (maksimum 10 MB).',
        removeFile: 'Hapus file',
        indent: 'Indentasi',
        twoSpaces: '2 spasi',
        fourSpaces: '4 spasi',
        format: 'Format XML',
        validate: 'Validasi XML',
        copy: 'Salin hasil',
        copied: 'Tersalin',
        download: 'Unduh XML',
        valid: 'XML valid.',
        invalid: 'XML tidak valid. Periksa tag, atribut, dan struktur dokumen.',
        readError: 'Tidak dapat membaca file XML.',
        fileTooLarge: 'Ukuran file maksimum adalah 10 MB.',
        copyError: 'Tidak dapat menyalin. Periksa izin clipboard browser.',
        downloadError: 'Tidak dapat mengunduh file XML.',
        localNote: 'File dan teks tidak dikirim ke server.',
      }
    : {
        description: 'Format XML with readable indentation or validate its structure. All checks run locally in your browser.',
        input: 'XML input',
        output: 'XML output',
        placeholder: 'Paste XML here...',
        upload: 'Upload XML file',
        fileHint: 'XML file is processed locally in your browser (up to 10 MB).',
        removeFile: 'Remove file',
        indent: 'Indentation',
        twoSpaces: '2 spaces',
        fourSpaces: '4 spaces',
        format: 'Format XML',
        validate: 'Validate XML',
        copy: 'Copy result',
        copied: 'Copied',
        download: 'Download XML',
        valid: 'XML is valid.',
        invalid: 'Invalid XML. Check the tags, attributes, and document structure.',
        readError: 'Unable to read the XML file.',
        fileTooLarge: 'The maximum file size is 10 MB.',
        copyError: 'Unable to copy. Check your browser clipboard permissions.',
        downloadError: 'Unable to download the XML file.',
        localNote: 'Files and text are never sent to a server.',
      };

  const handleFile = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setError('');
    setStatus('');
    setOutput('');
    setCopied(false);
    if (file.size > 10 * 1024 * 1024) {
      setError(labels.fileTooLarge);
      return;
    }
    try {
      setInput(await file.text());
    } catch {
      setError(labels.readError);
    }
  };

  const run = (validateOnly: boolean) => {
    setError('');
    setStatus('');
    setCopied(false);
    try {
      if (!input.trim()) throw new Error('XML input is empty.');
      const formatted = formatXml(input, indentation);
      if (validateOnly) {
        setOutput(input);
        setStatus(labels.valid);
      } else {
        setOutput(formatted);
        setStatus(labels.valid);
      }
    } catch {
      setOutput('');
      setError(labels.invalid);
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setError('');
    } catch {
      setError(labels.copyError);
    }
  };

  const downloadOutput = () => {
    if (!output || error) return;
    try {
      downloadBlob(new Blob([output], { type: 'application/xml;charset=utf-8' }), 'formatted.xml');
      setError('');
    } catch (caughtError) {
      console.error('Unable to download formatted XML:', caughtError);
      setError(labels.downloadError);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{labels.description}</p>
        <p className="mt-3 text-xs font-medium text-sky-700 dark:text-sky-300">{labels.localNote}</p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">
            {labels.indent}
            <select
              value={indentation}
              onChange={(event) => setIndentation(Number(event.target.value))}
              className="ml-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-normal dark:border-slate-800 dark:bg-slate-900"
            >
              <option value={2}>{labels.twoSpaces}</option>
              <option value={4}>{labels.fourSpaces}</option>
            </select>
          </label>
          <FileDropzone
            accept=".xml,text/xml,application/xml,.txt,text/plain"
            label={labels.upload}
            hint={labels.fileHint}
            onFiles={(files) => void handleFile(files)}
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-900 dark:text-white">
            {labels.input}
            <textarea
              rows={14}
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setOutput('');
                setStatus('');
                setError('');
                setCopied(false);
              }}
              spellCheck={false}
              placeholder={labels.placeholder}
              className="mt-3 w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-4 font-mono text-sm leading-6 text-slate-900 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-slate-800"
            />
          </label>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{labels.output}</p>
              <button
                type="button"
                onClick={downloadOutput}
                disabled={!output || Boolean(error)}
                className="rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {labels.download}
              </button>
            </div>
            <textarea
              rows={14}
              value={output}
              readOnly
              aria-live="polite"
              className="w-full rounded-3xl border border-slate-200/80 bg-slate-50 p-4 font-mono text-sm leading-6 text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {error ? <p role="alert" className="mt-4 rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">{error}</p> : null}
        {status ? <p role="status" className="mt-4 rounded-3xl border border-emerald-300/70 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">{status}</p> : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={() => run(false)} className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
            {labels.format}
          </button>
          <button type="button" onClick={() => run(true)} className="rounded-3xl bg-sky-100 px-5 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-200 dark:bg-sky-900/30 dark:text-sky-200">
            {labels.validate}
          </button>
          <button
            type="button"
            onClick={() => void copyOutput()}
            disabled={!output}
            className="rounded-3xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-sky-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-200 dark:hover:border-sky-500"
          >
            {copied ? labels.copied : labels.copy}
          </button>
        </div>
      </div>
    </div>
  );
}
