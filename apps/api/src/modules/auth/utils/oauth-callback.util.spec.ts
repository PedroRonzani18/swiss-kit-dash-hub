import { HttpException } from '@nestjs/common';
import {
  buildAuthCallbackPayload,
  buildOAuthErrorCallbackResponse,
  buildOAuthErrorMessage,
  buildOAuthFallbackRedirectUrl,
  buildOAuthSuccessCallbackResponse,
  buildOAuthSuccessMessage,
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
    const user = {
      id: 'user-1',
      email: 'user@example.com',
      name: 'User',
      provider: 'google' as const,
    };
    const payload = buildAuthCallbackPayload(user);

    expect(payload).toEqual({
      success: true,
      user,
    });
  });

  it('builds oauth success popup message', () => {
    const user = {
      id: 'user-1',
      email: 'user@example.com',
      name: 'User',
      provider: 'google' as const,
    };

    expect(buildOAuthSuccessMessage(user)).toEqual({
      type: 'swisskit:auth:success',
      payload: {
        success: true,
        user,
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

  it('builds oauth error popup message', () => {
    expect(buildOAuthErrorMessage('boom')).toEqual({
      type: 'swisskit:auth:error',
      payload: {
        message: 'boom',
      },
    });
  });

  it('builds fallback redirect url safely for oauth errors', () => {
    expect(
      buildOAuthFallbackRedirectUrl(
        'https://app.example.com/dashboard',
        'swisskit:auth:error',
      ),
    ).toBe('https://app.example.com/dashboard?authError=oauth_failed');

    expect(
      buildOAuthFallbackRedirectUrl(
        'https://app.example.com/dashboard?foo=bar',
        'swisskit:auth:error',
      ),
    ).toBe('https://app.example.com/dashboard?foo=bar&authError=oauth_failed');

    expect(
      buildOAuthFallbackRedirectUrl('not-a-valid-url', 'swisskit:auth:error'),
    ).toBe('not-a-valid-url?authError=oauth_failed');
  });

  it('keeps fallback redirect url unchanged for success message', () => {
    expect(
      buildOAuthFallbackRedirectUrl(
        'https://app.example.com/dashboard',
        'swisskit:auth:success',
      ),
    ).toBe('https://app.example.com/dashboard');
  });

  it('builds callback response as json when html is not preferred', () => {
    const user = {
      id: 'user-1',
      email: 'user@example.com',
      name: 'User',
      provider: 'google' as const,
    };

    const callbackResponse = buildOAuthSuccessCallbackResponse({
      user,
      prefersHtml: false,
      targetOrigin: 'https://app.example.com',
      fallbackRedirectUrl: 'https://app.example.com',
    });

    expect(callbackResponse).toEqual({
      kind: 'json',
      statusCode: 200,
      body: {
        success: true,
        user,
      },
    });
  });

  it('builds callback response as html when html is preferred', () => {
    const user = {
      id: 'user-1',
      email: 'user@example.com',
      name: 'User',
      provider: 'google' as const,
    };

    const callbackResponse = buildOAuthSuccessCallbackResponse({
      user,
      prefersHtml: true,
      targetOrigin: 'https://app.example.com',
      fallbackRedirectUrl: 'https://app.example.com',
    });

    expect(callbackResponse.kind).toBe('html');
    expect(callbackResponse.statusCode).toBe(200);
    expect(callbackResponse.body).toContain('swisskit:auth:success');
  });

  it('builds oauth html error callback response', () => {
    const callbackResponse = buildOAuthErrorCallbackResponse({
      error: new HttpException('unauthorized', 401),
      targetOrigin: 'https://app.example.com',
      fallbackRedirectUrl: 'https://app.example.com',
    });

    expect(callbackResponse.kind).toBe('html');
    expect(callbackResponse.statusCode).toBe(401);
    expect(callbackResponse.body).toContain('swisskit:auth:error');
  });

  it('renders html message with escaped payload content', () => {
    const html = renderOAuthHtmlMessage({
      message: {
        type: 'swisskit:auth:error',
        payload: {
          message: '<script>alert(1)</script>',
        },
      },
      targetOrigin: 'https://app.example.com',
      fallbackRedirectUrl: 'https://app.example.com',
    });

    expect(html).toContain('\\u003cscript>alert(1)\\u003c/script>');
    expect(html).toContain('window.opener.postMessage(message, targetOrigin)');
    expect(html).toContain('authError');
  });
});
