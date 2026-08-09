import { createFileRoute } from "@tanstack/react-router"

import { toast } from "@/components/ui/toast"
import { CodeBlock } from "@/hoogin/docs/code-block"
import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { SignupPage } from "@/hoogin/blocks/signup-page/signup-page"

import favicon from "@/assets/favicon.svg"

export const Route = createFileRoute("/docs/blocks/signup-page")({
  component: SignupPagePage,
})

function SignupPagePreview() {
  return (
    <SignupPage
      className="min-h-[640px]"
      logo={<img src={favicon} alt="Hoogin" className="size-10" />}
      onSubmit={async (values) => {
        toast.add({
          type: "success",
          title: "Account created",
          description: `Welcome, ${values.firstName}!`,
        })
      }}
    />
  )
}

const usageSource = `import { SignupPage } from "@/hoogin/blocks/signup-page/signup-page"

export function SignupRoute() {
  return (
    <SignupPage
      logo={<img src="/logo.svg" alt="Acme" className="size-10" />}
      onSubmit={async (values) => {
        await signUp(values)
        router.navigate({ to: "/dashboard" })
      }}
    />
  )
}`

function SignupPagePage() {
  return (
    <ComponentDoc name="signup-page">
      <DocSection title="Preview">
        <Preview>
          <SignupPagePreview />
        </Preview>
      </DocSection>
      <DocSection
        title="Usage"
        description="SignupPage renders a centered page with a logo, a card containing the signup form, and the legal footer links. It composes SignupForm, which is a TanStack Form built from the @hoogin form field components (first name, last name, email, strong password, and a matching confirm password). Pass onSubmit to create the account; it receives the validated form values."
      >
        <CodeBlock language="tsx" code={usageSource} />
      </DocSection>
      <DocSection
        title="Notes"
        description="The page is router-agnostic: the sign in, terms, and privacy links are plain anchors so the block works with any router. The submit button disables itself and shows 'Creating Account...' while onSubmit is pending. Pass an error string to show an inline server error above the button."
      >
        <p className="text-sm text-muted-foreground">
          Customize the copy and links via the title, subtitle, signInHref,
          termsHref, and privacyHref props. The logo is your brand's — pass it
          with the logo prop.
        </p>
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              prop: "onSubmit",
              type: "(values: SignupValues) => void | Promise<void>",
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
              description:
                "Card title. Defaults to \"Create an account\".",
            },
            {
              prop: "subtitle",
              type: "string",
              description:
                "Card subtitle below the title. Defaults to \"Enter your details to get started.\"",
            },
            {
              prop: "signInHref",
              type: "string",
              description:
                "Href of the sign in link. Defaults to /auth/signin.",
            },
            {
              prop: "termsHref",
              type: "string",
              description: "Href of the Terms of Service link. Defaults to /terms.",
            },
            {
              prop: "privacyHref",
              type: "string",
              description: "Href of the Privacy Policy link. Defaults to /privacy.",
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
