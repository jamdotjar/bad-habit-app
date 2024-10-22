import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import supabase from "../../supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function SignUpPage() {
    const { session } = useSession();
    if (session) return <Navigate to="/" />;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("");

    const signUpWithEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("Signing up...");
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            console.error("Sign-up error:", error); // Log the full error object
            if (error.message.includes("Invalid email")) {
                setStatus("Error: Invalid email format.");
            } else if (error.message.includes("already registered")) {
                setStatus("Error: Email is already registered.");
            } else if (error.message.includes("over_email_send_rate_limit")) {
                setStatus("Error: Too many requests. Please try again later.");
            } else if (error.status === 500) {
                setStatus("Error: Server error. Please try again later.");
            } else if (error.code) {
                setStatus(`Error: ${error.code} - ${error.message}`);
            } else {
                setStatus(`Error: ${error.message}`);
            }
        } else {
            setStatus("Signed up successfully! Please check your email for verification.");
        }
    };

    const signInWithGitHub = async () => {
        setStatus("Redirecting to GitHub...");
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
        });
        if (error) {
            console.error("GitHub sign-in error:", error); // Log the full error object
            if (error.code) {
                setStatus(`Error: ${error.code} - ${error.message}`);
            } else {
                setStatus(`Error: ${error.message}`);
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-6">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>Create a new account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={signUpWithEmail} className="space-y-4">
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
                        <Button type="submit" className="w-full">Sign Up</Button>
                    </form>
                    <div className="mt-4">
                        <Button onClick={signInWithGitHub} variant="outline" className="w-full">
                            Continue with GitHub
                        </Button>
                    </div>
                    {status && <p className="mt-4 text-center text-sm">{status}</p>}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/signin" className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                    <Link to="/" className="text-primary hover:underline">
                        Home
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}