import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FinanceDataPrefetcher } from './FinanceDataPrefetcher';

vi.mock('@/features/finance/api', () => ({
  financeQueryKeys: { root: ['finance'] },
  accountsQueries: {
    list: () => ({ queryKey: ['accounts'], queryFn: vi.fn() }),
  },
  categoriesQueries: {
    list: () => ({ queryKey: ['categories'], queryFn: vi.fn() }),
  },
  subcategoriesQueries: {
    list: () => ({ queryKey: ['subcategories'], queryFn: vi.fn() }),
  },
  transactionsQueries: {
    list: () => ({ queryKey: ['transactions'], queryFn: vi.fn() }),
  },
}));

type PrefetcherProps = { isAuthenticated: boolean; isAuthLoading: boolean };

function makeWrapper(queryClient: QueryClient) {
  let root: ReturnType<typeof createRoot>;
  let container: HTMLDivElement;

  function mount(props: PrefetcherProps) {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root.render(
        createElement(
          QueryClientProvider,
          { client: queryClient },
          createElement(FinanceDataPrefetcher, props),
        ),
      );
    });
  }

  function rerender(props: PrefetcherProps) {
    act(() => {
      root.render(
        createElement(
          QueryClientProvider,
          { client: queryClient },
          createElement(FinanceDataPrefetcher, props),
        ),
      );
    });
  }

  function unmount() {
    act(() => root.unmount());
    container.remove();
  }

  return { mount, rerender, unmount };
}

describe('FinanceDataPrefetcher auth -> prefetch behavior', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  it('triggers prefetch when authenticated and not loading', () => {
    const prefetchSpy = vi
      .spyOn(queryClient, 'prefetchQuery')
      .mockResolvedValue(undefined);
    const { mount, unmount } = makeWrapper(queryClient);

    mount({ isAuthenticated: true, isAuthLoading: false });
    unmount();

    expect(prefetchSpy).toHaveBeenCalledTimes(4);
  });

  it('does not prefetch while auth is still loading', () => {
    const prefetchSpy = vi
      .spyOn(queryClient, 'prefetchQuery')
      .mockResolvedValue(undefined);
    const { mount, unmount } = makeWrapper(queryClient);

    mount({ isAuthenticated: false, isAuthLoading: true });
    unmount();

    expect(prefetchSpy).not.toHaveBeenCalled();
  });

  it('does not prefetch when unauthenticated and not loading', () => {
    const prefetchSpy = vi
      .spyOn(queryClient, 'prefetchQuery')
      .mockResolvedValue(undefined);
    const { mount, unmount } = makeWrapper(queryClient);

    mount({ isAuthenticated: false, isAuthLoading: false });
    unmount();

    expect(prefetchSpy).not.toHaveBeenCalled();
  });

  it('resets finance query cache when user becomes unauthenticated', () => {
    const removeSpy = vi.spyOn(queryClient, 'removeQueries');
    const { mount, rerender, unmount } = makeWrapper(queryClient);

    mount({ isAuthenticated: true, isAuthLoading: false });
    rerender({ isAuthenticated: false, isAuthLoading: false });
    unmount();

    expect(removeSpy).toHaveBeenCalledWith({ queryKey: ['finance'] });
  });

  it('renders without an auth provider — no useAuth coupling', () => {
    // FinanceDataPrefetcher must not call useAuth. If it did, rendering without
    // an AuthProvider would throw. This assert is the proof that coupling is gone.
    const prefetchSpy = vi
      .spyOn(queryClient, 'prefetchQuery')
      .mockResolvedValue(undefined);
    const { mount, unmount } = makeWrapper(queryClient);

    expect(() =>
      mount({ isAuthenticated: true, isAuthLoading: false }),
    ).not.toThrow();
    unmount();

    expect(prefetchSpy).toHaveBeenCalledTimes(4);
  });
});
