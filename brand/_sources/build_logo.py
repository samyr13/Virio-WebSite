"""Virio — génère le système de logo en SVG (symbole, logotypes, icônes).

Le mot « Virio » est vectorisé depuis Inter Black : les SVG ne dépendent d'aucune police installée.
Usage :  python build_logo.py      (écrit dans ../logo et ../icones)
"""

import site
import sys
from pathlib import Path

sys.path.append(site.getusersitepackages())
sys.stdout.reconfigure(encoding="utf-8")

from fontTools.pens.boundsPen import BoundsPen  # noqa: E402
from fontTools.pens.svgPathPen import SVGPathPen  # noqa: E402
from fontTools.pens.transformPen import TransformPen  # noqa: E402
from fontTools.ttLib import TTFont  # noqa: E402

HERE = Path(__file__).resolve().parent
BRAND = HERE.parent
LOGO = BRAND / "logo"
ICONS = BRAND / "icones"

# --- couleurs (mêmes valeurs que css/style.css du site) ---------------------------------------
INK = "#07090d"
TEXT = "#f2f4f8"
SAFE = "#2bc97a"  # vert Virio, sur fond sombre
SAFE_STRONG = "#12965a"  # vert Virio, sur fond clair (contraste suffisant sur blanc)
WHITE = "#ffffff"

# --- le symbole : bouclier + « pupille » (la capsule du lien du SMS devenue marque) -------------
SHIELD = (
    "M100 10 L182 40 C186 41.5 188 45 188 49 V112 C188 166 152 204 100 228 "
    "C48 204 12 166 12 112 V49 C12 45 14 41.5 18 40 Z"
)
PUPIL = '<rect x="82" y="66" width="36" height="104" rx="18" fill="{c}"/>'
MARK_VB = (4, 2, 192, 234)  # boîte visible du bouclier tracé (trait de 16)


def mark_body(stroke, pupil=None, tint=True, solid=None):
    """Contenu SVG du symbole dans son repère 0..200 × 0..240."""
    pupil = pupil or stroke
    if solid:  # version pleine pour les très petites tailles
        return (
            f'<path d="{SHIELD}" fill="{solid}" stroke="{solid}" stroke-width="16" stroke-linejoin="round"/>'
            + PUPIL.format(c=pupil)
        )
    fill = f' fill="{stroke}" fill-opacity="0.14"' if tint else ' fill="none"'
    return (
        f'<path d="{SHIELD}"{fill} stroke="{stroke}" stroke-width="16" stroke-linejoin="round"/>'
        + PUPIL.format(c=pupil)
    )


def nested_mark(x, y, h, **kw):
    w = h * MARK_VB[2] / MARK_VB[3]
    vb = " ".join(str(v) for v in MARK_VB)
    return f'<svg x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" viewBox="{vb}">{mark_body(**kw)}</svg>', w


# --- le logotype « Virio » -------------------------------------------------------------------------
font = TTFont(HERE / "fonts" / "Inter-900.ttf")
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
UPM = font["head"].unitsPerEm
CAP = font["OS/2"].sCapHeight
TRACK = -0.03 * UPM  # même resserrement que les titres du site


def wordmark(text="Virio"):
    """Chemin SVG du mot (ligne de base à y=0, en unités de police) + sa largeur et sa boîte."""
    x = 0.0
    d = []
    bp = BoundsPen(glyphs)
    for i, ch in enumerate(text):
        name = cmap[ord(ch)]
        pen = SVGPathPen(glyphs)
        glyphs[name].draw(TransformPen(pen, (1, 0, 0, -1, x, 0)))
        d.append(pen.getCommands())
        glyphs[name].draw(TransformPen(bp, (1, 0, 0, -1, x, 0)))
        x += glyphs[name].width + (TRACK if i < len(text) - 1 else 0)
    x0, y0, x1, y1 = bp.bounds
    return " ".join(d), (x0, y0, x1, y1)


WORD, WB = wordmark()


def svg(w, h, body, title, display_h=None):
    """display_h : hauteur d'affichage par défaut en px (le dessin reste vectoriel)."""
    dh = display_h or h
    dw = w * dh / h
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.2f} {h:.2f}" width="{dw:.0f}" height="{dh:.0f}" role="img">'
        f"<title>{title}</title>{body}</svg>\n"
    )


def horizontal(mark_kw, text_color, title):
    """Symbole à gauche, centré sur la hauteur des capitales ; mot à droite."""
    hm = CAP * 1.72
    gap = CAP * 0.36
    m, wm = nested_mark(0, 0, hm, **mark_kw)
    x0, y0, x1, y1 = WB
    # ligne de base placée pour que le centre des capitales tombe au centre du symbole
    base = hm / 2 + CAP / 2
    tx = wm + gap - x0
    word = f'<path transform="translate({tx:.2f} {base:.2f})" d="{WORD}" fill="{text_color}"/>'
    return svg(wm + gap + (x1 - x0), hm, m + word, title, display_h=120)


