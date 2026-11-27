"""Prepare the supplied environment film for the cinematic landing.

Example: python3 scripts/prepare-hero-sequence.py ~/Downloads/Anime.mp4 \
    --activate-reviewed --replace-derived

The source film is never changed. Existing generated assets are replaced only
with --replace-derived, after all new derivatives have been prepared.
"""
import argparse
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("video", type=Path)
parser.add_argument("--activate-reviewed", action="store_true",
                    help="Activate after inspecting the complete source journey.")
parser.add_argument("--replace-derived", action="store_true",
                    help="Replace the generated journey folder; preserve the input.")
args = parser.parse_args()
if not args.video.is_file():
    parser.error("The input film does not exist.")
source = args.video.resolve()
destination = ROOT / "public/media/journey"
if destination in source.parents:
    parser.error("Keep the source outside the generated journey folder.")
if destination.exists() and not args.replace_derived:
    parser.error("Journey derivatives exist. Use --replace-derived to rebuild them.")
if not shutil.which("ffmpeg"):
    parser.error("FFmpeg is required.")

with tempfile.TemporaryDirectory(prefix="anime-journey-") as staging_dir:
    staging = Path(staging_dir)
    (staging / "frames").mkdir()

    def ffmpeg(*options):
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", *options], check=True)

    ffmpeg("-i", str(source), "-an", "-vf", "fps=24,scale=1280:-2",
           "-c:v", "libwebp", "-quality", "76", "-compression_level", "4",
           str(staging / "frames/frame_%04d.webp"))
    frames = sorted((staging / "frames").glob("*.webp"))
    if len(frames) < 2:
        raise RuntimeError("The source did not produce a usable journey.")
    for name, time in [("city", 0), ("sanctuary", min(6.5, (len(frames) - 1) / 24))]:
        ffmpeg("-ss", str(time), "-i", str(source), "-frames:v", "1",
               "-c:v", "libwebp", "-quality", "86", str(staging / f"{name}.webp"))
    ffmpeg("-i", str(source), "-an", "-c:v", "libx264", "-preset", "fast",
           "-crf", "24", "-movflags", "+faststart", "-pix_fmt", "yuv420p",
           str(staging / "anime-journey.mp4"))
    if destination.exists():
        shutil.rmtree(destination)
    shutil.copytree(staging, destination)
    config = {
        "ready": args.activate_reviewed,
        "source": f"User-supplied {source.name}",
        "poster": "/media/journey/city.webp",
        "staticPoster": "/media/journey/sanctuary.webp",
        "count": len(frames), "fps": 24,
        "prefix": "/media/journey/frames/frame_", "extension": "webp",
    }
    (ROOT / "src/data/hero-sequence.json").write_text(json.dumps(config, indent=2) + "\n")
    print(json.dumps({"frames": len(frames), "active": args.activate_reviewed,
                      "frameBytes": sum(p.stat().st_size for p in frames)}))
