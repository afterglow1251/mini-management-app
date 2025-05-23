export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  PROJECT_CREATE: "/projects/create",
  PROJECT_DETAILS: "/projects/:id",
  PROJECT_EDIT: "/projects/:id/edit",
};

export const NAVIGATE_ROUTES = {
  home: () => ROUTES.HOME,
  login: () => ROUTES.LOGIN,
  signup: () => ROUTES.SIGNUP,
  createProject: () => ROUTES.PROJECT_CREATE,
  projectDetails: (id: number) => `/projects/${id}`,
  projectEdit: (id: number) => `/projects/${id}/edit`,
};
