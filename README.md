# Sumist Kumar Khatri | 3D Anime Portfolio

A 3D anime-style portfolio built with plain HTML, CSS, JavaScript and three.js (no build step).

## Structure

```
index.html      page markup (sections, content)
css/style.css   all styling and CSS animations
js/ui.js        cursor, typing text, reveal animations, intro, sound, click effects
js/scene.js     three.js world: toon shading, torii gate, islands, companion, camera flight
```

## Run locally

Open `index.html` in a browser, or serve the folder (for example `python3 -m http.server`) and visit `http://localhost:8000`.

## Deploy with GitHub Pages

1. Push this folder to a GitHub repo (name it `<username>.github.io` for a clean URL).
2. Go to Settings, then Pages. Set the source to **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Open the URL GitHub shows after a minute or two.

## Edit your content

- Missions: the cards inside `<section id="work">` in `index.html`. Turn each `<div class="card rv">` into a link when your live URLs are ready.
- Skills: the array of names near the top of `js/ui.js`.
- Colors: the CSS variables at the top of `css/style.css`.
