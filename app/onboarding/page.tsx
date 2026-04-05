"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, User } from "lucide-react";
import { saveProfile } from "@/lib/actions/user";
import PageLoader from "@/components/page-loader";

export default function OnboardingPage() {
  const { update, data: session, status } = useSession();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.replace("/"); // better than push for auth redirects
    }
  }, [session, status, router]);

if (status === "loading" || !session || session.user?.name) {
  // here we can use loading component
  return <PageLoader message="Setting things up..." />;
}

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim()) {
      setError("First name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await saveProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      await update(); // refresh JWT token so proxy picks up the new name
      router.push("/notes");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        {/* Header */}
        <header className="fixed top-0 w-full z-50 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
          <div className="flex items-center px-6 py-4 max-w-6xl mx-auto">
            <h1 className="text-lg font-semibold tracking-tight">dev-lab</h1>
          </div>
        </header>

        {/* Main */}
        <main className="flex-grow flex items-center justify-center px-4 pt-24 pb-12">
          <Card className="w-full max-w-md shadow-lg">
            <CardContent className="p-8 md:p-10">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                  <User size={28} className="text-muted-foreground" />
                </div>
              </div>

              {/* Heading */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold tracking-tight">
                  One last step
                </h2>
                <p className="text-muted-foreground mt-2 text-sm">
                  Tell us your name to get started
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label>
                    First name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoFocus
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Last name{" "}
                    <span className="text-muted-foreground text-xs font-normal">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={loading || !firstName.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      Get started <ArrowRight size={14} />
                    </>
                  )}
                </Button>
              </form>
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
            </div>
            <p>© 2026 dev-lab</p>
          </div>
        </footer>
      </div>
    </>
  );
}
