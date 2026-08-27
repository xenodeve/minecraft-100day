# -*- coding: utf-8 -*-
"""Generate docs/mod-dependencies.md - every mod's DECLARED requirements, and
whether this pack satisfies them.

WHY THIS IS READ OUT OF THE JARS AND NOT WRITTEN BY HAND

  A dependency list is only useful if it is the one Forge will act on. That
  list lives in each jar's META-INF/mods.toml, so this reads it there. Nothing
  is recalled and nothing is inferred from a mod's name.

THREE THINGS THAT LOOK LIKE MISSING DEPENDENCIES AND ARE NOT

  1. `${file.jarVersion}` is a Forge placeholder, expanded from the jar
     MANIFEST at load time. Comparing the literal string against a version
     range reports seven false failures.
  2. Mods ship their dependencies INSIDE themselves. Create carries flywheel
     and ponder; Puzzles Lib carries puzzlesaccessapi. A scan that does not
     open nested jars reports those as absent.
  3. Nested jars live under META-INF/jarjar/ OR META-INF/jars/ - EntityCulling
     and Naturalist use the second. Scanning only the first loses midnightlib,
     transition and trender.

  All three were live false positives on the first run of this survey. They are
  written down because each one produced a confident, wrong "missing
  dependency" list that looked exactly like a real finding.

WHAT `[x]` MEANS

  The requirement is satisfied by something this pack ships. It does NOT mean
  the mod reaches a player's install: `side` decides that, and the "Never
  reaches a client install" section is exactly the gap that cost this pack its
  In Control spawn rules on every client.
"""
import io, json, os, re, sys, zipfile, tomllib
from collections import defaultdict

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
CACHE = os.path.join(ROOT, 'build', '.jar-cache')
MODS = os.path.join(ROOT, 'mods')
OUT = os.path.join(ROOT, 'docs', 'mod-dependencies.md')

# Forge supplies these itself; no jar declares them.
BUILTIN = {
    'minecraft': 'Minecraft itself',
    'forge': 'Forge itself',
    'java': 'the JVM',
    'neoforge': 'not applicable on Forge',
    'fml': 'Forge itself',
}
# Loaded by Forge as a shaded library rather than as a mod, so it never appears
# in the mod list even though many jars bundle a copy.
SHADED = {'mixinextras'}


def die(msg):
    sys.stderr.write(msg + '\n')
    raise SystemExit(1)


def metafiles():
    out = {}
    for f in sorted(os.listdir(MODS)):
        if not f.endswith('.pw.toml'):
            continue
        s = io.open(os.path.join(MODS, f), encoding='utf-8').read()

        def g(k):
            m = re.search(r'^%s\s*=\s*"(.*?)"' % k, s, re.M)
            return m.group(1) if m else None

        out[f[:-8]] = {'file': g('filename'), 'side': g('side') or 'both', 'name': g('name')}
    return out


def manifest_vals(z):
    out = {}
    if 'META-INF/MANIFEST.MF' not in z.namelist():
        return out
    txt = z.read('META-INF/MANIFEST.MF').decode('utf-8', 'replace')
    txt = txt.replace('\r\n', '\n').replace('\n ', '')      # unfold continuations
    for line in txt.split('\n'):
        if ':' in line:
            k, v = line.split(':', 1)
            out[k.strip()] = v.strip()
    return out


def subst(v, mf):
    if not isinstance(v, str):
        return v

    def rep(m):
        key = m.group(1)
        if key.startswith('file.'):
            attr = key[5:]
            for cand in (attr, attr[0].upper() + attr[1:]):
                if cand in mf:
                    return mf[cand]
            if attr == 'jarVersion':
                return mf.get('Implementation-Version', mf.get('Specification-Version', '0'))
        return m.group(0)

    return re.sub(r'\$\{([^}]+)\}', rep, v)


def read_toml(z):
    for cand in ('META-INF/mods.toml', 'META-INF/neoforge.mods.toml'):
        if cand in z.namelist():
            try:
                return tomllib.loads(z.read(cand).decode('utf-8-sig', 'replace')), None
            except Exception as e:
                return None, 'mods.toml is unparseable: %s' % e
    t = manifest_vals(z).get('FMLModType')
    if t:
        return None, 'FMLModType=%s - a library, registers no modId of its own' % t
    return None, 'no mods.toml'


