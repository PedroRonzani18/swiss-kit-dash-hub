import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import {
  DEFAULT_MODULE_ROUTE,
  MODULE_ROUTES,
} from "@/app/navigation/modules";
import { FinanceModulePage } from "@/modules/finance/pages/FinanceModulePage";
import NotFound from "@/pages/NotFound";

function RootModuleRedirect() {
  const location = useLocation();

  return (
    <Navigate
      to={{
        pathname: DEFAULT_MODULE_ROUTE,
        search: location.search,
        hash: location.hash,
      }}
      replace
    />
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootModuleRedirect />} />
      <Route path={MODULE_ROUTES.finance} element={<FinanceModulePage />} />
      <Route path={`${MODULE_ROUTES.finance}/:tab`} element={<FinanceModulePage />} />
      <Route path={`${MODULE_ROUTES.finance}/:tab/:action`} element={<FinanceModulePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
