/* Ride pages: shared site behaviour.
 *
 * Everything that lists routes reads routes.json, so adding a route never means
 * editing this file. It currently:
 *   - renders the route bar (dropdown + previous/next + counter) on any page with
 *     <body data-route="ID">, where ID matches an entry in routes.json
 *   - fills <div data-route-downloads></div> on a route page with that route's files
 *   - renders the route cards into <div id="route-list"></div> on the home page
 * Add new features as further small functions and call them from init().
 */
(function () {
  'use strict';

  var script = document.currentScript;
  // assets/site.js lives one level below the site root.
  var ROOT = new URL('../', script.src);

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'class') n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }

  function routeUrl(r) { return new URL(r.path, ROOT).href; }

  function daysLabel(r) { return r.days === 1 ? '1 day' : r.days + ' days'; }

  /* ---------- route bar ---------- */
  function renderBar(routes, currentId) {
    var i = routes.findIndex(function (r) { return r.id === currentId; });
    if (i < 0) return;
    var n = routes.length;
    var prev = routes[(i - 1 + n) % n];
    var next = routes[(i + 1) % n];

    var select = el('select', { id: 'route-select', 'aria-label': 'Choose a route' },
      routes.map(function (r) {
        var o = el('option', { value: routeUrl(r), text: r.name + ' · ' + daysLabel(r) });
        if (r.id === currentId) o.selected = true;
        return o;
      }));
    select.addEventListener('change', function () { location.href = select.value; });

    var bar = el('nav', { class: 'routebar', 'aria-label': 'Routes' }, [
      el('div', { class: 'routebar-in' }, [
        el('a', { class: 'home', href: ROOT.href, text: 'All routes' }),
        el('a', { class: 'cyc', id: 'route-prev', href: routeUrl(prev), title: 'Previous: ' + prev.name, 'aria-label': 'Previous route: ' + prev.name, text: '‹' }),
        select,
        el('a', { class: 'cyc', id: 'route-next', href: routeUrl(next), title: 'Next: ' + next.name, 'aria-label': 'Next route: ' + next.name, text: '›' }),
        el('span', { class: 'count', text: (i + 1) + '/' + n })
      ])
    ]);
    var slot = document.getElementById('routebar');
    if (slot) slot.replaceWith(bar); else document.body.prepend(bar);

    document.addEventListener('keydown', function (e) {
      if (e.target.closest('input, select, textarea') || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'ArrowLeft') location.href = routeUrl(prev);
      if (e.key === 'ArrowRight') location.href = routeUrl(next);
    });
    // Reset the dropdown when the page comes back from the browser's back/forward cache.
    window.addEventListener('pageshow', function () { select.value = routeUrl(routes[i]); });
  }

  /* ---------- downloads on a route page ---------- */
  function renderDownloads(route) {
    document.querySelectorAll('[data-route-downloads]').forEach(function (slot) {
      var files = route.files || [];
      slot.className = 'gm-row';
      slot.replaceChildren.apply(slot, files.map(function (f, k) {
        return el('a', {
          class: 'btn' + (k < files.length - 1 ? ' primary' : ''),
          href: new URL(f.href, routeUrl(route)).href,
          download: '',
          text: 'Download ' + f.label
        });
      }));
    });
  }

  /* ---------- home page cards ---------- */
  function renderList(routes) {
    var list = document.getElementById('route-list');
    if (!list) return;
    list.replaceChildren.apply(list, routes.map(function (r) {
      return el('a', { class: 'route-card', href: routeUrl(r) }, [
        el('p', { class: 'eyebrow', text: daysLabel(r) + ' · ' + r.distance_km + ' km · from ' + r.start }),
        el('h2', { text: r.name }),
        el('p', { class: 'route-line', text: r.via }),
        el('p', { class: 'summary', text: r.summary }),
        el('div', { class: 'tags' }, (r.tags || []).map(function (t) {
          return el('span', { class: 'chip tag', text: t });
        })),
        el('span', { class: 'open', text: 'Open route →' })
      ]);
    }));
    var count = document.getElementById('route-count');
    if (count) count.textContent = routes.length + (routes.length === 1 ? ' route' : ' routes');
  }

  function showError(msg) {
    var list = document.getElementById('route-list');
    if (list) list.replaceChildren(el('p', { class: 'load-error', text: msg }));
  }

  function init() {
    fetch(new URL('routes.json', ROOT))
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        var routes = data.routes || [];
        var currentId = document.body.dataset.route;
        if (currentId) {
          renderBar(routes, currentId);
          var cur = routes.find(function (r) { return r.id === currentId; });
          if (cur) renderDownloads(cur);
        }
        renderList(routes);
      })
      .catch(function () {
        showError('The route list could not be loaded. Refresh the page to try again.');
      });
  }

  init();
})();