def scan(z, sink, depth=0):
    """modIds from this jar and from every jar nested inside it."""
    data, err = read_toml(z)
    mf = manifest_vals(z)
    if data:
        for m in data.get('mods', []):
            if m.get('modId'):
                sink.append((m['modId'], subst(str(m.get('version', '?')), mf), depth > 0))
    if depth < 2:
        for n in z.namelist():
            if n.startswith('META-INF/') and n.endswith('.jar'):
                try:
                    with zipfile.ZipFile(io.BytesIO(z.read(n))) as inner:
                        scan(inner, sink, depth + 1)
                except Exception:
                    pass
    return data, err


def jarjar_claims(z):
    """What a mod DEMANDS of the library it bundles.

    Forge loads exactly one copy of a jar-in-jar library across the whole pack,
    so two mods bundling different versions is not two libraries - it is one
    library and one loser. The loser is silent: nothing in the log says a mod is
    running against a version older than the one it asked for.
    """
    if 'META-INF/jarjar/metadata.json' not in z.namelist():
        return []
    try:
        d = json.loads(z.read('META-INF/jarjar/metadata.json').decode('utf-8', 'replace'))
    except Exception:
        return []
    out = []
    for j in d.get('jars', []):
        v = j.get('version', {}) or {}
        out.append({'artifact': (j.get('identifier', {}) or {}).get('artifact'),
                    'range': v.get('range', ''),
                    'version': v.get('artifactVersion', '')})
    return out


# ---- maven version ranges -------------------------------------------------
def parse_range(r):
    if not r or r.strip() in ('', '*'):
        return None
    out = []
    for part in re.findall(r'[\[\(][^\]\)]*[\]\)]', r):
        lo_inc, hi_inc = part[0] == '[', part[-1] == ']'
        body = part[1:-1]
        lo, hi = body.split(',', 1) if ',' in body else (body, body)
        out.append((lo.strip() or None, lo_inc, hi.strip() or None, hi_inc))
    return out or [(r.strip(), True, None, False)]


def vkey(v):
    return [int(x) if x.isdigit() else x for x in re.split(r'[._\-+]', v) if x]


def vcmp(a, b):
    ka, kb = vkey(a), vkey(b)
    for x, y in zip(ka, kb):
        if type(x) is not type(y):
            x, y = str(x), str(y)
        if x != y:
            return -1 if x < y else 1
    return (len(ka) > len(kb)) - (len(ka) < len(kb))


def in_range(v, r):
    rs = parse_range(r)
    if rs is None:
        return True
    if '$' in v:
        return None                       # placeholder survived - unknown, not a failure
    for lo, lo_inc, hi, hi_inc in rs:
        ok = True
        if lo is not None:
            c = vcmp(v, lo)
            ok = ok and (c >= 0 if lo_inc else c > 0)
        if hi is not None:
            c = vcmp(v, hi)
            ok = ok and (c <= 0 if hi_inc else c < 0)
        if ok:
            return True
    return False


# ---- gather ---------------------------------------------------------------
meta = metafiles()
absent = [s for s, m in meta.items()
          if not (m['file'] and os.path.exists(os.path.join(CACHE, m['file'])))]
if absent:
    die('%d jar(s) are not in build/.jar-cache, so their requirements cannot be read:\n  %s\n\n'
        'Run a build that fetches jars first (e.g. node scripts/build/build-instance.mjs).\n'
        'Generating a requirements list from a partial cache would silently under-report, which\n'
        'is worse than not generating one.'
        % (len(absent), '\n  '.join(sorted(absent))))

roster = [(os.path.join(CACHE, m['file']), s, m['side'], m['name'])
          for s, m in sorted(meta.items())]
for fn in sorted(os.listdir(MODS)):
    if fn.endswith('.jar'):
        roster.append((os.path.join(MODS, fn), fn[:-4], 'both', 'built in this repo'))

