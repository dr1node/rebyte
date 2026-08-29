import Link from 'next/link';
import AboutFAQ from '../../components/AboutFAQ';
import LocalizedText from '../../components/LocalizedText';

export const metadata = {
  title: 'About · ReByte',
  description: 'Learn more about ReByte, a modern suite of free online utilities.',
};

export default function AboutPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/95 p-10 shadow-soft dark:border-slate-800/70 dark:bg-slate-950/95 sm:p-12">
          <div className="absolute inset-x-0 top-0 h-72 bg-hero-stripes opacity-80 dark:opacity-60" />
          <div className="relative grid gap-12">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:bg-sky-900/15 dark:text-sky-300">
                <LocalizedText en="About ReByte" id="Tentang ReByte" />
              </p>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                <LocalizedText en="Powerful browser tools with speed, privacy, and no distractions." id="Alat browser yang cepat, privat, dan bebas gangguan." />
              </h1>
              <p className="mt-6 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                <LocalizedText en="ReByte is a curated collection of web utilities built for the modern web. No login, no database, and no waiting—just fast, reliable tools that help you finish work and keep moving." id="ReByte adalah kumpulan utilitas web untuk web modern. Tanpa login, database, atau waktu tunggu, hanya alat cepat dan andal untuk membantu Anda menyelesaikan pekerjaan." />
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/95">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400"><LocalizedText en="Our mission" id="Misi kami" /></p>
                <p className="mt-4 text-base leading-7 text-slate-700 dark:text-slate-200"><LocalizedText en="Create approachable utilities that work instantly in the browser, with privacy built in and interfaces designed for clarity." id="Membuat utilitas yang mudah digunakan dan langsung bekerja di browser, dengan privasi serta antarmuka yang jelas." /></p>
              </div>
              <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/95">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400"><LocalizedText en="Our promise" id="Janji kami" /></p>
                <p className="mt-4 text-base leading-7 text-slate-700 dark:text-slate-200"><LocalizedText en="Keep tools free, fast, and easy to use without forcing signup, tracking, or backend complexity." id="Menjaga alat tetap gratis, cepat, dan mudah digunakan tanpa pendaftaran, pelacakan, atau kompleksitas backend." /></p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200/70 bg-slate-50 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/95">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-400"><LocalizedText en="Offline-first PWA" id="PWA offline-first" /></p>
              <p className="mt-4 text-base leading-7 text-slate-700 dark:text-slate-200">
                <LocalizedText
                  en="ReByte now works as a Progressive Web App with offline-first support. The app loads its key pages and tool assets in advance, so the tools remain fully usable without an internet connection. Feedback and analytics requests are queued locally and automatically synced when the connection returns."
                  id="ReByte kini berfungsi sebagai Progressive Web App dengan dukungan offline-first. Aplikasi memuat halaman utama dan aset alat lebih dulu, sehingga alat tetap dapat digunakan sepenuhnya tanpa koneksi internet. Permintaan feedback dan analytics disimpan dalam antrean lokal lalu otomatis tersinkronisasi saat koneksi kembali."
                />
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: <LocalizedText en="Tools available" id="Alat tersedia" />, value: '40+' },
                { label: <LocalizedText en="No login needed" id="Tanpa login" />, value: '100%' },
                { label: <LocalizedText en="Built for" id="Dibuat untuk" />, value: <LocalizedText en="browser-first workflows" id="alur kerja browser" /> },
              ].map((item) => (
                <div key={item.value.toString()} className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/95">
                  <p className="text-3xl font-semibold text-slate-900 dark:text-white">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/tools" className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                <LocalizedText en="Browse tools" id="Lihat alat" />
              </Link>
              <Link href="/" className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                <LocalizedText en="Explore the homepage" id="Jelajahi beranda" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-10 shadow-soft dark:border-slate-800/70 dark:bg-slate-950/95">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600"><LocalizedText en="Why ReByte" id="Mengapa ReByte" /></p>
              <h2 className="mt-5 text-3xl font-semibold text-slate-900 dark:text-white"><LocalizedText en="Built for practical work, not for hype." id="Dibuat untuk pekerjaan nyata, bukan sensasi." /></h2>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
                <LocalizedText en="Every utility is designed to solve a real task quickly. ReByte focuses on usefulness, clarity, and a smooth browser experience across desktop and mobile." id="Setiap utilitas dirancang untuk menyelesaikan tugas dengan cepat. ReByte berfokus pada kegunaan, kejelasan, dan pengalaman browser yang mulus di desktop maupun mobile." />
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { title: <LocalizedText en="Privacy-first" id="Utamakan privasi" />, content: <LocalizedText en="Most tools run entirely in the browser, so your data stays local." id="Sebagian besar alat berjalan sepenuhnya di browser sehingga data tetap lokal." /> },
                  { title: <LocalizedText en="Instant access" id="Akses instan" />, content: <LocalizedText en="Open a tool, paste your input, and get results within seconds." id="Buka alat, tempel input, dan dapatkan hasil dalam hitungan detik." /> },
                  { title: <LocalizedText en="Developer-ready" id="Siap untuk developer" />, content: <LocalizedText en="Includes converters, encoders, PDF utilities, and debugging helpers." id="Menyediakan konverter, encoder, utilitas PDF, dan bantuan debugging." /> },
                  { title: <LocalizedText en="Modern design" id="Desain modern" />, content: <LocalizedText en="Clean UI with responsive layout and accessible controls." id="UI bersih dengan layout responsif dan kontrol yang mudah diakses." /> },
                ].map((item, index) => (
                  <div key={index} className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
                    <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-10 shadow-soft dark:border-slate-800/70 dark:bg-slate-950/95">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600"><LocalizedText en="Product focus" id="Fokus produk" /></p>
              <h2 className="mt-5 text-3xl font-semibold text-slate-900 dark:text-white"><LocalizedText en="What we build" id="Yang kami buat" /></h2>
              <ul className="mt-8 space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-600" />
                  <span><LocalizedText en="Compact, usable tools for everyday browser workflows." id="Alat ringkas dan berguna untuk alur kerja browser sehari-hari." /></span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-600" />
                  <span><LocalizedText en="Privacy-minded experiences with minimal external dependencies." id="Pengalaman yang mengutamakan privasi dengan dependensi eksternal minimal." /></span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-600" />
                  <span><LocalizedText en="High-quality utility pages with clear guidance and instant feedback." id="Halaman utilitas berkualitas dengan panduan jelas dan hasil instan." /></span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-10 shadow-soft dark:border-slate-800/70 dark:bg-slate-950/95">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600"><LocalizedText en="Core values" id="Nilai inti" /></p>
              <div className="mt-8 space-y-6">
                {[
                  { title: <LocalizedText en="Simplicity" id="Kesederhanaan" />, description: <LocalizedText en="Remove unnecessary options and make each tool feel effortless to use." id="Hilangkan opsi yang tidak perlu agar setiap alat terasa mudah digunakan." /> },
                  { title: <LocalizedText en="Reliability" id="Keandalan" />, description: <LocalizedText en="Ensure tools work consistently without extra setup or hidden steps." id="Pastikan alat bekerja konsisten tanpa setup tambahan atau langkah tersembunyi." /> },
                  { title: <LocalizedText en="Transparency" id="Transparansi" />, description: <LocalizedText en="Be open about how tools process data and what happens in the browser." id="Jelaskan cara alat memproses data dan apa yang terjadi di browser." /> },
                ].map((item, index) => (
                  <div key={index} className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-10 shadow-soft dark:border-slate-800/70 dark:bg-slate-950/95">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600"><LocalizedText en="Roadmap" id="Roadmap" /></p>
              <h2 className="mt-5 text-3xl font-semibold text-slate-900 dark:text-white"><LocalizedText en="What’s next" id="Berikutnya" /></h2>
              <div className="mt-8 space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95">
                  <p className="font-semibold text-slate-900 dark:text-white"><LocalizedText en="More PDF & developer tools" id="Lebih banyak alat PDF & developer" /></p>
                  <p className="mt-2"><LocalizedText en="Continuously expand utilities for workflows like PDF editing, image conversion, regex testing, and token decoding." id="Terus memperluas utilitas untuk edit PDF, konversi gambar, pengujian regex, dan decoding token." /></p>
                </div>
                <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95">
                  <p className="font-semibold text-slate-900 dark:text-white"><LocalizedText en="Improved sharing" id="Berbagi yang lebih mudah" /></p>
                  <p className="mt-2"><LocalizedText en="Add easier ways to share results, export outputs, and move data between tools." id="Tambahkan cara yang lebih mudah untuk berbagi hasil, mengekspor output, dan memindahkan data antar alat." /></p>
                </div>
                <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95">
                  <p className="font-semibold text-slate-900 dark:text-white"><LocalizedText en="Faster onboarding" id="Mulai lebih cepat" /></p>
                  <p className="mt-2"><LocalizedText en="Offer more guided help for new users and smarter search for finding the right tool fast." id="Berikan bantuan terpandu dan pencarian yang lebih cerdas untuk menemukan alat yang tepat." /></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.65fr_0.35fr]">
          <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-10 shadow-soft dark:border-slate-800/70 dark:bg-slate-950/95">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600"><LocalizedText en="Modern utility toolkit" id="Toolkit utilitas modern" /></p>
            <h2 className="mt-5 text-3xl font-semibold text-slate-900 dark:text-white"><LocalizedText en="Designed for teams, builders, and anyone who values speed." id="Dibuat untuk tim, builder, dan siapa saja yang menghargai kecepatan." /></h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { title: 'PDF Saver', body: <LocalizedText en="Compress, merge, split, and convert files without uploading them." id="Kompres, gabungkan, pecah, dan konversi file tanpa mengunggahnya." /> },
                { title: 'Dev helpers', body: <LocalizedText en="JWT decode, URL encode, regex testing, and barcode generation." id="Decode JWT, encode URL, uji regex, dan buat barcode." /> },
                { title: 'Image workflow', body: <LocalizedText en="Convert, resize, and export images in the browser." id="Konversi, ubah ukuran, dan ekspor gambar di browser." /> },
                { title: 'Text utilities', body: <LocalizedText en="Markdown preview, JSON formatting, and case conversion." id="Pratinjau Markdown, format JSON, dan konversi huruf." /> },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800/70 dark:bg-slate-900/95">
                  <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-10 shadow-soft dark:border-slate-800/70 dark:bg-slate-950/95">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600"><LocalizedText en="Commitment" id="Komitmen" /></p>
              <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300">
                <LocalizedText en="ReByte is about practical tools that reduce friction for everyday tasks. We keep the experience fast and distraction-free by avoiding unnecessary features." id="ReByte menyediakan alat praktis untuk mengurangi hambatan tugas sehari-hari. Pengalaman dijaga cepat dan bebas gangguan." />
              </p>
              <div className="mt-8 grid gap-4">
                {[
                  <LocalizedText key="signup" en="No sign-up required" id="Tanpa pendaftaran" />,
                  <LocalizedText key="tracking" en="No hidden tracking" id="Tanpa pelacakan tersembunyi" />,
                  <LocalizedText key="browser" en="All tools accessible in-browser" id="Semua alat dapat diakses di browser" />,
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 rounded-3xl border border-slate-200/70 bg-slate-50 p-4 dark:border-slate-800/70 dark:bg-slate-900/95">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-600" />
                    <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-10 shadow-soft dark:border-slate-800/70 dark:bg-slate-950/95">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600"><LocalizedText en="Get started" id="Mulai" /></p>
              <h3 className="mt-5 text-2xl font-semibold text-slate-900 dark:text-white"><LocalizedText en="Start using tools in seconds." id="Mulai gunakan alat dalam hitungan detik." /></h3>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300"><LocalizedText en="Open the tools page, choose a utility, and paste your content. No setup required." id="Buka halaman alat, pilih utilitas, dan tempel konten Anda. Tanpa setup." /></p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/tools" className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                  <LocalizedText en="View tools" id="Lihat alat" />
                </Link>
                <Link href="/" className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                  <LocalizedText en="Return home" id="Kembali ke beranda" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-[2rem] border border-slate-200/70 bg-white/95 p-10 shadow-soft dark:border-slate-800/70 dark:bg-slate-950/95">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600"><LocalizedText en="Meet the Developer" id="Tentang Developer" /></p>
          <h2 className="mt-5 text-3xl font-semibold text-slate-900 dark:text-white"><LocalizedText en="Independently designed and built." id="Dirancang dan dibuat secara mandiri." /></h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
            <LocalizedText en="ReByte is independently designed and developed by Regi." id="ReByte dirancang dan dikembangkan secara mandiri oleh Regi." />
          </p>
          <div className="mt-6">
            <a
              href="https://rex.is-a.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <LocalizedText en="Visit Portfolio" id="Kunjungi Portofolio" />
            </a>
          </div>
        </div>

        <div className="mt-12">
          <AboutFAQ />
        </div>
      </div>
    </div>
  );
}
