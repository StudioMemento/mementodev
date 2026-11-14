# Gates: Via Roma V20 polish

Scope: Seven requested polish outcomes, verified on the existing React build; clean ZIP only, no deployment.

- [x] G1: Original slogan/logo, understated interactive hero and text plus chevron CTA pass visual review.
  EVIDENCE: Visual review of docs/previews/1440-hero.jpg, 390-hero.jpg and 320px capture; source slogan parity and transparent text CTA measured by verify-polish-ui.
- [x] G2: Printed menu assets, prices, recipes and allergen data match the supplied V19 source and menu remains usable.
  CHECK: node scripts/verify-polish.mjs
  EXPECT: POLISH_SOURCE_VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=4e91e0616de905de409ca6180f417e0c2719be789366032cd7173ffe3da988a6; exit=0; EXPECT=matched; output-sha256=96572444ae99f64ccd92edb8a0f889c202eb3c5a9f9c0c38e58f3ee4a0644dd0; output-bytes=325; shell=/bin/sh; cwd=/workspace/scratch/c17d5d3a7937/build/Pizzeria_Via_Roma_V20_Polish; path=5da26d574a08/13 entries
- [x] G3: Four independent navigation elements are legible and usable without a shared container.
  EVIDENCE: Visual review of independent tiles at 320/390/900/1440px; verify-polish-ui measured four separated tiles and verify-performance confirms transparent dock.
- [x] G4: Five albums each show a dominant central image, faded neighbours, working drag/swipe/arrows and correct lightbox group.
  EVIDENCE: Visual review of all five albums at desktop, portrait and mobile; docs/previews/gallery-review-1440.jpg and gallery-review-390.jpg. Automated arrow, drag, keyboard, touch and lightbox checks passed in G9.
- [x] G5: Community originals contain no visible faces; sharing solicitations are absent in all four languages; original review text/source remain intact.
  EVIDENCE: Twelve originals reviewed at full composition with no visible faces; docs/PHOTO_SELECTION.md and fixture list. G2/G9 confirm original reviews and removal of sharing copy in IT/EN/DE/FR.
- [x] G6: Contact arrangement is preserved with square Bento cards and localized gold interaction; no text collision on mobile or portrait.
  EVIDENCE: Visual review of desktop/mobile/portrait contact screenshots; G9 checks all contact text at seven widths in four languages, 0px radius, 200px local gold light and pointer response.
- [x] G7: Right-edge indicator measures 2 CSS pixels and is visible at top, middle and bottom without obstructing input.
  EVIDENCE: docs/polish-evidence.json records width=2px, height=24/450/900px at top/middle/end of a 900px viewport, right edge at 1440px and pointer-events none.
- [x] G8: TypeScript, production build, local asset references and content checks pass.
  CHECK: npm run check
  EXPECT: PRODUCTION_CHECK_OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=48c943ee7842e6c8c60f66e4186f8251b2b755b0288dcb501ab9f53ae679e5a9; exit=0; EXPECT=matched; output-sha256=649ec7cb82842624b73812f77a5fa5254b7087b77e4dd2520d65cd0fbb5ccec2; output-bytes=1649; shell=/bin/sh; cwd=/workspace/scratch/c17d5d3a7937/build/Pizzeria_Via_Roma_V20_Polish; path=5da26d574a08/13 entries
- [x] G9: Desktop, portrait and 390px mobile render without overflow; keyboard, drag, dialogs, languages and reduced motion remain usable.
  CHECK: npm test
  EXPECT: POLISH_UI_OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=73cbd5fe58cf9804304203f26c748fdf4957ebb0bfa8d8683943b4f3253d4945; exit=0; EXPECT=matched; output-sha256=b90c49a5c5c3b79a60c4a0bf502c2cf07622b2a2e0bfff16758304c3a81e3dfc; output-bytes=1201; shell=/bin/sh; cwd=/workspace/scratch/c17d5d3a7937/build/Pizzeria_Via_Roma_V20_Polish; path=5da26d574a08/13 entries
- [x] G10: ZIP is clean, self contained, reproducibly builds and includes an accurate validation report and deployment instructions.
  EVIDENCE: Clean ZIP extraction + npm ci + npm run check passed; all 139 production files match byte-for-byte. verify-package validates every archived file against source. README, verification report and screenshots included.

Legal/business content: retain supplied documents and restaurant data. Missing operator details cannot be invented; identify this existing limitation separately from the seven UI acceptance criteria.
