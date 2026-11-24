import type { Language } from './LanguageContext';
import type { Tool } from './tools';

const indonesianTools: Record<string, { name: string; description: string; category: string }> = {
  'json-formatter': { name: 'Formatter JSON', description: 'Format, validasi, dan ringkas data JSON secara instan.', category: 'Developer' },
  'csv-json-converter': { name: 'Konverter CSV ↔ JSON', description: 'Konversi tabel CSV ke array JSON dan array objek JSON ke CSV secara lokal di browser.', category: 'Developer' },
  'unit-converter': { name: 'Konverter Satuan', description: 'Konversi satuan panjang, berat, suhu, luas, kecepatan, dan penyimpanan digital secara instan.', category: 'Utilitas' },
  'xml-formatter': { name: 'Formatter & Validator XML', description: 'Rapikan XML dengan indentasi yang mudah dibaca dan validasi strukturnya secara lokal di browser.', category: 'Developer' },
  'date-difference-calculator': { name: 'Kalkulator Selisih Tanggal', description: 'Hitung durasi kalender, total hari, atau umur antara dua tanggal.', category: 'Utilitas' },
  'css-gradient-shadow-generator': { name: 'Generator CSS Gradient & Shadow', description: 'Buat CSS linear/radial gradient dan box-shadow yang dapat disesuaikan dengan pratinjau langsung.', category: 'Developer' },
  'qr-code-scanner': { name: 'Pemindai QR Code', description: 'Pindai QR code dari gambar lokal atau kamera dengan dekode langsung di browser.', category: 'Utilitas' },
  'color-picker-converter': { name: 'Pemilih & Konverter Warna', description: 'Pilih warna dan konversikan antara format HEX, RGB, dan HSL secara instan.', category: 'Developer' },
  'timestamp-converter': { name: 'Konverter Timestamp', description: 'Konversi Unix Timestamp menjadi tanggal yang mudah dibaca dan sebaliknya secara instan.', category: 'Developer' },
  'text-diff-checker': { name: 'Pembanding Teks', description: 'Bandingkan dua teks dan tampilkan perbedaannya secara instan.', category: 'Developer' },
  'pdf-compressor': { name: 'Kompresor PDF', description: 'Kurangi ukuran file PDF tanpa mengubah tata letaknya.', category: 'PDF' },
  'image-resizer': { name: 'Pengubah Ukuran Gambar', description: 'Ubah ukuran gambar untuk web, media sosial, dan presentasi.', category: 'Gambar' },
  'image-compressor': { name: 'Kompresor Gambar', description: 'Kurangi ukuran file gambar dengan tetap menjaga kualitas.', category: 'Gambar' },
  'remove-background': { name: 'Hapus Background', description: 'Hapus background gambar secara lokal dengan AI di browser dan ekspor sebagai PNG transparan.', category: 'Gambar' },
  'image-cropper': { name: 'Pemotong Gambar', description: 'Potong gambar ke ukuran apa pun langsung di browser.', category: 'Gambar' },
  'image-rotator-flipper': { name: 'Pemutar & Pembalik Gambar', description: 'Putar dan balik gambar langsung di browser tanpa mengunggah file ke server.', category: 'Gambar' },
  'exif-metadata-viewer': { name: 'Penampil Metadata EXIF', description: 'Lihat metadata gambar seperti model kamera, dimensi, tanggal, orientasi, dan informasi EXIF lainnya.', category: 'Gambar' },
  'exif-metadata-remover': { name: 'Penghapus Metadata EXIF', description: 'Hapus metadata EXIF dari gambar sebelum dibagikan untuk membantu menjaga privasi.', category: 'Gambar' },
  'svg-optimizer': { name: 'Pengoptimal SVG', description: 'Optimalkan file SVG dengan menghapus data yang tidak diperlukan dan mengurangi ukuran file tanpa mengubah tampilannya secara signifikan.', category: 'Gambar' },
  'text-case-converter': { name: 'Pengubah Huruf Teks', description: 'Ubah teks menjadi huruf besar, kecil, title case, dan lainnya.', category: 'Teks' },
  'word-counter': { name: 'Penghitung Kata', description: 'Hitung jumlah kata, karakter, kalimat, paragraf, estimasi waktu membaca, dan waktu berbicara secara instan.', category: 'Teks' },
  'lorem-ipsum-generator': { name: 'Generator Lorem Ipsum', description: 'Buat teks Lorem Ipsum dengan jumlah kata, kalimat, atau paragraf yang dapat disesuaikan.', category: 'Teks' },
  'text-cleaner': { name: 'Pembersih Teks', description: 'Bersihkan teks dari spasi berlebih, baris kosong, karakter yang tidak diperlukan, dan masalah formatting umum.', category: 'Teks' },
  'duplicate-line-remover': { name: 'Penghapus Baris Duplikat', description: 'Hapus baris yang sama secara otomatis dari daftar, teks, atau data berbasis baris.', category: 'Teks' },
  'text-sorter': { name: 'Pengurut Teks', description: 'Urutkan baris teks berdasarkan alfabet, angka, panjang teks, atau urutan terbalik.', category: 'Teks' },
  'ping-test': { name: 'Ping Server', description: 'Uji latensi server dan konektivitas browser dengan permintaan sederhana.', category: 'Jaringan' },
  calculator: { name: 'Kalkulator', description: 'Lakukan perhitungan cepat dengan antarmuka yang bersih dan responsif.', category: 'Utilitas' },
  'uuid-generator': { name: 'Generator UUID', description: 'Buat UUID versi 4 secara instan untuk identifier dan key unik.', category: 'Developer' },
  'base64-encoder': { name: 'Encoder Base64', description: 'Encode dan decode teks dengan cepat menggunakan encoding Base64.', category: 'Developer' },
  'binary-translator': { name: 'Konverter Biner', description: 'Konversi teks ke biner UTF-8 dan biner kembali ke teks dengan mengetik atau mengunggah file teks langsung di browser.', category: 'Developer' },
  'mp3-cutter': { name: 'Pemotong MP3', description: 'Potong file MP3 berdasarkan waktu mulai dan selesai, lalu ekspor hasilnya langsung di browser.', category: 'Audio' },
  'audio-converter': { name: 'Konverter Audio', description: 'Konversi audio WAV ke MP3 atau MP3 ke WAV langsung di browser.', category: 'Audio' },
  'audio-visualizer': { name: 'Visualizer Audio', description: 'Tampilkan waveform dan spektrum frekuensi audio secara real-time saat diputar.', category: 'Audio' },
  'mp3-metadata-editor': { name: 'Editor Metadata MP3', description: 'Edit tag ID3 judul, artis, album, tahun, track, genre, dan komentar secara lokal.', category: 'Audio' },
  'audio-volume-booster': { name: 'Penguat / Normalizer Volume Audio', description: 'Atur gain atau normalisasi peak file WAV dan MP3 langsung di browser.', category: 'Audio' },
  'hash-generator': { name: 'Generator Hash', description: 'Buat hash SHA-1, SHA-256, SHA-384, dan SHA-512 dari teks atau file, serta cocokkan teks kandidat dengan hash secara lokal.', category: 'Developer' },
  'password-generator': { name: 'Generator Password', description: 'Buat password aman dengan panjang dan karakter yang dapat disesuaikan.', category: 'Developer' },
  'jwt-decoder': { name: 'Decoder JWT', description: 'Decode token JWT secara instan tanpa mengunggah data.', category: 'Developer' },
  'url-encoder': { name: 'Encoder URL', description: 'Encode dan decode URL dengan aman.', category: 'Developer' },
  'regex-tester': { name: 'Penguji Regex', description: 'Uji regular expression secara real-time.', category: 'Developer' },
  'image-converter': { name: 'Konverter Gambar', description: 'Konversi gambar antara format PNG, JPEG, dan WebP langsung di browser.', category: 'Gambar' },
  'image-to-pdf': { name: 'Gambar ke PDF', description: 'Konversi gambar menjadi halaman PDF dengan skala otomatis.', category: 'PDF' },
  'pdf-splitter': { name: 'Pemisah PDF', description: 'Ekstrak halaman tertentu atau pecah PDF menjadi beberapa file.', category: 'PDF' },
  'pdf-to-image': { name: 'PDF ke Gambar', description: 'Konversi halaman PDF menjadi gambar PNG atau JPG berkualitas tinggi.', category: 'PDF' },
  'pdf-page-organizer': { name: 'Pengatur Halaman PDF', description: 'Atur halaman PDF dengan memindahkan, menghapus, memutar, menggandakan, atau mengubah urutannya langsung di browser.', category: 'PDF' },
  'pdf-metadata-remover': { name: 'Penghapus Metadata PDF', description: 'Hapus metadata PDF seperti author, title, creator, dan informasi dokumen lainnya secara lokal.', category: 'PDF' },
  'pdf-watermark': { name: 'Watermark PDF', description: 'Tambahkan watermark teks ke halaman PDF dengan posisi, ukuran, rotasi, dan transparansi yang dapat disesuaikan.', category: 'PDF' },
  'qr-code-generator': { name: 'Generator QR Code', description: 'Buat QR Code yang dapat disesuaikan secara instan.', category: 'Utilitas' },
  'barcode-generator': { name: 'Generator Barcode', description: 'Buat barcode Code128, EAN, dan QR secara online.', category: 'Utilitas' },
  'random-number-generator': { name: 'Generator Angka Acak', description: 'Buat angka acak dengan rentang yang dapat disesuaikan.', category: 'Utilitas' },
  'pdf-merge': { name: 'Penggabung PDF', description: 'Gabungkan beberapa file PDF menjadi satu dokumen aman.', category: 'PDF' },
  'markdown-preview': { name: 'Pratinjau Markdown', description: 'Render Markdown secara instan dan salin hasil yang sudah diformat.', category: 'Developer' },
  'invoice-maker': { name: 'Pembuat Invoice & Penawaran', description: 'Buat invoice dan penawaran siap cetak dengan rincian usaha, item, pajak, dan logo secara lokal di browser.', category: 'Utilitas' },
  'photo-redactor': { name: 'Penyamar Foto', description: 'Buramkan atau tutup bagian pribadi pada foto lalu ekspor gambar yang sudah diratakan tanpa mengunggahnya.', category: 'Gambar' },
  'monthly-budget': { name: 'Pencatat Anggaran Bulanan', description: 'Catat pemasukan dan pengeluaran bulanan, lihat selisihnya, dan ekspor transaksi sebagai CSV di perangkat Anda.', category: 'Utilitas' },
  'recipe-scaler': { name: 'Pengubah Takaran Resep', description: 'Sesuaikan jumlah bahan untuk porsi berbeda dan konversi takaran dapur umum di browser.', category: 'Utilitas' },
  'photo-collage-maker': { name: 'Pembuat Kolase Foto', description: 'Susun foto lokal menjadi kolase yang dapat disesuaikan dan ekspor hasilnya sebagai PNG.', category: 'Gambar' },
};

export function getLocalizedTool(tool: Tool, language: Language) {
  if (language === 'id' && indonesianTools[tool.slug]) return indonesianTools[tool.slug];
  return { name: tool.name, description: tool.description, category: tool.category === 'AUDIO' ? 'Audio' : tool.category };
}

export function getToolNames(tool: Tool, language: Language) {
  const localized = getLocalizedTool(tool, language);
  const alternate = getLocalizedTool(tool, language === 'id' ? 'en' : 'id');

  return {
    localizedName: localized.name,
    alternateName: alternate.name === localized.name ? '' : alternate.name,
  };
}

export function getBilingualToolSearchText(tool: Tool) {
  const english = getLocalizedTool(tool, 'en');
  const indonesian = getLocalizedTool(tool, 'id');

  return [
    tool.slug,
    english.name,
    english.description,
    english.category,
    indonesian.name,
    indonesian.description,
    indonesian.category,
  ].join(' ');
}

export function toolMatchesSearch(tool: Tool, query: string) {
  const normalizedWords = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (normalizedWords.length === 0) return true;

  const haystack = getBilingualToolSearchText(tool).toLowerCase();
  return normalizedWords.every((word) => haystack.includes(word));
}
