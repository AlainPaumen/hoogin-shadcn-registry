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
import { m } from "@/paraglide/messages.js"
import {
  SignupForm,
  type SignupFormProps,
} from "@/hoogin/blocks/signup-page/signup-form"

export type SignupPageProps = Omit<SignupFormProps, "onSubmit"> & {
  logo?: ReactNode
  title?: string
  subtitle?: string
  signInHref?: string
  termsHref?: string
  privacyHref?: string
  onSubmit: SignupFormProps["onSubmit"]
  className?: string
}

export function SignupPage({
  logo,
  title = m.signupPage_title(),
  subtitle = m.signupPage_subtitle(),
  signInHref = "/auth/signin",
  termsHref = "/terms",
  privacyHref = "/privacy",
  error,
  onSubmit,
  className,
}: SignupPageProps) {
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
          <SignupForm error={error} onSubmit={onSubmit} />
          <p className="text-center text-sm text-muted-foreground">
            {m.signupPage_hasAccount()}{" "}
            <a
              href={signInHref}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {m.signupPage_signIn()}
            </a>
          </p>
        </CardContent>
      </Card>
      <p className="max-w-md text-center text-xs text-muted-foreground">
        {m.signupPage_termsIntro()}{" "}
        <a
          href={termsHref}
          className="text-foreground underline-offset-4 hover:underline"
        >
          {m.signupPage_terms()}
        </a>{" "}
        {m.signupPage_and()}{" "}
        <a
          href={privacyHref}
          className="text-foreground underline-offset-4 hover:underline"
        >
          {m.signupPage_privacy()}
        </a>
        .
      </p>
    </main>
  )
}
