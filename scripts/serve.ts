import { readFile } from "node:fs/promises"
import { extname, join, normalize } from "node:path"

const root = import.meta.dir
const publicDir = join(root, "..", "public")
const port = Number(process.env.PORT ?? 3001)

const mime: Record<string, string> = {
  ".json": "application/json",
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
}

Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url)
    let path = decodeURIComponent(url.pathname)
    if (path.endsWith("/")) path = path + "index.json"
    const filePath = normalize(join(publicDir, path))
    if (!filePath.startsWith(publicDir)) return new Response("Forbidden", { status: 403 })
    try {
      const data = await readFile(filePath)
      return new Response(data, {
        headers: { "content-type": mime[extname(filePath)] ?? "application/octet-stream" },
      })
    } catch {
      const withExt = await readFile(`${filePath}.json`).catch(() => null)
      if (withExt) {
        return new Response(withExt, {
          headers: { "content-type": "application/json" },
        })
      }
      return new Response("Not found", { status: 404 })
    }
  },
})

console.log(`Serving ${publicDir} at http://localhost:${port}`)
