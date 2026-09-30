# Vilnius Moto Routes

Motorcycle route plans served by GitHub Pages at https://beagle0913.github.io.

## Layout

```
index.html               Home page. Lists every route from routes.json.
routes.json              The list of routes. Everything that shows routes reads this file.
assets/site.css          Shared styles and colour tokens (light and dark theme).
assets/site.js           Shared behaviour: route bar, download buttons, home page cards.
routes/<id>/index.html   One road-book page per route.
routes/<id>/*.gpx|*.kml  That route's files, next to its page.
asveja-loop.html         Redirect from the old address of the Asveja loop.
```

## Add a route

1. Make a folder `routes/<id>/` (lower-case, hyphens, e.g. `routes/nemunas-valley/`).
2. Put the route's GPX/KML files in it.
3. Copy an existing `routes/*/index.html` into it and change the content. Keep these lines:
   - `<link rel="stylesheet" href="../../assets/site.css">`
   - `<script src="../../assets/site.js" defer></script>`
   - `<body data-route="<id>">`, where `<id>` matches the folder name
   - `<div id="routebar"></div>` at the top of the body (the route bar is drawn here)
   - `<div data-route-downloads></div>` wherever the download buttons should go
4. Add an entry to `routes.json`:

```json
{
  "id": "nemunas-valley",
  "name": "Nemunas Valley Ride",
  "path": "routes/nemunas-valley/",
  "days": 1,
  "distance_km": 450,
  "start": "Vilnius",
  "via": "Vilnius → Birštonas → Kaunas → Jurbarkas → Vilnius",
  "summary": "One or two sentences for the home page card.",
  "tags": ["Day loop", "Sweepers"],
  "files": [{ "label": "Route GPX", "href": "nemunas-valley.gpx" }],
  "added": "2026-10-01"
}
```

The order of `routes` in `routes.json` is the order of the home page and of the previous/next cycling. The home page, dropdown, arrows, counter and download buttons all update from that file.

## Add a feature

Put new behaviour in `assets/site.js` as its own function and call it from `init()`, which already has the parsed `routes.json`. Extra route fields (for example `season` or `difficulty`) can be added to `routes.json` without breaking anything, since fields nothing reads are ignored.

## Preview locally

`routes.json` is loaded with `fetch`, which browsers block for `file://` pages. Serve the folder instead:

```
python3 -m http.server 8000
```

then open http://localhost:8000.
