# VOID CTF — landing content

Every string the landing sequence renders, in the order it appears. Edit this
file and the values get applied back into `src/content/site.ts`, which is what
the page actually reads at runtime.

Placeholders are marked **[placeholder]** — those are slots waiting on real
assets or real copy.

---

## The mark

| Slot | Value |
| --- | --- |
| `first` | VOID |
| `second` | CTF |

Set in Archivo Black. `second` carries the vermilion; `first` is iron.

---

## Preloader

| Slot | Value |
| --- | --- |
| `status` | Brief sealed |
| `a11y` | Loading VOID CTF |
| `holdMs` | 900 |

The sheet is bone, the mark is printed on it in iron, and the sheet tears along
the project's seam. Both halves print the same mark, which is why the letters
split rather than just the paper.

---

## Beat one — Ingress

| Slot | Value |
| --- | --- |
| `eyebrow` | 00 / Ingress |
| `headline` | Forty-two vaults are open. |
| `sub` | Nobody has reached the bottom. |

Readout, left to right:

| Label | Value |
| --- | --- |
| Layers | 6 |
| Window | 24 h |
| Range | Isolated |
| Vaults | 42 |

### Asset

| Slot | Value |
| --- | --- |
| `mosaicAlt` | A riverside nuclear plant at dusk, cut into a grid of windows. |

The picture is `src/assets/bg-layer-2.png`, statically imported in
`sequence/ingress.tsx` and cut into a bento grid: one `<image>` clipped to the
union of the tiles, so the photograph stays continuous across them and the gaps
fall through to the iron ground. Swap the file to change the picture.

---

## Beat two — The statement

| Slot | Value |
| --- | --- |
| `eyebrow` | 01 / The plant |
| `circleCaption` | L4 · Enterprise |

The sentence is three lines. `[o]` marks where the circle sits in the flow — it
is a real slot in the typesetting, not an overlay, so moving it moves the line
break with it.

```
Every plant is a ladder
[o] from the internet down to the water.
We drew this one the way they actually are.
```

### Asset

| Slot | Value |
| --- | --- |
| image | `src/assets/bg-layer-2.png` — bundled, not a path |
| `circleAlt` | An assault team overlooking a riverside nuclear plant at dusk, with a helicopter overhead. |

The picture is a **static import**, not a string path. It is bundled from
`src/assets/bg-layer-2.png`, which means it cannot 404, and Next generates a
blur placeholder for it. To change the image, replace that file — there is no
value in `site.ts` to keep in sync.

It is 1664×944 landscape. This matters, and it is why the beat uses
`clip-path` rather than scaling a round element: a round element has to be
square, and an image covering a square crops a landscape photo to its centre.
The window opens by clipping a full-frame image instead, so the photograph is
always framed as a whole and only the window over it grows.

---

## Beat three — The globe

| Slot | Value |
| --- | --- |
| `eyebrow` | 02 / Field |
| `headline` | Forty-one countries, one grid. |
| `body` | The range runs on the stack every water utility already runs on. The globe is where the entrants are. |
| `turns` | 0.62 |

`turns` is how far the globe rotates across the whole scroll range, in full
revolutions. Higher is busier.

`nodes` is the list of `[latitude, longitude]` pairs the globe plots as amber
pins. Currently 25 real centroids standing in for the entrants. **[placeholder]**
— swap for the real list when registration closes; the count in `headline` should
match.

Two entrants are annotated with floating callouts: a leader runs up off the dot
with a short diagonal, then out to the side along a long horizontal shelf, with a
two-line label (`ENTRANT_NN` and the coordinate) sitting above the shelf — so the
labels stand clear in the space beside the globe. The two are chosen
automatically at the orientation the globe settles on — the left-most and
right-most face-on dots in the upper half of the disc, so one reaches out to the
left and the other to the right. Each leader draws itself on with a short dash
reveal as the beat settles, the label fades in just behind it, and the whole
callout fades out as its dot rounds the limb. The count is `CALLOUTS` in
`sequence/globe.tsx`.

The globe is a real, textured sphere rendered in WebGL (three.js): a true-colour
day map, a normal map for terrain relief, and a night map on the emissive channel
so the dark half shows city lights. A single key light from the upper left casts
the terminator, and a white starfield behind the globe fades up as the camera
draws back. This is a deliberate reversal of the original "one
palette, no photograph" globe — the real Earth was asked for.

The maps live in `public/media/` (`earth-day.jpg`, `earth-night.jpg`,
`earth-normal.jpg`), 2048×1024 each, resized from a 16K equirectangular source
set with `sharp` — about 240 KB total. The paths are constants in the component;
there is no slot in `site.ts`. To change resolution or grade, re-run the resize
against the source and drop the files back in. `three` is a project dependency
this beat pulls in; nothing else uses it yet.

The renderer is orthographic in pixel units — one world unit is one CSS pixel —
so the pull-back is still one number: the sphere is scaled from a disc that
covers the frame down to a miniature, the same `R` the drawn globe used. `LON0`
in the component is the longitude offset that lines the pins up with the map's
Greenwich; nudge it if a pin sits off its city.

---

## Footer

| Slot | Value |
| --- | --- |
| `first` | VOID |
| `second` | CTF |
| `disclaimer` | Every system in the range is synthetic. Nothing here touches a live utility. |
| `legal` | Void Society |
| `cta` | Register → `#register` |

Columns:

| Column | Links |
| --- | --- |
| Range | Root Protocol `#root-protocol` · Leaderboard `#leaderboard` · Rules `#rules` |
| Records | Archive `#` · Write-ups `#` · Scoring `#` |
| Society | About `#` · Contact `#` · Conduct `#` |

The `Records` and `Society` links are **[placeholder]** — no destinations yet.
The `Range` links match the masthead's existing anchors.

---

## Not in this file

The sections below the sequence do not read from `site.ts` either. `Operation`
(`components/sections/operation.tsx`), `Protocol` (`protocol.tsx`) and the format
and schedule (`timeline.tsx`) each hold their own copy as a const at the top of
the file. The dates in particular live in `timeline.tsx` — plus their one
caption, which is where the zone and the year are stated, since the rows
themselves carry neither.

The masthead (`src/components/hero/site-nav.tsx`) still hard-codes its own
links and brand string. It was left untouched on purpose — it is working code
and the sequence did not need to change it — but it means the nav is the one
piece of copy that does not come from here.

**No numbered-season references remain anywhere in the repo.** One used to sit
in `src/components/hero/ics-hero.tsx`, in orphaned code; its status line now
reads `Registration open`. That file is still dead and still broken for its own
reasons — nothing imports it, and it references design tokens (`font-slab`,
`sand-*`, `ember-*`) that do not exist in this project's theme, so it would
render unstyled. Delete it or repair it independently of anything here.

`src/components/hero/hero-footer.tsx` contains the string `Level IV`. That is a
threat level, not a season, and it was left as-is.
