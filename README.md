# Mars Mission Design Lab

Open **index.html** in Edge or Chrome. No installation or account is required. The mission designer and local mission briefings work offline; the welcome YouTube video requires an internet connection. For a local preview, run `node server.cjs` and open http://localhost:5175.

This app reuses the dark mission-control design, panel styling, colours, starfield and canvas rover, rock, sand, debris, dust, sample, relay, cache and crater artwork from **Sphero Mission App 2**. The original folder is unchanged.

## Welcome introduction

On the first visit, a welcome screen shows the supplied video: https://www.youtube.com/watch?v=liypQHa_dr8. Press play to watch, then **Continue to your mission** to open the selected mission briefing. Dismissing the welcome screen records that it has been seen in this browser; later visits open the normal mission briefing. **Watch introduction** at the top of the app reopens the video at any time. Closing the screen stops playback. The welcome flow preserves the student's current design and completed mission archive.

The video uses a YouTube privacy-enhanced embedded player, with a direct **Watch on YouTube** fallback for blocked embeds or direct-file browser restrictions. The video is streamed from YouTube, while the five concept briefing videos remain local.

## Design a mission

1. Choose a level from the engineering journey or mission selector: Rank 1 landing, Rank 2 exploration, Rank 3 sample preparation, or Rank 4 Earth return. Mission architect remains an open challenge. The opening scenario and its captioned 26-second video appear when loading, changing or starting a mission. Press play to watch; **Read scenario** reopens it.
2. Drag inventory objects onto the Mars surface, or click an inventory card and click the map. On a keyboard, select a card and press Enter on the focused map to place it centrally.
3. Drag placed objects to move them. Select objects from the inspector list to edit their label, coordinates, size and orientation. Orientation changes the rover's initial heading or rotates the object artwork; hazard safety zones remain circular.
4. Choose **Route**, then click to add numbered waypoints. The rover always starts from its placed position. Stops snap to nearby equipment. Drag stops to adjust them; remove them with their × buttons.
5. Use **Preview route** to check your plan. Open **Route calculations for your code** to see each leg’s distance, heading and time at speed 70.
6. Write your own Python-style program in the rover editor and press **Run Python**. Program the movement and science actions explicitly. Only a successful code run completes the mission.
7. Add a science question and engineering explanation. Download the mission JSON, Python `.py` program or map PNG. **Print / save PDF** prepares an A4 student portfolio: a high-resolution design screenshot, mission details, science question, engineering explanation, the complete current Python program, code telemetry, goal checks, equipment list and planned waypoints. Choose **Save as PDF** in the browser print dialog. Longer programs continue onto additional pages, with indentation preserved.

New missions open with an empty map, no waypoints and a fresh incomplete coding scaffold: students place everything and program their own expedition. Before a code test, resource and goal cards preview the planned route with a pending coding requirement. After a code test, they show the actual coded mission’s actions and energy. Current test results are invalidated when the design or program changes.

## Engineering levels and ranks

| Rank | Engineering rank | Three missions | Minimum obstacles |
| --- | --- | --- | --- |
| 1 · Landing on Mars | Landing Engineer | Safe Touchdown; Landing Site Weather; Return to Landing Zone | 2 / 3 / 4 |
| 2 · Exploring Mars | Surface Explorer | Surface Survey; Weather Network; Rock Reconnaissance | 4 / 5 / 6 |
| 3 · Samples for Earth | Sample Return Engineer | Prepare a Sample Cache; Samples and Weather Context; Three-Sample Collection | 3 / 4 / 5 |
| 4 · Return to Earth | Flight Director | Launch a Return Capsule; Weather-Ready Launch; Efficient Relay Return | 5 / 6 / 7 |

Only successful Python mission checks award a mission pass. Each rank requires all three of its missions. Engineering rank titles advance in order, while students can practise any mission. Earlier mission completions are preserved as Mission 1 of their original rank. Progress is stored separately from the current design in this browser; it persists when creating or importing a mission. The portfolio includes the selected mission, earned rank and point totals.

Mission 1 awards 100 points, Mission 2 awards 150, and Mission 3 awards 200. Completing all three adds a 100-point rank bonus: **550 points per rank, 2,200 points for all twelve missions**. Points are derived from unique completed mission IDs; repeats never award extra points. The open Mission architect challenge remains a practice mission outside this point total. Failed code tests, route previews and opening a downloaded design do not award new mission completions.

Each rank card shows its three missions, completed stars and progress. **View / print certificate** unlocks when all three missions in that rank are complete. Enter or edit the student/team name, then use **Print / save PDF**. Certificates use one landscape A4 page and include the recipient, rank, three mission names, 550 earned points and award date. Certificate names and dates persist in this browser. The rank certificate can be earned even while practising a later rank; the overall engineering title advances after earlier ranks are complete.

Mission variations are checked through actual code actions: multiple weather observations, two or three distinct samples, returning to the landing zone, or two separate relay signals. Efficient Relay Return additionally caps both planned and actual coded energy at **55**. Every mission opens with its own written scenario and the appropriate rank's example-only concept video; the mission's written objectives and obstacle count take precedence over the introductory example.

Selecting an unfinished mission starts a clean map, route and coding scaffold. **Restart this mission** also clears the current unfinished mission. Completed missions have a **★** beside their names in the selector, level cards, scenario, portfolio and expedition name. Each successful mission, including Mission architect, stores its own complete design, object positions, waypoints, source, name and explanations. Selecting it again or using **Reopen completed mission** restores that saved work and its successful test evidence. The archive survives a page reload. Adding explanations after passing updates the archive; experimental map or code edits leave the previous successful version protected until another successful run replaces it. Refreshing an unfinished active mission retains its usual autosaved draft, but leaving and starting it again clears it. Undo history is reset between missions.

