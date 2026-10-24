"""Virio — export PNG avec Chrome sans interface.

    python render.py            → exporte tout (logos, icônes, réseaux, Chrome Web Store)
    python render.py reseaux    → seulement les fichiers dont le chemin contient « reseaux »
"""

import site
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.append(site.getusersitepackages())
sys.stdout.reconfigure(encoding="utf-8")

from PIL import Image  # noqa: E402

HERE = Path(__file__).resolve().parent
BRAND = HERE.parent
CHROME = next(
    p
    for p in (
        Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
        Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"),
    )
    if p.exists()
)


def shot(src: Path, out: Path, w: int, h: int, scale: float = 1, transparent: bool = False):
    out.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as profile:
        cmd = [
            str(CHROME),
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            "--no-first-run",
            f"--user-data-dir={profile}",
            f"--window-size={w},{h}",
            f"--force-device-scale-factor={scale}",
            "--virtual-time-budget=8000",
            "--run-all-compositor-stages-before-draw",
            f"--screenshot={out}",
        ]
        if transparent:
            cmd.append("--default-background-color=00000000")
        cmd.append(src.resolve().as_uri())
        subprocess.run(cmd, check=True, capture_output=True, timeout=120)
    got = Image.open(out).size
    want = (round(w * scale), round(h * scale))
    if got != want:  # Chrome arrondit parfois d'un pixel : on recadre au format exact
        Image.open(out).crop((0, 0, *want)).save(out)
    print(f"   {out.relative_to(BRAND)}  {want[0]}×{want[1]}")


def svg_png(svg: Path, out: Path, w: int, h: int, scale: float = 1, bg: str = "transparent"):
    """Rend un SVG en PNG à la taille demandée (fond transparent par défaut)."""
    html = (
        f'<!doctype html><html><body style="margin:0;background:{bg}">'
        f'<img src="{svg.resolve().as_uri()}" style="display:block;width:{w}px;height:{h}px"></body></html>'
    )
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, encoding="utf-8") as f:
        f.write(html)
        tmp = Path(f.name)
    try:
        shot(tmp, out, w, h, scale, transparent=(bg == "transparent"))
    finally:
        tmp.unlink(missing_ok=True)


def svg_size(svg: Path):
    import re

    m = re.search(r'viewBox="([\d.\s-]+)"', svg.read_text(encoding="utf-8"))
    _, _, vw, vh = (float(v) for v in m.group(1).split())
    return vw, vh


JOBS = []


def job(fn):
    JOBS.append(fn)
    return fn


@job
def logos():
    print("Logos →")
    for svg in sorted((BRAND / "logo").glob("*.svg")):
        vw, vh = svg_size(svg)
        h = 512 if "symbole" in svg.name else (300 if "horizontal" in svg.name else 700)
        w = round(vw * h / vh)
        svg_png(svg, BRAND / "logo" / "png" / f"{svg.stem}.png", w, h, scale=2)


@job
def icones():
    print("Icônes →")
    ic = BRAND / "icones"
    for name in ("virio-icone-app", "virio-icone-app-verte", "virio-photo-profil", "virio-photo-profil-verte"):
        svg_png(ic / f"{name}.svg", ic / "png" / f"{name}-1024.png", 1024, 1024)
    for name, size in (("virio-photo-profil", 400), ("virio-photo-profil-verte", 400), ("virio-icone-app", 512), ("virio-icone-app", 180)):
        svg_png(ic / f"{name}.svg", ic / "png" / f"{name}-{size}.png", size, size)
    for s in (16, 32, 48, 128):
        svg_png(ic / "extension-chrome" / f"icon-{s}.svg", ic / "extension-chrome" / f"icon-{s}.png", s, s)


def templates(folder: str, transparent: bool = False):
    """Chaque gabarit HTML porte sa taille dans son nom : nom-LARGEURxHAUTEUR.html."""
    import re

    for html in sorted((HERE / "gabarits" / folder).glob("*.html")):
        m = re.search(r"-(\d+)x(\d+)$", html.stem)
        if not m:
            continue
        w, h = int(m.group(1)), int(m.group(2))
        # coins arrondis cuits dans le PNG : fond transparent sauf pour l'aperçu social
        clear = transparent and "social" not in html.stem
        shot(html, BRAND / folder / f"{html.stem}.png", w, h, transparent=clear)


@job
def reseaux():
    print("Réseaux sociaux →")
    templates("reseaux")


@job
def chrome_web_store():
    print("Chrome Web Store →")
    templates("chrome-web-store")


@job
def github():
    print("GitHub →")
    templates("github", transparent=True)


if __name__ == "__main__":
    only = sys.argv[1] if len(sys.argv) > 1 else ""
    for fn in JOBS:
        if only in fn.__name__.replace("_", "-") or only in fn.__name__:
            fn()
