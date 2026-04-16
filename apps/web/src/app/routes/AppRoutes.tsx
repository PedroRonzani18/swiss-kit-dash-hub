import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import {
  DEFAULT_MODULE_ROUTE,
  MODULE_ROUTES,
} from "@/app/navigation/modules";
import { AnimesModulePage } from "@/modules/animes/pages/AnimesModulePage";
import { FinanceModulePage } from "@/modules/finance/pages/FinanceModulePage";
import { SettingsModulePage } from "@/modules/settings/pages/SettingsModulePage";
import { ToolsModulePage } from "@/modules/tools/pages/ToolsModulePage";
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
      <Route path={MODULE_ROUTES.animes} element={<AnimesModulePage />} />
      <Route path={MODULE_ROUTES.tools} element={<ToolsModulePage />} />
      <Route path={MODULE_ROUTES.settings} element={<SettingsModulePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
