import { describe, expect, it } from 'vitest';
import {
  getPopupAuthErrorMessage,
  isAuthCallbackResponse,
  isAuthPopupMessage,
} from './oauthPopup';

describe('oauthPopup helpers', () => {
  it('recognizes popup message payload', () => {
    expect(
      isAuthPopupMessage({
        type: 'swisskit:auth:success',
      }),
    ).toBe(true);
  });

  it('recognizes callback response payload', () => {
    expect(
      isAuthCallbackResponse({
        success: true,
      }),
    ).toBe(true);
  });

  it('returns default popup error message when payload message is missing', () => {
    expect(getPopupAuthErrorMessage()).toBe('Falha no login com Google');
  });
});
