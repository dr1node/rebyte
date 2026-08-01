'use client';

import Link from 'next/link';
import { useLanguage } from '../lib/LanguageContext';
import { getLocalizedTool } from '../lib/toolTranslations';
import { tools } from '../lib/tools';

const guides: Record<string, { en: [string, string][]; id: [string, string][] }> = {
  'pdf-compressor': { en: [['Upload a PDF', 'Choose a PDF file from your device.'], ['Set compression level', 'Adjust the slider to preview the estimated size.'], ['Download the compressed PDF', 'Click download to save the new PDF file.']], id: [['Unggah PDF', 'Pilih file PDF dari perangkat Anda.'], ['Atur tingkat kompresi', 'Geser pengaturan untuk melihat perkiraan ukuran file.'], ['Unduh PDF terkompresi', 'Klik tombol unduh untuk menyimpan file PDF baru.']] },
  'color-picker-converter': { en: [['Pick a color', 'Use the color picker or enter a HEX value to choose a color.'], ['Review color formats', 'Read the matching HEX, RGB, and HSL values shown in the result panel.'], ['Copy a value', 'Click Copy next to a format to use that color value in your project.']], id: [['Pilih warna', 'Gunakan pemilih warna atau masukkan nilai HEX untuk memilih warna.'], ['Periksa format warna', 'Lihat nilai HEX, RGB, dan HSL yang sesuai pada panel hasil.'], ['Salin nilai', 'Klik Salin di samping format untuk menggunakan nilai warna dalam project Anda.']] },
  'timestamp-converter': { en: [['Choose a conversion mode', 'Select timestamp to date or date to timestamp.'], ['Enter the value', 'Enter a Unix timestamp in seconds or choose a date and time.'], ['Read the conversion', 'The converted value updates instantly and can be copied for use elsewhere.']], id: [['Pilih mode konversi', 'Pilih timestamp ke tanggal atau tanggal ke timestamp.'], ['Masukkan nilai', 'Masukkan Unix timestamp dalam detik atau pilih tanggal dan waktu.'], ['Baca hasil konversi', 'Hasil konversi diperbarui secara instan dan dapat disalin untuk digunakan di tempat lain.']] },
  'text-diff-checker': { en: [['Enter the original text', 'Paste the first version into the Original text panel.'], ['Enter the changed text', 'Paste the second version into the Changed text panel.'], ['Review highlighted differences', 'Added lines appear in green and removed lines appear in red below the editors.']], id: [['Masukkan teks awal', 'Tempel versi pertama ke panel Teks awal.'], ['Masukkan teks perubahan', 'Tempel versi kedua ke panel Teks perubahan.'], ['Periksa perbedaan yang disorot', 'Baris yang ditambahkan berwarna hijau dan baris yang dihapus berwarna merah di bawah editor.']] },
  'json-formatter': { en: [['Paste or upload JSON', 'Insert JSON text or upload a JSON file.'], ['Format or minify', 'Choose Format to beautify or Minify to compress the JSON.'], ['Copy or download', 'Copy the result or download it as a JSON file.']], id: [['Tempel atau unggah JSON', 'Masukkan teks JSON atau unggah file JSON.'], ['Format atau ringkas', 'Pilih Format untuk merapikan atau Minify untuk meringkas JSON.'], ['Salin atau unduh', 'Salin hasilnya atau unduh sebagai file JSON.']] },
  'image-compressor': { en: [['Upload an image', 'Select a supported image file.'], ['Choose format and quality', 'Pick an output format and adjust quality.'], ['Download compressed image', 'Save the optimized image to your device.']], id: [['Unggah gambar', 'Pilih file gambar yang didukung.'], ['Pilih format dan kualitas', 'Pilih format output dan sesuaikan kualitasnya.'], ['Unduh gambar terkompresi', 'Simpan gambar yang sudah dioptimalkan ke perangkat Anda.']] },
  'image-to-pdf': { en: [['Upload an image', 'Select a JPEG, PNG, or other supported image.'], ['Review the preview', 'Make sure the image looks correct before conversion.'], ['Download the PDF', 'Save the generated PDF to your device.']], id: [['Unggah gambar', 'Pilih JPEG, PNG, atau gambar lain yang didukung.'], ['Periksa pratinjau', 'Pastikan gambar sudah benar sebelum dikonversi.'], ['Unduh PDF', 'Simpan PDF yang dihasilkan ke perangkat Anda.']] },
  'pdf-merge': { en: [['Upload PDF files', 'Select the PDFs you want to combine.'], ['Review the selected files', 'Check the files before merging them.'], ['Download the merged document', 'Save the combined PDF to your device.']], id: [['Unggah file PDF', 'Pilih PDF yang ingin Anda gabungkan.'], ['Periksa file yang dipilih', 'Pastikan semua file sudah benar sebelum digabungkan.'], ['Unduh dokumen gabungan', 'Simpan PDF gabungan ke perangkat Anda.']] },
  'word-counter': { en: [['Enter your text', 'Type or paste text into the editor to calculate its statistics instantly.'], ['Review the text metrics', 'Check words, characters, sentences, paragraphs, and estimated reading and speaking time.'], ['Edit and compare', 'Continue editing the text and use the live metrics to compare different versions.']], id: [['Masukkan teks', 'Ketik atau tempel teks ke editor untuk menghitung statistiknya secara instan.'], ['Periksa statistik teks', 'Lihat jumlah kata, karakter, kalimat, paragraf, serta estimasi waktu membaca dan berbicara.'], ['Edit dan bandingkan', 'Lanjutkan mengedit teks dan gunakan statistik langsung untuk membandingkan beberapa versi.']] },
  'lorem-ipsum-generator': { en: [['Choose the amount', 'Enter how many words, sentences, or paragraphs you want to generate.'], ['Select the output unit', 'Use Generate by to switch between words, sentences, and paragraphs.'], ['Generate and copy', 'Click Generate for fresh placeholder text, then copy the result when it is ready.']], id: [['Tentukan jumlah', 'Masukkan jumlah kata, kalimat, atau paragraf yang ingin dibuat.'], ['Pilih satuan output', 'Gunakan opsi Buat berdasarkan untuk memilih kata, kalimat, atau paragraf.'], ['Buat dan salin', 'Klik Buat untuk menghasilkan teks placeholder baru, lalu salin hasilnya saat siap.']] },
  'image-rotator-flipper': { en: [['Upload an image', 'Select or drop an image file to load it into the browser preview.'], ['Adjust the orientation', 'Rotate the image by 90 degrees or toggle horizontal and vertical flipping.'], ['Download the result', 'Review the preview, then download the transformed image to your device.']], id: [['Unggah gambar', 'Pilih atau seret file gambar untuk membukanya di pratinjau browser.'], ['Atur orientasi', 'Putar gambar 90 derajat atau aktifkan pembalikan horizontal dan vertikal.'], ['Unduh hasilnya', 'Periksa pratinjau, lalu unduh gambar yang sudah diubah ke perangkat Anda.']] },
};

