import { Component, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { m } from "@/paraglide/messages.js"

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  error: Error | null
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  reset = () => this.setState({ error: null })

  render() {
    if (!this.state.error) return this.props.children

    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
        <h1 className="font-heading text-xl font-medium">{m.error_title()}</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          {this.state.error.message}
        </p>
        <Button onClick={this.reset}>{m.error_retry()}</Button>
      </main>
    )
  }
}
