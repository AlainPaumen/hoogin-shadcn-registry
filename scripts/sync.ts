import { copyFile, readFile, readdir } from "node:fs/promises"
import { watch } from "node:fs"
import { join } from "node:path"

const root = join(import.meta.dir, "..")
const sourceDir = join(root, "example", "src", "hoogin", "ui")
const targetDir = join(root, "registry", "ui")

const watchMode = process.argv.includes("--watch")
const reverse = process.argv.includes("--reverse")

const [from, to, label] = reverse
  ? [targetDir, sourceDir, "registry → example"]
  : [sourceDir, targetDir, "example → registry"]

async function registeredItems(): Promise<Set<string>> {
  const raw = JSON.parse(
    await readFile(join(root, "registry", "ui", "registry.json"), "utf8")
  )
  return new Set((raw.items ?? []).map((item: { name: string }) => item.name))
}

async function syncOne(file: string) {
  await copyFile(join(from, file), join(to, file))
  console.log(`synced ${file}`)
}

async function syncAll() {
  const items = await registeredItems()
  const files = (await readdir(from)).filter(
    (file) => !file.endsWith("registry.json") && !file.startsWith(".")
  )
  for (const file of files) {
    await syncOne(file)
    if (!reverse) {
      const name = file.replace(/\.(ts|tsx)$/, "")
      if (!items.has(name)) {
        console.log(`  ! ${file} is not registered in registry/ui/registry.json`)
      }
    }
  }
  console.log(`Synced ${files.length} file(s) (${label}).`)
}

if (watchMode) {
  await syncAll()
  console.log(`Watching ${from} for changes...`)
  watch(from, (_event, filename) => {
    if (typeof filename !== "string") return
    if (filename.endsWith("registry.json")) return
    syncOne(filename).catch((err) => console.error(err))
  })
} else {
  await syncAll()
}
