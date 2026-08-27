// Shared pack resolution for the build scripts.
//
// Extracted when `build-server` arrived, because the alternative was a second
// copy of the fetch-and-verify loop. Two copies of a hash check is the one
// duplication that actually matters here: if they drift, one artifact ships
// jars the other would have refused, and nobody finds out until a friend cannot
// launch.
//
// Everything here is pure resolution — read the manifest, fetch, verify. Nothing
// in this file decides what an artifact looks like; that is each build script's
// own job.

import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'

export const digest = (buf, fmt) =>
  createHash(fmt === 'sha1' ? 'sha1' : fmt === 'sha512' ? 'sha512' : 'sha256')
    .update(buf).digest('hex')

/** packwiz metafiles are small and flat; a full TOML parser is not worth a dependency here. */
export function parseMeta(text) {
  const get = (k) => (text.match(new RegExp(`^\\s*${k}\\s*=\\s*"([^"]*)"`, 'm')) || [])[1]
  const num = (k) => (text.match(new RegExp(`^\\s*${k}\\s*=\\s*(\\d+)`, 'm')) || [])[1]
  return {
    name: get('name'),
    filename: get('filename'),
    side: get('side') ?? 'both',
    url: get('url'),
    hashFormat: get('hash-format'),
    hash: get('hash'),
    mode: get('mode'),
    projectId: num('project-id'),
    fileId: num('file-id'),
    // Modrinth's base62 project id. Present only on Modrinth-sourced metafiles,
    // and the only stable handle we have to the project page — packwiz records
    // no slug, which is exactly why the roster resolves ids instead of guessing.
    modId: get('mod-id'),
  }
}

/** The roster digest, defined in exactly one place so the generator and the ship
 *  gate cannot disagree about what "the same list" means.
 *
 *  Takes already-parsed metas rather than raw text: an earlier version re-derived
 *  the fields with its own regexes, which is a second metafile parser living in
 *  the file whose whole reason for existing is that a second copy drifts.
 *
 *  Sorted by metafile path, so a re-ordered directory listing is not a change.
 *  Deliberately covers only locally-derivable facts — no resolved URLs — so the
 *  gate that checks it never needs the network. */
export function rosterDigest(entries) {
  const rows = entries
    .map(({ file, meta }) => [
      file,
      meta.name ?? '',
      meta.filename ?? '',
      meta.side ?? 'both',
      meta.modId ?? meta.projectId ?? '',
    ].join('\t'))
    .sort()
  return createHash('sha256').update(rows.join('\n')).digest('hex')
}

/** Jars in `mods/` that are OURS, not packwiz metafiles.
 *
 *  Normally `mods/` holds only `*.pw.toml` and every build iterates those. The
 *  refMap shim (#86) is a real jar we author and commit, and it is invisible to
 *  a metafile loop — which is exactly how it reached none of the four artifacts
 *  on its first attempt. `.gitignore` permits precisely one filename pattern
 *  here, so this cannot quietly start shipping someone else's mod. */
export function packOwnedJars(root) {
  const dir = join(root, 'mods')
  return readdirSync(dir)
    .filter(f => f.endsWith('.jar'))
    .map(f => ({ filename: f, path: join(dir, f) }))
}

export function readPack(root) {
  const pack = readFileSync(join(root, 'pack.toml'), 'utf8')
  const field = (k) => (pack.match(new RegExp(`^${k}\\s*=\\s*"([^"]*)"`, 'm')) || [])[1]
  const mc = (pack.match(/^minecraft\s*=\s*"([^"]*)"/m) || [])[1]
  const forge = (pack.match(/^forge\s*=\s*"([^"]*)"/m) || [])[1]
  if (!mc || !forge) {
    console.error('pack.toml: could not read the minecraft/forge versions')
    process.exit(1)
  }
  return { name: field('name') ?? 'modpack', version: field('version') ?? '0.0.0', mc, forge }
}

export function readMetas(root) {
  return readdirSync(join(root, 'mods'))
    .filter(f => f.endsWith('.pw.toml'))
    .map(f => parseMeta(readFileSync(join(root, 'mods', f), 'utf8')))
}