Landing uses map movement as a simplified final approach. Earth return is a simulated capsule return carrying the cached samples; the rover stays on Mars. `launch()` requires two deposited samples, a relay signal and capsule proximity. After launch, finish the program with `stop()` (or a `say()` message). These teaching actions do not model spacecraft flight physics.

## Python-style programming

The editor supports the simple Sphero-style teaching subset: `roll()`, `turn()`, `set_heading()`, `collect()`, `flash_colour_code()`, `set_color()`, `wait()`, `say()` and `stop()`. It also supports `observe()` for weather stations and `transmit()` as a relay shorthand, numeric variables, arithmetic, `for … in range(...)`, `while`, `if / else`, and boolean conditions. The function guide explains commands, limits and examples. This is a teaching interpreter rather than a full Python installation; imports, classes, external libraries and arbitrary system access are unsupported.

Movement distance is **speed × 1.28 × seconds**, matching Sphero Mission App 2. Headings are 0° north, 90° east, 180° south and 270° west. `roll(70, 90, 2)` travels 179.2 map units east. Code starts from the rover’s placed position and does not follow the drawn route automatically. Playback runs at 2× speed; commanded distances stay the same.

Use `collect()` within 55 map units of a rock sample. Each call collects one different sample. Use `observe()` or `collect()` at a weather station. Use `flash_colour_code("orange-blue")` or `transmit()` at a relay. At a sample cache, `collect()` deposits the carried samples. Driving past equipment during a code run performs no action. Syntax, proximity, collision, boundary and resource errors report a Python line number. The interpreter has loop and command limits.

Videos are local WebM animations with embedded captions, optional WebVTT tracks, posters, original ambient space music and a written scenario. They are explicitly labelled **concept examples**. They show isolated obstacle and command concepts and pose design questions; they do not show a complete mission layout, solved route or finished program. Students choose their own equipment positions, hazards, traverse, headings and durations. Music plays only when the video is played; use the video controls to adjust volume or mute it. The soundtrack is synthesized locally and embedded in the videos, so playback needs no internet connection. The server supports byte ranges for seeking. Rebuild them with `node make-briefings.cjs` using the bundled browser runtime.

## Model rules

- One rover; up to 100 objects and 100 waypoints.
- Minimum terrain obstacles are listed per mission above; Mission architect requires 5. Rock fields, sand traps, craters, dust zones and debris fields all count. The live checklist displays the placed count. Both planned-route checks and actual coded completion enforce the minimum; successful science actions with too few obstacles do not complete the mission.
- Students are asked to spread hazards through the exploration area, between the rover and science sites, and explain their placement. The automatic count checks the number of placed terrain objects; thoughtful placement is assessed through the design and explanation.
- 1,000 build credits, 100 rover energy (55 for Efficient Relay Return). Planned energy is `ceil(distance × 0.045 + number of waypoints × 2)`. Actual coded energy is `ceil(actual distance × 0.045 + nonzero roll commands × 2)`.
- Code must explicitly perform science and relay actions within 55 map units.
- Hazards are circular marked zones. The rover needs 15 map units of clearance outside each zone. Sand and dust are impassable in this simplified model.
- Sample explorer needs two distinct sample collections, a relay signal, two deposited samples and a finish near a cache. Surface survey needs a sample collection, weather observation, relay signal and a finish near a landing zone. Mission architect needs a science action and a written question. Each requires a successful Python demonstration.
- Routes must avoid all hazards and meet resource limits. There are no physical robot connections, real Mars terrain data or flight-grade calculations.

## Saving and keyboard controls

Design and code autosave in this browser using the Mars mission storage key. Completed designs use a separate archive keyed by mission type, alongside engineering progress. The current design is preserved when upgrading from the older rank-only storage format; older completed designs that were never stored individually cannot be reconstructed. Downloaded JSON includes the source program and can be reopened on another computer. Older mission files are accepted and gain starter code. Browser profiles, file locations and server addresses may have separate storage. Download missions before clearing browser data. Normal design edits or a replacement scaffold can be undone within the current mission.

On the focused map: arrows move the selected object or waypoint by 10 units; Shift+arrows move by 40. Delete removes the selection. Ctrl+Z / Ctrl+Y undo and redo. Escape cancels object placement. In the editor, Tab inserts two spaces; Ctrl+Enter runs Python. Form controls preserve their normal editing shortcuts.

Run `node --test tests.cjs coding-tests.cjs rank-tests.cjs curriculum-tests.cjs` for design, interpreter, mission and points checks. `node verify-browser.cjs` checks design interactions, actual code playback and errors, persistence, proposals, videos, mobile layouts and direct-file video playback. `node verify-browser.cjs --curriculum` (or `--ranks`) checks all twelve missions, point totals, rank bonuses, certificate locks, saved certificate names, per-mission archives, PDF print modes and mobile layouts. `node verify-browser.cjs --mission-storage` checks older saved designs and the open challenge. `node verify-browser.cjs --welcome` checks the introductory video and first-visit controls. `node verify-browser.cjs --media-report` verifies music in all five videos and generates standard and long-code QA PDFs under `tmp/pdfs/` for visual inspection.

NASA science inspiration: https://science.nasa.gov/mission/mars-2020-perseverance/science-objectives/

Independent educational app; not an official NASA product.
