import { HttpException } from '@nestjs/common';
import {
  buildAuthCallbackPayload,
  getOAuthErrorDetails,
  renderOAuthHtmlMessage,
  shouldRenderOAuthHtml,
} from './oauth-callback.util';

describe('oauth-callback util', () => {
  it('detects html callback by accept header', () => {
    expect(shouldRenderOAuthHtml('text/html,application/json')).toBe(true);
    expect(shouldRenderOAuthHtml(['application/json', 'text/html'])).toBe(true);
    expect(shouldRenderOAuthHtml('application/json')).toBe(false);
  });

  it('builds callback payload with authenticated user', () => {
    const payload = buildAuthCallbackPayload({
      id: 'user-1',
      email: 'user@example.com',
      name: 'User',
      provider: 'google',
    });

    expect(payload).toEqual({
      success: true,
      user: {
        id: 'user-1',
        email: 'user@example.com',
        name: 'User',
        provider: 'google',
      },
    });
  });

  it('maps oauth errors to status and message', () => {
    expect(
      getOAuthErrorDetails(new HttpException('unauthorized', 401)),
    ).toEqual({
      statusCode: 401,
      message: 'unauthorized',
    });

    expect(getOAuthErrorDetails(new Error('boom'))).toEqual({
      statusCode: 401,
      message: 'boom',
    });
  });

  it('renders html message with escaped payload content', () => {
    const html = renderOAuthHtmlMessage({
      type: 'swisskit:auth:error',
      payload: {
        message: '<script>alert(1)</script>',
      },
      targetOrigin: 'https://app.example.com',
      fallbackRedirectUrl: 'https://app.example.com',
    });

    expect(html).toContain('\\u003cscript>alert(1)\\u003c/script>');
    expect(html).toContain('window.opener.postMessage(message, targetOrigin)');
    expect(html).toContain('authError');
  });
});
