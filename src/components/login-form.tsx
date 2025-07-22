"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { type FormState, SignIn } from "../../server/actions/signin"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const initialState: FormState = {
    errors: {},
  }

  const router = useRouter()
  const [state, formAction, isPending] = useActionState<FormState, FormData>(SignIn, initialState)

  useEffect(() => {
    if (state?.redirectTo && typeof state.redirectTo === "string") {
      console.log("Redirecting to:", state.redirectTo)
      router.replace(state.redirectTo)
    }
  }, [state?.redirectTo, router])

  useEffect(() => {
    if (state.timestamp && state.message && !state.redirectTo) {
      toast(state.message)
    }
  }, [state.timestamp, state.message, state.redirectTo])

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                {state.errors?.email && <p className="text-red-400 text-sm">{state.errors.email[0]}</p>}
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                />
                {state.errors?.email && (
                  <p className="text-red-400 text-sm">{state.errors.email[0]}</p>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" name="password" required />
                {state.errors?.password && <p className="text-red-400 text-sm">{state.errors?.password[0]}</p>}
                <Input id="password" type="password" name="password" placeholder="Enter your Password" required />
                {state.errors?.password && (
                  <p className="text-red-400 text-sm">{state.errors?.password[0]}</p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Logging in..." : "Login"}
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Login with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
