import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import supabase from "../../supabase";
import { Button } from "@/components/ui/button";

const SignInPage = () => {
  const { session } = useSession();
  if (session) return <Navigate to="/" />;

  const [status, setStatus] = useState("");

  const signInWithGitHub = async () => {
    setStatus("Redirecting to GitHub...");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
    if (error) {
      alert(error.message);
    }
    setStatus("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <div className="w-full max-w-md text-center">
        <Button onClick={signInWithGitHub}>Sign In with GitHub</Button>
        {status && <p>{status}</p>}
      </div>
    </div>
  );
};

export default SignInPage;