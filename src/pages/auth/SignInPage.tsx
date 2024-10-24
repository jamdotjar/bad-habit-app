import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import supabase from "../../supabase";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { GoogleLoginButton, GithubLoginButton } from "@/components/LoginButtons"; // Adjust the import path as necessary
import { Separator } from "@/components/ui/separator";

const SignInPage = () => {
  const { session } = useSession();
  if (session) return <Navigate to="/" />;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Signing in...");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setStatus(`Error: ${error.message}`);
    } else {
      setStatus("Signed in successfully!");
    }
  };

  const signInWithGitHub = async () => {
    setStatus("Redirecting to GitHub...");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
    if (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const signInWithGoogle = async () => {
    setStatus("Redirecting to Google...");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={signInWithEmail} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
          <Separator className="my-4" />
          <div className="mt-4 space-y-2">
            <GithubLoginButton onClick={signInWithGitHub} className="w-full" />
            <GoogleLoginButton onClick={signInWithGoogle} className="w-full" />
          </div>
          {status && <p className="mt-4 text-center text-sm">{status}</p>}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link to="/" className="text-primary hover:underline">
            Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInPage;
