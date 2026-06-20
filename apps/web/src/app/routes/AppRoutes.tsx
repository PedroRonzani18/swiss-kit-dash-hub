import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import {
  DEFAULT_MODULE_ROUTE,
  MODULE_ROUTES,
} from "@/app/navigation/modules";
import { useAuth } from "@/auth";
import { LoginPage } from "@/modules/auth/pages/LoginPage";
import { CoreAppPage } from "@/modules/core/pages/CoreAppPage";
import NotFound from "@/pages/NotFound";

const LOGIN_ROUTE = "/login";
const LEGACY_FINANCE_ROUTE = "/financeiro";

function AuthBootstrapLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-app-grid">
      <p className="text-sm text-muted-foreground">Carregando sessão...</p>
    </div>
  );
}

function RootModuleRedirect() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthBootstrapLoading />;
  }

  return (
    <Navigate
      to={{
        pathname: isAuthenticated ? DEFAULT_MODULE_ROUTE : LOGIN_ROUTE,
        search: location.search,
        hash: location.hash,
      }}
      replace
    />
  );
}

function ProtectedAppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthBootstrapLoading />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={{
          pathname: LOGIN_ROUTE,
          search: location.search,
          hash: location.hash,
        }}
        replace
      />
    );
  }

  return <Outlet />;
}

function PublicOnlyRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <AuthBootstrapLoading />;
  }

  if (isAuthenticated) {
    return <Navigate to={DEFAULT_MODULE_ROUTE} replace />;
  }

  return <Outlet />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootModuleRedirect />} />

      <Route element={<PublicOnlyRoutes />}>
        <Route path={LOGIN_ROUTE} element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedAppRoutes />}>
        <Route path={MODULE_ROUTES.core} element={<CoreAppPage />} />
        <Route
          path={`${LEGACY_FINANCE_ROUTE}/*`}
          element={<Navigate to={DEFAULT_MODULE_ROUTE} replace />}
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
