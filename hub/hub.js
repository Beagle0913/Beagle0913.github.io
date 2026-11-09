/* Project hub: shared behaviour.
 *
 * Everything that lists projects reads projects.json at the site root, so adding
 * a project never means editing this file. It:
 *   - draws the project bar (all projects, previous/next, dropdown, counter) on any
 *     page with <body data-project="ID">, where ID matches an entry in projects.json
 *   - draws the project list into <ol id="project-list"></ol> on the home page
 */
(function () {
  'use strict';

  var script = document.currentScript;
  // hub/hub.js lives one level below the site root.
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

  function projectUrl(p) { return new URL(p.path, ROOT).href; }

  /* ---------- project bar on a project page ---------- */
  function renderBar(projects, currentId) {
    var i = projects.findIndex(function (p) { return p.id === currentId; });
    if (i < 0) return;
    var n = projects.length;
    var prev = projects[(i - 1 + n) % n];
    var next = projects[(i + 1) % n];

    var select = el('select', { id: 'project-select', 'aria-label': 'Choose a project' },
      projects.map(function (p) {
        var o = el('option', { value: projectUrl(p), text: p.name });
        if (p.id === currentId) o.selected = true;
        return o;
      }));
    select.addEventListener('change', function () { location.href = select.value; });

    var bar = el('nav', { class: 'hubbar', 'aria-label': 'Projects' }, [
      el('div', { class: 'hubbar-in' }, [
        el('a', { class: 'hb-home', href: ROOT.href, text: '← All projects' }),
        n > 1 ? el('a', { class: 'hb-cyc', id: 'project-prev', href: projectUrl(prev), title: 'Previous: ' + prev.name, 'aria-label': 'Previous project: ' + prev.name, text: '‹' }) : null,
        select,
        n > 1 ? el('a', { class: 'hb-cyc', id: 'project-next', href: projectUrl(next), title: 'Next: ' + next.name, 'aria-label': 'Next project: ' + next.name, text: '›' }) : null,
        el('span', { class: 'hb-count', text: (i + 1) + '/' + n })
      ])
    ]);
    var slot = document.getElementById('hubbar');
    if (slot) slot.replaceWith(bar); else document.body.prepend(bar);
    // Reset the dropdown when the page comes back from the browser's back/forward cache.
    window.addEventListener('pageshow', function () { select.value = projectUrl(projects[i]); });
  }

  /* ---------- home page list ---------- */
  function renderList(projects) {
    var list = document.getElementById('project-list');
    if (!list) return;
    list.replaceChildren.apply(list, projects.map(function (p, k) {
      return el('li', {}, [
        el('a', { class: 'hub-row', href: projectUrl(p) }, [
          el('span', { class: 'hub-no', text: String(k + 1).padStart(2, '0') }),
          el('h2', { text: p.name }),
          el('span', { class: 'hub-kind', text: [p.kind, p.added].filter(Boolean).join(' · ') }),
          el('p', { class: 'hub-sum', text: p.summary || '' }),
          el('div', { class: 'hub-tags' }, (p.tags || []).map(function (t) {
            return el('span', { class: 'hub-tag', text: t });
          }).concat([el('span', { class: 'hub-open', text: 'Open →' })]))
        ])
      ]);
    }));
    var count = document.getElementById('project-count');
    if (count) count.textContent = projects.length + (projects.length === 1 ? ' project' : ' projects');
  }

  function showError(msg) {
    var list = document.getElementById('project-list');
    if (list) list.replaceChildren(el('li', { class: 'hub-error', text: msg }));
  }

  function init() {
    fetch(new URL('projects.json', ROOT))
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        var projects = data.projects || [];
        var currentId = document.body.dataset.project;
        if (currentId) renderBar(projects, currentId);
        renderList(projects);
      })
      .catch(function () {
        showError('The project list could not be loaded. Refresh the page to try again.');
      });
  }

  if (document.body) init(); else document.addEventListener('DOMContentLoaded', init);
})();
