let lockCount = 0;
let previousBodyOverflow = '';
let previousHtmlOverflow = '';

export function setBodyScrollLocked(locked: boolean) {
  if (typeof document === 'undefined') {
    return;
  }

  const body = document.body;
  const html = document.documentElement;

  if (locked) {
    lockCount += 1;

    if (lockCount === 1) {
      previousBodyOverflow = body.style.overflow;
      previousHtmlOverflow = html.style.overflow;
      body.style.overflow = 'hidden';
      html.style.overflow = 'hidden';
    }

    return;
  }

  if (lockCount > 0) {
    lockCount -= 1;
  }

  if (lockCount === 0) {
    body.style.overflow = previousBodyOverflow;
    html.style.overflow = previousHtmlOverflow;
    previousBodyOverflow = '';
    previousHtmlOverflow = '';
  }
}
