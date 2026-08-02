import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: DemoComponent,
})

function DemoComponent() {
  return (
    <div>DEMO</div>
  )
}