import { CodeBlock } from "@/hoogin/docs/code-block"

export function InstallCommand({ name }: { name: string }) {
  const command = `npx shadcn@latest add @hoogin/${name}`
  return <CodeBlock code={command} language="bash" />
}
