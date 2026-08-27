# -*- coding: utf-8 -*-
"""Generate the Industrial Civilization connected-texture sheets for Fusion.

Format taken from Fusion's own json_schemas/fusion-texture-metadata.json and
SimpleLayoutHandler.java (`super(4, 4, 4)` -> a 4x4 tile grid), NOT from memory.

Tile index in the `simple` layout is a 4-bit mask of which SIDES CONNECT:
    bit 0 = top, bit 1 = right, bit 2 = bottom, bit 3 = left
and the handler maps that to a (x, y) tile. We do not need to reproduce its
mapping: we draw, for every one of the 16 tiles, the frame edges on the sides
that are NOT connected. Reading the handler's getTilePos, tile (x, y) is
reached for a specific connection set, so we build the sheet by asking the same
question per tile.
"""
import os, json
from PIL import Image, ImageDraw

OUT = 'D:/Github/Minecraft 100Day/resourcepacks/industrial-civilization-connected-textures'
T = 16          # pixels per tile
GRID = 4        # simple layout is 4x4

# Mapping lifted verbatim from SimpleLayoutHandler.getTilePos: connection set -> tile.
# Keys are (left, top, right, bottom).
TILES = {
    # (left, top, right, bottom) -> (tileX, tileY), transcribed from
    # SimpleLayoutHandler.getTilePos. Five entries of a first, guessed table
    # were wrong; wrong tiles render with no error at all, so this was read.
    (0, 0, 0, 0): (0, 0),   # none
    (1, 0, 0, 0): (3, 0),   # left
    (0, 1, 0, 0): (3, 1),   # top
    (0, 0, 1, 0): (2, 1),   # right
    (0, 0, 0, 1): (2, 0),   # bottom
    (1, 0, 1, 0): (0, 1),   # left+right
    (0, 1, 0, 1): (1, 1),   # top+bottom
    (1, 1, 0, 0): (3, 3),   # left+top
    (0, 1, 1, 0): (2, 3),   # top+right
    (0, 0, 1, 1): (2, 2),   # right+bottom
    (1, 0, 0, 1): (3, 2),   # left+bottom
    (0, 1, 1, 1): (0, 2),   # all but left
    (1, 0, 1, 1): (1, 2),   # all but top
    (1, 1, 0, 1): (1, 3),   # all but right
    (1, 1, 1, 0): (0, 3),   # all but bottom
    (1, 1, 1, 1): (1, 0),   # all four
}


def sheet(base, frame, mullion=None, alpha_body=110):
    """One 4x4 CT sheet. `base` is the pane fill, `frame` the edge colour."""
    img = Image.new('RGBA', (T * GRID, T * GRID), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    for (l, t, r, b), (tx, ty) in TILES.items():
        ox, oy = tx * T, ty * T
        # pane body
        d.rectangle([ox, oy, ox + T - 1, oy + T - 1], fill=base + (alpha_body,))
        # a faint interior mullion so glass does not read as a flat sheet
        if mullion:
            d.line([ox + T // 2, oy, ox + T // 2, oy + T - 1], fill=mullion, width=1)
            d.line([ox, oy + T // 2, ox + T - 1, oy + T // 2], fill=mullion, width=1)
        # frame on every edge that does NOT connect
        if not t: d.line([ox, oy, ox + T - 1, oy], fill=frame, width=1)
        if not b: d.line([ox, oy + T - 1, ox + T - 1, oy + T - 1], fill=frame, width=1)
        if not l: d.line([ox, oy, ox, oy + T - 1], fill=frame, width=1)
        if not r: d.line([ox + T - 1, oy, ox + T - 1, oy + T - 1], fill=frame, width=1)
    return img


SPECS = [
    # name, base rgb, frame rgba, mullion rgba, body alpha
    ('factory_glass',        (150, 175, 180), (62, 66, 70, 255),   (110, 135, 140, 90),  105),
    ('control_room_window',  (140, 168, 186), (48, 54, 62, 255),   (100, 125, 145, 90),   95),
    ('station_glass',        (162, 172, 158), (74, 68, 54, 255),   (120, 128, 116, 90),  105),
    ('industrial_panel',     (108, 112, 116), (58, 60, 64, 255),   (128, 132, 136, 140), 255),
]

NS = 'ics_ct'
tex_dir = os.path.join(OUT, 'assets', NS, 'textures', 'block')
os.makedirs(tex_dir, exist_ok=True)

meta = {"fusion": {"type": "connecting", "layout": "simple", "render_type": "cutout"}}
meta_opaque = {"fusion": {"type": "connecting", "layout": "simple", "render_type": "opaque"}}

for name, base, frame, mullion, a in SPECS:
    img = sheet(base, frame, mullion, a)
    png = os.path.join(tex_dir, name + '.png')
    img.save(png)
    m = meta_opaque if name == 'industrial_panel' else meta
    with open(png + '.mcmeta', 'w', encoding='utf-8', newline='\n') as f:
        json.dump(m, f, indent=2)
        f.write('\n')
    print('  %-22s %dx%d  render_type=%s' % (name, img.width, img.height, m['fusion']['render_type']))

with open(os.path.join(OUT, 'pack.mcmeta'), 'w', encoding='utf-8', newline='\n') as f:
    json.dump({"pack": {
        "pack_format": 15,
        "description": "Industrial Civilization — connected textures for factory glass, control-room windows, station glass and industrial panels. Requires Fusion."
    }}, f, indent=2)
    f.write('\n')
print('  pack.mcmeta written')
