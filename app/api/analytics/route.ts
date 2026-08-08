import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, message: 'Analytics endpoint is ready.' });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.info('[ReByte analytics]', payload);
    return NextResponse.json({ ok: true, received: payload });
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid payload' }, { status: 400 });
  }
}
