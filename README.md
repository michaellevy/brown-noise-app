# Noise

Seamless brown/pink noise for sleeping. One button, two sliders.

**https://michaellevy.github.io/brown-noise-app/**

## Why it doesn't have a loop seam

There is no loop. Every sample is synthesised on the fly from Paul Kellet's
refined pink-noise filter, so there is no buffer to wrap around and nothing to
click at the join. It can run indefinitely.

Two engines generate it from the identical `Gen` class:

- **AudioWorklet** — runs on the audio thread, immune to main-thread jank.
  Requires a secure context (https or localhost).
- **ScriptProcessorNode** — deprecated and main-thread, but available on plain
  http, so the app still works when served over a LAN address for testing.

## Playing overnight on Android

Output is routed through a `MediaStreamDestination` into an `<audio>` element
rather than straight to `ctx.destination`. That's what makes Chrome treat it as
real media playback: it keeps running with the screen off and gives you
lock-screen controls.

Install it to the home screen and the service worker caches everything, so it
works with no network at all.

## Levels

The tone slider sweeps a 4th-order (24 dB/oct) lowpass from 150 Hz (deep brown
rumble) to 1.8 kHz, with makeup gain to keep loudness roughly even across the
sweep. Constants are chosen for headroom: noise peaks are stochastic, so across
eight hours you see ~6.5-sigma excursions rather than the ~5-sigma a short test
shows. Worst case (volume 1.0, tone 0.0) peaks near -3 dBFS overnight and never
clips.

If you change `index.html`, bump `CACHE` in `sw.js` — the fetch handler is
cache-first and will otherwise serve the old app forever.
