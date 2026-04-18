import { FINANCE_MODULE_ROUTE } from './routeContract';

export const FINANCE_TAB_SEGMENT_BY_ROUTE = {
  dashboard: 'dashboard',
  transactions: 'transacoes',
  accounts: 'contas',
  categories: 'categorias',
} as const;

export type FinanceTabRoute = keyof typeof FINANCE_TAB_SEGMENT_BY_ROUTE;
type FinanceTabSegment =
  (typeof FINANCE_TAB_SEGMENT_BY_ROUTE)[FinanceTabRoute];

const FINANCE_TAB_ROUTE_BY_SEGMENT: Record<FinanceTabSegment, FinanceTabRoute> =
  {
    dashboard: 'dashboard',
    transacoes: 'transactions',
    contas: 'accounts',
    categorias: 'categories',
  };

export const FINANCE_TAB_ROUTES = Object.keys(
  FINANCE_TAB_SEGMENT_BY_ROUTE,
) as FinanceTabRoute[];

export const DEFAULT_FINANCE_TAB_ROUTE: FinanceTabRoute = 'dashboard';

export const FINANCE_ACTION_ROUTES = {
  newTransaction: 'nova-transacao',
} as const;

export type FinanceActionRoute =
  (typeof FINANCE_ACTION_ROUTES)[keyof typeof FINANCE_ACTION_ROUTES];

export function isFinanceTabRoute(value?: string): value is FinanceTabRoute {
  return Boolean(value && FINANCE_TAB_ROUTES.includes(value as FinanceTabRoute));
}

export function parseFinanceTabRoute(tabSegment?: string): FinanceTabRoute {
  if (!tabSegment) {
    return DEFAULT_FINANCE_TAB_ROUTE;
  }

  return (
    FINANCE_TAB_ROUTE_BY_SEGMENT[tabSegment as FinanceTabSegment] ??
    DEFAULT_FINANCE_TAB_ROUTE
  );
}

export function buildFinancePath(
  tabRoute: FinanceTabRoute = DEFAULT_FINANCE_TAB_ROUTE,
  action?: FinanceActionRoute,
): string {
  const basePath = `${FINANCE_MODULE_ROUTE}/${FINANCE_TAB_SEGMENT_BY_ROUTE[tabRoute]}`;
  return action ? `${basePath}/${action}` : basePath;
}
