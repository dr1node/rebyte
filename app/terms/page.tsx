import LocalizedText from '../../components/LocalizedText';

export const metadata = {
  title: 'Terms · ReByte',
  description: 'Terms and conditions for using the ReByte platform.',
};

export default function TermsPage() {
  return (
    <main className="py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <article className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-10 shadow-soft dark:border-slate-800/70 dark:bg-slate-950/95">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600"><LocalizedText en="Terms" id="Ketentuan" /></p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white"><LocalizedText en="Terms of use" id="Ketentuan penggunaan" /></h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
            <LocalizedText en="ReByte provides online utilities for free. Using this site indicates your agreement to our terms of service." id="ReByte menyediakan utilitas online secara gratis. Dengan menggunakan situs ini, Anda menyetujui ketentuan layanan kami." />
          </p>
          <div className="mt-10 space-y-6 text-slate-600 dark:text-slate-300">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white"><LocalizedText en="Usage" id="Penggunaan" /></h2>
              <p className="mt-3 text-sm leading-6"><LocalizedText en="You may use the tools for personal and professional purposes at no cost." id="Anda dapat menggunakan alat untuk keperluan pribadi dan profesional tanpa biaya." /></p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white"><LocalizedText en="Limitation of Liability" id="Batas tanggung jawab" /></h2>
              <p className="mt-3 text-sm leading-6"><LocalizedText en="ReByte is not responsible for the use of uploaded data or results produced by the tools." id="ReByte tidak bertanggung jawab atas penggunaan data yang diunggah atau hasil yang dihasilkan alat." /></p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
