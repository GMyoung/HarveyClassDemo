"""Generate the transparent, low-weight LEGO-style atmosphere GIFs.

The presentation imports the generated files from src/assets/atmosphere.  The
art is intentionally procedural so the loops have clean alpha edges, predictable
composition, and no third-party sticker dependency.
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw


SIZE = 240
FRAME_COUNT = 28
OUTPUT = Path(__file__).resolve().parents[1] / "src" / "assets" / "atmosphere"

YELLOW = (255, 207, 0, 255)
RED = (226, 35, 26, 255)
BLUE = (0, 112, 192, 255)
GREEN = (0, 166, 81, 255)
PURPLE = (117, 65, 200, 255)
ORANGE = (247, 129, 32, 255)
CYAN = (58, 212, 255, 255)
WHITE = (248, 250, 255, 255)
DARK = (16, 20, 31, 255)
GRAY = (151, 160, 172, 255)


def rgba() -> Image.Image:
    return Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))


def shade(color: tuple[int, int, int, int], amount: float) -> tuple[int, int, int, int]:
    return tuple(max(0, min(255, int(c * amount))) for c in color[:3]) + (color[3],)


def paste_rotated(base: Image.Image, item: Image.Image, center: tuple[float, float], angle: float) -> None:
    turned = item.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
    base.alpha_composite(turned, (int(center[0] - turned.width / 2), int(center[1] - turned.height / 2)))


def brick(
    width: int,
    height: int,
    color: tuple[int, int, int, int],
    studs: int = 4,
    glow: bool = False,
) -> Image.Image:
    pad = 10
    img = Image.new("RGBA", (width + pad * 2, height + pad * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    x0, y0, x1, y1 = pad, pad + 8, pad + width, pad + height
    if glow:
        d.rounded_rectangle((x0 - 5, y0 - 5, x1 + 5, y1 + 5), radius=9, fill=color[:3] + (55,))
    d.rounded_rectangle((x0, y0, x1, y1), radius=6, fill=color, outline=shade(color, 0.62), width=3)
    d.line((x0 + 5, y0 + 5, x1 - 5, y0 + 5), fill=shade(color, 1.18), width=3)
    stud_w = max(8, min(16, (width - 10) // max(1, studs)))
    gap = (width - studs * stud_w) / (studs + 1)
    for index in range(studs):
        sx = x0 + gap + index * (stud_w + gap)
        sy = pad
        d.ellipse((sx, sy, sx + stud_w, sy + 10), fill=shade(color, 0.72))
        d.ellipse((sx, sy - 2, sx + stud_w, sy + 7), fill=shade(color, 1.08), outline=shade(color, 0.58), width=2)
    return img


def minifigure(body_color: tuple[int, int, int, int], scale: float = 1.0) -> Image.Image:
    w, h = int(92 * scale), int(142 * scale)
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    s = scale
    # Legs
    d.rounded_rectangle((22*s, 94*s, 43*s, 135*s), radius=4*s, fill=shade(body_color, .72))
    d.rounded_rectangle((49*s, 94*s, 70*s, 135*s), radius=4*s, fill=shade(body_color, .72))
    # Torso and arms
    d.polygon([(20*s, 50*s), (72*s, 50*s), (66*s, 99*s), (26*s, 99*s)], fill=body_color)
    d.line((20*s, 58*s, 8*s, 91*s), fill=body_color, width=max(4, int(11*s)))
    d.line((72*s, 58*s, 84*s, 91*s), fill=body_color, width=max(4, int(11*s)))
    d.ellipse((1*s, 85*s, 16*s, 101*s), fill=YELLOW)
    d.ellipse((76*s, 85*s, 91*s, 101*s), fill=YELLOW)
    # Head, stud, and face
    d.rounded_rectangle((28*s, 15*s, 64*s, 53*s), radius=9*s, fill=YELLOW, outline=shade(YELLOW, .65), width=max(1, int(2*s)))
    d.rounded_rectangle((37*s, 7*s, 55*s, 17*s), radius=4*s, fill=shade(YELLOW, 1.06))
    eye_r = max(1, int(2*s))
    for ex in (39*s, 53*s):
        d.ellipse((ex-eye_r, 30*s-eye_r, ex+eye_r, 30*s+eye_r), fill=DARK)
    d.arc((38*s, 33*s, 55*s, 44*s), 5, 175, fill=DARK, width=max(1, int(2*s)))
    return img


def shuriken(size: int = 74, color: tuple[int, int, int, int] = CYAN) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    c = size / 2
    points = []
    for i in range(16):
        angle = -math.pi / 2 + i * math.pi / 8
        radius = size * (0.46 if i % 4 == 0 else 0.20 if i % 2 == 0 else 0.30)
        points.append((c + math.cos(angle) * radius, c + math.sin(angle) * radius))
    d.polygon(points, fill=color, outline=WHITE)
    d.ellipse((c-8, c-8, c+8, c+8), fill=(0, 0, 0, 0), outline=WHITE, width=3)
    return img


def clapper(open_amount: float) -> Image.Image:
    img = Image.new("RGBA", (150, 130), (0, 0, 0, 0))
    body = brick(126, 74, DARK, studs=4)
    img.alpha_composite(body, (12, 47))
    d = ImageDraw.Draw(img)
    for y in (75, 96):
        d.line((30, y, 132, y), fill=WHITE, width=4)
    top = Image.new("RGBA", (142, 32), (0, 0, 0, 0))
    td = ImageDraw.Draw(top)
    td.rounded_rectangle((5, 9, 137, 26), radius=4, fill=WHITE, outline=DARK, width=3)
    for x in range(8, 132, 28):
        td.polygon([(x, 10), (x+13, 10), (x+2, 26), (x-10, 26)], fill=DARK)
    paste_rotated(img, top, (76, 54), -26 * open_amount)
    return img


def pickaxe(angle: float) -> Image.Image:
    img = Image.new("RGBA", (120, 160), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.line((59, 48, 59, 145), fill=ORANGE, width=13)
    d.rounded_rectangle((51, 132, 67, 153), radius=5, fill=shade(ORANGE, .75))
    d.arc((15, 12, 105, 84), 190, 350, fill=WHITE, width=13)
    d.arc((15, 12, 105, 84), 190, 350, fill=PURPLE, width=8)
    return img.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)


def shield() -> Image.Image:
    img = Image.new("RGBA", (130, 150), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.polygon([(65, 7), (118, 27), (109, 95), (65, 140), (21, 95), (12, 27)], fill=BLUE, outline=WHITE)
    d.polygon([(65, 25), (99, 37), (94, 87), (65, 118), (36, 87), (31, 37)], fill=shade(BLUE, .62))
    lock = brick(50, 35, YELLOW, studs=2)
    img.alpha_composite(lock, (30, 57))
    return img


def check_mark(color: tuple[int, int, int, int] = WHITE) -> Image.Image:
    img = Image.new("RGBA", (70, 60), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.line((12, 30, 28, 46, 60, 12), fill=shade(color, .45), width=14, joint="curve")
    d.line((12, 27, 28, 43, 60, 9), fill=color, width=8, joint="curve")
    return img


def render(theme: str, frame: int) -> Image.Image:
    img = rgba()
    d = ImageDraw.Draw(img)
    p = frame / FRAME_COUNT
    wave = math.sin(p * math.tau)

    if theme == "minifigure_story":
        paste_rotated(img, minifigure(RED, 1.15), (120, 126 + wave * 7), wave * 2)
        for i, color in enumerate((YELLOW, BLUE, GREEN)):
            b = brick(42, 28, color, 2)
            paste_rotated(img, b, (38 + i * 83, 194 - abs(math.sin(p * math.tau + i)) * 16), wave * 4)

    elif theme == "star_wars_orbit":
        # A brick-built twin-wing starfighter orbiting a blue planet.
        d.ellipse((74, 74, 166, 166), fill=BLUE[:3] + (55,), outline=CYAN, width=4)
        craft = Image.new("RGBA", (150, 82), (0, 0, 0, 0))
        cd = ImageDraw.Draw(craft)
        cd.rectangle((7, 9, 34, 73), fill=shade(GRAY, .55), outline=WHITE, width=3)
        cd.rectangle((116, 9, 143, 73), fill=shade(GRAY, .55), outline=WHITE, width=3)
        cd.line((34, 41, 58, 41), fill=GRAY, width=7)
        cd.line((92, 41, 116, 41), fill=GRAY, width=7)
        cd.ellipse((54, 20, 96, 62), fill=DARK, outline=WHITE, width=4)
        cd.ellipse((64, 30, 86, 52), fill=BLUE)
        angle = p * 360
        paste_rotated(img, craft, (120 + math.cos(p*math.tau)*28, 120 + math.sin(p*math.tau)*15), angle)

    elif theme == "crisis_fall":
        for i in range(7):
            y = ((p * 250 + i * 43) % 290) - 35
            x = 26 + (i % 4) * 57 + math.sin(p*math.tau + i) * 8
            b = brick(48, 27, RED if i % 2 else ORANGE, 2)
            paste_rotated(img, b, (x, y), (p*190 + i*21) % 360)
        d.line((35, 202, 205, 202), fill=RED[:3] + (130,), width=5)

    elif theme == "ninjago_spin":
        for ring, alpha in ((85, 60), (64, 95), (44, 135)):
            box = (120-ring, 120-ring/2, 120+ring, 120+ring/2)
            d.arc(box, int(p*360), int(p*360)+230, fill=CYAN[:3] + (alpha,), width=6)
        paste_rotated(img, minifigure(GREEN, .9), (120, 142 + wave*4), -wave*8)
        paste_rotated(img, shuriken(), (168 + math.cos(p*math.tau)*18, 62 + math.sin(p*math.tau)*10), p*720)

    elif theme == "movie_clapper":
        item = clapper((wave + 1) / 2)
        img.alpha_composite(item, (45, 48 + int(wave*3)))
        for i in range(4):
            a = p*math.tau + i*math.pi/2
            d.ellipse((116+math.cos(a)*92-4, 116+math.sin(a)*70-4, 124+math.cos(a)*92, 124+math.sin(a)*70), fill=YELLOW)

    elif theme == "fortnite_build":
        for row in range(3):
            for col in range(3-row):
                b = brick(48, 27, PURPLE if (row+col)%2 else BLUE, 2)
                img.alpha_composite(b, (112 + col*38 - row*8, 156-row*34))
        axe = pickaxe(-28 - 22 * max(0, wave))
        img.alpha_composite(axe, (17, 35))
        if wave > .55:
            for i in range(5):
                d.line((115, 112, 90+math.cos(i*1.25)*34, 112+math.sin(i*1.25)*34), fill=YELLOW, width=4)

    elif theme == "media_jobs":
        colors = (RED, YELLOW, BLUE, GREEN)
        for i, color in enumerate(colors):
            a = p*math.tau + i*math.pi/2
            scale = .72 + .12 * (math.sin(a)+1)
            b = brick(int(58*scale), int(38*scale), color, 2)
            paste_rotated(img, b, (120+math.cos(a)*70, 120+math.sin(a)*54), -math.degrees(a)/4)
        core = brick(78, 46, PURPLE, 3, True)
        img.alpha_composite(core, (71, 89))

    elif theme == "ecosystem_loop":
        for i, color in enumerate((YELLOW, RED, BLUE, GREEN, PURPLE, ORANGE)):
            a = p*math.tau + i*math.tau/6
            b = brick(42, 25, color, 2)
            paste_rotated(img, b, (120+math.cos(a)*82, 120+math.sin(a)*64), -math.degrees(a)+90)
        d.arc((65, 65, 175, 175), int(p*360), int(p*360)+255, fill=WHITE[:3]+(135,), width=4)

    elif theme == "paths_forward":
        origin = brick(58, 34, WHITE, 2)
        img.alpha_composite(origin, (90, 165))
        endpoints = ((46, 52, RED), (120, 30, YELLOW), (194, 52, GREEN))
        progress = (p * 1.8) % 1
        for x, y, color in endpoints:
            d.line((120, 170, x, y+30), fill=color[:3]+(100,), width=8)
            mx, my = 120+(x-120)*progress, 170+(y+30-170)*progress
            b = brick(40, 24, color, 2)
            paste_rotated(img, b, (mx, my), wave*4)

    elif theme == "vrio_shield":
        pulse = 1 + .05 * wave
        sh = shield().resize((int(130*pulse), int(150*pulse)), Image.Resampling.LANCZOS)
        img.alpha_composite(sh, (120-sh.width//2, 120-sh.height//2))
        for i in range(4):
            a = p*math.tau + i*math.pi/2
            d.ellipse((116+math.cos(a)*92, 116+math.sin(a)*92, 124+math.cos(a)*92, 124+math.sin(a)*92), fill=CYAN)

    elif theme == "related_loop":
        left = brick(70, 42, BLUE, 3)
        right = brick(70, 42, YELLOW, 3)
        img.alpha_composite(left, (20, 96))
        img.alpha_composite(right, (150, 96))
        d.arc((52, 43, 188, 178), 200, 340, fill=GREEN, width=8)
        d.arc((52, 62, 188, 197), 20, 160, fill=GREEN, width=8)
        a = p*math.tau
        dot_x = 120 + math.cos(a)*68
        dot_y = 120 + math.sin(a)*67
        d.ellipse((dot_x-7, dot_y-7, dot_x+7, dot_y+7), fill=WHITE)

    elif theme == "recommendation_compass":
        d.ellipse((37, 37, 203, 203), outline=WHITE[:3]+(150,), width=7)
        d.ellipse((58, 58, 182, 182), outline=YELLOW[:3]+(120,), width=3)
        angle = -55 + wave*5
        a = math.radians(angle)
        tip = (120+math.cos(a)*67, 120+math.sin(a)*67)
        d.polygon([(tip[0], tip[1]), (107, 127), (130, 136)], fill=RED, outline=WHITE)
        core = brick(54, 32, YELLOW, 2, True)
        img.alpha_composite(core, (93, 103))

    elif theme == "last_brick_orbit":
        core = brick(92, 53, YELLOW, 4, True)
        img.alpha_composite(core, (64, 90))
        for i, color in enumerate((RED, BLUE, GREEN, PURPLE)):
            a = p*math.tau + i*math.pi/2
            b = brick(39, 23, color, 2)
            paste_rotated(img, b, (120+math.cos(a)*91, 120+math.sin(a)*69), -math.degrees(a))

    elif theme == "brick_test":
        colors = (RED, YELLOW, GREEN)
        active = int((p*3) % 3)
        for i, color in enumerate(colors):
            y = 38+i*63
            b = brick(92, 42, color, 4, glow=i <= active)
            img.alpha_composite(b, (30, y))
            if i <= active:
                mark = check_mark()
                img.alpha_composite(mark, (145, y+2))

    elif theme == "audience_build":
        stack = int((p*4) % 4) + 1
        for i in range(stack):
            color = (YELLOW, RED, BLUE, GREEN)[i]
            b = brick(92-i*10, 34, color, max(2, 4-i))
            img.alpha_composite(b, (74+i*5, 171-i*39))
        for i in range(8):
            a = i*math.pi/4 + p*math.tau
            radius = 78 + wave*7
            x, y = 120+math.cos(a)*radius, 73+math.sin(a)*radius*.55
            d.ellipse((x-4, y-4, x+4, y+4), fill=WHITE if i%2 else YELLOW)

    elif theme == "story_theater":
        d.polygon([(12, 15), (93, 15), (68, 226), (12, 226)], fill=YELLOW[:3]+(28,))
        d.polygon([(228, 15), (147, 15), (172, 226), (228, 226)], fill=CYAN[:3]+(28,))
        for i in range(18):
            y = ((p*170 + i*29) % 235) - 10
            x = 15 + ((i*47) % 210)
            color = (YELLOW, RED, BLUE, GREEN, PURPLE)[i % 5]
            d.rounded_rectangle((x, y, x+9, y+14), radius=2, fill=color)
        for x, color in ((78, RED), (120, BLUE), (162, GREEN)):
            fig = minifigure(color, .48)
            img.alpha_composite(fig, (x-22, 148+int(wave*3)))

    return img


def to_gif_frame(frame: Image.Image) -> Image.Image:
    alpha = frame.getchannel("A")
    palette = frame.convert("RGB").quantize(colors=255, method=Image.Quantize.MEDIANCUT)
    palette_data = palette.getpalette()
    if palette_data is None:
        palette_data = [0] * 768
    palette_data[255 * 3:255 * 3 + 3] = [0, 255, 0]
    palette.putpalette(palette_data)
    transparent = alpha.point(lambda value: 255 if value < 18 else 0)
    palette.paste(255, mask=transparent)
    palette.info["transparency"] = 255
    return palette


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    themes = (
        "minifigure_story",
        "star_wars_orbit",
        "crisis_fall",
        "ninjago_spin",
        "movie_clapper",
        "fortnite_build",
        "media_jobs",
        "ecosystem_loop",
        "paths_forward",
        "vrio_shield",
        "related_loop",
        "recommendation_compass",
        "last_brick_orbit",
        "brick_test",
        "audience_build",
        "story_theater",
    )
    for theme in themes:
        frames = [to_gif_frame(render(theme, frame)) for frame in range(FRAME_COUNT)]
        frames[0].save(
            OUTPUT / f"{theme}.gif",
            save_all=True,
            append_images=frames[1:],
            duration=70,
            loop=0,
            disposal=2,
            transparency=255,
            optimize=False,
        )
        print(f"generated {theme}.gif")


if __name__ == "__main__":
    main()
