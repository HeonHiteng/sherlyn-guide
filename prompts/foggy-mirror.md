Build **Foggy Mirror**: a full-screen, photorealistic interactive web app where your webcam is a bathroom mirror. You breathe on it to fog it up, write in the fog with your fingertip, and kiss it to leave a lip print. It must be a fully working experience, not a mockup.

## Stack
- React + TypeScript + Vite + Tailwind CSS.
- **WebGL2** for all rendering (no 2D canvas for the fog).
- **MediaPipe Tasks Vision**: Hand Landmarker (1 hand) and Face Landmarker (1 face, `outputFaceBlendshapes: true`), both in VIDEO mode with the GPU delegate and a CPU fallback. Serve the WASM files locally from `/public/mediapipe/wasm` (copy them from `node_modules/@mediapipe/tasks-vision/wasm`) and load the `.task` models from Google's model storage.
- Camera only: no microphone, no audio APIs, no speech recognition. All processing stays in the browser.

## Core interaction
1. Look into the mirror and see your own **mirrored webcam reflection**, cover-fit to the screen. The mirror starts clear.
2. **Open your mouth → fog condenses on the glass**, starting at your mouth's position in the mirrored view and spreading outward. The longer your mouth stays open, the larger and denser the fog gets. Closing your mouth stops new fog. Reopening adds more fog on top, even over existing fog and writing.
3. **Raise only your index finger → write.** The fog is completely removed under your fingertip (landmark 8), revealing the sharp reflection.
4. **Breathe again → fresh fog covers your writing.**
5. **Kiss the mirror** (pucker your lips, mouth closed): a small patch of fog appears at your lips and a **lip print** is pressed into it. **Hold the kiss for about 1.1 s → a heart** is wiped through the fog around the lip print.
6. With no new breath, fog **evaporates naturally** over roughly 30 s, thin edges first, so it retreats unevenly.

## Detection details
**Mouth open (breath):**
- ratio = distance between inner lips (face landmarks 13 and 14) ÷ face height (landmarks 10 to 152), using screen-space coordinates.
- Calibrate a "closed mouth" baseline from the first ~12 frames, then let it drift slowly while the mouth is closed.
- Open when ratio − baseline > 0.06 for 2 frames; close when it drops below 0.035 for 2 frames (hysteresis). Smooth with an EMA.
- Openness (0.35 to 1) scales the breath strength. Breath position = mouth centre mapped to the mirrored screen.

**Finger writing (no pinch):**
- Decide the pose from **3D world landmarks** (pose-invariant), not 2D screen distances. Otherwise a fist facing the camera gets mistaken for a pointing finger.
- For each finger, add up its joint bend angles (knuckle, middle joint and end joint).
- Write when the index bend is under 55° (under 70° to keep writing), the index tip reaches at least 1.25× further from the wrist than the middle fingertip, the middle and ring fingers are each bent over 95°, and the pinky over 70°.
- Start after 2 agreeing frames. **Stop on the first frame** the pose fails. Fists and open palms must never write.
- Position = index fingertip in screen pixels, through a One Euro filter (min cutoff ~2.4, beta ~0.035) for minimal lag. Stroke points are joined with midpoint-quadratic curves, subdivided every ~3 px, so handwriting is smooth and connected between camera frames.

**Kiss:**
- From blendshapes: `mouthPucker` (EMA-smoothed) above 0.5 with `jawOpen` below 0.3 for 2 frames starts a kiss. Below 0.3 ends it, followed by a 0.6 s cooldown.
- A kiss never counts as an open-mouth breath.
- Lip print size = 0.2 × face width (cheek landmarks 234 to 454). Rotate it with the head roll (eye corners 33 and 263).

**Performance:** run hand detection on every new video frame and face detection on every other frame. Use monotonically increasing timestamps.

## Rendering architecture (WebGL2)
- **Fog state texture** at full screen resolution (device pixel ratio capped at 1.5, about 2.4 MP max). Use RGBA16F when `EXT_color_buffer_float` is available, with an RGBA8 fallback that batches evaporation into representable steps. Ping-pong two framebuffers.
  - R = condensation density (0 to 1.5).
  - G = "dryness" (1 = dry). Low values mark the wet rims beside wiped strokes.