/** CurseForge-sourced metafiles carry no URL. This is the endpoint the website's
 *  own Download button uses — not the API those four mods opted out of. */
const cfUrl = (m) => `https://www.curseforge.com/api/v1/mods/${m.projectId}/files/${m.fileId}/download`

/**
 * Fetch every mod into `cache` and verify it against the hash in its metafile.
 * Exits non-zero on any problem: a silently corrupt jar inside a 400 MB archive
 * is exactly the failure nobody finds until it is a friend's problem.
 */
export async function fetchAndVerify(metas, cache) {
  mkdirSync(cache, { recursive: true })
  const problems = []
  let fetched = 0, cached = 0

  for (const [i, m] of metas.entries()) {
    const dest = join(cache, m.filename)
    const label = `(${String(i + 1).padStart(2)}/${metas.length}) ${m.name}`

    let buf
    if (existsSync(dest)) {
      buf = readFileSync(dest)
      cached++
    } else {
      const url = m.url ?? cfUrl(m)
      if (!m.url && (!m.projectId || !m.fileId)) {
        problems.push(`${m.name}: no download url and no curseforge ids`); continue
      }
      try {
        const r = await fetch(url, { headers: { 'User-Agent': 'minecraft-100day-bot' }, redirect: 'follow' })
        if (!r.ok) { problems.push(`${m.name}: HTTP ${r.status} from ${url}`); console.log(`${label} — HTTP ${r.status}`); continue }
        buf = Buffer.from(await r.arrayBuffer())
        writeFileSync(dest, buf)
        fetched++
      } catch (e) {
        problems.push(`${m.name}: ${e.message}`); console.log(`${label} — ${e.message}`); continue
      }
    }

    if (m.hash) {
      const got = digest(buf, m.hashFormat)
      if (got !== m.hash) {
        problems.push(`${m.name}: ${m.hashFormat} mismatch\n      expected ${m.hash}\n      got      ${got}`)
        console.log(`${label} — HASH MISMATCH`)
        continue
      }
    } else {
      problems.push(`${m.name}: metafile records no hash — cannot verify`)
    }
    console.log(`${label} — ok (${(buf.length / 1048576).toFixed(1)} MB)`)
  }

  if (problems.length) {
    console.error(`\n${problems.length} problem(s):\n`)
    for (const p of problems) console.error(`  ✗ ${p}`)
    console.error('\nRefusing to build an artifact that is missing or corrupt.')
    process.exit(1)
  }
  console.log(`\nall ${metas.length} jars verified — ${fetched} downloaded, ${cached} from cache`)
}

/**
 * Zip a staged directory with .NET, NOT Compress-Archive.
 *
 * Compress-Archive writes entry names with backslashes, which the ZIP spec
 * forbids (4.4.17.1: the path separator MUST be '/'). Java's ZipInputStream
 * then reads `mods\create.jar` as a FILE called "mods\create.jar" at the
 * archive root, and every launcher sees an instance with no mods folder.
 */
export function zipDir(stage, out) {
  const ps = `
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$stage = '${stage.replace(/'/g, "''")}'
$out   = '${out.replace(/'/g, "''")}'
if (Test-Path $out) { Remove-Item $out -Force }
$zip = [System.IO.Compression.ZipFile]::Open($out, 'Create')
try {
  Get-ChildItem -Path $stage -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($stage.Length + 1).Replace('\\', '/')
    [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $rel, 'Optimal')
  }
} finally { $zip.Dispose() }
`
  return ps
}

/**
 * A version stamp written into every artifact.
 *
 * Distribution Spec §12: "Client Pack Version = Server Pack Version", and §40
 * wants a mismatch to be obvious rather than a mystery. A file both artifacts
 * carry makes the check a `cat` rather than an investigation.
 */
export function versionStamp(pack, side) {
  return [
    `${pack.name}`,
    `version=${pack.version}`,
    `side=${side}`,
    `minecraft=${pack.mc}`,
    `forge=${pack.forge}`,
    '',
    'Distribution Spec §12: the client pack and the server pack must carry the',
    'same version. If these two files disagree, the mismatch is the problem —',
    'do not debug anything else first.',
    '',
  ].join('\n')
}
