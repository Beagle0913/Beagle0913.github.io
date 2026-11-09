# Beagle0913 projects

A shelf of small projects served by GitHub Pages at https://beagle0913.github.io.
The home page lists every project, and every project page has a bar at the top for switching to another project or coming back to the list.

## Layout

```
index.html        Home page. Lists every project from projects.json.
projects.json     The list of projects. The home page and the project bar both read this file.
hub/hub.css       Styles for the home page and the project bar.
hub/hub.js        Draws the project list (home page) and the project bar (project pages).
404.html          Shown for addresses that do not exist; lists the projects.
math-trainer/     GMC Math Trainer (see its README).
moto-routes/      Vilnius Moto Routes (see its README).
routes/, asveja-loop.html   Redirects from the addresses the moto routes had before they moved.
```

Each project lives in its own folder and keeps its own styles and scripts, so projects cannot break each other.

## Add a project

1. Make a folder at the site root (lower-case, hyphens, e.g. `plant-log/`) with an `index.html` in it.
2. In that page's `<head>` add the hub files, and mark the body with the project's id:

```html
<link rel="stylesheet" href="../hub/hub.css">
<script src="../hub/hub.js" defer></script>
...
<body data-project="plant-log">
<div id="hubbar"></div>
```

   The bar is drawn where `<div id="hubbar"></div>` is. Pages deeper inside the folder use a longer path (`../../hub/hub.js`).
3. Add an entry to `projects.json`:

```json
{
  "id": "plant-log",
  "name": "Plant Log",
  "path": "plant-log/",
  "kind": "Tracker",
  "summary": "One or two sentences for the home page.",
  "tags": ["Plants"],
  "added": "2026-12-01"
}
```

The order of `projects` in `projects.json` is the order on the home page and of the previous/next arrows.

## Safety rules the pages follow

- Every page carries a `Content-Security-Policy` meta tag: scripts and data load only from this site, styles from this site and Google Fonts, and nothing else. A new project should copy that tag from an existing page. If a project really needs an inline script or another host, loosen the tag on that project's pages only.
- Text that comes from `projects.json`, `routes.json` or from what a visitor types is always put on the page as plain text, never as HTML.
- Links built from those files are checked to stay on this site.
- Nothing is collected or sent anywhere. The math trainer keeps its progress in the visitor's own browser.

## Preview locally

`projects.json` is loaded with `fetch`, which browsers block for `file://` pages. Serve the folder instead:

```
python3 -m http.server 8000
```

then open http://localhost:8000.
