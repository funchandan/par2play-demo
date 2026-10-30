"""Recut the home membership film using only the repository's Par2Play media.

Run with Python 3 and FFmpeg. PING and TaylorMade are readable in the source
images/footage; no stock footage, invented logos, or brand overlays are added.
"""
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/media/membership'
# path, in point, duration, still, optional source crop
SHOTS = [
    ('public/media/testimonials/testimonial-1.mp4', 8, 2.2, False, None),
    ('public/media/fitting/fitting-ping-cart.webp', 0, 1.65, True, None),
    ('public/media/testimonials/testimonial-3.mp4', 4.2, 1.8, False, None),
    ('public/clips/facilities.mp4', 11.55, 2.0, False, 'crop=1000:562:920:490'),
    ('public/photos/club-rack.jpg', 0, 1.65, True, None),
    ('public/media/fitting/fitting-club-workshop.webp', 0, 1.5, True, None),
    ('public/media/testimonials/testimonial-4.mp4', 8.6, 2.0, False, None),
    ('public/media/events/events-hero.mp4', 6.7, 1.5, False, None),
]
TRANSITIONS = ['zoomin', 'hblur', 'smoothleft', 'zoomin', 'hblur', 'fade', 'smoothright']
FADE = .2


def run(args):
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *args], check=True, cwd=ROOT)


args = ['-filter_complex_threads', '1']
filters = []
for i, (path, start, duration, still, crop) in enumerate(SHOTS):
    if still:
        args += ['-loop', '1', '-framerate', '30']
    else:
        args += ['-ss', str(start)]
    args += ['-t', str(duration), '-i', path]
    steps = ([crop] if crop else []) + [
        'scale=1600:900:force_original_aspect_ratio=increase',
        'crop=1600:900',
        "zoompan=z='1+0.0012*on':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1280x720:fps=30",
        'setsar=1', 'format=yuv420p', 'settb=1/30', 'setpts=PTS-STARTPTS',
    ]
    filters.append(f'[{i}:v]' + ','.join(steps) + f'[shot{i}]')
last = 'shot0'
elapsed = SHOTS[0][2]
for i in range(1, len(SHOTS)):
    label = f'cut{i}'
    filters.append(f'[{last}][shot{i}]xfade=transition={TRANSITIONS[i-1]}:duration={FADE}:offset={elapsed-FADE:.3f}[{label}]')
    elapsed += SHOTS[i][2] - FADE
    last = label
# The final fade blends naturally back into the opening shot on loop.
filters.append(f'[{last}]fade=t=out:st={elapsed-.18:.3f}:d=0.18[film]')
OUT.mkdir(parents=True, exist_ok=True)
with tempfile.TemporaryDirectory(prefix='membership-montage-') as scratch:
    graph = Path(scratch) / 'filters.txt'
    graph.write_text(';\n'.join(filters))
    run(args + ['-filter_complex_script', str(graph), '-map', '[film]', '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '25', '-threads', '2', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(OUT/'montage.mp4')])
run(['-i', str(OUT/'montage.mp4'), '-vf', 'scale=768:432', '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '28', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(OUT/'montage-mobile.mp4')])
run(['-ss', '0.5', '-i', str(OUT/'montage.mp4'), '-frames:v', '1', '-q:v', '3', str(OUT/'montage-poster.jpg')])
print(f'Rendered {elapsed:.1f}s montage: PING, TaylorMade, clubs, fitting, and golfers.')
