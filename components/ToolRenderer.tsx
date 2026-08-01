import type { ComponentType } from 'react';
import dynamic from 'next/dynamic';

const JsonFormatterTool = dynamic(() => import('./tools/JsonFormatterTool'), { ssr: false });
const ColorPickerConverterTool = dynamic(() => import('./tools/ColorPickerConverterTool'), { ssr: false });
const TimestampConverterTool = dynamic(() => import('./tools/TimestampConverterTool'), { ssr: false });
const TextDiffCheckerTool = dynamic(() => import('./tools/TextDiffCheckerTool'), { ssr: false });
const MarkdownPreviewTool = dynamic(() => import('./tools/MarkdownPreviewTool'), { ssr: false });
const TextCaseConverterTool = dynamic(() => import('./tools/TextCaseConverterTool'), { ssr: false });
const WordCounterTool = dynamic(() => import('./tools/WordCounterTool'), { ssr: false });
const LoremIpsumGeneratorTool = dynamic(() => import('./tools/LoremIpsumGeneratorTool'), { ssr: false });
const CalculatorTool = dynamic(() => import('./tools/CalculatorTool'), { ssr: false });
const PingTestTool = dynamic(() => import('./tools/PingTestTool'), { ssr: false });
const ImageResizerTool = dynamic(() => import('./tools/ImageResizerTool'), { ssr: false });
const PdfCompressorTool = dynamic(() => import('./tools/PdfCompressorTool'), { ssr: false });
const PdfMergeTool = dynamic(() => import('./tools/PdfMergeTool'), { ssr: false });
const PasswordGeneratorTool = dynamic(() => import('./tools/PasswordGeneratorTool'), { ssr: false });
const ImageConverterTool = dynamic(() => import('./tools/ImageConverterTool'), { ssr: false });
const ImageToPdfTool = dynamic(() => import('./tools/ImageToPdfTool'), { ssr: false });
const ImageCompressorTool = dynamic(() => import('./tools/ImageCompressorTool'), { ssr: false });
const ImageCropperTool = dynamic(() => import('./tools/ImageCropperTool'), { ssr: false });
const ImageRotatorFlipperTool = dynamic(() => import('./tools/ImageRotatorFlipperTool'), { ssr: false });
const PdfSplitterTool = dynamic(() => import('./tools/PdfSplitterTool'), { ssr: false });
const PdfToImageTool = dynamic(() => import('./tools/PdfToImageTool'), { ssr: false });
const QrCodeGeneratorTool = dynamic(() => import('./tools/QrCodeGeneratorTool'), { ssr: false });
const BarcodeGeneratorTool = dynamic(() => import('./tools/BarcodeGeneratorTool'), { ssr: false });
const RandomNumberGeneratorTool = dynamic(() => import('./tools/RandomNumberGeneratorTool'), { ssr: false });
const JwtDecoderTool = dynamic(() => import('./tools/JwtDecoderTool'), { ssr: false });
const UrlEncoderTool = dynamic(() => import('./tools/UrlEncoderTool'), { ssr: false });
const RegexTesterTool = dynamic(() => import('./tools/RegexTesterTool'), { ssr: false });
const UuidGeneratorTool = dynamic(() => import('./tools/UuidGeneratorTool'), { ssr: false });
const Base64EncoderTool = dynamic(() => import('./tools/Base64EncoderTool'), { ssr: false });
const Sha256GeneratorTool = dynamic(() => import('./tools/Sha256GeneratorTool'), { ssr: false });

const toolComponents: Record<string, ComponentType> = {
  'json-formatter': JsonFormatterTool,
  'color-picker-converter': ColorPickerConverterTool,
  'timestamp-converter': TimestampConverterTool,
  'text-diff-checker': TextDiffCheckerTool,
  'markdown-preview': MarkdownPreviewTool,
  'text-case-converter': TextCaseConverterTool,
  'word-counter': WordCounterTool,
  'lorem-ipsum-generator': LoremIpsumGeneratorTool,
  calculator: CalculatorTool,
  'ping-test': PingTestTool,
  'image-resizer': ImageResizerTool,
  'pdf-compressor': PdfCompressorTool,
  'pdf-merge': PdfMergeTool,
  'password-generator': PasswordGeneratorTool,
  'image-converter': ImageConverterTool,
  'image-to-pdf': ImageToPdfTool,
  'image-compressor': ImageCompressorTool,
  'image-cropper': ImageCropperTool,
  'image-rotator-flipper': ImageRotatorFlipperTool,
  'pdf-splitter': PdfSplitterTool,
  'pdf-to-image': PdfToImageTool,
  'qr-code-generator': QrCodeGeneratorTool,
  'barcode-generator': BarcodeGeneratorTool,
  'random-number-generator': RandomNumberGeneratorTool,
  'jwt-decoder': JwtDecoderTool,
  'url-encoder': UrlEncoderTool,
  'regex-tester': RegexTesterTool,
  'uuid-generator': UuidGeneratorTool,
  'base64-encoder': Base64EncoderTool,
  'sha-256-generator': Sha256GeneratorTool,
};

export default function ToolRenderer({ slug }: { slug: string }) {
  const Component = toolComponents[slug];
  if (!Component) {
    return (
      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-8 text-sm text-slate-700 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.3)] dark:border-slate-800/70 dark:bg-slate-900/95 dark:text-slate-300">
        This tool is under development. Please check back later or choose another tool from the list.
      </div>
    );
  }

  return <Component />;
}
