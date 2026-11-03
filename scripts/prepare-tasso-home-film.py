"""Build the homepage's continuous scroll-addressable film without altering originals."""
import argparse
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
FPS = 24
FRAMES = 648
COLS, ROWS, PER_SHEET = 3, 4, 12
CHAPTERS = [('collect', 0, 156, 48), ('return', 156, 348, 336), ('understand', 348, 648, 372)]
VARIANTS = {'desktop': (960, 540, 76), 'mobile': (480, 270, 74)}

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def run(args):
    subprocess.run(args, check=True)

def probe(path):
    return json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate,nb_frames', '-of', 'json', str(path)]))['streams'][0]

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--opening', type=Path, default=Path('/workspace/eva-content-review/media/source/tasso-one-take/touch-final-physical.mp4'))
    p.add_argument('--ending', type=Path, default=Path('/workspace/eva-scroll-media/native-tablet-raw2.mp4'))
    p.add_argument('--media-directory', type=Path, default=Path('/workspace/eva-scroll-media'))
    p.add_argument('--posters-only', action='store_true')
    args = p.parse_args()
    for source, minimum in [(args.opening, 240), (args.ending, 408)]:
        metadata = probe(source)
        assert metadata['r_frame_rate'] == '24/1', 'Source cadence must be the native24fps'
        assert int(metadata['nb_frames']) >= minimum, 'Source is too short'
        assert metadata['width'] * 9 == metadata['height'] * 16, 'Preserve16:9; do not crop the source'
    opening_sha, ending_sha = sha(args.opening), sha(args.ending)
    assert ending_sha == 'ed7c0d481e70cbfe6a7f608eefe9ed70baf7ac2a5f696a44f4297981439d09fe', 'Wrong ending: preserve the referenced native2 film'
    recipe = json.dumps({'opening': opening_sha, 'ending': ending_sha, 'intervals': [0, 240, 0, 408], 'fps': FPS, 'variants': VARIANTS, 'grid': [COLS, ROWS], 'version': 1}, sort_keys=True)
    version = hashlib.sha256(recipe.encode()).hexdigest()[:16]
    relative = Path('art/tasso-home-film') / version
    out = ROOT / 'public' / relative
    out.mkdir(parents=True, exist_ok=True)
    manifest_path = ROOT / 'lib/site-content/tasso-home-film.json'
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest = {'version': 1, 'id': 'tasso-home-film', 'ready': False, 'assetVersion': version, 'fps': FPS, 'frameCount': FRAMES,
        'source': {'durationSeconds': 27, 'fps': FPS, 'frameCount': FRAMES, 'width': 1920, 'height': 1080}, 'variants': {}, 'chapters': [],
        'provenance': {'openingSha256': opening_sha, 'endingSha256': ending_sha, 'endingJob': 'bc37c071-a5d4-44e5-82c7-94ae07872936', 'nativeJoinFrame': 240, 'postGenerationUiOverlays': False}}
    for name, (width, height, quality) in VARIANTS.items():
        base = '/' + str(relative / name)
        (out / name).mkdir(exist_ok=True)
        manifest['variants'][name] = {'frameWidth': width, 'frameHeight': height, 'columns': COLS, 'rows': ROWS, 'framesPerSheet': PER_SHEET,
            'atlases': [], 'poster': base + '/poster.jpg', 'chapterPosters': [base + '/' + c[0] + '.jpg' for c in CHAPTERS], 'totalBytes': 0}
    for index, (name, start, end, poster) in enumerate(CHAPTERS):
        manifest['chapters'].append({'id': name, 'startFrame': start, 'endFrame': end, 'endFrameExclusive': end, 'posterFrame': poster,
            'poster': manifest['variants']['desktop']['chapterPosters'][index], 'mobilePoster': manifest['variants']['mobile']['chapterPosters'][index], 'posterWidth': 960, 'posterHeight': 540})
    manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
    print(json.dumps({'stage': 'manifest-ready', 'manifest': str(manifest_path), 'assetVersion': version}), flush=True)

    def posters(name):
        width, height, _ = VARIANTS[name]
        folder = out / name
        for source, frame, target in [(args.opening, 0, 'poster'), (args.opening, 48, 'collect'), (args.ending, 96, 'return'), (args.ending, 132, 'understand')]:
            dest = folder / (target + '.jpg')
            if not dest.exists():
                run(['ffmpeg', '-v', 'error', '-i', str(source), '-vf', f"select=eq(n\\,{frame}),scale={width}:{height}:flags=lanczos", '-frames:v', '1', '-fps_mode', 'vfr', '-q:v', '3', '-threads', '2', str(dest)])
    with ThreadPoolExecutor(max_workers=2) as pool:
        list(pool.map(posters, VARIANTS))
    print(json.dumps({'stage': 'posters-ready', 'count': 8, 'output': str(out)}), flush=True)
    if args.posters_only:
        return

    args.media_directory.mkdir(parents=True, exist_ok=True)
    film = args.media_directory / ('home-film-' + version + '.mp4')
    if not film.exists():
        run(['ffmpeg', '-v', 'error', '-i', str(args.opening), '-i', str(args.ending), '-filter_complex',
            '[0:v]trim=start_frame=0:end_frame=240,setpts=N/(24*TB)[a];[1:v]trim=start_frame=0:end_frame=408,setpts=N/(24*TB)[b];[a][b]concat=n=2:v=1:a=0,format=yuv420p[film]',
            '-map', '[film]', '-an', '-c:v', 'libx264', '-crf', '16', '-preset', 'fast', '-threads', '2', '-r', '24', '-fps_mode', 'cfr', '-movflags', '+faststart', str(film)])
    assert int(probe(film)['nb_frames']) == FRAMES, 'Expected exact648-frame movie'
    print(json.dumps({'stage': 'source-ready', 'film': str(film), 'sha256': sha(film)}), flush=True)

    def atlases(name):
        width, height, quality = VARIANTS[name]
        folder = out / name
        expected = [folder / f'atlas-{i:03d}.webp' for i in range(FRAMES // PER_SHEET)]
        if not all(path.exists() for path in expected):
            run(['ffmpeg', '-v', 'error', '-y', '-i', str(film), '-vf', f'fps=24,scale={width}:{height}:flags=lanczos,trim=end_frame=648,tile=3x4:nb_frames=12',
                '-frames:v', '54', '-c:v', 'libwebp', '-quality', str(quality), '-compression_level', '4', '-threads', '2', '-start_number', '0', str(folder / 'atlas-%03d.webp')])
        from PIL import Image
        for path in expected:
            with Image.open(path) as image:
                assert image.size == (width * COLS, height * ROWS), 'Wrong atlas dimensions'
        byte_count = sum(path.stat().st_size for path in expected)
        print(json.dumps({'stage': 'variant-ready', 'variant': name, 'atlases': len(expected), 'bytes': byte_count, 'decodedBitmapBytes': width * height * PER_SHEET * 4}), flush=True)
        return name, expected, byte_count
    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(atlases, VARIANTS))
    for name, paths, byte_count in results:
        manifest['variants'][name]['atlases'] = ['/' + str(path.relative_to(ROOT / 'public')) for path in paths]
        manifest['variants'][name]['totalBytes'] = byte_count
    manifest['ready'] = True
    manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
    provenance = {'manifest': str(manifest_path.relative_to(ROOT)), 'assetVersion': version, 'recipe': json.loads(recipe), 'privateSource': str(film), 'privateSourceSha256': sha(film),
        'sourceProvenance': [{'path': str(args.opening), 'sha256': opening_sha, 'sourceInFrame': 0, 'sourceOutExclusive': 240, 'masterStartFrame': 0},
                             {'path': str(args.ending), 'sha256': ending_sha, 'sourceInFrame': 0, 'sourceOutExclusive': 408, 'masterStartFrame': 240}],
        'nativeFrames': FRAMES, 'fps': FPS, 'noNewGeneration': True, 'noFrameInterpolation': True, 'noEditorialTransition': True,
        'knownSourceLimits': ['Native2 paper gradually becomes book-like in the camera orbit.', 'Native dashboard small labels/date/ring are approximate.'],
        'variants': manifest['variants']}
    (ROOT / 'docs').mkdir(exist_ok=True)
    (ROOT / 'docs/tasso-home-film-assets.json').write_text(json.dumps(provenance, indent=2) + '\n')
    print(json.dumps({'stage': 'complete', 'manifest': str(manifest_path), 'totalAtlasBytes': sum(v['totalBytes'] for v in manifest['variants'].values())}), flush=True)

if __name__ == '__main__':
    main()