records, provides = [], defaultdict(list)
bundled = defaultdict(list)          # artifact -> [{slug, range, version}]
for path, slug, side, name in roster:
    rec = {'slug': slug, 'side': side, 'name': name, 'file': os.path.basename(path),
           'mods': [], 'deps': [], 'loader': None, 'note': None}
    with zipfile.ZipFile(path) as z:
        sink = []
        data, err = scan(z, sink)
        rec['note'] = err
        for c in jarjar_claims(z):
            if c['artifact']:
                bundled[c['artifact']].append(dict(c, slug=slug))
        for mid, ver, nested in sink:
            rec['mods'].append({'modId': mid, 'version': ver, 'nested': nested})
            provides[mid].append({'slug': slug, 'version': ver, 'nested': nested, 'side': side})
        if data:
            rec['loader'] = data.get('modLoader')
            for _owner, lst in (data.get('dependencies', {}) or {}).items():
                for d in ([lst] if isinstance(lst, dict) else lst):
                    rec['deps'].append({'modId': d.get('modId'),
                                        'mandatory': bool(d.get('mandatory', False)),
                                        'range': d.get('versionRange', '') or '',
                                        'side': (d.get('side') or 'BOTH').upper()})
    records.append(rec)


def classify(dep):
    """-> (state, detail). state in ok | builtin | badver | unknown | absent"""
    mid = dep['modId']
    if mid in BUILTIN:
        return 'builtin', BUILTIN[mid]
    if mid in SHADED:
        return 'builtin', 'shaded into Forge; %d mods bundle a copy' % len(provides.get(mid, []))
    got = provides.get(mid)
    if not got:
        return 'absent', 'not in this pack'
    top = [g for g in got if not g['nested']] or got
    g = top[0]
    where = g['slug'] if not g['nested'] else '%s (bundled inside it)' % g['slug']
    ok = in_range(g['version'], dep['range'])
    if ok is None:
        return 'unknown', '%s `%s` - a Forge placeholder, not checkable outside the game' % (where, g['version'])
    if not ok:
        return 'badver', '%s `%s` is outside `%s`' % (where, g['version'], dep['range'])
    return 'ok', '%s `%s`' % (where, g['version'])


unsat, badver, unknown, optabsent = [], [], [], []
for r in records:
    for d in r['deps']:
        st, detail = classify(d)
        d['state'], d['detail'] = st, detail
        if st == 'absent':
            (unsat if d['mandatory'] else optabsent).append((r, d))
        elif st == 'badver':
            badver.append((r, d))
        elif st == 'unknown':
            unknown.append((r, d))

server_only = [r for r in records if r['side'] == 'server']
client_only = [r for r in records if r['side'] == 'client']
edges = sum(len(r['deps']) for r in records)

# Jar-in-jar libraries bundled at more than one version.
#
# DO NOT PREDICT THE WINNER HERE. Highest-version-wins is the obvious guess and
# it is wrong at least once in this pack: every mod bundles midnightlib, the
# highest is 1.9.2+1.20.1-forge, and the 2026-08-27 client boot loaded 1.4.2.
# Forge resolves this at load time from data these files do not fully carry, so
# what is derivable is only WHICH CHOICES WOULD BREAK WHICH MOD -- and that is
# what gets written. The actual pick is read out of the log, not from here.
contested, at_risk = {}, []
for art, claims in sorted(bundled.items()):
    if art in ('mixinextras-forge', 'mixinextras'):
        continue                     # Forge ships its own; every bundled copy is ignored
    versions = sorted({c['version'] for c in claims if c['version']}, key=vkey)
    if len(versions) < 2:
        continue
    losers = {}
    for v in versions:
        losers[v] = [c for c in claims if c['range'] and in_range(v, c['range']) is False]
    contested[art] = {'versions': versions, 'claims': claims, 'losers': losers}
    if any(losers.values()):
        at_risk.append(art)


def box(b):
    return '[x]' if b else '[ ]'


L = []
w = L.append
w('<!-- GENERATED FILE - do not edit by hand.')
w('     Run: python scripts/build/generate-mod-dependencies.py')
w("     Every line is read out of that mod's own META-INF/mods.toml. -->")
w('<!-- mod-count: %d -->' % len(meta))
w('<!-- dependency-edges: %d -->' % edges)
w('')
w('# Mod requirements · มอดแต่ละตัวต้องการอะไร')
w('')
w('**%d mods** and **%d declared dependencies** between them. Every line was read out of that'
  % (len(meta), edges))
w("mod's own `META-INF/mods.toml` - the same file Forge reads when it decides whether to boot.")
w('')
w('**%d มอด** และ **%d dependency** ที่ประกาศไว้ระหว่างกัน ทุกบรรทัดอ่านมาจาก `META-INF/mods.toml`'
  % (len(meta), edges))
