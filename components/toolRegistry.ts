import type { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import type { ToolSlug } from '../lib/tools';

const JsonFormatterTool = dynamic(() => import('./tools/JsonFormatterTool'), { ssr: false });
const CsvJsonConverterTool = dynamic(() => import('./tools/CsvJsonConverterTool'), { ssr: false });
const UnitConverterTool = dynamic(() => import('./tools/UnitConverterTool'), { ssr: false });
const XmlFormatterTool = dynamic(() => import('./tools/XmlFormatterTool'), { ssr: false });
const DateDifferenceCalculatorTool = dynamic(() => import('./tools/DateDifferenceCalculatorTool'), { ssr: false });
const CssGradientShadowGeneratorTool = dynamic(() => import('./tools/CssGradientShadowGeneratorTool'), { ssr: false });
const QrCodeScannerTool = dynamic(() => import('./tools/QrCodeScannerTool'), { ssr: false });
const ColorPickerConverterTool = dynamic(() => import('./tools/ColorPickerConverterTool'), { ssr: false });
const TimestampConverterTool = dynamic(() => import('./tools/TimestampConverterTool'), { ssr: false });
const TextDiffCheckerTool = dynamic(() => import('./tools/TextDiffCheckerTool'), { ssr: false });
const MarkdownPreviewTool = dynamic(() => import('./tools/MarkdownPreviewTool'), { ssr: false });
const TextCaseConverterTool = dynamic(() => import('./tools/TextCaseConverterTool'), { ssr: false });
const WordCounterTool = dynamic(() => import('./tools/WordCounterTool'), { ssr: false });
const LoremIpsumGeneratorTool = dynamic(() => import('./tools/LoremIpsumGeneratorTool'), { ssr: false });
const TextCleanerTool = dynamic(() => import('./tools/TextCleanerTool'), { ssr: false });
const DuplicateLineRemoverTool = dynamic(() => import('./tools/DuplicateLineRemoverTool'), { ssr: false });
const TextSorterTool = dynamic(() => import('./tools/TextSorterTool'), { ssr: false });
const CalculatorTool = dynamic(() => import('./tools/CalculatorTool'), { ssr: false });
const PingTestTool = dynamic(() => import('./tools/PingTestTool'), { ssr: false });
const ImageResizerTool = dynamic(() => import('./tools/ImageResizerTool'), { ssr: false });
const PdfCompressorTool = dynamic(() => import('./tools/PdfCompressorTool'), { ssr: false });
const PdfMergeTool = dynamic(() => import('./tools/PdfMergeTool'), { ssr: false });
const PasswordGeneratorTool = dynamic(() => import('./tools/PasswordGeneratorTool'), { ssr: false });
const ImageConverterTool = dynamic(() => import('./tools/ImageConverterTool'), { ssr: false });
const ImageToPdfTool = dynamic(() => import('./tools/ImageToPdfTool'), { ssr: false });
const ImageCompressorTool = dynamic(() => import('./tools/ImageCompressorTool'), { ssr: false });
const RemoveBackgroundTool = dynamic(() => import('./tools/RemoveBackgroundTool'), { ssr: false });
const ImageCropperTool = dynamic(() => import('./tools/ImageCropperTool'), { ssr: false });
const ImageRotatorFlipperTool = dynamic(() => import('./tools/ImageRotatorFlipperTool'), { ssr: false });
const ExifMetadataViewerTool = dynamic(() => import('./tools/ExifMetadataViewerTool'), { ssr: false });
const ExifMetadataRemoverTool = dynamic(() => import('./tools/ExifMetadataRemoverTool'), { ssr: false });
const SvgOptimizerTool = dynamic(() => import('./tools/SvgOptimizerTool'), { ssr: false });
const PdfSplitterTool = dynamic(() => import('./tools/PdfSplitterTool'), { ssr: false });
const PdfToImageTool = dynamic(() => import('./tools/PdfToImageTool'), { ssr: false });
const PdfPageOrganizerTool = dynamic(() => import('./tools/PdfPageOrganizerTool'), { ssr: false });
const PdfMetadataRemoverTool = dynamic(() => import('./tools/PdfMetadataRemoverTool'), { ssr: false });
const PdfWatermarkTool = dynamic(() => import('./tools/PdfWatermarkTool'), { ssr: false });
const QrCodeGeneratorTool = dynamic(() => import('./tools/QrCodeGeneratorTool'), { ssr: false });
const BarcodeGeneratorTool = dynamic(() => import('./tools/BarcodeGeneratorTool'), { ssr: false });
const RandomNumberGeneratorTool = dynamic(() => import('./tools/RandomNumberGeneratorTool'), { ssr: false });
const JwtDecoderTool = dynamic(() => import('./tools/JwtDecoderTool'), { ssr: false });
const UrlEncoderTool = dynamic(() => import('./tools/UrlEncoderTool'), { ssr: false });
const BinaryTranslatorTool = dynamic(() => import('./tools/BinaryTranslatorTool'), { ssr: false });
const Mp3CutterTool = dynamic(() => import('./tools/Mp3CutterTool'), { ssr: false });
const AudioConverterTool = dynamic(() => import('./tools/AudioConverterTool'), { ssr: false });
const AudioVisualizerTool = dynamic(() => import('./tools/AudioVisualizerTool'), { ssr: false });
const Mp3MetadataEditorTool = dynamic(() => import('./tools/Mp3MetadataEditorTool'), { ssr: false });
const AudioVolumeBoosterTool = dynamic(() => import('./tools/AudioVolumeBoosterTool'), { ssr: false });
const RegexTesterTool = dynamic(() => import('./tools/RegexTesterTool'), { ssr: false });
const UuidGeneratorTool = dynamic(() => import('./tools/UuidGeneratorTool'), { ssr: false });
const Base64EncoderTool = dynamic(() => import('./tools/Base64EncoderTool'), { ssr: false });
const HashGeneratorTool = dynamic(() => import('./tools/HashGeneratorTool'), { ssr: false });
const InvoiceMakerTool = dynamic(() => import('./tools/InvoiceMakerTool'), { ssr: false });
const PhotoRedactorTool = dynamic(() => import('./tools/PhotoRedactorTool'), { ssr: false });
const MonthlyBudgetTool = dynamic(() => import('./tools/MonthlyBudgetTool'), { ssr: false });
const RecipeScalerTool = dynamic(() => import('./tools/RecipeScalerTool'), { ssr: false });
const PhotoCollageMakerTool = dynamic(() => import('./tools/PhotoCollageMakerTool'), { ssr: false });

export const toolComponents: Record<ToolSlug, ComponentType> = {
  'json-formatter': JsonFormatterTool,
  'csv-json-converter': CsvJsonConverterTool,
  'unit-converter': UnitConverterTool,
  'xml-formatter': XmlFormatterTool,
  'date-difference-calculator': DateDifferenceCalculatorTool,
  'css-gradient-shadow-generator': CssGradientShadowGeneratorTool,
  'qr-code-scanner': QrCodeScannerTool,
  'color-picker-converter': ColorPickerConverterTool,
  'timestamp-converter': TimestampConverterTool,
  'text-diff-checker': TextDiffCheckerTool,
  'markdown-preview': MarkdownPreviewTool,
  'text-case-converter': TextCaseConverterTool,
  'word-counter': WordCounterTool,
  'lorem-ipsum-generator': LoremIpsumGeneratorTool,
  'text-cleaner': TextCleanerTool,
  'duplicate-line-remover': DuplicateLineRemoverTool,
  'text-sorter': TextSorterTool,
  calculator: CalculatorTool,
  'ping-test': PingTestTool,
  'image-resizer': ImageResizerTool,
  'pdf-compressor': PdfCompressorTool,
  'pdf-merge': PdfMergeTool,
  'password-generator': PasswordGeneratorTool,
  'image-converter': ImageConverterTool,
  'image-to-pdf': ImageToPdfTool,
  'image-compressor': ImageCompressorTool,
  'remove-background': RemoveBackgroundTool,
  'image-cropper': ImageCropperTool,
  'image-rotator-flipper': ImageRotatorFlipperTool,
  'exif-metadata-viewer': ExifMetadataViewerTool,
  'exif-metadata-remover': ExifMetadataRemoverTool,
  'svg-optimizer': SvgOptimizerTool,
  'pdf-splitter': PdfSplitterTool,
  'pdf-to-image': PdfToImageTool,
  'pdf-page-organizer': PdfPageOrganizerTool,
  'pdf-metadata-remover': PdfMetadataRemoverTool,
  'pdf-watermark': PdfWatermarkTool,
  'qr-code-generator': QrCodeGeneratorTool,
  'barcode-generator': BarcodeGeneratorTool,
  'random-number-generator': RandomNumberGeneratorTool,
  'jwt-decoder': JwtDecoderTool,
  'url-encoder': UrlEncoderTool,
  'binary-translator': BinaryTranslatorTool,
  'mp3-cutter': Mp3CutterTool,
  'audio-converter': AudioConverterTool,
  'audio-visualizer': AudioVisualizerTool,
  'mp3-metadata-editor': Mp3MetadataEditorTool,
  'audio-volume-booster': AudioVolumeBoosterTool,
  'regex-tester': RegexTesterTool,
  'uuid-generator': UuidGeneratorTool,
  'base64-encoder': Base64EncoderTool,
  'hash-generator': HashGeneratorTool,
  'invoice-maker': InvoiceMakerTool,
  'photo-redactor': PhotoRedactorTool,
  'monthly-budget': MonthlyBudgetTool,
  'recipe-scaler': RecipeScalerTool,
  'photo-collage-maker': PhotoCollageMakerTool,
};