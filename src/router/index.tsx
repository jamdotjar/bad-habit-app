import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage.tsx";
import SignInPage from "../pages/auth/SignInPage.tsx";
import ProtectedPage from "../pages/ProtectedPage.tsx";
import NewHabitPage from "../pages/NewHabitPage.tsx";
import NotFoundPage from "../pages/404Page.tsx";
import Dashboard from "@/pages/Dashboard.tsx";
import AuthProtectedRoute from "./AuthProtectedRoute.tsx";
import Providers from "../Providers.tsx";

const router = createBrowserRouter([
  // I recommend you reflect the routes here in the pages folder
  {
    path: "/",
    element: <Providers />,
    children: [
      // Public routes
      {
        path: "/",
        element: <HomePage />,
      },

      {
        path: "/auth/sign-in",
        element: <SignInPage />,
      },
      // Auth Protected routes
      {
        path: "/",
        element: <AuthProtectedRoute />,
        children: [
          {
            path: "/protected",
            element: <ProtectedPage />,
          },
          { path: "new-habit", element: <NewHabitPage /> },
          {
            path:
              "dashboard",
            element: <Dashboard />
          }
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
