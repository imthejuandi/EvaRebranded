# Runner signals / 03.35

Approved runner tracking study 03, integrated into the opening hero.

- Uses the existing runner footage, original glow and source proportions.
- Three reviewed anchors: ApoB / Óptimo, HbA1c / Óptimo, HsCRP / Fuera de rango.
- English copy is available through the component language prop: Optimal / Out of range.
- Starts with 1.5 seconds of clean playback, then staggered point, leader and label reveals. Labels remain through all subsequent loops.
- Tracking follows decoded video time at the original 24 fps, independently from scroll. The overlay shares the media's scroll transform and object-fit mapping.
- Pause freezes the points with the footage; callbacks stop offscreen and in hidden tabs. Uses three SVG groups and the existing video, without another player or video download.
- Head, abdomen and knee use the exact approved reviewed tracks, including the stabilized waist keys and continuous loop boundary.
- Mobile label positions reserve room above the dotted headline and invitation. Desktop labels remain outside the headline and runner's face.
- Statuses are illustrative art direction, not measurements of the person or medical thresholds. An equivalent description is available to screen readers.
- No new clinical claims, pricing changes or private business context introduced.

The preceding hero is retained in /archive/eva-03-34-centered-runner.zip and in source history. The independent bilingual tracking study also remains available locally.

Validation: TypeScript passed. Mobile and 1440×900 visual checks passed; all three signals visible after the reveal, media/overlay timing within a decoded frame, pause verified. No browser runtime errors observed.
