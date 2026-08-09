"use client"

import type { ReactNode } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  SigninForm,
  type SigninFormProps,
} from "@/hoogin/blocks/signin-page/signin-form"

export type SigninPageProps = Omit<SigninFormProps, "onSubmit"> & {
  logo?: ReactNode
  title?: string
  subtitle?: string
  signUpHref?: string
  forgotPasswordHref?: string
  onSubmit: SigninFormProps["onSubmit"]
  className?: string
}

export function SigninPage({
  logo,
  title = "Welcome back",
  subtitle = "Enter your credentials to sign in.",
  signUpHref = "/auth/signup",
  forgotPasswordHref = "/auth/forgot-password",
  error,
  onSubmit,
  className,
}: SigninPageProps) {
  return (
    <main
      className={cn(
        "flex min-h-dvh w-full flex-col items-center justify-center gap-6 px-4 py-10",
        className
      )}
    >
      {logo ? <div className="flex justify-center">{logo}</div> : null}
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <CardTitle>{title}</CardTitle>
          {subtitle ? <CardDescription>{subtitle}</CardDescription> : null}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <SigninForm error={error} onSubmit={onSubmit} />
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a
              href={signUpHref}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign Up
            </a>
          </p>
        </CardContent>
      </Card>
      <p className="text-center text-xs text-muted-foreground">
        <a
          href={forgotPasswordHref}
          className="text-foreground underline-offset-4 hover:underline"
        >
          Forgot your password?
        </a>
      </p>
    </main>
  )
}
