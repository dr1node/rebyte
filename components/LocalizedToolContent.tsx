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
  'remove-background': { en: [['Upload an image', 'Select a JPG, PNG, or WebP image. The file stays in your browser.'], ['Run local AI processing', 'The segmentation model is cached in your browser and uses WebGPU when available, with a WASM fallback.'], ['Preview and download', 'Review the transparent result, then download it as a PNG.']], id: [['Unggah gambar', 'Pilih gambar JPG, PNG, atau WebP. File tetap berada di browser Anda.'], ['Jalankan pemrosesan AI lokal', 'Model segmentasi disimpan di cache browser dan menggunakan WebGPU jika tersedia, dengan fallback WASM.'], ['Pratinjau dan unduh', 'Periksa hasil transparan, lalu unduh sebagai PNG.']] },
  'image-to-pdf': { en: [['Upload an image', 'Select a JPEG, PNG, or other supported image.'], ['Review the preview', 'Make sure the image looks correct before conversion.'], ['Download the PDF', 'Save the generated PDF to your device.']], id: [['Unggah gambar', 'Pilih JPEG, PNG, atau gambar lain yang didukung.'], ['Periksa pratinjau', 'Pastikan gambar sudah benar sebelum dikonversi.'], ['Unduh PDF', 'Simpan PDF yang dihasilkan ke perangkat Anda.']] },
  'pdf-merge': { en: [['Upload PDF files', 'Select the PDFs you want to combine.'], ['Review the selected files', 'Check the files before merging them.'], ['Download the merged document', 'Save the combined PDF to your device.']], id: [['Unggah file PDF', 'Pilih PDF yang ingin Anda gabungkan.'], ['Periksa file yang dipilih', 'Pastikan semua file sudah benar sebelum digabungkan.'], ['Unduh dokumen gabungan', 'Simpan PDF gabungan ke perangkat Anda.']] },
  'pdf-page-organizer': { en: [['Upload your PDF', 'Choose a PDF file from your device.'], ['Arrange the pages', 'Drag pages to reorder them or use the page actions to rotate, duplicate, or delete them.'], ['Export the PDF', 'Click Export PDF to download the organized result.']], id: [['Unggah PDF', 'Pilih file PDF dari perangkat Anda.'], ['Atur halaman', 'Drag halaman untuk mengubah urutan atau gunakan aksi untuk memutar, menggandakan, atau menghapusnya.'], ['Ekspor PDF', 'Klik Export PDF untuk mengunduh hasil yang sudah diatur.']] },
  'pdf-metadata-remover': { en: [['Upload your PDF', 'Choose a PDF file from your device.'], ['Review the metadata', 'Inspect the detected author, title, creator, and document information.'], ['Remove metadata', 'Click Remove Metadata and download the cleaned PDF.']], id: [['Unggah PDF', 'Pilih file PDF dari perangkat Anda.'], ['Periksa metadata', 'Periksa author, title, creator, dan informasi dokumen yang terdeteksi.'], ['Hapus metadata', 'Klik Remove Metadata lalu unduh PDF yang sudah dibersihkan.']] },
  'pdf-watermark': { en: [['Upload a PDF and enter text', 'Choose your PDF and type the watermark text.'], ['Adjust the watermark', 'Set its position, size, rotation, and opacity.'], ['Add the watermark', 'Click Add Watermark and download the PDF.']], id: [['Unggah PDF dan masukkan teks', 'Pilih PDF lalu ketik teks watermark.'], ['Atur watermark', 'Tentukan posisi, ukuran, rotasi, dan transparansinya.'], ['Tambahkan watermark', 'Klik Add Watermark lalu unduh PDF.']] },
  'word-counter': { en: [['Enter your text', 'Type or paste text into the editor to calculate its statistics instantly.'], ['Review the text metrics', 'Check words, characters, sentences, paragraphs, and estimated reading and speaking time.'], ['Edit and compare', 'Continue editing the text and use the live metrics to compare different versions.']], id: [['Masukkan teks', 'Ketik atau tempel teks ke editor untuk menghitung statistiknya secara instan.'], ['Periksa statistik teks', 'Lihat jumlah kata, karakter, kalimat, paragraf, serta estimasi waktu membaca dan berbicara.'], ['Edit dan bandingkan', 'Lanjutkan mengedit teks dan gunakan statistik langsung untuk membandingkan beberapa versi.']] },
  'lorem-ipsum-generator': { en: [['Choose the amount', 'Enter how many words, sentences, or paragraphs you want to generate.'], ['Select the output unit', 'Use Generate by to switch between words, sentences, and paragraphs.'], ['Generate and copy', 'Click Generate for fresh placeholder text, then copy the result when it is ready.']], id: [['Tentukan jumlah', 'Masukkan jumlah kata, kalimat, atau paragraf yang ingin dibuat.'], ['Pilih satuan output', 'Gunakan opsi Buat berdasarkan untuk memilih kata, kalimat, atau paragraf.'], ['Buat dan salin', 'Klik Buat untuk menghasilkan teks placeholder baru, lalu salin hasilnya saat siap.']] },
  'text-cleaner': { en: [['Enter your text', 'Paste or type the text you want to clean.'], ['Choose cleaning options', 'Select the spaces, empty lines, characters, or formatting issues to remove.'], ['Clean and copy the result', 'Click Clean Text, then copy the cleaned text.']], id: [['Masukkan teks', 'Tempel atau ketik teks yang ingin dibersihkan.'], ['Pilih opsi pembersihan', 'Pilih spasi, baris kosong, karakter, atau masalah formatting yang ingin dihapus.'], ['Bersihkan dan salin hasilnya', 'Klik Clean Text, lalu salin teks yang sudah dibersihkan.']] },
  'duplicate-line-remover': { en: [['Enter one item per line', 'Paste your list or line-based text into the editor.'], ['Choose case sensitivity', 'Decide whether uppercase and lowercase lines should be treated differently.'], ['Remove duplicates and copy', 'Click Remove Duplicates, then copy the result.']], id: [['Masukkan satu item per baris', 'Tempel daftar atau teks berbasis baris ke editor.'], ['Pilih sensitivitas huruf', 'Tentukan apakah baris dengan huruf besar dan kecil dianggap berbeda.'], ['Hapus duplikat dan salin', 'Klik Remove Duplicates, lalu salin hasilnya.']] },
  'text-sorter': { en: [['Enter one item per line', 'Type or paste the lines you want to sort.'], ['Select a sorting method', 'Choose alphabetical, numerical, length, or reverse order.'], ['Sort and copy or download', 'Click Sort, then copy or download the result.']], id: [['Masukkan satu item per baris', 'Ketik atau tempel baris yang ingin diurutkan.'], ['Pilih metode pengurutan', 'Pilih urutan alfabet, angka, panjang, atau terbalik.'], ['Urutkan lalu salin atau unduh', 'Klik Sort, lalu salin atau unduh hasilnya.']] },
  'image-rotator-flipper': { en: [['Upload an image', 'Select or drop an image file to load it into the browser preview.'], ['Adjust the orientation', 'Rotate the image by 90 degrees or toggle horizontal and vertical flipping.'], ['Download the result', 'Review the preview, then download the transformed image to your device.']], id: [['Unggah gambar', 'Pilih atau seret file gambar untuk membukanya di pratinjau browser.'], ['Atur orientasi', 'Putar gambar 90 derajat atau aktifkan pembalikan horizontal dan vertikal.'], ['Unduh hasilnya', 'Periksa pratinjau, lalu unduh gambar yang sudah diubah ke perangkat Anda.']] },
  'exif-metadata-viewer': { en: [['Upload an image', 'Choose an image file from your device.'], ['Wait for EXIF detection', 'The available image dimensions and EXIF information are read locally.'], ['Review or copy metadata', 'Review the detected values and copy any metadata you need.']], id: [['Unggah gambar', 'Pilih file gambar dari perangkat Anda.'], ['Tunggu deteksi EXIF', 'Dimensi gambar dan informasi EXIF yang tersedia dibaca secara lokal.'], ['Lihat atau salin metadata', 'Periksa nilai yang terdeteksi dan salin metadata yang diperlukan.']] },
  'exif-metadata-remover': { en: [['Upload your image', 'Choose the image whose metadata you want to remove.'], ['Review the metadata', 'Check the image details that will be removed by re-encoding the image.'], ['Remove metadata', 'Click Remove Metadata and download the cleaned image.']], id: [['Unggah gambar', 'Pilih gambar yang metadata-nya ingin dihapus.'], ['Periksa metadata', 'Periksa detail gambar yang akan dihapus dengan membuat ulang gambar.'], ['Hapus metadata', 'Klik Remove Metadata lalu unduh gambar yang sudah dibersihkan.']] },
  'svg-optimizer': { en: [['Upload an SVG file', 'Choose an SVG file from your device.'], ['Select optimization options', 'Choose which unnecessary comments, whitespace, and editor data to remove.'], ['Optimize and download', 'Click Optimize and download the optimized SVG.']], id: [['Unggah file SVG', 'Pilih file SVG dari perangkat Anda.'], ['Pilih opsi optimasi', 'Pilih komentar, whitespace, dan data editor yang ingin dihapus.'], ['Optimalkan dan unduh', 'Klik Optimize lalu unduh SVG yang sudah dioptimalkan.']] },
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
