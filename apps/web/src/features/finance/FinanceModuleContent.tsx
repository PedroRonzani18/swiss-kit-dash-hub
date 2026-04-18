import { FinanceDataPrefetcher } from './components/FinanceDataPrefetcher';
import { FinanceDashboardPage } from './components/dashboard';
import {
  FinanceLoadingState,
  UnauthenticatedFinanceState,
} from './components/states';

type FinanceModuleContentProps = {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  onLogin: () => Promise<void>;
};

export function FinanceModuleContent({
  isAuthenticated,
  isAuthLoading,
  onLogin,
}: FinanceModuleContentProps) {
  let content: JSX.Element;

  if (isAuthLoading && !isAuthenticated) {
    content = <FinanceLoadingState />;
  } else if (!isAuthenticated) {
    content = (
      <UnauthenticatedFinanceState
        isAuthLoading={isAuthLoading}
        onLogin={onLogin}
      />
    );
  } else {
    content = <FinanceDashboardPage />;
  }

  return (
    <>
      <FinanceDataPrefetcher
        isAuthenticated={isAuthenticated}
        isAuthLoading={isAuthLoading}
      />
      {content}
    </>
  );
}
