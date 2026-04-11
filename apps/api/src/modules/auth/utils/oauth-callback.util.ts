import { HttpException } from '@nestjs/common';
import type { AuthenticatedUserContract } from '@/common/contracts';

export type OAuthHtmlMessageType =
  | 'swisskit:auth:success'
  | 'swisskit:auth:error';

export type OAuthCallbackPayload = {
  success: true;
  user: AuthenticatedUserContract;
};

export type OAuthPopupMessage = {
  type: OAuthHtmlMessageType;
  payload: OAuthCallbackPayload | { message: string };
};

export type OAuthCallbackResponseBody =
  | {
      kind: 'json';
      statusCode: 200;
      body: OAuthCallbackPayload;
    }
  | {
      kind: 'html';
      statusCode: number;
      body: string;
    };

export type OAuthErrorDetails = {
  statusCode: number;
  message: string;
};

type OAuthHtmlMessageParams = {
  message: OAuthPopupMessage;
  targetOrigin: string;
  fallbackRedirectUrl: string;
};

type BuildOAuthSuccessCallbackResponseParams = {
  user: AuthenticatedUserContract;
  prefersHtml: boolean;
  targetOrigin: string;
  fallbackRedirectUrl: string;
};

type BuildOAuthErrorCallbackResponseParams = {
  error: unknown;
  targetOrigin: string;
  fallbackRedirectUrl: string;
};

const OAUTH_ERROR_QUERY_PARAM = 'authError';
const OAUTH_ERROR_QUERY_VALUE = 'oauth_failed';

export function shouldRenderOAuthHtml(
  acceptHeader: string | string[] | undefined,
): boolean {
  if (Array.isArray(acceptHeader)) {
    return acceptHeader.some((value) => value.includes('text/html'));
  }

  return acceptHeader?.includes('text/html') ?? false;
}

export function buildAuthCallbackPayload(user: AuthenticatedUserContract): {
  success: true;
  user: AuthenticatedUserContract;
} {
  return {
    success: true,
    user,
  };
}

export function buildOAuthSuccessMessage(
  user: AuthenticatedUserContract,
): OAuthPopupMessage {
  return {
    type: 'swisskit:auth:success',
    payload: buildAuthCallbackPayload(user),
  };
}

export function getOAuthErrorDetails(error: unknown): OAuthErrorDetails {
  return {
    statusCode: error instanceof HttpException ? error.getStatus() : 401,
    message:
      error instanceof Error
        ? error.message
        : 'Authentication failed during Google callback',
  };
}

export function buildOAuthErrorMessage(message: string): OAuthPopupMessage {
  return {
    type: 'swisskit:auth:error',
    payload: {
      message,
    },
  };
}

export function buildOAuthFallbackRedirectUrl(
  fallbackRedirectUrl: string,
  messageType: OAuthHtmlMessageType,
): string {
  if (messageType !== 'swisskit:auth:error') {
    return fallbackRedirectUrl;
  }

  try {
    const url = new URL(fallbackRedirectUrl);
    url.searchParams.set(OAUTH_ERROR_QUERY_PARAM, OAUTH_ERROR_QUERY_VALUE);
    return url.toString();
  } catch {
    return (
      fallbackRedirectUrl +
      (fallbackRedirectUrl.includes('?') ? '&' : '?') +
      `${OAUTH_ERROR_QUERY_PARAM}=${OAUTH_ERROR_QUERY_VALUE}`
    );
  }
}

export function buildOAuthSuccessCallbackResponse({
  user,
  prefersHtml,
  targetOrigin,
  fallbackRedirectUrl,
}: BuildOAuthSuccessCallbackResponseParams): OAuthCallbackResponseBody {
  const payload = buildAuthCallbackPayload(user);
  if (!prefersHtml) {
    return {
      kind: 'json',
      statusCode: 200,
      body: payload,
    };
  }

  return {
    kind: 'html',
    statusCode: 200,
    body: renderOAuthHtmlMessage({
      message: buildOAuthSuccessMessage(user),
      targetOrigin,
      fallbackRedirectUrl,
    }),
  };
}

export function buildOAuthErrorCallbackResponse({
  error,
  targetOrigin,
  fallbackRedirectUrl,
}: BuildOAuthErrorCallbackResponseParams): OAuthCallbackResponseBody {
  const { statusCode, message } = getOAuthErrorDetails(error);

  return {
    kind: 'html',
    statusCode,
    body: renderOAuthHtmlMessage({
      message: buildOAuthErrorMessage(message),
      targetOrigin,
      fallbackRedirectUrl,
    }),
  };
}

export function renderOAuthHtmlMessage({
  message,
  targetOrigin,
  fallbackRedirectUrl,
}: OAuthHtmlMessageParams): string {
  const serializedMessage = JSON.stringify(message).replace(/</g, '\\u003c');
  const serializedTargetOrigin = JSON.stringify(targetOrigin);
  const serializedRedirectUrl = JSON.stringify(
    buildOAuthFallbackRedirectUrl(fallbackRedirectUrl, message.type),
  );

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>SwissKit Auth</title>
  </head>
  <body>
    <script>
      (function () {
        var message = ${serializedMessage};
        var targetOrigin = ${serializedTargetOrigin};
        var redirectUrl = ${serializedRedirectUrl};
        if (window.opener) {
          window.opener.postMessage(message, targetOrigin);
          window.close();
          return;
        }

        window.location.replace(redirectUrl);
      })();
    </script>
  </body>
</html>`;
}
