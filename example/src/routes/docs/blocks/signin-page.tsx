import { createFileRoute } from "@tanstack/react-router"

import { toast } from "@/components/ui/toast"
import { CodeBlock } from "@/hoogin/docs/code-block"
import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { SigninPage } from "@/hoogin/blocks/signin-page/signin-page"

import favicon from "@/assets/favicon.svg"

export const Route = createFileRoute("/docs/blocks/signin-page")({
  component: SigninPagePage,
})

function SigninPagePreview() {
  return (
    <SigninPage
      className="min-h-[640px]"
      logo={<img src={favicon} alt="Hoogin" className="size-10" />}
      onSubmit={async (values) => {
        toast.add({
          type: "success",
          title: "Signed in",
          description: `Welcome back, ${values.email}!`,
        })
      }}
    />
  )
}

const usageSource = `import { SigninPage } from "@/hoogin/blocks/signin-page/signin-page"

export function SigninRoute() {
  return (
    <SigninPage
      logo={<img src="/logo.svg" alt="Acme" className="size-10" />}
      onSubmit={async (values) => {
        await signIn(values)
        router.navigate({ to: "/dashboard" })
      }}
    />
  )
}`

function SigninPagePage() {
  return (
    <ComponentDoc name="signin-page">
      <DocSection title="Preview">
        <Preview>
          <SigninPagePreview />
        </Preview>
      </DocSection>
      <DocSection
        title="Usage"
        description="SigninPage renders a centered page with a logo, a card containing the signin form, and a forgot password link. It composes SigninForm, a TanStack Form built from the @hoogin form field components (email and password). Pass onSubmit to authenticate; it receives the validated form values."
      >
        <CodeBlock language="tsx" code={usageSource} />
      </DocSection>
      <DocSection
        title="Notes"
        description="The page is router-agnostic: the sign up and forgot password links are plain anchors so the block works with any router. The submit button disables itself and shows 'Signing In...' while onSubmit is pending. Pass an error string to show an inline server error above the button."
      >
        <p className="text-sm text-muted-foreground">
          Customize the copy and links via the title, subtitle, signUpHref, and
          forgotPasswordHref props. The logo is your brand's — pass it with the
          logo prop.
        </p>
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              prop: "onSubmit",
              type: "(values: SigninValues) => void | Promise<void>",
              description:
                "Called with the validated values when the form is submitted.",
            },
            {
              prop: "logo",
              type: "ReactNode",
              description: "Brand logo rendered above the card.",
            },
            {
              prop: "title",
              type: "string",
              description: 'Card title. Defaults to "Welcome back".',
            },
            {
              prop: "subtitle",
              type: "string",
              description:
                'Card subtitle below the title. Defaults to "Enter your credentials to sign in."',
            },
            {
              prop: "signUpHref",
              type: "string",
              description:
                "Href of the sign up link. Defaults to /auth/signup.",
            },
            {
              prop: "forgotPasswordHref",
              type: "string",
              description:
                "Href of the forgot password link. Defaults to /auth/forgot-password.",
            },
            {
              prop: "error",
              type: "string | null",
              description: "Inline error shown above the submit button.",
            },
            {
              prop: "className",
              type: "string",
              description: "Additional classes for the page wrapper.",
            },
          ]}
        />
      </DocSection>
    </ComponentDoc>
  )
}
