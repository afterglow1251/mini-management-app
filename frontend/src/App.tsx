import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotFound } from "./shared/components/common/stubs/NotFound";
import { Header } from "./components/layout/Header/Header";
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { ROUTES } from "./shared/constants/routing/routes.constants";
import { ProjectsList } from "./pages/projects/ProjectsList/ProjectsList";
import { PrivateRoute } from "./shared/components/routing/PrivateRoute";
import { PublicRoute } from "./shared/components/routing/PublicRoute";
import { useTokenRefresher } from "./shared/hooks/auth/useTokenRefresher";
import { useAuthCheck } from "./shared/hooks/auth/useAuthCheck";
import { CreateProjectPage } from "./pages/projects/forms/CreateProjectPage";
import { WithValidId } from "./shared/components/routing/WithValidId";
import { UpdateProjectPage } from "./pages/projects/forms/UpdateProjectPage";
import { ProjectDetailsPage } from "./pages/projects/ProjectDetailsPage/ProjectDetailsPage";

const queryClient = new QueryClient();

function App() {
  useAuthCheck();
  useTokenRefresher();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Header />

        <main className="p-8">
          <Routes>
            <Route
              path={ROUTES.HOME}
              element={
                <PrivateRoute>
                  <ProjectsList />
                </PrivateRoute>
              }
            />

            <Route
              path={ROUTES.LOGIN}
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path={ROUTES.SIGNUP}
              element={
                <PublicRoute>
                  <SignupPage />
                </PublicRoute>
              }
            />

            <Route
              path={ROUTES.PROJECT_CREATE}
              element={
                <PrivateRoute>
                  <CreateProjectPage />
                </PrivateRoute>
              }
            />

            <Route
              path={ROUTES.PROJECT_DETAILS}
              element={
                <PrivateRoute>
                  <WithValidId>
                    {(id) => <ProjectDetailsPage id={id} />}
                  </WithValidId>
                </PrivateRoute>
              }
            />

            <Route
              path={ROUTES.PROJECT_EDIT}
              element={
                <PrivateRoute>
                  <WithValidId>
                    {(id) => <UpdateProjectPage id={id} />}
                  </WithValidId>
                </PrivateRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
