import LocalizedText from '../../components/LocalizedText';

export const metadata = {
  title: 'Privacy · ReByte',
  description: 'Privacy policy for ReByte and how user data is handled.',
};

export default function PrivacyPage() {
  return (
    <main className="py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <article className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-10 shadow-soft dark:border-slate-800/70 dark:bg-slate-950/95">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600"><LocalizedText en="Privacy" id="Privasi" /></p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white"><LocalizedText en="Your data stays private." id="Data Anda tetap privat." /></h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
            <LocalizedText en="ReByte does not store user data. All default processing happens in the browser so your files and text remain private." id="ReByte tidak menyimpan data pengguna. Pemrosesan default dilakukan di browser agar file dan teks Anda tetap privat." />
          </p>
          <div className="mt-10 space-y-6 text-slate-600 dark:text-slate-300">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white"><LocalizedText en="No login required." id="Tidak perlu login." /></h2>
              <p className="mt-3 text-sm leading-6"><LocalizedText en="This platform is designed without authentication so no user information is collected." id="Platform ini dibuat tanpa autentikasi sehingga tidak mengumpulkan informasi pengguna." /></p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white"><LocalizedText en="No server storage." id="Tanpa penyimpanan server." /></h2>
              <p className="mt-3 text-sm leading-6"><LocalizedText en="Data is only used client-side and is not stored on a server or external database." id="Data hanya digunakan di sisi klien dan tidak disimpan di server atau database eksternal." /></p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
