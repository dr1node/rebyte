'use client';

import { useEffect, useRef, useState } from 'react';
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import FileDropzone from '../FileDropzone';
import { useLanguage } from '../../lib/LanguageContext';

type DocumentType = 'invoice' | 'quotation';
type Currency = 'IDR' | 'USD';
type LineItem = { description: string; quantity: string; unitPrice: string };

const initialItems: LineItem[] = [{ description: '', quantity: '1', unitPrice: '' }];

function localDateString() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [''];

  const lines: string[] = [];
  let line = '';
  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (line && font.widthOfTextAtSize(candidate, size) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  });
  if (line) lines.push(line);
  return lines;
}

function drawRight(page: PDFPage, text: string, x: number, width: number, y: number, font: PDFFont, size: number) {
  const textWidth = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: x + width - textWidth, y, font, size, color: rgb(0.12, 0.16, 0.22) });
}

export default function InvoiceMakerTool() {
  const { language } = useLanguage();
  const isIndonesian = language === 'id';
  const [documentType, setDocumentType] = useState<DocumentType>('invoice');
  const [currency, setCurrency] = useState<Currency>('IDR');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessContact, setBusinessContact] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [documentNumber, setDocumentNumber] = useState('INV-0001');
  const [issueDate, setIssueDate] = useState(localDateString);
  const [dueDate, setDueDate] = useState('');
  const [taxRate, setTaxRate] = useState('0');
  const [items, setItems] = useState<LineItem[]>(initialItems);
  const [logo, setLogo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const previewUrlRef = useRef('');

  useEffect(() => () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
  }, []);

  const labels = isIndonesian
    ? {
        description: 'Buat invoice atau penawaran dengan rincian usaha, pelanggan, item, pajak, dan logo. Data tetap di perangkat Anda.',
        invoice: 'Invoice',
        quotation: 'Penawaran',
        business: 'Nama usaha',
        businessAddress: 'Alamat usaha',
        businessContact: 'Email atau telepon usaha',
        customer: 'Nama pelanggan',
        customerAddress: 'Alamat pelanggan',
        number: 'Nomor dokumen',
        issueDate: 'Tanggal dibuat',
        dueDate: 'Jatuh tempo',
        currency: 'Mata uang',
        logo: 'Logo usaha (opsional)',
        logoHint: 'Gunakan logo PNG atau JPG, maksimal 5 MB.',
        items: 'Rincian item',
        item: 'Deskripsi item',
        quantity: 'Jumlah',
        unitPrice: 'Harga satuan',
        addItem: 'Tambah item',
        removeItem: 'Hapus item',
        tax: 'Pajak (%)',
        subtotal: 'Subtotal',
        taxAmount: 'Pajak',
        total: 'Total',
        generate: 'Buat dan unduh PDF',
        generating: 'Membuat PDF...',
        download: 'Unduh PDF lagi',
        preview: 'Pratinjau PDF',
        required: 'Lengkapi nama usaha, nama pelanggan, nomor dokumen, serta setidaknya satu item yang valid.',
        invalid: 'Pastikan jumlah lebih dari 0, harga tidak negatif, dan pajak antara 0–100%.',
        logoTooLarge: 'Ukuran logo maksimal 5 MB.',
        createError: 'PDF tidak dapat dibuat. Periksa isi dokumen dan pastikan logo berformat PNG atau JPG.',
        fileLabel: 'Unggah logo PNG/JPG',
      }
    : {
        description: 'Create an invoice or quotation with business, customer, line item, tax, and logo details. Your data stays on this device.',
        invoice: 'Invoice',
        quotation: 'Quotation',
        business: 'Business name',
        businessAddress: 'Business address',
        businessContact: 'Business email or phone',
        customer: 'Customer name',
        customerAddress: 'Customer address',
        number: 'Document number',
        issueDate: 'Issue date',
        dueDate: 'Due date',
        currency: 'Currency',
        logo: 'Business logo (optional)',
        logoHint: 'Use a PNG or JPG logo up to 5 MB.',
        items: 'Line items',
        item: 'Item description',
        quantity: 'Quantity',
        unitPrice: 'Unit price',
        addItem: 'Add item',
        removeItem: 'Remove item',
        tax: 'Tax (%)',
        subtotal: 'Subtotal',
        taxAmount: 'Tax',
        total: 'Total',
        generate: 'Create and download PDF',
        generating: 'Creating PDF...',
        download: 'Download PDF again',
        preview: 'PDF preview',
        required: 'Enter a business name, customer name, document number, and at least one valid line item.',
        invalid: 'Quantity must be above 0, prices cannot be negative, and tax must be between 0 and 100%.',
        logoTooLarge: 'The logo must be 5 MB or smaller.',
        createError: 'Unable to create the PDF. Check the document details and make sure the logo is PNG or JPG.',
        fileLabel: 'Upload PNG/JPG logo',
      };

  const lineTotals = items.map((item) => item.description.trim() ? Number(item.quantity) * Number(item.unitPrice) : 0);
  const subtotal = lineTotals.reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0);
  const numericTaxRate = Number(taxRate);
  const taxAmount = subtotal * (Number.isFinite(numericTaxRate) ? numericTaxRate : 0) / 100;
  const total = subtotal + taxAmount;
  const formattedMoney = (value: number) => new Intl.NumberFormat(isIndonesian ? 'id-ID' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'IDR' ? 0 : 2,
  }).format(value);

  const updateItem = (index: number, field: keyof LineItem, value: string) => {
    setItems((current) => current.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [field]: value } : item
    )));
  };

  const downloadPdf = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const createPdf = async () => {
    const validItems = items.filter((item) => item.description.trim());
    if (!businessName.trim() || !customerName.trim() || !documentNumber.trim() || !validItems.length) {
      setError(labels.required);
      return;
    }

    const validNumbers = validItems.every((item) => (
      Number.isFinite(Number(item.quantity))
      && Number(item.quantity) > 0
      && item.unitPrice.trim() !== ''
      && Number.isFinite(Number(item.unitPrice))
      && Number(item.unitPrice) >= 0
    ));
    if (!validNumbers || !Number.isFinite(numericTaxRate) || numericTaxRate < 0 || numericTaxRate > 100) {
      setError(labels.invalid);
      return;
    }

    setProcessing(true);
    setError('');
    try {
      const pdf = await PDFDocument.create();
      const regular = await pdf.embedFont(StandardFonts.Helvetica);
      const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
      let embeddedLogo: Awaited<ReturnType<typeof pdf.embedPng>> | null = null;
      if (logo) {
        const bytes = await logo.arrayBuffer();
        const isPng = logo.type === 'image/png' || logo.name.toLowerCase().endsWith('.png');
        embeddedLogo = isPng
          ? await pdf.embedPng(bytes)
          : await pdf.embedJpg(bytes);
      }

      const documentTitle = documentType === 'invoice'
        ? (isIndonesian ? 'INVOICE' : 'INVOICE')
        : (isIndonesian ? 'PENAWARAN' : 'QUOTATION');
      const dateText = (value: string) => value
        ? new Date(`${value}T00:00:00`).toLocaleDateString(isIndonesian ? 'id-ID' : 'en-US')
        : '-';
      const drawTableHeader = (page: PDFPage, y: number) => {
        page.drawLine({ start: { x: 42, y: y + 8 }, end: { x: 553, y: y + 8 }, thickness: 0.8, color: rgb(0.75, 0.79, 0.84) });
        page.drawText(isIndonesian ? 'Deskripsi' : 'Description', { x: 44, y: y - 7, font: bold, size: 9 });
        drawRight(page, isIndonesian ? 'Jumlah' : 'Qty', 288, 42, y - 7, bold, 9);
        drawRight(page, isIndonesian ? 'Harga' : 'Unit price', 340, 92, y - 7, bold, 9);
        drawRight(page, isIndonesian ? 'Total' : 'Amount', 438, 110, y - 7, bold, 9);
        return y - 22;
      };

      const addPage = (continued = false) => {
        const page = pdf.addPage([595.28, 841.89]);
        let y = 790;
        if (continued) {
          page.drawText(`${documentTitle} - ${isIndonesian ? 'lanjutan' : 'continued'}`, { x: 42, y, font: bold, size: 14, color: rgb(0.05, 0.35, 0.58) });
          y -= 36;
        } else {
          page.drawText(documentTitle, { x: 42, y, font: bold, size: 20, color: rgb(0.05, 0.35, 0.58) });
          page.drawText(businessName, { x: 42, y: y - 34, font: bold, size: 15, maxWidth: embeddedLogo ? 330 : 500 });
          let businessY = y - 52;
          [businessAddress, businessContact].filter(Boolean).forEach((line) => {
            wrapText(line, regular, 9, embeddedLogo ? 330 : 500).forEach((wrapped) => {
              page.drawText(wrapped, { x: 42, y: businessY, font: regular, size: 9, color: rgb(0.35, 0.39, 0.44) });
              businessY -= 13;
            });
          });
          if (embeddedLogo) {
            const scale = Math.min(92 / embeddedLogo.width, 58 / embeddedLogo.height);
            page.drawImage(embeddedLogo, { x: 460, y: y - 66, width: embeddedLogo.width * scale, height: embeddedLogo.height * scale });
          }

          let detailsY = Math.min(businessY, y - 105) - 14;
          page.drawLine({ start: { x: 42, y: detailsY + 9 }, end: { x: 553, y: detailsY + 9 }, thickness: 0.8, color: rgb(0.82, 0.85, 0.88) });
          page.drawText(`${isIndonesian ? 'Nomor' : 'Number'}: ${documentNumber}`, { x: 42, y: detailsY - 5, font: bold, size: 9 });
          page.drawText(`${isIndonesian ? 'Tanggal' : 'Date'}: ${dateText(issueDate)}`, { x: 300, y: detailsY - 5, font: regular, size: 9 });
          detailsY -= 25;
          page.drawText(isIndonesian ? 'Kepada' : 'Bill to', { x: 42, y: detailsY, font: bold, size: 10 });
          page.drawText(customerName, { x: 42, y: detailsY - 16, font: regular, size: 9 });
          if (customerAddress.trim()) page.drawText(customerAddress, { x: 42, y: detailsY - 29, font: regular, size: 9, maxWidth: 250 });
          if (documentType === 'invoice' && dueDate) {
            page.drawText(`${isIndonesian ? 'Jatuh tempo' : 'Due date'}: ${dateText(dueDate)}`, { x: 330, y: detailsY - 5, font: regular, size: 9 });
          }
          y = detailsY - (customerAddress.trim() ? 55 : 42);
        }
        return { page, y: drawTableHeader(page, y) };
      };

      let { page, y } = addPage();
      validItems.forEach((item) => {
        const lineTotal = Number(item.quantity) * Number(item.unitPrice);
        const descriptionLines = wrapText(item.description.trim(), regular, 9, 230);
        const rowHeight = Math.max(26, descriptionLines.length * 12 + 10);
        if (y - rowHeight < 105) {
          ({ page, y } = addPage(true));
        }
        descriptionLines.forEach((line, lineIndex) => {
          page.drawText(line, { x: 44, y: y - 8 - lineIndex * 12, font: regular, size: 9, maxWidth: 230 });
        });
        drawRight(page, item.quantity, 288, 42, y - 8, regular, 9);
        drawRight(page, Number(item.unitPrice).toLocaleString(isIndonesian ? 'id-ID' : 'en-US', { maximumFractionDigits: 2 }), 340, 92, y - 8, regular, 9);
        drawRight(page, lineTotal.toLocaleString(isIndonesian ? 'id-ID' : 'en-US', { maximumFractionDigits: 2 }), 438, 110, y - 8, regular, 9);
        y -= rowHeight;
        page.drawLine({ start: { x: 42, y: y + 2 }, end: { x: 553, y: y + 2 }, thickness: 0.35, color: rgb(0.88, 0.89, 0.91) });
      });

      if (y < 150) ({ page, y } = addPage(true));
      y -= 12;
      const moneyText = (value: number) => `${currency} ${value.toLocaleString(isIndonesian ? 'id-ID' : 'en-US', { maximumFractionDigits: currency === 'IDR' ? 0 : 2 })}`;
      drawRight(page, isIndonesian ? 'Subtotal' : 'Subtotal', 350, 90, y, regular, 9);
      drawRight(page, moneyText(subtotal), 445, 108, y, regular, 9);
      y -= 17;
      drawRight(page, `${isIndonesian ? 'Pajak' : 'Tax'} (${numericTaxRate}%)`, 350, 90, y, regular, 9);
      drawRight(page, moneyText(taxAmount), 445, 108, y, regular, 9);
      y -= 10;
      page.drawLine({ start: { x: 350, y }, end: { x: 553, y }, thickness: 0.8, color: rgb(0.55, 0.6, 0.66) });
      y -= 17;
      drawRight(page, isIndonesian ? 'TOTAL' : 'TOTAL', 350, 90, y, bold, 11);
      drawRight(page, moneyText(total), 445, 108, y, bold, 11);

      const bytes = await pdf.save();
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = url;
      setPreviewUrl(url);
      const safeNumber = documentNumber.replace(/[^a-z0-9-_]/gi, '-');
      downloadPdf(url, `${documentType}-${safeNumber}.pdf`);
    } catch (caughtError) {
      console.error('Invoice PDF generation failed:', caughtError);
      setError(labels.createError);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95">
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{labels.description}</p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800/70 dark:bg-slate-950">
        <div className="mb-6 flex flex-wrap gap-3" role="group" aria-label={isIndonesian ? 'Jenis dokumen' : 'Document type'}>
          {(['invoice', 'quotation'] as const).map((value) => (
            <button key={value} type="button" aria-pressed={documentType === value} onClick={() => setDocumentType(value)} className={`rounded-3xl border px-4 py-3 text-sm font-semibold ${documentType === value ? 'border-sky-500 bg-sky-50 text-slate-900 dark:border-sky-400 dark:bg-slate-900 dark:text-white' : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'}`}>
              {value === 'invoice' ? labels.invoice : labels.quotation}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.business}<input value={businessName} onChange={(event) => setBusinessName(event.target.value)} maxLength={100} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white" /></label>
          <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.businessContact}<input value={businessContact} onChange={(event) => setBusinessContact(event.target.value)} maxLength={120} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white" /></label>
          <label className="text-sm font-semibold text-slate-900 dark:text-white sm:col-span-2">{labels.businessAddress}<input value={businessAddress} onChange={(event) => setBusinessAddress(event.target.value)} maxLength={180} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white" /></label>
          <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.customer}<input value={customerName} onChange={(event) => setCustomerName(event.target.value)} maxLength={100} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white" /></label>
          <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.number}<input value={documentNumber} onChange={(event) => setDocumentNumber(event.target.value)} maxLength={50} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white" /></label>
          <label className="text-sm font-semibold text-slate-900 dark:text-white sm:col-span-2">{labels.customerAddress}<input value={customerAddress} onChange={(event) => setCustomerAddress(event.target.value)} maxLength={180} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white" /></label>
          <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.issueDate}<input type="date" value={issueDate} onChange={(event) => setIssueDate(event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white" /></label>
          {documentType === 'invoice' ? <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.dueDate}<input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white" /></label> : null}
          <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.currency}<select value={currency} onChange={(event) => setCurrency(event.target.value as Currency)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white"><option value="IDR">IDR - Rupiah</option><option value="USD">USD - US Dollar</option></select></label>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">{labels.logo}</p>
          <FileDropzone label={labels.fileLabel} hint={labels.logoHint} accept=".png,.jpg,.jpeg,image/png,image/jpeg" onFiles={(files) => {
            const selected = files[0] ?? null;
            if (selected && selected.size > 5 * 1024 * 1024) {
              setLogo(null);
              setError(labels.logoTooLarge);
              return;
            }
            setLogo(selected);
            setError('');
          }} />
          {logo ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{logo.name}</p> : null}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{labels.items}</h3>
          <div className="mt-4 space-y-3">
            {items.map((item, index) => (
              <div key={index} className="grid gap-3 rounded-3xl border border-slate-200/80 bg-slate-50 p-4 sm:grid-cols-[minmax(0,1fr)_110px_160px_auto] dark:border-slate-800 dark:bg-slate-900">
                <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.item}<input value={item.description} onChange={(event) => updateItem(index, 'description', event.target.value)} maxLength={160} className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-950 dark:text-white" /></label>
                <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.quantity}<input type="number" min="0.01" step="any" value={item.quantity} onChange={(event) => updateItem(index, 'quantity', event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-3 py-3 font-normal dark:border-slate-800 dark:bg-slate-950 dark:text-white" /></label>
                <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.unitPrice}<input type="number" min="0" step="any" value={item.unitPrice} onChange={(event) => updateItem(index, 'unitPrice', event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-3 py-3 font-normal dark:border-slate-800 dark:bg-slate-950 dark:text-white" /></label>
                <button type="button" aria-label={`${labels.removeItem} ${index + 1}`} disabled={items.length === 1} onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="self-end rounded-3xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200">{labels.removeItem}</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setItems((current) => [...current, { description: '', quantity: '1', unitPrice: '' }])} className="mt-3 rounded-3xl border border-sky-300 px-4 py-3 text-sm font-semibold text-sky-700 dark:border-sky-700 dark:text-sky-300">{labels.addItem}</button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">{labels.tax}<input type="number" min="0" max="100" step="0.1" value={taxRate} onChange={(event) => setTaxRate(event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal dark:border-slate-800 dark:bg-slate-900 dark:text-white" /></label>
          <div className="space-y-2 rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="flex justify-between gap-4"><span>{labels.subtotal}</span><span>{formattedMoney(subtotal)}</span></p>
            <p className="flex justify-between gap-4"><span>{labels.taxAmount} ({Number.isFinite(numericTaxRate) ? numericTaxRate : 0}%)</span><span>{formattedMoney(taxAmount)}</span></p>
            <p className="flex justify-between gap-4 border-t border-slate-200 pt-2 font-bold dark:border-slate-700"><span>{labels.total}</span><span>{formattedMoney(total)}</span></p>
          </div>
        </div>

        {error ? <p role="alert" className="mt-4 rounded-3xl border border-rose-300/70 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-600/60 dark:bg-rose-900/30 dark:text-rose-200">{error}</p> : null}
        <button type="button" disabled={processing} onClick={() => void createPdf()} className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500 disabled:cursor-wait disabled:opacity-60">{processing ? labels.generating : labels.generate}</button>
      </div>

      {previewUrl ? <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800/70 dark:bg-slate-900/95">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-semibold text-slate-900 dark:text-white">{labels.preview}</h3>
          <button type="button" onClick={() => downloadPdf(previewUrl, `${documentType}-${documentNumber}.pdf`)} className="rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700">{labels.download}</button>
        </div>
        <object data={previewUrl} type="application/pdf" title={labels.preview} className="h-[520px] w-full rounded-3xl bg-white"><p className="p-4 text-sm text-slate-600">{labels.preview}</p></object>
      </div> : null}
    </div>
  );
}
