import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

function isPrivateIpv4(address: string) {
  const parts = address.split('.').map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return false;
  }

  const [a, b] = parts;
  return (
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a === 0 ||
    (a === 100 && b >= 64 && b <= 127)
  );
}

function isPrivateAddress(address: string) {
  const family = isIP(address);
  if (family === 4) return isPrivateIpv4(address);
  if (family === 6) {
    const normalized = address.toLowerCase();
    if (normalized.startsWith('::ffff:')) {
      return isPrivateIpv4(normalized.slice(7));
    }
    return (
      normalized === '::1' ||
      normalized === '::' ||
      normalized.startsWith('fc') ||
      normalized.startsWith('fd') ||
      normalized.startsWith('fe8') ||
      normalized.startsWith('fe9') ||
      normalized.startsWith('fea') ||
      normalized.startsWith('feb')
    );
  }
  return false;
}

export async function GET(request: NextRequest) {
  const rawTarget = request.nextUrl.searchParams.get('url')?.trim();
  if (!rawTarget) {
    return NextResponse.json({ ok: false, message: 'Target URL is required.' }, { status: 400 });
  }
  if (rawTarget.length > 2048) {
    return NextResponse.json({ ok: false, message: 'Target URL is too long.' }, { status: 400 });
  }

  let url: URL;
  try {
    const withProtocol = /^https?:\/\//i.test(rawTarget) ? rawTarget : `https://${rawTarget}`;
    url = new URL(withProtocol);
  } catch {
    return NextResponse.json({ ok: false, message: 'Enter a valid HTTP or HTTPS URL or hostname.' }, { status: 400 });
  }

  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    return NextResponse.json({ ok: false, message: 'Only public HTTP or HTTPS targets are supported.' }, { status: 400 });
  }

  const hostname = url.hostname.toLowerCase();
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    isPrivateAddress(hostname)
  ) {
    return NextResponse.json({ ok: false, message: 'Local and private network addresses are not supported.' }, { status: 400 });
  }

  try {
    const addresses = isIP(hostname)
      ? [{ address: hostname, family: isIP(hostname) }]
      : await lookup(hostname, { all: true, verbatim: true });

    const publicAddress = addresses.find(({ address }) => !isPrivateAddress(address));
    if (!publicAddress) {
      return NextResponse.json({ ok: false, message: 'The target resolves only to a private or local address.' }, { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const start = performance.now();

    let response: Response;
    let method = 'HEAD';
    try {
      response = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow',
        cache: 'no-store',
        signal: controller.signal,
        headers: { 'User-Agent': 'ReByte-Ping/1.0' },
      });
    } catch (error) {
      if ((error as Error).name === 'AbortError') throw error;
      throw error;
    }

    if (response.status === 405 || response.status === 501) {
      method = 'GET';
      response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        cache: 'no-store',
        signal: controller.signal,
        headers: { 'Range': 'bytes=0-0', 'User-Agent': 'ReByte-Ping/1.0' },
      });
    }

    clearTimeout(timeout);
    const latency = Math.max(1, Math.round(performance.now() - start));

    return NextResponse.json(
      {
        ok: response.ok || (response.status >= 300 && response.status < 400),
        status: response.status,
        statusText: response.statusText,
        latency,
        method,
        resolvedAddress: publicAddress.address,
        finalUrl: response.url || url.toString(),
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      return NextResponse.json({ ok: false, message: 'The target did not respond within 10 seconds.' }, { status: 504 });
    }
    return NextResponse.json(
      { ok: false, message: 'Unable to reach the target from the server.' },
      { status: 502 },
    );
  }
}
