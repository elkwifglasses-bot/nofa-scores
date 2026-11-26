# nofa scores

Spoiler-free watchability ratings (0–10) for matches in the Super League, Premier League, La Liga, Serie A, Bundesliga and Ligue 1, season 2026–27.

The app is a single page (`index.html`) that reads two data files. GitHub Pages publishes it as is; there is nothing to build.

## Files

| File | What it is |
|---|---|
| `index.html` | The app: Matches (day or week, picked with the calendar; also the next week with predictions), Season, Favourites (stored on the phone) and Options (coming soon); the bell shows the last daily update |
| `data/matches.json` | Every match with its rating, breakdown and (from 23 Nov 2026) per-team figures `x`: `{ "season", "updated", "matches": [ ... ] }` |
| `data/fixtures.json` | Next round per league, used for the next-week predictions: `{ "<league>": { "c", "r", "matches": [ { "h", "a", "d", "t" } ] } }`; `t` is the kickoff time in Swiss time (`"18:00"`), left out while not known (the app then shows "n/a") |
| `data/runs.json` | Log of the daily update runs (start, end, ok, matches added per league), shown under the bell: `{ "runs": [ { "d", "start", "end", "ok", "added", "note", "skipped" } ] }`; `skipped: true` marks a day with nothing scheduled, where the update stopped before any research |
| `manifest.webmanifest`, `icons/` | Make the page installable as an app (name, icon, full screen) |
| `sw.js` | Offline cache: the app still opens without a connection, with the last data it saw |

## Match format

```json
{ "id": "2026-11-22_sa_atalanta-inter", "c": "sa", "r": 12, "d": "2026-11-22",
  "h": "Atalanta", "a": "Inter", "rt": 9.2, "s": "4 – 4",
  "w": [["Starting score", "3.0"], ["Goals", "+3.2"]],
  "q": "Atalanta+Inter+highlights+DAZN+Fussball" }
```

League codes: `sl` Super League, `pl` Premier League, `ll` La Liga, `sa` Serie A, `bl` Bundesliga, `l1` Ligue 1. `rt` is `null` for matches not played or not rated yet. `q` is the YouTube search for the highlights (`null` for the Bundesliga). Team names are stored in full; the page shortens them for display.

## Daily update

Each morning the scheduled task first checks whether any of the six leagues had a match scheduled yesterday; if not, it only logs a skipped run. Otherwise it adds yesterday's matches to `data/matches.json` (and updates `data/fixtures.json` when a round is complete) and commits both files. GitHub Pages republishes within a minute or two, and the app picks up the new data the next time it is opened.

## Preview locally

```
python3 -m http.server 8000
```

then open http://localhost:8000.
