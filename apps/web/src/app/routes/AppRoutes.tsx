import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import {
  PROTECTED_MODULE_ROUTES,
  getDefaultModuleRouteForUser,
  getProtectedModuleRoutesForUser,
} from "@/app/navigation/modules";
import { useAuth } from "@/auth";
import { LoginPage } from "@/modules/auth/pages/LoginPage";
import NotFound from "@/pages/NotFound";
import { useTranslation } from "react-i18next";

const LOGIN_ROUTE = "/login";

function AuthBootstrapLoading() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-app-grid">
      <p className="text-sm text-muted-foreground">
        {t("auth.loadingSession")}
      </p>
    </div>
  );
}

function RootModuleRedirect() {
  const { isAuthenticated, isLoading, permissions } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthBootstrapLoading />;
  }

  return (
    <Navigate
      to={{
        pathname: isAuthenticated
          ? getDefaultModuleRouteForUser(permissions)
          : LOGIN_ROUTE,
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
  const { isAuthenticated, isLoading, permissions } = useAuth();

  if (isLoading) {
    return <AuthBootstrapLoading />;
  }

  if (isAuthenticated) {
    return <Navigate to={getDefaultModuleRouteForUser(permissions)} replace />;
  }

  return <Outlet />;
}

export function AppRoutes() {
  const { permissions, isLoading } = useAuth();
  const protectedModuleRoutes = isLoading
    ? PROTECTED_MODULE_ROUTES
    : getProtectedModuleRoutesForUser(permissions);

  return (
    <Routes>
      <Route path="/" element={<RootModuleRedirect />} />

      <Route element={<PublicOnlyRoutes />}>
        <Route path={LOGIN_ROUTE} element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedAppRoutes />}>
        {protectedModuleRoutes.map((module) => {
          const ModuleComponent = module.component;

          return (
            <Route
              key={module.id}
              path={module.path}
              element={<ModuleComponent />}
            />
          );
        })}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
