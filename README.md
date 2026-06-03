# MARK LXXXV — J.A.R.V.I.S. Interface (Scaffold)

This scaffold creates a cinematic Next.js + TypeScript starter with React Three Fiber, Framer Motion, Lenis, and Tailwind.

Notes:
- Place a high-fidelity model at `public/models/armor.glb` (GLB/GLTF). Use draco-compressed/optimized model for production.
- This scaffold omits full Shadcn UI wiring; install and configure `shadcn/ui` if desired.

Decoding and GPU texture/transcoder setup
- For DRACO-compressed meshes, place decoder files under `public/draco/` (e.g. `draco_decoder.js`, `draco_wasm_wrapper.js`, `draco_decoder.wasm`). The `DRACOLoader` in `Hero3D.tsx` expects `/draco/` path by default.
- For KTX2/Basis GPU textures, place the Basis Universal transcoder files under `public/basis/` and enable KTX2 in your model export. `KTX2Loader` expects the transcoder at `/basis/` by default.
- If you prefer CDN-hosted decoders/transcoders, update the paths in `components/Hero3D.tsx`.

SSR-friendly fallback
- A poster image `public/images/armor-poster.jpg` is used as a static fallback until the model finishes loading; add a poster image for graceful SSR and no-JS scenarios.

CDN defaults and overrides
- This scaffold includes `config/decoders.ts` with default CDN paths. You can override them by setting `DRACO_PATH` and `BASIS_PATH` environment variables, or edit `config/decoders.ts` directly.

Optimization scripts
- Run the included glTF-Transform scripts (requires dev dependency `@gltf-transform/cli`):

```bash
npm run optimize:draco    # draco-compress public/models/armor.glb -> public/models/armor.draco.glb
npm run optimize:ktx2     # transcode textures -> ktx2 (public/models/armor.draco.glb -> public/models/armor.ktx2.glb)
npm run optimize:all
```

Upload server
- Quick uploader for local testing: `npm run upload:server` starts a small server at port 4000 with `/upload` POST endpoint. Upload files there to place them into `public/models/`.


Quick start:

```bash
cd "c:\Users\rajku\OneDrive\Desktop\something new\mark-lxxxv-ui"
npm install
npm run dev
```

Open http://localhost:3000
