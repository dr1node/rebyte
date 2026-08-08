'use client';

import { MessageSquare } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import { queueRequest, syncQueuedRequests } from '../lib/offlineQueue';

const formResponseUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfjXDGSZhop-T5W3zIGx_SCXBRI7xR1dulWeuqtMyOa8jaMrQ/formResponse';

export default function FeedbackSection() {
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'offline'>('idle');
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(window.navigator.onLine);

    const handleStatus = () => {
      setIsOnline(window.navigator.onLine);
      if (window.navigator.onLine) {
        void syncQueuedRequests();
      }
    };

    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);

    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  const submitFeedback = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!rating || !feedback.trim()) {
      setStatus('error');
      return;
    }

    setIsSending(true);
    setStatus('idle');
    const payload = {
      rating,
      feedback: feedback.trim(),
      email: email.trim(),
      createdAt: Date.now(),
    };

    const formData = new URLSearchParams();
    formData.set('entry.986012193', String(rating));
    formData.set('entry.1332637419', payload.feedback);
    if (payload.email) formData.set('entry.866272866', payload.email);

    try {
      if (!window.navigator.onLine) {
        await queueRequest('feedback', payload as Record<string, unknown>);
        setStatus('offline');
        setRating(0);
        setFeedback('');
        setEmail('');
        return;
      }

      await fetch(formResponseUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: formData.toString() });
      setStatus('success');
      setRating(0);
      setFeedback('');
      setEmail('');
    } catch {
      try {
        await queueRequest('feedback', payload as Record<string, unknown>);
        setStatus('offline');
        setRating(0);
        setFeedback('');
        setEmail('');
      } catch {
        setStatus('error');
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="feedback" className="scroll-mt-28 rounded-[2rem] border border-slate-200/80 bg-white/90 p-5 shadow-[0_22px_60px_-32px_rgba(15,23,42,0.32)] backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-950/95 sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100 dark:bg-sky-950/50 dark:text-sky-300 dark:ring-sky-900/60">
            <MessageSquare className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-400">{t('feedback')}</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{t('feedbackTitle')}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{t('feedbackDescription')}</p>
          <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">{t('feedbackPrivacy')}</p>
        </div>

        <form onSubmit={submitFeedback} className="rounded-3xl border border-slate-200/80 bg-slate-50 p-5 shadow-inner dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="space-y-5">
            <fieldset>
              <legend className="text-sm font-semibold text-slate-900 dark:text-white">{t('feedbackRating')} <span className="text-rose-500">*</span></legend>
              <div className="mt-3 flex flex-wrap gap-2" aria-label={t('feedbackChooseRating')}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border text-sm font-semibold transition ${rating === value ? 'border-sky-600 bg-sky-600 text-white shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-sky-500'}`}>
                    <input type="radio" name="rating" value={value} checked={rating === value} onChange={() => { setRating(value); setStatus('idle'); }} className="sr-only" />
                    {value}
                  </label>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{t('feedbackChooseRating')}</p>
            </fieldset>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{t('feedbackMessage')} <span className="text-rose-500">*</span></span>
              <textarea value={feedback} onChange={(event) => { setFeedback(event.target.value); setStatus('idle'); }} required rows={5} placeholder={t('feedbackMessagePlaceholder')} className="w-full resize-y rounded-2xl border border-slate-200/80 bg-white p-4 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-slate-800" />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{t('feedbackEmail')}</span>
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t('feedbackEmailPlaceholder')} className="w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-slate-800" />
            </label>

            {status === 'success' ? <p role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300">{t('feedbackSuccess')}</p> : null}
            {status === 'offline' ? <p role="status" className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-300">{t('feedbackOffline')}</p> : null}
            {status === 'error' ? <p role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-300">{t('feedbackError')}</p> : null}
            {!isOnline ? <p className="rounded-2xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-700 dark:border-sky-900/70 dark:bg-sky-950/40 dark:text-sky-300">{t('feedbackOfflineStatus')}</p> : null}
            <button type="submit" disabled={isSending} className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-wait disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white">{isSending ? t('feedbackSending') : t('feedbackSubmit')}</button>
          </div>
        </form>
      </div>
    </section>
  );
}
