#!/usr/bin/env node
/**
 * opencode-skill-dashboard
 * ------------------------
 * Scans your GLOBAL and LOCAL (per-project) OpenCode skills + local session
 * history to figure out which skills actually get invoked by the agent, and
 * how often.
 *
 * Usage:
 *   node scan.mjs                          # scan everything found in session history
 *   node scan.mjs --out report.html
 *   node scan.mjs --data-dir /path/to/opencode/data
 *   node scan.mjs --json data.json          # also dump raw JSON alongside the HTML
 *   node scan.mjs --projects /a,/b          # also scan these project roots for local
 *                                            # skills even if they have no history yet
 *   node scan.mjs --filter-project my-app   # only show usage for a matching project
 *   node scan.mjs --no-local                # global skills only (old behavior)
 *   node scan.mjs --max-walk-up 8           # how far up from a project dir to look
 *                                            # for local skills before hitting .git
 *   node scan.mjs --debug                   # verbose logging + raw sample dumps
 *
 * Zero dependencies — just Node 18+.
 *
 * NOTE: OpenCode's on-disk storage layout (~/.local/share/opencode/storage/...)
 * is an internal implementation detail, not a stable public API. This script
 * uses defensive, structural parsing (it looks for the *shape* of a skill-tool
 * call anywhere in a JSON blob, rather than hard-coded field paths) so it's
 * more likely to survive version changes, but it may still need tweaking.
 * Run with --debug if your counts look wrong or come back empty.
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";

// ---------- CLI args ----------
const args = process.argv.slice(2);
function flag(name, def = undefined) {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return def;
  const v = args[i + 1];
  return v && !v.startsWith("--") ? v : true;
}
const OUT_HTML = flag("out", "dashboard.html");
const OUT_JSON = flag("json", null);
const DEBUG = !!flag("debug", false);
const DATA_DIR = flag(
  "data-dir",
  process.env.OPENCODE_DATA_DIR || path.join(os.homedir(), ".local/share/opencode")
);
const EXTRA_SKILL_DIRS = flag("skills-dir", null);
const EXTRA_PROJECTS = flag("projects", null);
const FILTER_PROJECT = flag("filter-project", null);
const NO_LOCAL = !!flag("no-local", false);
const MAX_WALK_UP = parseInt(flag("max-walk-up", "8"), 10);

// ---------- helpers ----------
function log(...a) {
  console.log(...a);
}
function dlog(...a) {
  if (DEBUG) console.log("[debug]", ...a);
}
function listDirSafe(p) {
  try {
    return fs.readdirSync(p, { withFileTypes: true });
  } catch {
    return [];
  }
}
function readJsonSafe(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}
function walkFiles(dir, out = []) {
  for (const ent of listDirSafe(dir)) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkFiles(full, out);
    else if (ent.isFile() && ent.name.endsWith(".json")) out.push(full);
  }
  return out;
}
function escapeHtml(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}
function fmtDate(ms) {
  if (!ms) return "—";
  return new Date(ms).toISOString().slice(0, 10);
}
function shortProject(p) {
  if (!p) return "";
  return p.replace(os.homedir(), "~");
}

// ---------- SKILL.md parsing ----------
function parseFrontmatter(md) {
  const m = md.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
    if (kv) {
      let val = kv[2].trim();
      val = val.replace(/^["']|["']$/g, "");
      fm[kv[1]] = val;
    }
  }
  return fm;
}
function readSkillDir(skillDir) {
  const mdPath = path.join(skillDir, "SKILL.md");
  if (!fs.existsSync(mdPath)) return null;
  const raw = fs.readFileSync(mdPath, "utf8");
  const fm = parseFrontmatter(raw);
  return { name: fm.name, description: fm.description || "" };
}

// ---------- 1. discover GLOBAL skills ----------
function discoverGlobalSkills() {
  const home = os.homedir();
  const dirs = [
    { source: "opencode-native", dir: path.join(home, ".config/opencode/skills") },
    { source: "claude", dir: path.join(home, ".claude/skills") },
    { source: "agents", dir: path.join(home, ".agents/skills") },
  ];
  if (EXTRA_SKILL_DIRS && typeof EXTRA_SKILL_DIRS === "string") {
    for (const d of EXTRA_SKILL_DIRS.split(",")) dirs.push({ source: "custom", dir: d });
  }

  const skills = new Map(); // id -> record, first source wins
  for (const { source, dir } of dirs) {
    for (const ent of listDirSafe(dir)) {
      if (!ent.isDirectory()) continue;
      const skillDir = path.join(dir, ent.name);
      const info = readSkillDir(skillDir);
      if (!info) continue;
      const id = ent.name;
      if (!skills.has(id)) {
        skills.set(id, {
          key: `global:${id}`,
          id,
          name: info.name || id,
          description: info.description,
          scope: "global",
          project: null,
          source,
          path: skillDir,
        });
      }
    }
  }
  return [...skills.values()].sort((a, b) => a.id.localeCompare(b.id));
}

// ---------- 2. discover LOCAL skills for a given project, walking up to the git root ----------
const LOCAL_SUBDIRS = [
  { rel: ".opencode/skills", source: "opencode-native" },
  { rel: ".claude/skills", source: "claude" },
  { rel: ".agents/skills", source: "agents" },
];

function discoverLocalSkillsForProject(projectDir) {
  const found = new Map(); // id -> record, deepest (closest to project dir) wins
  let dir = projectDir;
  let levels = 0;
  const visitedDirs = [];

  while (dir && levels <= MAX_WALK_UP) {
    visitedDirs.push(dir);
    for (const { rel, source } of LOCAL_SUBDIRS) {
      const skillsPath = path.join(dir, rel);
      for (const ent of listDirSafe(skillsPath)) {
        if (!ent.isDirectory()) continue;
        const skillDir = path.join(skillsPath, ent.name);
        const info = readSkillDir(skillDir);
        if (!info) continue;
        const id = ent.name;
        if (found.has(id)) continue; // a shallower (closer) definition already claimed this id
        found.set(id, {
          key: `local:${projectDir}:${id}`,
          id,
          name: info.name || id,
          description: info.description,
          scope: "local",
          project: projectDir,
          foundAt: dir,
          source,
          path: skillDir,
        });
      }
    }
    if (fs.existsSync(path.join(dir, ".git"))) break; // stop at git worktree root
    const parent = path.dirname(dir);
    if (parent === dir) break; // filesystem root
    dir = parent;
    levels++;
  }

  dlog(`local skill walk for ${projectDir}: visited ${visitedDirs.length} dir(s), found ${found.size} skill(s)`);
  return [...found.values()];
}

// ---------- 3. build sessionID -> project directory map, messageID -> sessionID map ----------
function buildSessionMaps() {
  const messageDir = path.join(DATA_DIR, "storage/message");
  const sessionDir = path.join(DATA_DIR, "storage/session");

  const messageIdToSession = new Map();
  for (const sessDirEnt of listDirSafe(messageDir)) {
    if (!sessDirEnt.isDirectory()) continue;
    const sessionId = sessDirEnt.name;
    const sessPath = path.join(messageDir, sessionId);
    for (const f of listDirSafe(sessPath)) {
      if (!f.isFile()) continue;
      const messageId = f.name.replace(/^msg_/, "").replace(/\.json$/, "");
      messageIdToSession.set(messageId, sessionId);
      messageIdToSession.set(`msg_${messageId}`, sessionId);
    }
  }

  const sessionIdToProject = new Map();
  for (const projDirEnt of listDirSafe(sessionDir)) {
    if (!projDirEnt.isDirectory()) continue;
    const projPath = path.join(sessionDir, projDirEnt.name);
    for (const f of listDirSafe(projPath)) {
      if (!f.isFile() || !f.name.endsWith(".json")) continue;
      const sessionId = f.name.replace(/\.json$/, "");
      const data = readJsonSafe(path.join(projPath, f.name));
      if (!data) continue;
      const directory = data.directory || data.cwd || data.root || data.worktree || data.path || null;
      sessionIdToProject.set(sessionId, directory || null);
    }
  }

  return { messageIdToSession, sessionIdToProject };
}

// ---------- 4. find skill-tool invocations inside part/ ----------
function findSkillCalls(obj, results) {
  if (obj == null) return;
  if (Array.isArray(obj)) {
    obj.forEach((v) => findSkillCalls(v, results));
    return;
  }
  if (typeof obj !== "object") return;

  const toolVal = obj.tool ?? obj.tool_name ?? obj.toolName ?? (typeof obj.name === "string" ? obj.name : undefined);
  if (typeof toolVal === "string" && toolVal.toLowerCase() === "skill") {
    const input = obj.input ?? obj.state?.input ?? obj.args ?? obj.arguments ?? {};
    const skillId = input.id ?? input.skill ?? input.skillId ?? input.name;
    const time = obj.time?.start ?? obj.time?.created ?? obj.timestamp ?? obj.created ?? null;
    results.push({ skillId: skillId || null, time });
  }
  for (const v of Object.values(obj)) findSkillCalls(v, results);
}

function mineUsage() {
  const partDir = path.join(DATA_DIR, "storage/part");
  const files = walkFiles(partDir);
  dlog(`scanning ${files.length} part files under ${partDir}`);

  const calls = [];
  for (const file of files) {
    const data = readJsonSafe(file);
    if (!data) continue;
    const found = [];
    findSkillCalls(data, found);
    if (found.length === 0) continue;
    const messageFolder = path.basename(path.dirname(file));
    for (const f of found) calls.push({ ...f, messageId: messageFolder });
  }

  if (calls.length === 0 && files.length > 0 && DEBUG) {
    const sample = readJsonSafe(files[0]);
    dlog("no skill calls matched. Sample part file contents:", JSON.stringify(sample, null, 2).slice(0, 2000));
  }
  return calls;
}

// ---------- 5. resolve project roots to scan for local skills ----------
function collectProjectRoots(sessionIdToProject) {
  const roots = new Set();
  for (const p of sessionIdToProject.values()) {
    if (p) roots.add(p);
  }
  if (EXTRA_PROJECTS && typeof EXTRA_PROJECTS === "string") {
    for (const p of EXTRA_PROJECTS.split(",")) roots.add(path.resolve(p.trim()));
  }
  return [...roots];
}

// ---------- 6. aggregate ----------
function aggregate({ globalSkills, localSkillsByProject, calls, messageIdToSession, sessionIdToProject }) {
  const globalById = new Map(globalSkills.map((s) => [s.id, s]));

  function resolveSkill(project, id) {
    if (project && localSkillsByProject.has(project)) {
      const local = localSkillsByProject.get(project).find((s) => s.id === id);
      if (local) return local;
    }
    if (globalById.has(id)) return globalById.get(id);
    return null;
  }

  const usage = new Map(); // key -> stats
  const unresolved = new Map(); // "id@project" -> {id, project, count}

  for (const call of calls) {
    if (!call.skillId) continue;
    const sessionId = messageIdToSession.get(call.messageId) || null;
    const project = sessionId ? sessionIdToProject.get(sessionId) : null;

    const skill = resolveSkill(project, call.skillId);
    if (!skill) {
      const k = `${call.skillId}@${project || "(no project)"}`;
      if (!unresolved.has(k)) unresolved.set(k, { id: call.skillId, project, count: 0 });
      unresolved.get(k).count++;
      continue;
    }

    if (!usage.has(skill.key)) {
      usage.set(skill.key, {
        key: skill.key,
        id: skill.id,
        scope: skill.scope,
        project: skill.project,
        count: 0,
        sessions: new Set(),
        projects: new Set(),
        firstUsed: null,
        lastUsed: null,
      });
    }
    const u = usage.get(skill.key);
    u.count++;
    if (sessionId) u.sessions.add(sessionId);
    if (project) u.projects.add(project);
    if (call.time) {
      const t = new Date(call.time).getTime();
      if (!isNaN(t)) {
        if (u.firstUsed === null || t < u.firstUsed) u.firstUsed = t;
        if (u.lastUsed === null || t > u.lastUsed) u.lastUsed = t;
      }
    }
  }

  let usageList = [...usage.values()]
    .map((u) => ({ ...u, sessions: u.sessions.size, projects: [...u.projects] }))
    .sort((a, b) => b.count - a.count);

  const allSkills = [...globalSkills, ...[...localSkillsByProject.values()].flat()];
  const usedKeys = new Set(usageList.map((u) => u.key));
  let unusedSkills = allSkills.filter((s) => !usedKeys.has(s.key));

  if (FILTER_PROJECT) {
    const f = FILTER_PROJECT.toLowerCase();
    usageList = usageList.filter(
      (u) => u.scope === "global" || (u.project && u.project.toLowerCase().includes(f))
    );
    unusedSkills = unusedSkills.filter(
      (s) => s.scope === "global" || (s.project && s.project.toLowerCase().includes(f))
    );
  }

  return { usageList, unusedSkills, unresolved: [...unresolved.values()], allSkills };
}

// ---------- 7. render dashboard ----------
function renderHtml({ allSkills, usageList, unusedSkills, unresolved, generatedAt, dataDir, projectRoots }) {
  const maxCount = Math.max(1, ...usageList.map((u) => u.count));
  const byKey = new Map(allSkills.map((s) => [s.key, s]));

  function scopeBadge(u) {
    return u.scope === "global"
      ? `<span class="badge badge-global">Global</span>`
      : `<span class="badge badge-local">Local · ${escapeHtml(shortProject(u.project))}</span>`;
  }

  const rows = usageList
    .map((u) => {
      const s = byKey.get(u.key);
      const pct = Math.max(4, Math.round((u.count / maxCount) * 100));
      return `
      <tr>
        <td class="name">
          <div class="skill-name">${escapeHtml(s ? s.name : u.id)} ${scopeBadge(u)}</div>
          <div class="skill-id">${escapeHtml(u.id)}</div>
          ${s ? `<div class="skill-desc">${escapeHtml(s.description)}</div>` : ""}
        </td>
        <td class="bar-cell"><div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div></td>
        <td class="num">${u.count}</td>
        <td class="num">${u.sessions}</td>
        <td class="num">${fmtDate(u.lastUsed)}</td>
      </tr>`;
    })
    .join("");

  const unusedRows = unusedSkills
    .map(
      (s) => `
      <tr>
        <td class="name">
          <div class="skill-name">${escapeHtml(s.name)} ${
        s.scope === "global"
          ? `<span class="badge badge-global">Global</span>`
          : `<span class="badge badge-local">Local · ${escapeHtml(shortProject(s.project))}</span>`
      }</div>
          <div class="skill-id">${escapeHtml(s.id)} · ${escapeHtml(s.source)}</div>
          <div class="skill-desc">${escapeHtml(s.description || "(no description in frontmatter — the agent may not even see this skill as invocable)")}</div>
        </td>
      </tr>`
    )
    .join("");

  const unresolvedRows = unresolved
    .sort((a, b) => b.count - a.count)
    .map(
      (u) => `
      <tr>
        <td class="name"><div class="skill-id">${escapeHtml(u.id)}</div></td>
        <td class="name">${escapeHtml(shortProject(u.project) || "(unknown)")}</td>
        <td class="num">${u.count}</td>
      </tr>`
    )
    .join("");

  const globalCount = allSkills.filter((s) => s.scope === "global").length;
  const localCount = allSkills.filter((s) => s.scope === "local").length;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>OpenCode Skill Usage Dashboard</title>
<style>
  :root {
    --bg: #0d0f14; --panel: #151822; --border: #262b38; --text: #e6e8ee;
    --muted: #8a90a3; --accent: #6ea8fe; --accent-dim: #2f4a7a;
    --good: #4ade80; --warn: #f59e0b; --purple: #c084fc;
  }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif;
    background: var(--bg); color: var(--text); padding: 40px 24px 80px; }
  .wrap { max-width: 1080px; margin: 0 auto; }
  h1 { font-size: 1.6rem; margin-bottom: 4px; }
  .meta { color: var(--muted); font-size: 0.85rem; margin-bottom: 32px; }
  .stats { display: flex; gap: 16px; margin-bottom: 32px; flex-wrap: wrap; }
  .stat { background: var(--panel); border: 1px solid var(--border); border-radius: 10px;
    padding: 16px 20px; flex: 1; min-width: 140px; }
  .stat .num { font-size: 1.6rem; font-weight: 600; }
  .stat .label { color: var(--muted); font-size: 0.8rem; margin-top: 2px; }
  section { margin-bottom: 40px; }
  h2 { font-size: 1.1rem; margin-bottom: 4px; }
  .section-sub { color: var(--muted); font-size: 0.85rem; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em;
    color: var(--muted); padding: 8px 10px; border-bottom: 1px solid var(--border); }
  td { padding: 12px 10px; border-bottom: 1px solid var(--border); vertical-align: top; }
  .skill-name { font-weight: 600; }
  .skill-id { color: var(--muted); font-size: 0.78rem; font-family: ui-monospace, monospace; margin-top: 2px; }
  .skill-desc { color: var(--muted); font-size: 0.82rem; margin-top: 6px; max-width: 460px; }
  .bar-cell { width: 150px; }
  .bar-track { background: #1c2130; border-radius: 6px; height: 10px; overflow: hidden; }
  .bar-fill { background: linear-gradient(90deg, var(--accent-dim), var(--accent)); height: 100%; }
  .num { text-align: right; font-variant-numeric: tabular-nums; color: var(--text); }
  .panel { background: var(--panel); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
  .panel table tr:last-child td { border-bottom: none; }
  .badge { display: inline-block; font-size: 0.68rem; padding: 2px 8px; border-radius: 999px; margin-left: 6px; }
  .badge-global { background: rgba(110,168,254,0.15); color: var(--accent); }
  .badge-local { background: rgba(192,132,252,0.15); color: var(--purple); }
  .warn-badge { display: inline-block; font-size: 0.7rem; padding: 2px 8px; border-radius: 999px;
    background: rgba(245,158,11,0.15); color: var(--warn); margin-left: 8px; }
  .note { color: var(--muted); font-size: 0.8rem; line-height: 1.5; }
  code { font-family: ui-monospace, monospace; background: #1c2130; padding: 1px 5px; border-radius: 4px; }
  .proj-list { color: var(--muted); font-size: 0.78rem; font-family: ui-monospace, monospace; line-height: 1.6; }
</style>
</head>
<body>
<div class="wrap">
  <h1>OpenCode Skill Usage Dashboard</h1>
  <div class="meta">Generated ${generatedAt} · data source: <code>${escapeHtml(dataDir)}</code>${
    FILTER_PROJECT ? ` · filtered to projects matching <code>${escapeHtml(FILTER_PROJECT)}</code>` : ""
  }</div>

  <div class="stats">
    <div class="stat"><div class="num">${globalCount}</div><div class="label">Global skills</div></div>
    <div class="stat"><div class="num">${localCount}</div><div class="label">Local skills (across ${projectRoots.length} project(s))</div></div>
    <div class="stat"><div class="num">${usageList.length}</div><div class="label">Skills actually invoked</div></div>
    <div class="stat"><div class="num">${unusedSkills.length}</div><div class="label">Never invoked</div></div>
  </div>

  <section>
    <h2>Actively used skills</h2>
    <div class="section-sub">Global and local skills together, ranked by invocation count. A local skill is scoped to one project — the same id in another project counts separately.</div>
    <table>
      <thead><tr><th>Skill</th><th>Usage</th><th class="num">Count</th><th class="num">Sessions</th><th class="num">Last used</th></tr></thead>
      <tbody>${rows || `<tr><td colspan="5" class="note" style="padding:24px 10px;">No skill invocations matched. Try <code>--debug</code>, or check --data-dir.</td></tr>`}</tbody>
    </table>
  </section>

  <section>
    <h2>Never invoked<span class="warn-badge">${unusedSkills.length} candidates</span></h2>
    <div class="section-sub">Defined (globally or in a scanned project) but never showed up as a skill-tool call. Rewrite the description to be more specific about *when* to use it, or delete it.</div>
    <div class="panel"><table>${unusedRows || `<tr><td style="padding:16px;">None — every discovered skill has been used at least once.</td></tr>`}</table></div>
  </section>

  ${
    unresolved.length > 0
      ? `<section>
    <h2>Unresolved calls<span class="warn-badge">${unresolved.length}</span></h2>
    <div class="section-sub">The agent called the skill tool with these ids, but no matching SKILL.md was found in the scanned global or local locations — likely a skill from a project not yet scanned (add it with <code>--projects</code>), or one that's since been deleted/renamed.</div>
    <div class="panel"><table>
      <thead><tr><th>Skill id</th><th>Project</th><th class="num">Calls</th></tr></thead>
      <tbody>${unresolvedRows}</tbody>
    </table></div>
  </section>`
      : ""
  }

  <section>
    <h2>Project roots scanned for local skills</h2>
    <div class="panel" style="padding:14px 18px;">
      <div class="proj-list">${
        projectRoots.length ? projectRoots.map((p) => escapeHtml(shortProject(p))).join("<br/>") : "(none found in session history — pass --projects to add some manually)"
      }</div>
    </div>
  </section>

  <p class="note">
    Tip: a skill only counts here if the agent actually called it via the <code>skill</code> tool.
    Skills with <code>opencode/autoinvoke: false</code> in frontmatter are never auto-suggested, so
    low usage there may be by design. Local skill discovery walks up from each project directory to
    its git worktree root (max ${MAX_WALK_UP} levels), mirroring OpenCode's own resolution order —
    a local skill overrides a global one with the same id. This dashboard only sees history under
    <code>${escapeHtml(dataDir)}</code>; sessions from other machines aren't included.
  </p>
</div>
</body>
</html>`;
}

// ---------- main ----------
function main() {
  log(`OpenCode data dir: ${DATA_DIR}`);

  const globalSkills = discoverGlobalSkills();
  log(`Discovered ${globalSkills.length} global skill(s).`);

  const { messageIdToSession, sessionIdToProject } = buildSessionMaps();
  log(`Indexed ${messageIdToSession.size / 2} message->session mapping(s), ${sessionIdToProject.size} session->project mapping(s).`);

  const projectRoots = collectProjectRoots(sessionIdToProject);
  const localSkillsByProject = new Map();
  if (!NO_LOCAL) {
    for (const root of projectRoots) {
      localSkillsByProject.set(root, discoverLocalSkillsForProject(root));
    }
    const totalLocal = [...localSkillsByProject.values()].reduce((a, l) => a + l.length, 0);
    log(`Discovered ${totalLocal} local skill(s) across ${projectRoots.length} project(s).`);
  } else {
    log(`--no-local set: skipping local skill discovery.`);
  }

  const calls = mineUsage();
  log(`Found ${calls.length} skill-tool invocation(s) in session history.`);

  const { usageList, unusedSkills, unresolved, allSkills } = aggregate({
    globalSkills,
    localSkillsByProject,
    calls,
    messageIdToSession,
    sessionIdToProject,
  });

  const generatedAt = new Date().toISOString();
  const html = renderHtml({ allSkills, usageList, unusedSkills, unresolved, generatedAt, dataDir: DATA_DIR, projectRoots });
  fs.writeFileSync(OUT_HTML, html, "utf8");
  log(`\nDashboard written to ${path.resolve(OUT_HTML)}`);

  if (OUT_JSON) {
    fs.writeFileSync(
      OUT_JSON,
      JSON.stringify({ generatedAt, dataDir: DATA_DIR, allSkills, usage: usageList, unusedSkills, unresolved, projectRoots }, null, 2)
    );
    log(`Raw data written to ${path.resolve(OUT_JSON)}`);
  }
}

main();