def vertical(mark_kw, text_color, title):
    """Symbole au-dessus, mot centré dessous (la carte de fin du film)."""
    hm = CAP * 2.3
    gap = CAP * 0.5
    x0, y0, x1, y1 = WB
    ww = x1 - x0
    wm = hm * MARK_VB[2] / MARK_VB[3]
    total_w = max(ww, wm)
    m, _ = nested_mark((total_w - wm) / 2, 0, hm, **mark_kw)
    base = hm + gap + CAP
    word = f'<path transform="translate({(total_w - ww) / 2 - x0:.2f} {base:.2f})" d="{WORD}" fill="{text_color}"/>'
    # le « o » descend un peu sous la ligne de base : on garde son dépassement dans le cadre
    return svg(total_w, base + max(0.0, y1), m + word, title, display_h=320)


def mark_only(title, **kw):
    vb = " ".join(str(v) for v in MARK_VB)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="192" height="234" role="img">'
        f"<title>{title}</title>{mark_body(**kw)}</svg>\n"
    )


def app_icon(bg, title, size=1024, **kw):
    """Icône carrée à coins arrondis (profil réseaux, application)."""
    r = size * 0.225
    hm = size * 0.56
    wm = hm * MARK_VB[2] / MARK_VB[3]
    m, _ = nested_mark((size - wm) / 2, (size - hm) / 2, hm, **kw)
    body = f'<rect width="{size}" height="{size}" rx="{r:.1f}" fill="{bg}"/>' + m
    return svg(size, size, body, title)


def round_icon(bg, title, size=1024, **kw):
    """Icône pleine, sans arrondi : les réseaux la recadrent eux-mêmes en rond."""
    hm = size * 0.56
    wm = hm * MARK_VB[2] / MARK_VB[3]
    m, _ = nested_mark((size - wm) / 2, (size - hm) / 2, hm, **kw)
    return svg(size, size, f'<rect width="{size}" height="{size}" fill="{bg}"/>' + m, title)


def ext_icon(size, title):
    """Icône d'extension Chrome : symbole plein sur fond transparent.
    128 px : dessin de 96 px centré avec 16 px de marge (recommandation du Chrome Web Store)."""
    pad = size * 0.125 if size >= 48 else size * 0.04
    hm = size - 2 * pad
    wm = hm * MARK_VB[2] / MARK_VB[3]
    m, _ = nested_mark((size - wm) / 2, pad, hm, stroke=SAFE, pupil=INK, solid=SAFE)
    return svg(size, size, m, title)


def write(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    print("  ", path.relative_to(BRAND))


if __name__ == "__main__":
    print("Logo Virio →")
    dark = dict(stroke=SAFE)
    light = dict(stroke=SAFE_STRONG)
    write(LOGO / "virio-symbole.svg", mark_only("Virio — symbole", **dark))
    write(LOGO / "virio-symbole-fond-clair.svg", mark_only("Virio — symbole (fond clair)", **light))
    write(LOGO / "virio-symbole-blanc.svg", mark_only("Virio — symbole blanc", stroke=WHITE, tint=False))
    write(LOGO / "virio-symbole-noir.svg", mark_only("Virio — symbole noir", stroke=INK, tint=False))
    write(LOGO / "virio-symbole-plein.svg", mark_only("Virio — symbole plein", stroke=SAFE, pupil=INK, solid=SAFE))

    write(LOGO / "virio-logo-horizontal.svg", horizontal(dark, TEXT, "Virio — logo horizontal (fond sombre)"))
    write(LOGO / "virio-logo-horizontal-fond-clair.svg", horizontal(light, INK, "Virio — logo horizontal (fond clair)"))
    write(LOGO / "virio-logo-horizontal-blanc.svg", horizontal(dict(stroke=WHITE, tint=False), WHITE, "Virio — logo horizontal blanc"))
    write(LOGO / "virio-logo-horizontal-noir.svg", horizontal(dict(stroke=INK, tint=False), INK, "Virio — logo horizontal noir"))

    write(LOGO / "virio-logo-vertical.svg", vertical(dark, TEXT, "Virio — logo vertical (fond sombre)"))
    write(LOGO / "virio-logo-vertical-fond-clair.svg", vertical(light, INK, "Virio — logo vertical (fond clair)"))
    write(LOGO / "virio-logo-vertical-blanc.svg", vertical(dict(stroke=WHITE, tint=False), WHITE, "Virio — logo vertical blanc"))
    write(LOGO / "virio-logo-vertical-noir.svg", vertical(dict(stroke=INK, tint=False), INK, "Virio — logo vertical noir"))

    write(ICONS / "virio-icone-app.svg", app_icon(INK, "Virio — icône application", **dark))
    write(ICONS / "virio-icone-app-verte.svg", app_icon(SAFE, "Virio — icône application verte", stroke=INK, tint=False))
    write(ICONS / "virio-photo-profil.svg", round_icon(INK, "Virio — photo de profil", **dark))
    write(ICONS / "virio-photo-profil-verte.svg", round_icon(SAFE, "Virio — photo de profil verte", stroke=INK, tint=False))
    for s in (16, 32, 48, 128):
        write(ICONS / "extension-chrome" / f"icon-{s}.svg", ext_icon(s, f"Virio — icône d'extension {s} px"))
