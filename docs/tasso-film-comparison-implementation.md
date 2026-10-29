# Tasso film comparison page

This page compares the retained original with three new rendered image-to-video directions. It does not replace the current homepage or present CSS animation as generated film.

## Routes and files

- `/en/review/tasso-options` and `/es/review/tasso-options` use `TassoFilmOptions.tsx` inside the existing public SiteShell.
- `tasso-film-options.css` scopes the responsive editorial player/comparison layout.
- `lib/site-language.ts` preserves the comparison route, query and fragment when switching languages.
- `lib/site-content/tasso-film-options.json` is the source of actual video/poster readiness. The root agent owns asset generation, validation, manifest updates and publication.

## Asset contract

The manifest has four options with IDs `original`, `studio`, `morning`, and `light`. Each has three scene entries (`collect`, `return`, `insight`). Every scene specifies `ready`, `video`, `poster`, and optional numeric `start`/`end` segment bounds (null means full clip).

New-direction paths default to `/art/tasso-films/{studio|morning|light}-{collect|return|insight}.mp4` with matching JPG posters. The root agent can change the actual local paths. Original entries point to the same retained original film and can use supplied segment bounds. Original playback therefore remains actual existing footage, not a reconstructed substitute.

Readiness defaults to false. A pending scene shows a plain preparation state and cannot be played. A failed load shows an error and retry while retaining readable process copy. A direction receives a ready label only when all three scene entries are marked ready and have video/poster paths. Files still require independent validation before that flag is enabled; the UI flag alone is not proof of film quality.

## Playback and access

There is no page-load autoplay, including reduced motion. Native video controls support keyboard, seeking, volume and fullscreen. A separate explicit play control starts the three-scene sequence. Scene selectors pause playback and select the requested shot. Original segment bounds are honored; when the same source film is reused between segments it can continue without fetching a second copy. Starting one option pauses the other comparison players.

The videos are not captioned with generated text. Sharp EN/ES website captions sit outside the media and update with the selected scene. The two-working-day statement includes laboratory receipt in the same sentence. Each option also has an expandable complete three-step process transcript and the actual manufacturer's full-instructions link. Sound is optional and no essential explanation relies on it.

## Visual approach

One large 16:9 film stage per direction preserves the full generated frame with `object-fit: contain`. Three scene selectors and an active caption sit beneath each player. The page uses EVA paper, ink, restrained type and spacing; it does not recolor one film to pretend there are three directions. Root-produced, separately generated photographic motion is the comparison's content. No placeholder illustration claims to be completed film.

The unchanged original homepage remains the baseline until an explicit direction is chosen and approved. Build, browser playback, real-media/provenance checks and the judge's production decision remain root/judge responsibilities.