w('ในตัว jar เอง ซึ่งเป็นไฟล์เดียวกับที่ Forge อ่านตอนตัดสินใจว่าจะ boot ให้หรือไม่')
w('')
w('## What the checkbox means · เครื่องหมายถูกแปลว่าอะไร')
w('')
w('`[x]` - the requirement is satisfied by something this pack ships.  ')
w('`[ ]` - it is not.')
w('')
w('**A ticked box does not promise the mod reaches a player.** `side` decides that, and the gap is')
w('real - see *Never reaches a client install* below.')
w('')
w('`[x]` คือแพ็คนี้มีของที่มันต้องการ · `[ ]` คือไม่มี')
w('')
w('**ติดถูกไม่ได้แปลว่ามอดจะไปถึงเครื่องผู้เล่น** เรื่องนั้น `side` เป็นตัวตัดสิน และช่องว่างตรงนี้มีจริง')
w('ดูหัวข้อ *Never reaches a client install* ด้านล่าง')
w('')
w('## Summary · สรุป')
w('')
w('| | Count |')
w('|---|---:|')
w('| Mods in the pack | %d |' % len(meta))
w('| Declared dependencies | %d |' % edges)
w('| **Mandatory and unsatisfied** | **%d** |' % len(unsat))
w('| Satisfied but outside the declared version range | %d |' % len(badver))
w('| Version unresolvable from the jar alone | %d |' % len(unknown))
w('| Optional integrations this pack does not have | %d |' % len(optabsent))
w('| Libraries bundled at conflicting versions | %d |' % len(contested))
w('| Bundled libraries where one choice would leave a mod short | %d |' % len(at_risk))
w('')
w('## Mandatory requirements this pack does not satisfy')
w('')
if not unsat:
    w('**None.** Every mandatory dependency of every mod resolves to something in the pack.')
    w('')
    w('**ไม่มี** dependency ที่บังคับของทุกมอด หาเจอในแพ็คครบทุกตัว')
else:
    for r, d in unsat:
        w('- [ ] **%s** needs `%s` `%s` - %s' % (r['slug'], d['modId'], d['range'] or '*', d['detail']))
w('')
if badver:
    w('## Present, but outside the version range the mod asked for')
    w('')
    for r, d in badver:
        w('- [ ] **%s** needs `%s` `%s` - %s' % (r['slug'], d['modId'], d['range'], d['detail']))
    w('')
if unknown:
    w('## Version could not be checked')
    w('')
    w('The provider states its version as a Forge placeholder, which only the running game expands.')
    w('Not a failure - an unknown.')
    w('')
    for r, d in unknown:
        w('- [ ] **%s** needs `%s` `%s` - %s' % (r['slug'], d['modId'], d['range'], d['detail']))
    w('')
w('## Never reaches a client install')
w('')
w('packwiz omits a `side = "server"` mod from every client artifact, and singleplayer runs an')
w('*integrated* server inside the client - so a mod marked this way is absent from the exact place')
w('a solo or LAN-hosting player needs it.')
w('')
w('packwiz ตัดมอดที่ `side = "server"` ออกจาก artifact ฝั่ง client ทุกแบบ และ singleplayer รัน')
w('integrated server อยู่ในตัว client เอง มอดที่ mark แบบนี้จึงหายไปจากที่ที่คนเล่นคนเดียวหรือคนเปิด LAN ต้องใช้พอดี')
w('')
for r in server_only:
    w('- [ ] **%s** (`%s`) - `side = "server"`' % (r['name'] or r['slug'], r['slug']))
w('')
w('`side = "client"` is the harmless direction: %d mods, none of which a dedicated server needs.'
  % len(client_only))
