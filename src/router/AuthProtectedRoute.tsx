import { Outlet } from "react-router-dom";
import NotFoundPage from "../pages/404Page";
import SignInPage from "@/pages/auth/SignInPage";
import { useSession } from "../context/SessionContext";

const AuthProtectedRoute = () => {
  const { session } = useSession();
  if (!session) {
    // or you can redirect to a different page and show a message
    return <SignInPage />;
  }
  return <Outlet />;
};

export default AuthProtectedRoute;
