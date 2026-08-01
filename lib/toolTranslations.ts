import type { Language } from './LanguageContext';
import type { Tool } from './tools';

const indonesianTools: Record<string, { name: string; description: string; category: string }> = {
  'json-formatter': { name: 'Formatter JSON', description: 'Format, validasi, dan ringkas data JSON secara instan.', category: 'Developer' },
  'color-picker-converter': { name: 'Pemilih & Konverter Warna', description: 'Pilih warna dan konversikan antara format HEX, RGB, dan HSL secara instan.', category: 'Developer' },
  'timestamp-converter': { name: 'Konverter Timestamp', description: 'Konversi Unix Timestamp menjadi tanggal yang mudah dibaca dan sebaliknya secara instan.', category: 'Developer' },
  'text-diff-checker': { name: 'Pembanding Teks', description: 'Bandingkan dua teks dan tampilkan perbedaannya secara instan.', category: 'Developer' },
  'pdf-compressor': { name: 'Kompresor PDF', description: 'Kurangi ukuran file PDF tanpa mengubah tata letaknya.', category: 'PDF' },
  'image-resizer': { name: 'Pengubah Ukuran Gambar', description: 'Ubah ukuran gambar untuk web, media sosial, dan presentasi.', category: 'Gambar' },
  'image-compressor': { name: 'Kompresor Gambar', description: 'Kurangi ukuran file gambar dengan tetap menjaga kualitas.', category: 'Gambar' },
  'image-cropper': { name: 'Pemotong Gambar', description: 'Potong gambar ke ukuran apa pun langsung di browser.', category: 'Gambar' },
  'image-rotator-flipper': { name: 'Pemutar & Pembalik Gambar', description: 'Putar dan balik gambar langsung di browser tanpa mengunggah file ke server.', category: 'Gambar' },
  'text-case-converter': { name: 'Pengubah Huruf Teks', description: 'Ubah teks menjadi huruf besar, kecil, title case, dan lainnya.', category: 'Teks' },
  'word-counter': { name: 'Penghitung Kata', description: 'Hitung jumlah kata, karakter, kalimat, paragraf, estimasi waktu membaca, dan waktu berbicara secara instan.', category: 'Teks' },
  'lorem-ipsum-generator': { name: 'Generator Lorem Ipsum', description: 'Buat teks Lorem Ipsum dengan jumlah kata, kalimat, atau paragraf yang dapat disesuaikan.', category: 'Teks' },
  'ping-test': { name: 'Ping Server', description: 'Uji latensi server dan konektivitas browser dengan permintaan sederhana.', category: 'Jaringan' },
  calculator: { name: 'Kalkulator', description: 'Lakukan perhitungan cepat dengan antarmuka yang bersih dan responsif.', category: 'Utilitas' },
  'uuid-generator': { name: 'Generator UUID', description: 'Buat UUID versi 4 secara instan untuk identifier dan key unik.', category: 'Developer' },
  'base64-encoder': { name: 'Encoder Base64', description: 'Encode dan decode teks dengan cepat menggunakan encoding Base64.', category: 'Developer' },
  'sha-256-generator': { name: 'Generator SHA-256', description: 'Buat hash SHA-256 untuk pesan, password, dan verifikasi.', category: 'Developer' },
  'password-generator': { name: 'Generator Password', description: 'Buat password aman dengan panjang dan karakter yang dapat disesuaikan.', category: 'Developer' },
  'jwt-decoder': { name: 'Decoder JWT', description: 'Decode token JWT secara instan tanpa mengunggah data.', category: 'Developer' },
  'url-encoder': { name: 'Encoder URL', description: 'Encode dan decode URL dengan aman.', category: 'Developer' },
  'regex-tester': { name: 'Penguji Regex', description: 'Uji regular expression secara real-time.', category: 'Developer' },
  'image-converter': { name: 'Konverter Gambar', description: 'Konversi gambar antara format PNG, JPEG, dan WebP langsung di browser.', category: 'Gambar' },
  'image-to-pdf': { name: 'Gambar ke PDF', description: 'Konversi gambar menjadi halaman PDF dengan skala otomatis.', category: 'PDF' },
  'pdf-splitter': { name: 'Pemisah PDF', description: 'Ekstrak halaman tertentu atau pecah PDF menjadi beberapa file.', category: 'PDF' },
  'pdf-to-image': { name: 'PDF ke Gambar', description: 'Konversi halaman PDF menjadi gambar PNG atau JPG berkualitas tinggi.', category: 'PDF' },
  'qr-code-generator': { name: 'Generator QR Code', description: 'Buat QR Code yang dapat disesuaikan secara instan.', category: 'Utilitas' },
  'barcode-generator': { name: 'Generator Barcode', description: 'Buat barcode Code128, EAN, dan QR secara online.', category: 'Utilitas' },
  'random-number-generator': { name: 'Generator Angka Acak', description: 'Buat angka acak dengan rentang yang dapat disesuaikan.', category: 'Utilitas' },
  'pdf-merge': { name: 'Penggabung PDF', description: 'Gabungkan beberapa file PDF menjadi satu dokumen aman.', category: 'PDF' },
  'markdown-preview': { name: 'Pratinjau Markdown', description: 'Render Markdown secara instan dan salin hasil yang sudah diformat.', category: 'Developer' },
};

export function getLocalizedTool(tool: Tool, language: Language) {
  if (language === 'id' && indonesianTools[tool.slug]) return indonesianTools[tool.slug];
  return { name: tool.name, description: tool.description, category: tool.category };
}
