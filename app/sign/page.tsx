"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Github, Mail, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await signIn("email", { email, redirect: false });
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <div className="flex justify-between items-center px-6 py-4 max-w-6xl mx-auto">
          <h1 className="text-lg font-semibold tracking-tight">Dev_Canva</h1>
          <nav className="hidden md:flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Help
            </a>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-4 pt-24 pb-12">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 md:p-10">
            {!sent ? (
              <>
                {/* Heading */}
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-semibold tracking-tight">
                    Welcome back
                  </h2>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Enter your email to receive a magic link
                  </p>
                </div>

                {/* Magic link form */}
                <form onSubmit={handleMagicLink} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Email address</Label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full gap-2 cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />{" "}
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail size={16} /> Send magic link{" "}
                        <ArrowRight size={14} />
                      </>
                    )}
                  </Button>

                  {/* Divider */}
                  <div className="relative flex items-center py-1">
                    <Separator />
                    <span className="absolute left-1/2 -translate-x-1/2 bg-background px-3 text-xs text-muted-foreground">
                      OR
                    </span>
                  </div>

                  {/* OAuth */}
                  <div className="space-y-3">
                    <Button
                      type="button"
                      onClick={() => {
                        setOauthLoading("google");
                        signIn("google");
                      }}
                      variant="outline"
                      className="w-full gap-2 cursor-pointer"
                      disabled={!!oauthLoading}
                    >
                      {oauthLoading === "google" ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />{" "}
                          Connecting...
                        </>
                      ) : (
                        "Continue with Google"
                      )}
                    </Button>

                    <Button
                      type="button"
                      onClick={() => {
                        setOauthLoading("github");
                        signIn("github");
                      }}
                      variant="outline"
                      className="w-full gap-2 cursor-pointer"
                      disabled={!!oauthLoading}
                    >
                      {oauthLoading === "github" ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />{" "}
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Github size={16} /> Continue with GitHub
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              /* Success state */
              <div className="text-center py-6 space-y-4">
                <div className="flex justify-center">
                  <CheckCircle2 size={48} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Check your inbox
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We sent a magic link to{" "}
                  <span className="text-foreground font-medium">{email}</span>.
                  Click the link in the email to sign in.
                </p>
                <p className="text-xs text-muted-foreground pt-2">
                  Didn't receive it?{" "}
                  <button
                    onClick={() => {
                      setSent(false);
                      setEmail("");
                    }}
                    className="text-primary hover:underline"
                  >
                    Try again
                  </button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t">
        <div className="flex flex-col items-center gap-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-4">
            <a href="#" className="hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground">
              Terms
            </a>
            <a href="#" className="hover:text-foreground">
              Legal
            </a>
          </div>
          <p>© 2026 dev-lab</p>
        </div>
      </footer>
    </div>
  );
}
