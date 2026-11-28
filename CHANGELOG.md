# nofa scores – changelog

nofa scores is a spoiler-free watchability rating for football matches (Swiss Super League, Premier League, La Liga, Serie A, Bundesliga, Ligue 1). It's an installable web app published from this repository with GitHub Pages. A daily scheduled task rates the previous day's matches and writes them to `data/`.

This file records how the app was built: one entry per day, newest first, with the pull request (#) or issue that holds the details. The daily data commits ("Ratings …", "Run log …") aren't listed individually. Nothing here gives away a result.

---

## v1.0 – 28 November 2026

### What v1.0 contains

- **Matches tab**
  - A day or a span of days. The default is the last seven days up to yesterday; one step forward shows the next seven days.
  - Any span can be picked in the calendar: tap a day, then a second one, for at most 14 days.
  - League pills filter the list, and each match shows its round under the flag.
  - Sort menu: highest or lowest rated, newest or oldest first.
  - Matches still to come show a predicted rating in a dashed box.
- **Match window**
  - Spoiler-free summary, rating breakdown and highlights link.
  - The score only on request, with per-team figures in which the higher number of each pair is green.
  - Matches still to come show the predicted rating and why: league average, goals, stakes.
- **Season tab**
  - An All-leagues summary card, and one card per league. Swipe to move between them.
  - Graph per league: average rating per round, with optional boxplots and the next round as a predicted point. The All-leagues graph uses blocks of seven days instead of rounds.
  - Team table and a sortable match list that shows 5 at a time.
- **Team window**
  - Ratings graph of the last ten matches, scrollable, with the next match as a predicted point and an optional league-average line.
  - Full match list including the matches still to come.
- **Favourites:** your teams' matches above every list, and their own tab.
- **Options:** five colour schemes.
- **Start screen and app icon:** a green pentagon logo, with the start screen lined up with Android's icon.
- **Daily task:**
  - Runs at 06:00 and rates the previous day's matches.
  - Writes a spoiler-free summary for each match.
  - Keeps the fixtures of the next seven days, with kickoff times.
  - Skips days without matches.

### Key decisions

- **Spoiler-free first.** No score, scorer or winner is shown anywhere unless asked for (Show score). Summaries describe context, chances and drama, never the outcome.
- **Rating model (0–10).** The daily task scores every match the same way:
  - start at 3.0
  - goals, late goals, equalisers and lead changes, comebacks
  - a close or one-sided match
  - chances (xG, or a fallback)
  - drama: red cards, penalties, VAR
  - stakes: table position, derbies
  - caps for low-scoring and very high scores

  Tiers: 8.5+ must watch · 7–8.4 worth it · 4–6.9 average · below 4 skip.
- **Predicted ratings (#21).** For matches still to come:
  - **Formula:** the league average so far + 3 × (0.37 × goals in the two teams' matches against the league average + 0.9 × stakes).
  - **Stakes:** a team in the top or bottom two, both teams in the top or bottom four, or a built-in derby list.
  - **Backtest:** checked on this season with only data known before kickoff, it correlates 0.32 with the real rating, against 0.13 for the earlier "bolts".
  - **Display:** stretched ×3 so the differences are visible, in a dashed box so a prediction is never mistaken for a rating.
- **Seven days, not rounds (#20).** Browsing is by days. Rounds only appear where they belong: under the flag, and in the Season graphs, where each match counts towards the round it was originally assigned to.
- **Data stays in this repository** (`data/matches.json`, `data/fixtures.json`, `data/runs.json`), so the app needs no server.
- **Sprints.** Changes are collected, tested and merged as one pull request, not committed one by one.

---

## Development history

### 28 November 2026
- **#28** Season match lists: round under the flag.
- **#27** Counts are simply the number of matches in the list (no "to come"); favourites follow the list's order (Season: by rating); the All-leagues graph leaves out seven-day blocks with fewer than 12 matches; Season with All leagues shows only the summary card.
- **#26** Built-in derby list for the predictions (incl. El Clásico, Der Klassiker, Le Classique). Before, derbies were only known from a flag on recent played matches, so none counted.
- **#25** Prediction window shows each team's average rating instead of its table position; the All-leagues graph gets the next seven days as a predicted point.
- **#24** Predicted ratings instead of bolts (closes #21):
  - a new prediction model, with a "why" breakdown
  - next round and next match as predicted points on the graphs
  - a League avg switch on the team graph
  - the team window lists matches still to come
  - a simpler score view: penalties awarded, higher figures in green, no positions, VAR awards or derby line
- **#23** Played and upcoming matches are treated the same (one list, one sort menu). Also:
  - Calendar: periods of up to 14 days, with the seven days on each side outlined.
  - Season: an All-leagues graph, quiet boxplots with a switch, swiping between leagues, a sortable match list with Show more.
  - No graph animation; one 12px style for headings and small buttons.

### 27 November 2026
- **#22** Browse by seven days instead of rounds (closes #20):
  - "Last seven days" / "Next seven days"
  - calendar periods
  - sort menu with day headers
  - round under the flag
  - Season graphs of the average rating per round, with a round window
  - the team graph no longer jumps when a point is tapped
  - fixtures can carry their own round
- **#19** Back to the green app icon and dark start screen, keeping the logo exactly aligned with Android's icon.
- **#18** Matches tab icon: the football turned like the logo (closes #13).
- **#17** New icon URLs so installed apps fetch the new icon.
- **#16** Tried a white start screen with a black-on-white icon (brought together #14 and #15). Replaced by #19 the same day.
- **#12** New logo: a single pentagon on a turned ball, with the header, start screen, favicon and app icons all updated.

### 26 November 2026
- **#11** Start screen, kickoff times and skipped runs:
  - a smoother start screen (closes #10)
  - kickoff times under the weekday for matches still to come (closes #3)
  - the daily task only runs fully when matches were scheduled the day before (closes #7)
- The backlog moved to GitHub issues (#1–#9).

### 25 November 2026
- **Season and teams**
  - A team window with a ratings graph on top of its match list, both collapsible.
  - Club badges: own geometric greyscale badges instead of real logos.
- **Match window:** Summary tab, buttons at the bottom, Show score first with a divider, "Highlights".
- **Look and options**
  - Colour schemes in Options (five schemes from one central colour set).
  - Rating boxes with one 3:2 shape everywhere.
  - Title screen with a faded wall of club badges.
- **Predictions:** flames, then lightning bolts, for promising upcoming matches.
- **Data:** spoiler-free summaries for every match from 17 Nov on; fixes to two breakdowns.

### 24 November 2026
- **Redesign:** green top section with the date bar, update status and calendar; tab bar with Matches, Season, Favourites and Options.
- **Match window ("scoreboard card"):** league, round, date, both teams and a large rating; Show score, Breakdown and highlights.
- **Season and Favourites**
  - Tap a team for its window.
  - Expandable team tables.
  - Animated adding and removing of favourites.
- **Calendar:** any day can be picked, including the coming days with their predictions.
- **App behaviour**
  - A start screen, animations and swiping between days.
  - Every pop-up dims the page and closes with a tap outside.
  - Updates arrive right away (network first, reload once).
- The "Outlook" folded into the week view, with predictions for the coming matches.

### 23 November 2026
- The app is published: first upload of the installable web app and the ratings from 22 November.
- Before that, the ratings came as a daily email digest, which was switched off once the app replaced it.

---

## Not merged (kept for reference)

- **#14** App icon: black pentagon on white (its branch `icon-black-white` still exists).
- **#15** Start screen alignment, folded into #16.

## Open backlog at v1.0

- #1 League table view you can switch to
- #2 Team graph: compare match rating with league position or points won
- #4 Reconcile the two colour scales
- #5 Consistent pop-up patterns
- #6 Date bar tags (this week / today …) — partly covered by "Last seven days" / "Next seven days"
- #8 Detailed statistical analysis, especially forecasting
- #9 Add the Champions League
