import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '../../../components/Breadcrumb';
import ToolRenderer from '../../../components/ToolRenderer';
import { tools } from '../../../lib/tools';

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export function generateMetadata({ params }: Props) {
  const tool = tools.find((item) => item.slug === params.slug);
  if (!tool) {
    return {
      title: 'Tool not found',
      description: 'Requested tool is not available.',
    };
  }

  const title = `${tool.name} · ReByte`;
  const description = tool.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://rebyte.example/tools/${tool.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://rebyte.example/tools/${tool.slug}`,
    },
  };
}

export default function ToolDetailPage({ params }: Props) {
  const tool = tools.find((item) => item.slug === params.slug);
  if (!tool) {
    notFound();
  }

  const relatedTools = tools.filter(
    (item) => item.category === tool.category && item.slug !== tool.slug
  ).slice(0, 3);

  return (
    <div className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Tools', href: '/tools' },
            { label: tool.name, href: `/tools/${tool.slug}` },
          ]}
        />

        <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-10 shadow-soft dark:border-slate-800/70 dark:bg-slate-950/95">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_0.55fr] lg:items-start">
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100">
                  <Image src={tool.icon} alt={`${tool.name} icon`} width={32} height={32} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">{tool.category}</p>
                  <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">{tool.name}</h1>
                </div>
              </div>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">{tool.description}</p>

              <div className="mt-10 rounded-3xl border border-slate-200/70 bg-slate-50 p-8 dark:border-slate-800/70 dark:bg-slate-900/95">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Tool area</h2>
                <ToolRenderer slug={tool.slug} />
              </div>

              <div className="mt-10 space-y-8">
                {tool.slug === 'pdf-compressor' ? (
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to use</h2>
                    <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">1. Upload a PDF</p>
                        <p className="mt-2 text-sm leading-6">Choose a PDF file from your device with the upload control.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">2. Set compression level</p>
                        <p className="mt-2 text-sm leading-6">Move the slider to adjust compression and preview the estimated size.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">3. Download the compressed PDF</p>
                        <p className="mt-2 text-sm leading-6">Click the download button to save the new PDF file.</p>
                      </li>
                    </ol>
                  </section>
                ) : tool.slug === 'json-formatter' ? (
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to use</h2>
                    <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">1. Paste or upload JSON</p>
                        <p className="mt-2 text-sm leading-6">Insert JSON text in the editor or upload a JSON file from your device.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">2. Format or minify</p>
                        <p className="mt-2 text-sm leading-6">Choose Format to prettify JSON or Minify to compress it into one line.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">3. Copy or download</p>
                        <p className="mt-2 text-sm leading-6">Copy the result to clipboard or download it as a JSON file.</p>
                      </li>
                    </ol>
                  </section>
                ) : tool.slug === 'markdown-preview' ? (
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to use</h2>
                    <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">1. Paste or type Markdown</p>
                        <p className="mt-2 text-sm leading-6">Enter headings, lists, links, inline code, or fenced code blocks in the editor.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">2. See live preview</p>
                        <p className="mt-2 text-sm leading-6">The preview pane updates instantly so you can verify formatting as you type.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">3. Use the preview output</p>
                        <p className="mt-2 text-sm leading-6">Copy the rendered preview or use it as a quick reference for your Markdown content.</p>
                      </li>
                    </ol>
                  </section>
                ) : tool.slug === 'text-case-converter' ? (
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to use</h2>
                    <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">1. Enter or upload text</p>
                        <p className="mt-2 text-sm leading-6">Type your text or upload a plain text file into the editor.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">2. Pick a case mode</p>
                        <p className="mt-2 text-sm leading-6">Select Original, UPPERCASE, lowercase, or Title Case.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">3. Download the output</p>
                        <p className="mt-2 text-sm leading-6">Save the converted text as a file with the download button.</p>
                      </li>
                    </ol>
                  </section>
                ) : tool.slug === 'calculator' ? (
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to use</h2>
                    <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">1. Enter an expression</p>
                        <p className="mt-2 text-sm leading-6">Type numbers and operators into the calculator input field.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">2. Use the buttons</p>
                        <p className="mt-2 text-sm leading-6">Use the on-screen buttons for digits, operators, decimal points, and parentheses.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">3. Calculate or clear</p>
                        <p className="mt-2 text-sm leading-6">Press Calculate to evaluate, C to clear, or ← to remove the last character.</p>
                      </li>
                    </ol>
                  </section>
                ) : tool.slug === 'image-compressor' ? (
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to use</h2>
                    <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">1. Upload an image</p>
                        <p className="mt-2 text-sm leading-6">Select a JPEG, PNG, or other supported image file from your device.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">2. Choose format and quality</p>
                        <p className="mt-2 text-sm leading-6">Pick JPEG or WebP and adjust the quality slider to balance size and clarity.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">3. Download compressed image</p>
                        <p className="mt-2 text-sm leading-6">Click the button to save the optimized image to your device.</p>
                      </li>
                    </ol>
                  </section>
                ) : tool.slug === 'image-cropper' ? (
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to use</h2>
                    <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">1. Upload an image</p>
                        <p className="mt-2 text-sm leading-6">Choose a supported image file to crop in the browser.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">2. Set crop dimensions</p>
                        <p className="mt-2 text-sm leading-6">Enter the desired width and height for the cropped area.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">3. Download the cropped image</p>
                        <p className="mt-2 text-sm leading-6">After previewing, click Download cropped image to save it.</p>
                      </li>
                    </ol>
                  </section>
                ) : tool.slug === 'ping-test' ? (
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to use</h2>
                    <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">1. Enter a target URL</p>
                        <p className="mt-2 text-sm leading-6">Type a full URL or hostname to test server response.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">2. Run the check</p>
                        <p className="mt-2 text-sm leading-6">Click Check latency to send a browser request and measure response time.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">3. Review status and latency</p>
                        <p className="mt-2 text-sm leading-6">Use the result panel to see server status and round-trip time.</p>
                      </li>
                    </ol>
                  </section>
                ) : tool.slug === 'image-resizer' ? (
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to use</h2>
                    <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">1. Upload an image</p>
                        <p className="mt-2 text-sm leading-6">Choose any supported image file from your device.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">2. Adjust width and height</p>
                        <p className="mt-2 text-sm leading-6">Change the dimensions to resize the image as needed.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">3. Download the resized image</p>
                        <p className="mt-2 text-sm leading-6">Preview the image and click download to save the updated version.</p>
                      </li>
                    </ol>
                  </section>
                ) : tool.slug === 'password-generator' ? (
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to use</h2>
                    <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">1. Choose password options</p>
                        <p className="mt-2 text-sm leading-6">Select length and enable lowercase, uppercase, numbers, or symbols.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">2. Review the generated password</p>
                        <p className="mt-2 text-sm leading-6">The tool creates a strong password based on the selected settings.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">3. Copy it securely</p>
                        <p className="mt-2 text-sm leading-6">Click Copy password to store it in your clipboard.</p>
                      </li>
                    </ol>
                  </section>
                ) : tool.slug === 'uuid-generator' ? (
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to use</h2>
                    <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">1. Set how many UUIDs</p>
                        <p className="mt-2 text-sm leading-6">Use the slider to select 1 to 10 UUIDs to generate at once.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">2. Generate the list</p>
                        <p className="mt-2 text-sm leading-6">Click Generate UUIDs to create version 4 identifiers instantly.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">3. Copy the values</p>
                        <p className="mt-2 text-sm leading-6">Use the Copy button to copy all generated UUIDs to your clipboard.</p>
                      </li>
                    </ol>
                  </section>
                ) : tool.slug === 'base64-encoder' ? (
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to use</h2>
                    <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">1. Enter the text</p>
                        <p className="mt-2 text-sm leading-6">Paste text to encode or a Base64 string to decode in the input area.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">2. Choose a mode</p>
                        <p className="mt-2 text-sm leading-6">Switch between Encode and Decode to transform the data.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">3. Copy the output</p>
                        <p className="mt-2 text-sm leading-6">Click Copy output to save the result to your clipboard.</p>
                      </li>
                    </ol>
                  </section>
                ) : tool.slug === 'sha-256-generator' ? (
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to use</h2>
                    <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">1. Enter text to hash</p>
                        <p className="mt-2 text-sm leading-6">Type or paste the data you want to convert into a SHA-256 fingerprint.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">2. Generate the hash</p>
                        <p className="mt-2 text-sm leading-6">Click Generate SHA-256 and wait for the result to appear below.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">3. Copy the digest</p>
                        <p className="mt-2 text-sm leading-6">Use Copy hash to copy the result for verification or storage.</p>
                      </li>
                    </ol>
                  </section>
                ) : tool.slug === 'png-to-pdf' ? (
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to use</h2>
                    <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">1. Upload a PNG image</p>
                        <p className="mt-2 text-sm leading-6">Select a PNG file from your device using the upload control.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">2. Preview the image</p>
                        <p className="mt-2 text-sm leading-6">Check the PNG preview before creating the PDF.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">3. Download as PDF</p>
                        <p className="mt-2 text-sm leading-6">Click Download PDF to save the converted file.</p>
                      </li>
                    </ol>
                  </section>
                ) : tool.slug === 'image-to-pdf' ? (
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to use</h2>
                    <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">1. Upload any image file</p>
                        <p className="mt-2 text-sm leading-6">Select a JPEG, PNG, or other supported image from your device.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">2. Review the preview</p>
                        <p className="mt-2 text-sm leading-6">Make sure the image looks correct before conversion.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">3. Download the PDF</p>
                        <p className="mt-2 text-sm leading-6">Save the generated PDF with the download button.</p>
                      </li>
                    </ol>
                  </section>
                ) : tool.slug === 'pdf-splitter' ? (
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to use</h2>
                    <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">1. Upload a PDF</p>
                        <p className="mt-2 text-sm leading-6">Select the PDF file you want to split into separate pages or ranges.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">2. Choose pages to extract</p>
                        <p className="mt-2 text-sm leading-6">Pick the pages or ranges you need from the PDF.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">3. Download the output</p>
                        <p className="mt-2 text-sm leading-6">Download each extracted file right from the browser.</p>
                      </li>
                    </ol>
                  </section>
                ) : tool.slug === 'pdf-to-image' ? (
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to use</h2>
                    <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">1. Upload a PDF</p>
                        <p className="mt-2 text-sm leading-6">Select the PDF file containing the pages you want to convert.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">2. Choose an image format</p>
                        <p className="mt-2 text-sm leading-6">Pick PNG or JPEG for the output images.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">3. Download each page</p>
                        <p className="mt-2 text-sm leading-6">Download converted images for every page of the PDF.</p>
                      </li>
                    </ol>
                  </section>
                ) : tool.slug === 'qr-code-generator' ? (
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to use</h2>
                    <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">1. Enter text or URL</p>
                        <p className="mt-2 text-sm leading-6">Type the content you want encoded in the QR code.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">2. Customize the result</p>
                        <p className="mt-2 text-sm leading-6">Adjust size or style if available for your QR code.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">3. Download it locally</p>
                        <p className="mt-2 text-sm leading-6">Save the generated QR code image to your device.</p>
                      </li>
                    </ol>
                  </section>
                ) : tool.slug === 'barcode-generator' ? (
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to use</h2>
                    <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">1. Choose a barcode type</p>
                        <p className="mt-2 text-sm leading-6">Select Code128, EAN-13, or QR code from the available options.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">2. Enter the barcode text</p>
                        <p className="mt-2 text-sm leading-6">Provide the value to encode, such as numbers, text, or a URL.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">3. Generate and save</p>
                        <p className="mt-2 text-sm leading-6">Click Generate barcode and download the image once it appears.</p>
                      </li>
                    </ol>
                  </section>
                ) : tool.slug === 'random-number-generator' ? (
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to use</h2>
                    <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">1. Set the range</p>
                        <p className="mt-2 text-sm leading-6">Enter minimum and maximum values for the random number range.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">2. Choose how many numbers</p>
                        <p className="mt-2 text-sm leading-6">Enter the quantity of numbers to generate in one batch.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">3. Generate and copy</p>
                        <p className="mt-2 text-sm leading-6">Click Generate numbers and copy the output if needed.</p>
                      </li>
                    </ol>
                  </section>
                ) : tool.slug === 'jwt-decoder' ? (
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to use</h2>
                    <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">1. Paste your JWT</p>
                        <p className="mt-2 text-sm leading-6">Paste the full JWT token into the input field.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">2. Decode the token</p>
                        <p className="mt-2 text-sm leading-6">Click Decode JWT to see the header, payload, and signature.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">3. Review the result</p>
                        <p className="mt-2 text-sm leading-6">Inspect the decoded values for debugging or verification.</p>
                      </li>
                    </ol>
                  </section>
                ) : tool.slug === 'url-encoder' ? (
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to use</h2>
                    <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">1. Select encode or decode</p>
                        <p className="mt-2 text-sm leading-6">Choose whether you want to encode text for use in URLs or decode an encoded string.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">2. Enter the string</p>
                        <p className="mt-2 text-sm leading-6">Type or paste the URL value into the input area.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">3. Copy the output</p>
                        <p className="mt-2 text-sm leading-6">Click the action button and copy the encoded or decoded result.</p>
                      </li>
                    </ol>
                  </section>
                ) : tool.slug === 'regex-tester' ? (
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to use</h2>
                    <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">1. Enter a regex pattern</p>
                        <p className="mt-2 text-sm leading-6">Type the regular expression you want to test in the pattern field.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">2. Provide test text</p>
                        <p className="mt-2 text-sm leading-6">Paste the text to match against and adjust flags as needed.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">3. View matches</p>
                        <p className="mt-2 text-sm leading-6">Read the matched results shown in the preview pane.</p>
                      </li>
                    </ol>
                  </section>
                ) : tool.slug === 'pdf-merge' ? (
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to use</h2>
                    <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">1. Upload multiple PDF files</p>
                        <p className="mt-2 text-sm leading-6">Select the PDFs you want to merge into one document.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">2. Arrange the order</p>
                        <p className="mt-2 text-sm leading-6">Place files in the order you want them to appear in the merged PDF.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">3. Download the merged document</p>
                        <p className="mt-2 text-sm leading-6">Click download to get your combined PDF file.</p>
                      </li>
                    </ol>
                  </section>
                ) : (
                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How to use</h2>
                    <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">1. Choose a tool</p>
                        <p className="mt-2 text-sm leading-6">Open the tool page and read the instructions provided there.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">2. Enter your data</p>
                        <p className="mt-2 text-sm leading-6">Use the inputs, file uploads, or buttons shown on the page.</p>
                      </li>
                      <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
                        <p className="font-semibold">3. Save or copy the output</p>
                        <p className="mt-2 text-sm leading-6">Download the result or copy it to your clipboard.</p>
                      </li>
                    </ol>
                  </section>
                )}

                <section>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">FAQ</h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
                      <p className="font-semibold text-slate-900 dark:text-white">Is my data safe?</p>
                      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">All processing happens in the browser. Data is not sent to external servers.</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
                      <p className="font-semibold text-slate-900 dark:text-white">Is this tool free?</p>
                      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Yes, this platform is built to offer free access with no login required.</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <aside className="space-y-8">
              <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Quick info</h2>
                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">This category includes tools designed to help with {tool.category.toLowerCase()} tasks using a simple interface and fast performance.</p>
              </div>

              <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 dark:border-slate-800/70 dark:bg-slate-950/95">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Related tools</h2>
                <div className="mt-4 space-y-4">
                  {relatedTools.length ? (
                    relatedTools.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/tools/${item.slug}`}
                        className="block rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-4 text-slate-900 transition hover:border-sky-300/40 hover:bg-white dark:border-slate-800/80 dark:bg-slate-900 dark:hover:border-sky-500/50 dark:hover:bg-slate-950"
                      >
                        <p className="font-semibold">{item.name}</p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-slate-600 dark:text-slate-400">No additional recommendations are available at this time.</p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
