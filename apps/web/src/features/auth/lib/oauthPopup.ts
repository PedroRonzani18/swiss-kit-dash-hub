import type { AuthCallbackResponse, AuthPopupMessage } from '@/types/auth';

const POPUP_NAME = 'swisskit-google-auth';
const DEFAULT_POPUP_WIDTH = 520;
const DEFAULT_POPUP_HEIGHT = 720;
const DEFAULT_TIMEOUT_MS = 3 * 60 * 1000;
const DEFAULT_POLL_INTERVAL_MS = 400;
const DEFAULT_ERROR_MESSAGE = 'Falha no login com Google';

type ParseAuthPopupFromText = (
  payload: string,
) => AuthPopupMessage | AuthCallbackResponse;

export type WaitForOAuthPopupCompletionOptions = {
  popup: Window;
  apiOrigin: string;
  parseAuthPopupFromText: ParseAuthPopupFromText;
  timeoutMs?: number;
  pollIntervalMs?: number;
};

export function isAuthPopupMessage(payload: unknown): payload is AuthPopupMessage {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'type' in payload &&
    typeof payload.type === 'string'
  );
}

export function isAuthCallbackResponse(
  payload: unknown,
): payload is AuthCallbackResponse {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'success' in payload &&
    payload.success === true
  );
}

export function getPopupAuthErrorMessage(payload?: {
  message?: string;
}): string {
  return payload?.message || DEFAULT_ERROR_MESSAGE;
}

export function openGoogleAuthPopup(authUrl: string): Window | null {
  const left = window.screenX + (window.outerWidth - DEFAULT_POPUP_WIDTH) / 2;
  const top = window.screenY + (window.outerHeight - DEFAULT_POPUP_HEIGHT) / 2;

  return window.open(
    authUrl,
    POPUP_NAME,
    [
      `width=${DEFAULT_POPUP_WIDTH}`,
      `height=${DEFAULT_POPUP_HEIGHT}`,
      `left=${Math.max(0, left)}`,
      `top=${Math.max(0, top)}`,
      'popup=yes',
      'resizable=yes',
      'scrollbars=yes',
    ].join(','),
  );
}

function closePopupSilently(popup: Window): void {
  try {
    popup.close();
  } catch {
    // noop
  }
}

function readPopupAuthResult(
  popup: Window,
  parseAuthPopupFromText: ParseAuthPopupFromText,
): AuthPopupMessage | AuthCallbackResponse | null {
  try {
    const href = popup.location.href;
    if (!href.includes('/auth/google/callback')) {
      return null;
    }

    const raw = popup.document.body?.innerText?.trim();
    if (!raw || !raw.startsWith('{')) {
      return null;
    }

    return parseAuthPopupFromText(raw);
  } catch {
    // Ignore cross-origin read errors until callback page becomes readable.
    return null;
  }
}

export function waitForOAuthPopupCompletion({
  popup,
  apiOrigin,
  parseAuthPopupFromText,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  pollIntervalMs = DEFAULT_POLL_INTERVAL_MS,
}: WaitForOAuthPopupCompletionOptions): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let pollTimer = 0;
    let timeoutTimer = 0;

    const cleanup = (messageListener: (event: MessageEvent) => void) => {
      window.removeEventListener('message', messageListener);
      window.clearInterval(pollTimer);
      window.clearTimeout(timeoutTimer);
    };

    const onSuccess = (messageListener: (event: MessageEvent) => void) => {
      cleanup(messageListener);
      closePopupSilently(popup);
      resolve();
    };

    const onError = (
      messageListener: (event: MessageEvent) => void,
      message: string,
    ) => {
      cleanup(messageListener);
      reject(new Error(message));
    };

    const messageListener = (event: MessageEvent) => {
      if (event.origin !== apiOrigin) {
        return;
      }

      const data = event.data as unknown;
      if (!isAuthPopupMessage(data)) {
        return;
      }

      if (data.type === 'swisskit:auth:error') {
        onError(messageListener, getPopupAuthErrorMessage(data.payload));
        return;
      }

      if (data.type === 'swisskit:auth:success') {
        onSuccess(messageListener);
      }
    };

    pollTimer = window.setInterval(() => {
      if (popup.closed) {
        onError(messageListener, 'Login cancelado antes da conclusão.');
        return;
      }

      const parsed = readPopupAuthResult(popup, parseAuthPopupFromText);
      if (!parsed) {
        return;
      }

      if (isAuthPopupMessage(parsed) && parsed.type === 'swisskit:auth:error') {
        onError(messageListener, getPopupAuthErrorMessage(parsed.payload));
        return;
      }

      if (
        (isAuthPopupMessage(parsed) && parsed.type === 'swisskit:auth:success') ||
        isAuthCallbackResponse(parsed)
      ) {
        onSuccess(messageListener);
      }
    }, pollIntervalMs);

    timeoutTimer = window.setTimeout(() => {
      onError(messageListener, 'Tempo limite excedido durante autenticação.');
    }, timeoutMs);

    window.addEventListener('message', messageListener);
  });
}