- **Simulation pass** (every frame):
  - Evaporation: `R -= dt*(0.008 + 0.03R)*noise`.
  - Breath injection: an irregular, grainy blob around the mouth. Distort its edge with fractal noise and bias it slightly upward. Its radius grows with √(time the mouth has been open), from ~9% of the screen's short side up to ~55% of its long side.
  - Rims slowly dry out, and new breath re-dries them.
- **Finger wipes:** draw each stroke segment as a capsule quad into the state texture with **MIN blending**.
  - Inside the stroke, R → 0 with a ~1 px anti-aliased edge, so writing is crisp and fully cleared, never semi-transparent.
  - Just outside the edge, G is set low to form a wet rim.
  - Strokes are narrow and consistent: half-width ≈ 0.85% of the screen's short side, clamped to 5–9.5 px.
- **Lip print:** a full-screen pass with MIN blending that discards fragments outside the lips. The lips are an analytic shape: an upper lip with a cupid's bow, a mouth line and a fuller lower lip, with a thin fogged gap between them. Contact is imperfect, so keep some fog inside along vertical lip creases (sine lines warped by noise) and in patchy low-pressure areas. Add a wet rim around the print.
- **Kiss sequence:**
  - A short, dense breath "puff" (~0.55 s) at the lips so the print always has fog to show in, then stamp the lips about 0.5 s later.
  - The heart gets its own larger puff. The parametric heart curve (16sin³t, 13cos t − 5cos 2t − …) is then wiped over ~0.9 s with ease-in-out.
  - Re-stamp the same lip print after the heart's puff so the fog doesn't cover it.
- **Composite pass:**
  - Sharp mirrored webcam with a slightly darker, cool mirror grade.
  - A blurred reflection (mipmapped video texture sampled at LOD ~4 with a few taps) shows behind the fog.
  - Fog colour is milky white in the light, blue-grey in shadow. Fog opacity = `1 − exp(−2.3·density)`, capped around 0.87 so faint shapes still show through.
  - Low-frequency noise and fine grain in the fog density.
  - **Droplet fields** (one bead per grid cell, so only one cell is evaluated per pixel):
    - Thousands of tiny beads (~3.4 px cells) wherever there is fog.
    - Sparser larger beads where fog is dense.
    - Rim beads beside strokes, shown only where there is fog around the stroke (sample neighbouring density).
    - Beads are shaded as lenses: refracted, inverted reflection inside, a darker edge, a specular highlight and a soft caustic.
  - Soft diffused window light from the upper left, a faint diagonal glass sheen and a vignette.
  - The fingertip indicator is a thin glowing ring drawn in the shader, lightly filled while writing.

## Design
- Immersive full screen. Elegant and minimal, inspired by cinematic bathroom scenes. Fonts: Cormorant Garamond (italic serif) and Inter.
- **Intro:** the title "Foggy Mirror", the line "Breathe on the glass. Write in the fog with your fingertip.", a "Step up to the mirror" button and a "No camera? Use mouse or touch" link. Add a privacy note: camera only, no microphone, processed locally.
- **Guided hints** in large italic serif that fade in and out: "Open your mouth and breathe on the glass" → after the first breath, "Raise your index finger to write in the fog" → after the first stroke, "Breathe again to fog over your words — or blow the mirror a kiss" (fades after 5 s).
- A small loading status ("Waking the camera…", "Preparing face & hand tracking…").
- A tiny glass toolbar that **auto-hides after 3.5 s idle**: camera on/off, Clear mirror (all fog evaporates over ~0.7 s, timed by real elapsed time), and Save mirror (PNG download without the cursor).
- **Fallbacks:**
  - Mouse or touch draws strokes (use coalesced pointer events).
  - Hold Space to breathe at the cursor; K = kiss, H = kiss heart.
  - Without a camera, show a procedural warm bathroom scene (tiles, towel, shelf, plant, sconce light) and start with the mirror fully fogged.
- Handle camera denial gracefully, falling back to the mouse experience. Responsive on desktop and mobile. Target 60 FPS.
- A `?debug` URL flag shows a live readout of the four finger-bend angles and the pucker score, for tuning.

**Most important:** your real mouth opening must create the fog, your real fingertip must control exactly where the fog is removed, and your real kiss must leave the lip print. Everything must be live, smooth and realistic.
