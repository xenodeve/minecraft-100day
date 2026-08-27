# -*- coding: utf-8 -*-
"""Placeholder 16x16 item textures for the re-themed Player Microchip items.

#35 renamed these three items and put them on the Industrial Electronics chain,
then parked on "needs an artist" -- which left finished mechanics waiting on art.
These are deliberately placeholder: readable silhouettes in the pack's palette,
good enough that the recipes, Curios slot and UI can be exercised. Replace them
with real art without touching anything else.

Filenames are NOT guessed. They come from the mod's own jar:

    assets/player_tracking_chip/textures/item/trackingchip.png
    assets/player_tracking_chip/textures/item/trackertexture.png
    assets/player_tracking_chip/textures/item/scalpeltexture.png

kubejs/assets/ is an always-on resource pack, so a file at the same path wins.
That is the same mechanism the existing en_us.json rename already uses.
"""
import os
from PIL import Image, ImageDraw

OUT = 'D:/Github/Minecraft 100Day/kubejs/assets/player_tracking_chip/textures/item'
os.makedirs(OUT, exist_ok=True)

# Pack palette: dark industrial bodies, brass accents, a green status LED.
BODY   = (58, 62, 66, 255)
BODY_HI= (86, 92, 98, 255)
BRASS  = (168, 132, 62, 255)
LED    = (96, 220, 118, 255)
LED_DIM= (52, 120, 66, 255)
SCREEN = (34, 48, 44, 255)
STRAP  = (44, 46, 40, 255)
EDGE   = (28, 30, 32, 255)


def new():
    return Image.new('RGBA', (16, 16), (0, 0, 0, 0))


def beacon():
    """Tactical Position Beacon -- a puck that CLIPS to a plate carrier (§20)."""
    img = new(); d = ImageDraw.Draw(img)
    d.rectangle([4, 3, 11, 12], fill=BODY, outline=EDGE)      # body
    d.rectangle([5, 4, 10, 6], fill=BODY_HI)                  # bevel
    d.rectangle([7, 8, 8, 9], fill=LED)                       # status LED
    d.point((7, 10), fill=LED_DIM)
    d.rectangle([3, 5, 3, 10], fill=BRASS)                    # the clip
    d.rectangle([2, 6, 2, 9], fill=BRASS)
    return img


def tracker():
    """Personnel Tracking Device -- handheld, screen, stub antenna."""
    img = new(); d = ImageDraw.Draw(img)
    d.rectangle([4, 2, 11, 14], fill=BODY, outline=EDGE)      # handset
    d.rectangle([5, 4, 10, 9], fill=SCREEN)                   # screen
    d.point((7, 6), fill=LED)                                 # a contact blip
    d.point((9, 8), fill=LED_DIM)
    d.rectangle([5, 11, 6, 12], fill=BRASS)                   # keys
    d.rectangle([9, 11, 10, 12], fill=BRASS)
    d.rectangle([10, 0, 10, 2], fill=BRASS)                   # antenna
    return img


def programmer():
    """Beacon Programmer -- a probe tool, NOT the surgical scalpel it replaces."""
    img = new(); d = ImageDraw.Draw(img)
    d.rectangle([3, 10, 8, 13], fill=BODY, outline=EDGE)      # grip
    d.rectangle([4, 11, 5, 12], fill=BRASS)                   # grip band
    d.line([8, 10, 13, 4], fill=BODY_HI, width=2)             # shaft
    d.line([12, 5, 14, 3], fill=BRASS, width=1)               # probe tip
    d.point((13, 3), fill=LED)                                # contact light
    return img


for name, fn in [('trackingchip', beacon),
                 ('trackertexture', tracker),
                 ('scalpeltexture', programmer)]:
    p = os.path.join(OUT, name + '.png')
    fn().save(p)
    print('  %-18s 16x16  %s' % (name, p))