const defaultGuide = {
  en: [['Use the tool', 'Enter data, upload a file, or use the controls shown in the tool area.'], ['Review the result', 'Check the generated output before saving it.'], ['Save or copy the output', 'Download the result or copy it to your clipboard.']],
  id: [['Gunakan alat', 'Masukkan data, unggah file, atau gunakan kontrol pada area alat.'], ['Periksa hasilnya', 'Periksa output yang dihasilkan sebelum menyimpannya.'], ['Simpan atau salin output', 'Unduh hasilnya atau salin ke clipboard.']],
} as const;

export function LocalizedToolMeta({ slug }: { slug: string }) {
  const { language } = useLanguage();
  const tool = tools.find((item) => item.slug === slug);
  if (!tool) return null;
  const localizedTool = getLocalizedTool(tool, language);

  return (
    <div className="localized-tool-meta hidden">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">{localizedTool.category}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">{localizedTool.name}</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">{localizedTool.description}</p>
    </div>
  );
}

export default function LocalizedToolContent({ slug }: { slug: string }) {
  const { language } = useLanguage();
  const guide = (guides[slug] ?? defaultGuide)[language];
  const tool = tools.find((item) => item.slug === slug);
  const localizedTool = tool ? getLocalizedTool(tool, language) : null;

  return (
    <div className="mt-10 space-y-8">
      <section>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{language === 'id' ? 'Cara menggunakan' : 'How to use'}</h2>
        <ol className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
          {guide.map(([title, description], index) => (
            <li key={title} className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/70 dark:bg-slate-950/95">
              <p className="font-semibold">{index + 1}. {title}</p>
              <p className="mt-2 text-sm leading-6">{description}</p>
            </li>
          ))}
        </ol>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">FAQ</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
            <p className="font-semibold text-slate-900 dark:text-white">{language === 'id' ? 'Apakah data saya aman?' : 'Is my data safe?'}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{language === 'id' ? 'Semua pemrosesan dilakukan di browser. Data tidak dikirim ke server eksternal.' : 'All processing happens in the browser. Data is not sent to external servers.'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:bg-slate-900/95">
            <p className="font-semibold text-slate-900 dark:text-white">{language === 'id' ? 'Apakah alat ini gratis?' : 'Is this tool free?'}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{language === 'id' ? 'Ya, platform ini gratis dan tidak memerlukan login.' : 'Yes, this platform is free and does not require login.'}</p>
          </div>
        </div>
      </section>
      <aside className="space-y-8">
        <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{language === 'id' ? 'Informasi singkat' : 'Quick info'}</h2>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{language === 'id' ? `Alat ini membantu kebutuhan ${localizedTool?.category.toLowerCase() ?? 'utilitas'} dengan antarmuka sederhana dan performa cepat.` : `This tool helps with ${localizedTool?.category.toLowerCase() ?? 'utility'} tasks using a simple interface and fast performance.`}</p>
        </div>
        <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 dark:border-slate-800/70 dark:bg-slate-950/95">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{language === 'id' ? 'Alat terkait' : 'Related tools'}</h2>
          <div className="mt-4 space-y-4">
            {tools.filter((item) => item.category === tool?.category && item.slug !== slug).slice(0, 3).map((item) => {
              const related = getLocalizedTool(item, language);
              return <Link key={item.slug} href={`/tools/${item.slug}`} className="block rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-4 text-slate-900 transition hover:border-sky-300/40 dark:border-slate-800/80 dark:bg-slate-900"><p className="font-semibold">{related.name}</p><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{related.description}</p></Link>;
            })}
          </div>
        </div>
      </aside>
    </div>
  );
}
