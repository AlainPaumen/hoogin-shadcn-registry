import { createFileRoute } from "@tanstack/react-router"

import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { CodeBlock } from "@/hoogin/docs/code-block"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import { AuthProvider, useAuth } from "@/hoogin/ui/auth/auth-provider"

export const Route = createFileRoute("/docs/components/auth-provider")({
  component: AuthProviderPage,
})

function AuthStatusPreview() {
  const { user } = useAuth()

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex items-center justify-between rounded-lg border p-3">
        <span className="text-sm">Session</span>
        <code className="rounded bg-muted px-1.5 py-0.5 text-[12px]">
          {user ? user.email : "signed out"}
        </code>
      </div>
      <p className="text-xs text-muted-foreground">
        This demo is wrapped in an AuthProvider without a baseUrl, so it only
        renders the signed-out state. Wire it to your TrailBase instance to
        sign in for real.
      </p>
    </div>
  )
}

const usageSource = `import { AuthProvider, useAuth } from "@/hoogin/ui/auth/auth-provider"
import { SigninPage } from "@/hoogin/blocks/signin-page/signin-page"

function App() {
  return (
    <AuthProvider baseUrl="https://api.example.com">
      <Routes />
    </AuthProvider>
  )
}

function SigninRoute() {
  const { user, signIn, signOut } = useAuth()
  const [error, setError] = useState<string | null>(null)

  if (user) {
    return <button onClick={() => signOut()}>Sign out</button>
  }

  return (
    <SigninPage
      error={error}
      onSubmit={async ({ email, password }) => {
        try {
          await signIn(email, password)
        } catch (err) {
          setError(err instanceof Error ? err.message : "Sign in failed")
        }
      }}
    />
  )
}`

const signupSource = `const { signUp } = useAuth()

async function handleSignup({ email, password, confirmPassword }) {
  if (password !== confirmPassword) return
  try {
    await signUp({ email, password })
    // Account created — TrailBase sent a verification email.
    // Show a "check your inbox" screen; the user signs in once verified.
  } catch (err) {
    // Show err.message, e.g. the password policy or a failed email send
  }
}`

function AuthProviderPage() {
  return (
    <ComponentDoc name="auth-provider">
      <DocSection title="Preview">
        <Preview>
          <AuthProvider>
            <AuthStatusPreview />
          </AuthProvider>
        </Preview>
      </DocSection>
      <DocSection
        title="Usage"
        description="Mount AuthProvider at the root of your app. It wraps the TrailBase JavaScript client, persists the session tokens in localStorage, and restores (and validates) the session on load. useAuth exposes the signed-in user and the sign in, sign up, and sign out helpers."
      >
        <CodeBlock language="tsx" code={usageSource} />
      </DocSection>
      <DocSection
        title="Sign up"
        description="signUp creates the account and sends the verification email. TrailBase requires the email to be verified before the user can sign in, so show a check-your-inbox screen after it resolves; password_repeat is sent automatically."
      >
        <CodeBlock language="tsx" code={signupSource} />
      </DocSection>
      <DocSection
        title="Notes"
        description="signIn and signUp throw an Error with a user-facing message on failure — pass it to the error prop of the signin and signup page blocks. The client is exposed for authenticated record access, e.g. client.records(TableName).list(). Sessions are refreshed automatically by the client; an expired session is cleared from state and storage."
      >
        <p className="text-sm text-muted-foreground">
          Tokens are persisted under the storageKey in localStorage and
          restored on load. Persist them yourself if you need to share a
          session across tabs or devices.
        </p>
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              prop: "baseUrl",
              type: "string",
              description:
                "TrailBase site URL, e.g. https://api.example.com. Defaults to the current origin.",
            },
            {
              prop: "storageKey",
              type: "string",
              default: '"trailbase.auth"',
              description: "localStorage key used to persist the session tokens.",
            },
          ]}
        />
      </DocSection>
    </ComponentDoc>
  )
}
