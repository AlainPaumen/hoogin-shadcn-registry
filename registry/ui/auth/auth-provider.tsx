import * as React from "react"
import { FetchError, initClient } from "trailbase"
import type { Client, Tokens, User } from "trailbase"

const AUTH_API_BASE_PATH = "/api/auth/v1"

type AuthProviderProps = {
  children: React.ReactNode
  /**
   * TrailBase site URL. Defaults to the current origin.
   */
  baseUrl?: string
  /**
   * localStorage key used to persist the session tokens. Defaults to
   * "trailbase.auth".
   */
  storageKey?: string
}

export type SignUpValues = {
  email: string
  password: string
}

type AuthProviderState = {
  /**
   * The signed-in user, or null when signed out.
   */
  user: User | null
  /**
   * The TrailBase client. Use it for authenticated record access, e.g.
   * `client.records("my_table").list()`.
   */
  client: Client
  /**
   * Signs in with email/username and password. Resolves once the session is
   * established; throws on invalid credentials or when MFA is required.
   */
  signIn: (emailOrUsername: string, password: string) => Promise<void>
  /**
   * Registers a new account and resolves once the verification email has been
   * sent. Throws when registration fails (e.g. the password does not meet the
   * server's policy or the verification email could not be sent). TrailBase
   * requires the email to be verified before the user can sign in.
   */
  signUp: (values: SignUpValues) => Promise<void>
  /**
   * Signs out and clears the persisted session.
   */
  signOut: () => Promise<void>
}

function toAuthError(error: unknown, fallback: string): Error {
  if (error instanceof FetchError) {
    const message = error.msg.trim()
    if (message && message !== "Unauthorized") {
      return new Error(message)
    }
  } else if (error instanceof Error) {
    return error
  }

  return new Error(fallback)
}

function loadTokens(storageKey: string): Tokens | undefined {
  const raw = localStorage.getItem(storageKey)
  if (raw === null) {
    return undefined
  }

  try {
    const tokens: unknown = JSON.parse(raw)
    if (
      typeof tokens === "object" &&
      tokens !== null &&
      "auth_token" in tokens &&
      typeof (tokens as Tokens).auth_token === "string"
    ) {
      return tokens as Tokens
    }
  } catch {
    // Fall through to an unauthenticated session.
  }

  return undefined
}

function persistTokens(storageKey: string, tokens: Tokens | undefined) {
  if (tokens === undefined) {
    localStorage.removeItem(storageKey)
    return
  }

  localStorage.setItem(storageKey, JSON.stringify(tokens))
}

const AuthProviderContext = React.createContext<
  AuthProviderState | undefined
>(undefined)

export function AuthProvider({
  children,
  baseUrl,
  storageKey = "trailbase.auth",
}: AuthProviderProps) {
  const [user, setUser] = React.useState<User | null>(null)

  const [client] = React.useState(() =>
    initClient(baseUrl, {
      tokens: loadTokens(storageKey),
      onAuthChange: (client, nextUser) => {
        setUser(nextUser ?? null)
        persistTokens(storageKey, client.tokens())
      },
    })
  )

  const initialUser = client.user()
  if (user === null && initialUser) {
    setUser(initialUser)
  }

  const signIn = React.useCallback(
    async (emailOrUsername: string, password: string) => {
      try {
        const mfaToken = await client.login(emailOrUsername, password)
        if (mfaToken) {
          throw new Error("Multi-factor authentication is not supported yet.")
        }
      } catch (error) {
        throw toAuthError(error, "Invalid email or password.")
      }
    },
    [client]
  )

  const signUp = React.useCallback(
    async ({ email, password }: SignUpValues) => {
      try {
        await client.fetch(`${AUTH_API_BASE_PATH}/register`, {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
            password_repeat: password,
          }),
        })
      } catch (error) {
        throw toAuthError(error, "Could not create your account.")
      }
    },
    [client]
  )

  const signOut = React.useCallback(async () => {
    await client.logout()
  }, [client])

  const value = React.useMemo(
    () => ({
      user,
      client,
      signIn,
      signUp,
      signOut,
    }),
    [user, client, signIn, signUp, signOut]
  )

  return (
    <AuthProviderContext.Provider value={value}>
      {children}
    </AuthProviderContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = React.useContext(AuthProviderContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
