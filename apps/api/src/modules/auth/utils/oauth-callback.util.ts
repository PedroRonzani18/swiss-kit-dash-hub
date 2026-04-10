import { HttpException } from '@nestjs/common';
import type { AuthenticatedUserContract } from '@/common/contracts';

export type OAuthHtmlMessageType =
  | 'swisskit:auth:success'
  | 'swisskit:auth:error';

export type OAuthErrorDetails = {
  statusCode: number;
  message: string;
};

type OAuthHtmlMessageParams = {
  type: OAuthHtmlMessageType;
  payload: unknown;
  targetOrigin: string;
  fallbackRedirectUrl: string;
};

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

export function getOAuthErrorDetails(error: unknown): OAuthErrorDetails {
  return {
    statusCode: error instanceof HttpException ? error.getStatus() : 401,
    message:
      error instanceof Error
        ? error.message
        : 'Authentication failed during Google callback',
  };
}

export function renderOAuthHtmlMessage({
  type,
  payload,
  targetOrigin,
  fallbackRedirectUrl,
}: OAuthHtmlMessageParams): string {
  const serializedPayload = JSON.stringify({ type, payload }).replace(
    /</g,
    '\\u003c',
  );
  const serializedTargetOrigin = JSON.stringify(targetOrigin);
  const serializedFallbackRedirectUrl = JSON.stringify(fallbackRedirectUrl);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>SwissKit Auth</title>
  </head>
  <body>
    <script>
      (function () {
        var message = ${serializedPayload};
        var targetOrigin = ${serializedTargetOrigin};
        var fallbackRedirectUrl = ${serializedFallbackRedirectUrl};
        if (window.opener) {
          window.opener.postMessage(message, targetOrigin);
          window.close();
          return;
        }

        var redirectUrl = fallbackRedirectUrl;
        try {
          var url = new URL(fallbackRedirectUrl);
          if (message.type === 'swisskit:auth:error') {
            url.searchParams.set('authError', 'oauth_failed');
          }
          redirectUrl = url.toString();
        } catch (_error) {
          if (message.type === 'swisskit:auth:error') {
            redirectUrl =
              fallbackRedirectUrl +
              (fallbackRedirectUrl.indexOf('?') >= 0 ? '&' : '?') +
              'authError=oauth_failed';
          }
        }

        window.location.replace(redirectUrl);
      })();
    </script>
  </body>
</html>`;
}
