"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Github } from "lucide-react"
import { signIn } from "next-auth/react";
export default function Home() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <div className="flex justify-between items-center px-6 py-4 max-w-6xl mx-auto">
          <h1 className="text-lg font-semibold">Sign In</h1>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#" className="hover:text-primary transition-colors">
              Login
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Help
            </a>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-4 pt-24 pb-12">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 md:p-10">

            {/* Heading */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-semibold tracking-tight">
                Welcome back
              </h2>
              <p className="text-muted-foreground mt-2">
                Sign in to your account
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6">

              {/* Email */}
              <div className="space-y-2">
                <Label>Email address</Label>
                <Input
                  type="email"
                  placeholder="name@company.com"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Password</Label>
                  <a
                    href="#"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Sign In */}
              <Button type="submit" className="w-full">
                Sign In
              </Button>

              {/* Divider */}
              <div className="relative flex items-center">
                <Separator />
                <span className="absolute left-1/2 -translate-x-1/2 bg-background px-3 text-xs text-muted-foreground">
                  OR
                </span>
              </div>

              {/* OAuth */}
              <div className="space-y-3">
                <Button type="button" onClick={() => signIn("google")} variant="outline" className="w-full">
                  Continue with Google
                </Button>

                <Button type="button" onClick={() => signIn("github")} variant="outline" className="w-full flex gap-2">
                  <Github size={16} />
                  Continue with GitHub
                </Button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-10 text-center text-sm text-muted-foreground">
              Don’t have an account?
              <a href="#" className="text-primary ml-1 hover:underline">
                Sign up
              </a>
            </div>

          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t">
        <div className="flex flex-col items-center gap-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-4">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Legal</a>
          </div>
          <p>© 2024 Your Company</p>
        </div>
      </footer>
    </div>
  )
}