w('')
if contested:
    w('## Libraries bundled by more than one mod, at different versions')
    w('')
    w('Forge loads exactly one copy of a jar-in-jar library for the whole pack. Two mods bundling')
    w('different versions is therefore one library and one loser, and the loser is silent - nothing')
    w('in the log says a mod is running against a version older than the one it asked for.')
    w('')
    w('Forge โหลด library แบบ jar-in-jar แค่ชุดเดียวต่อทั้งแพ็ค ถ้าสองมอดฝังคนละเวอร์ชันมา ผลคือได้')
    w('library ชุดเดียวกับผู้แพ้หนึ่งราย และผู้แพ้จะเงียบ ไม่มีบรรทัดไหนใน log บอกว่ามอดกำลังรันกับ')
    w('เวอร์ชันที่เก่ากว่าที่มันขอไว้')
    w('')
    w('**Which copy Forge keeps is not derivable from these files** and is not guessed here - read')
    w('it out of a boot log. What *is* derivable is which choice would leave which mod short, so')
    w('that is what is listed.')
    w('')
    w('**ตัวไหนที่ Forge เก็บไว้ อ่านจากไฟล์พวกนี้ไม่ได้** และจะไม่เดาในนี้ ให้ไปอ่านจาก boot log')
    w('สิ่งที่อ่านออกได้คือ ถ้าเลือกเวอร์ชันไหน มอดตัวไหนจะขาด — เลยเขียนเฉพาะส่วนนั้น')
    w('')
    for art, info in sorted(contested.items()):
        w('**`%s`** - %d versions bundled: %s'
          % (art, len(info['versions']), ', '.join('`%s`' % v for v in info['versions'])))
        w('')
        for c in sorted(info['claims'], key=lambda x: x['slug']):
            w('- [x] **%s** bundles `%s`, declares `%s`' % (c['slug'], c['version'], c['range'] or '*'))
        w('')
        for v in info['versions']:
            if info['losers'][v]:
                w('- [ ] if Forge keeps `%s`, it is below the range declared by **%s**'
                  % (v, ', '.join(c['slug'] for c in info['losers'][v])))
        w('')
    if at_risk:
        w('A mod running against a library older than the range it declares produces **no boot')
        w('error** - Forge had to pick one copy and does not fail on the choice. It surfaces only as')
        w('a `NoSuchMethodError` at the moment the newer API is actually called, which may be never.')
        w('')
w('## Every mod, and what it asks for')
w('')
for r in sorted(records, key=lambda x: (x['name'] or x['slug']).lower()):
    ids = ', '.join('`%s` %s' % (m['modId'], m['version'])
                    for m in r['mods'] if not m['nested']) or '-'
    w('### %s' % (r['name'] or r['slug']))
    w('')
    w('%s · loader `%s` · `%s`' % (ids, r['loader'] or '-', r['file']))
    w('')
    # A markdown checkbox only renders inside a list item, so the mod own state
    # goes here rather than in the heading.
    w('- [x] in the pack')
    if r['side'] == 'server':
        w('- [ ] **on a client install** - `side = "server"` keeps it off every client artifact')
    elif r['side'] == 'client':
        w('- [x] on a client install')
        w('- [ ] on a dedicated server - `side = "client"`, and a server has no use for it')
    else:
        w('- [x] on a client install')
        w('- [x] on a dedicated server')
    w('')
    if r['note']:
        w('> %s' % r['note'])
        w('')
    req = [d for d in r['deps'] if d['mandatory']]
    opt = [d for d in r['deps'] if not d['mandatory']]
    if req:
        w('**Requires**')
        w('')
        for d in sorted(req, key=lambda x: x['modId'] or ''):
            w('- %s `%s` `%s` - %s'
              % (box(d['state'] != 'absent'), d['modId'], d['range'] or '*', d['detail']))
        w('')
    have = [d for d in opt if d['state'] != 'absent']
    if have:
        w('**Optional, and present**')
        w('')
        for d in sorted(have, key=lambda x: x['modId'] or ''):
            w('- [x] `%s` - %s' % (d['modId'], d['detail']))
        w('')
    gone = [d for d in opt if d['state'] == 'absent']
    if gone:
        w('**Optional, and absent** - the mod runs without these')
        w('')
        for d in sorted(gone, key=lambda x: x['modId'] or ''):
            w('- [ ] `%s`' % d['modId'])
        w('')
    if not r['deps']:
        w('Declares no dependencies beyond Forge and Minecraft.')
        w('')

io.open(OUT, 'w', encoding='utf-8', newline='\n').write('\n'.join(L) + '\n')
print('  docs/mod-dependencies.md written')
print('  %d mods · %d dependency edges' % (len(meta), edges))
print('  mandatory unsatisfied : %d' % len(unsat))
print('  outside version range : %d' % len(badver))
print('  unresolvable version  : %d' % len(unknown))
print('  optional absent       : %d' % len(optabsent))
print('  server-only (never on a client): %s' % ', '.join(r['slug'] for r in server_only))
