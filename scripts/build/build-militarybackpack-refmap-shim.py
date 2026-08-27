# -*- coding: utf-8 -*-
"""Build a shim jar that supplies the refMap Sophisticated Tactical Backpacks
asks for but does not ship under that name.

THE BUG THIS WORKS AROUND (#84)

  militarybackpack.mixins.json declares:   "refmap": "militarybackpack.refmap.json"
  the jar actually contains:               militarybackpack.mixins.refmap.json

Mixin resolves a refMap as a plain classpath resource by the name in the config.
It finds nothing, cannot translate the named method `resolve` into the SRG name
a shipped game exposes (`m_173464_`), fails a required injection, and kills the
client during model baking.

THE SHIM

  A jar containing that same mapping under the name the config asks for. Mod
  jars are on the classloader path, so mixin should find ours. Their jar is not
  touched, so nothing about its licence or its hash changes.

  There is no code here. `lowcodefml` is Forge's loader for jars that carry
  resources and no classes, which is exactly what this is.

UNVERIFIED

  Whether mixin's resource lookup reaches a sibling mod jar at the moment configs
  are read -- early, before mod loading finishes -- is the part that has not been
  tested. If the crash is unchanged, that is the answer, and the shim costs
  nothing to remove.
"""
import io, json, os, zipfile

ROOT = 'D:/Github/Minecraft 100Day'
SRC = os.path.join(ROOT, 'build', '.jar-cache', 'militarybackpack-1.0.0-all.jar')
# Versioned against THEIR release, not ours: this is a hotfix for their 1.0.0,
# and the name should say so at a glance in a mods/ listing.
SHIM_VERSION = '1.0.1-pre-release-hotfix'
# Into mods/, not build/: it belongs to the pack now, and being in the packwiz
# index is what carries it into the friend archive (#86).
OUT = os.path.join(ROOT, 'mods', 'militarybackpack-refmap-shim-%s.jar' % SHIM_VERSION)

WRONG = 'militarybackpack.mixins.refmap.json'   # what their jar contains
WANTED = 'militarybackpack.refmap.json'          # what their config asks for

if not os.path.exists(SRC):
    raise SystemExit('%s not found. Run a build that fetches jars first.' % SRC)

with zipfile.ZipFile(SRC) as z:
    names = z.namelist()
    if WANTED in names:
        raise SystemExit('%s already contains %s -- the bug is fixed upstream, '
                         'drop this shim.' % (os.path.basename(SRC), WANTED))
    if WRONG not in names:
        raise SystemExit('%s does not contain %s -- the jar changed, re-read #84 '
                         'before trusting this script.' % (os.path.basename(SRC), WRONG))
    refmap_bytes = z.read(WRONG)

# Parse it, so a malformed refMap fails here rather than in the game.
refmap = json.loads(refmap_bytes.decode('utf-8'))
mappings = refmap.get('mappings', {})
target = mappings.get('com/vomiter/militarybackpack/mixin/BackpackOverrideMixin', {})
if 'resolve' not in target:
    raise SystemExit('the refMap has no `resolve` mapping -- it would not fix the crash')
print('  refMap read: resolve -> %s' % target['resolve'].split(';')[1].split('(')[0])

# TOML multi-line strings also use ''' , which would close this Python literal.
# Single-line description, deliberately.
MODS_TOML = '\n'.join([
    'modLoader="lowcodefml"',
    'loaderVersion="[47,)"',
    'license="MIT"',
    'issueTrackerURL="https://github.com/xenodeve/minecraft-100day/issues/84"',
    '',
    '[[mods]]',
    'modId="militarybackpack_refmap_shim"',
    'version="%s"' % SHIM_VERSION,
    'displayName="Tactical Backpacks refMap shim"',
    'description="Supplies militarybackpack.refmap.json, which Sophisticated Tactical '
    'Backpacks asks for in its mixin config but ships as militarybackpack.mixins.refmap.json. '
    'No code, no assets. Delete it the moment that mod fixes its own packaging."',
    '',
])

PACK_MCMETA = json.dumps({
    "pack": {
        "description": "Tactical Backpacks refMap shim %s" % SHIM_VERSION,
        "pack_format": 15,
    }
}, indent=2) + '\n'

if os.path.exists(OUT):
    os.remove(OUT)

with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED) as z:
    z.writestr(WANTED, refmap_bytes)
    z.writestr('META-INF/mods.toml', MODS_TOML)
    z.writestr('pack.mcmeta', PACK_MCMETA)

# Read it back rather than trusting the writes.
with zipfile.ZipFile(OUT) as z:
    got = z.namelist()
    missing = [n for n in (WANTED, 'META-INF/mods.toml', 'pack.mcmeta') if n not in got]
    if missing:
        raise SystemExit('shim is malformed, missing: %s' % ', '.join(missing))
    if z.read(WANTED) != refmap_bytes:
        raise SystemExit('the refMap in the shim does not match the source')

print('\n  OK  mods/%s  (%d bytes)' % (os.path.basename(OUT), os.path.getsize(OUT)))
print('      Confirmed working on a client, 2026-08-27. Run packwiz refresh after building.')
