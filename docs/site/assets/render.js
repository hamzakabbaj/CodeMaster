/* CodeMaster docs site renderer — classic script (no modules, no fetch), so it
   works over file://. Reads window.CM.site + window.CM.pages[slug] and builds
   the page from typed content blocks. Add content by editing data/*.js. */
(function () {
  "use strict";

  var CM = window.CM || {};
  var site = CM.site || {};
  var slug = document.body.getAttribute("data-page") || "overview";
  var page = (CM.pages || {})[slug] || { title: "", blocks: [] };

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (attrs[k] == null) return;
        if (k === "class") n.className = attrs[k];
        else if (k === "html") n.innerHTML = attrs[k];
        else if (k === "text") n.textContent = attrs[k];
        else n.setAttribute(k, attrs[k]);
      });
    }
    (kids || []).forEach(function (c) {
      if (c == null) return;
      n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return n;
  }

  function currentFile() {
    var f = location.pathname.split("/").pop();
    return f && f.length ? f : "index.html";
  }

  /* ---- chrome: header + footer ---- */
  function header() {
    var here = currentFile();
    var links = (site.nav || []).map(function (item) {
      return el("a", {
        href: item.href,
        class: item.href === here ? "active" : null,
        text: item.label,
      });
    });
    return el("header", { class: "site-header" }, [
      el("nav", { class: "nav" }, [
        el("a", { class: "brand", href: "index.html" }, [
          el("span", { class: "dot" }),
          site.name || "CodeMaster",
        ]),
        el("div", { class: "nav-links" }, links),
      ]),
    ]);
  }

  function footer() {
    return el("footer", { class: "site-footer" }, [
      el("div", { class: "wrap" }, [
        el("span", { class: "f-brand", text: site.footer || site.name || "" }),
        el("span", { class: "f-note", text: site.note || "" }),
      ]),
    ]);
  }

  /* ---- block builders ---- */
  function sectionHead(b) {
    return el("div", { class: "section-head" }, [
      b.kicker ? el("span", { class: "kicker", text: b.kicker }) : null,
      b.title ? el("h2", { text: b.title }) : null,
      b.intro ? el("p", { class: "intro", html: b.intro }) : null,
    ]);
  }

  var BLOCK = {
    hero: function (b) {
      var stats = (b.meta || []).map(function (m) {
        return el("div", { class: "stat" }, [
          el("div", { class: "v", text: m.value }),
          el("div", { class: "l", text: m.label }),
        ]);
      });
      var acts = (b.actions || []).map(function (a) {
        return el("a", { class: "btn" + (a.primary ? " primary" : ""), href: a.href, text: a.label });
      });
      return el("section", { class: "block hero" }, [
        b.kicker ? el("span", { class: "kicker", text: b.kicker }) : null,
        el("h1", { text: b.title }),
        b.subtitle ? el("p", { class: "subtitle", html: b.subtitle }) : null,
        stats.length ? el("div", { class: "hero-meta" }, stats) : null,
        acts.length ? el("div", { class: "actions" }, acts) : null,
      ]);
    },

    section: function (b) {
      return el("section", { class: "block", id: b.id || null }, [sectionHead(b)]);
    },

    prose: function (b) {
      return el("section", { class: "block prose", html: b.html });
    },

    cards: function (b) {
      var items = (b.items || []).map(function (c) {
        var inner = [
          c.tag ? el("span", { class: "tag", text: c.tag }) : null,
          el("h3", { text: c.title }),
          c.body ? el("div", { class: "body", html: c.body }) : null,
          c.meta ? el("div", { class: "meta", text: c.meta }) : null,
          c.href ? el("span", { class: "arrow", text: "↗" }) : null,
        ];
        return el(c.href ? "a" : "div", { class: "card", href: c.href || null }, inner);
      });
      return el("section", { class: "block" }, [
        b.title || b.kicker ? sectionHead(b) : null,
        el("div", { class: "cards" + (b.columns === 2 ? " cols-2" : "") }, items),
      ]);
    },

    table: function (b) {
      var head = el("thead", null, [
        el("tr", null, (b.headers || []).map(function (h) { return el("th", { html: h }); })),
      ]);
      var body = el("tbody", null, (b.rows || []).map(function (r) {
        return el("tr", null, r.map(function (cell) { return el("td", { html: cell }); }));
      }));
      return el("section", { class: "block" }, [
        b.title || b.kicker ? sectionHead(b) : null,
        el("div", { class: "tbl-wrap" }, [el("table", null, [head, body])]),
      ]);
    },

    steps: function (b) {
      var items = (b.items || []).map(function (s) {
        return el("div", { class: "step" }, [
          el("div", { class: "n" }),
          el("div", null, [
            el("h4", { text: s.title }),
            s.body ? el("p", { html: s.body }) : null,
          ]),
        ]);
      });
      return el("section", { class: "block" }, [
        b.title || b.kicker ? sectionHead(b) : null,
        el("div", { class: "steps" }, items),
      ]);
    },

    flow: function (b) {
      var kids = [];
      (b.nodes || []).forEach(function (node, i) {
        if (i) kids.push(el("span", { class: "sep", text: "→" }));
        kids.push(el("span", { class: "node", text: node }));
      });
      return el("section", { class: "block" }, [
        b.title || b.kicker ? sectionHead(b) : null,
        el("div", { class: "flow" }, kids),
      ]);
    },

    ladder: function (b) {
      var rungs = (b.items || []).map(function (r) {
        return el("div", { class: "rung" }, [
          el("div", { class: "lvl", text: r.level }),
          el("div", null, [
            el("h4", { text: r.title }),
            r.body ? el("p", { html: r.body }) : null,
          ]),
        ]);
      });
      return el("section", { class: "block" }, [
        b.title || b.kicker ? sectionHead(b) : null,
        el("div", { class: "ladder" }, rungs),
      ]);
    },

    phases: function (b) {
      var STATUS = {
        done: ["done", "✅ done"], prog: ["prog", "🟦 in progress"],
        todo: ["todo", "⬜ todo"], blocked: ["blocked", "⏸️ blocked"],
      };
      var rows = (b.items || []).map(function (p) {
        var s = STATUS[p.status] || STATUS.todo;
        return el("div", { class: "phase" }, [
          el("span", { class: "pname", text: p.name }),
          el("span", { class: "badge " + s[0], text: s[1] }),
          p.note ? el("span", { class: "pnote", html: p.note }) : null,
          p.tickets ? el("span", { class: "tickets", text: p.tickets }) : null,
        ]);
      });
      return el("section", { class: "block" }, [
        b.title || b.kicker ? sectionHead(b) : null,
        el("div", { class: "phases" }, rows),
      ]);
    },

    callout: function (b) {
      return el("section", { class: "block" }, [
        el("div", { class: "callout" + (b.variant === "principle" ? " principle" : "") }, [
          b.title ? el("div", { class: "ctitle", text: b.title }) : null,
          el("p", { html: b.html }),
        ]),
      ]);
    },

    code: function (b) {
      return el("section", { class: "block" }, [
        el("div", { class: "code-block" }, [
          b.caption ? el("div", { class: "cap", text: b.caption }) : null,
          el("pre", null, [el("code", { text: b.text })]),
        ]),
      ]);
    },

    divider: function () { return el("hr", { class: "divider" }); },
  };

  function unknown(b) {
    return el("section", { class: "block prose" }, [
      el("p", { text: "[unknown block type: " + (b && b.type) + "]" }),
    ]);
  }

  /* ---- mount ---- */
  var root = document.getElementById("app") || document.body;
  root.appendChild(header());
  var main = el("main", null, [el("div", { class: "wrap" }, (function () {
    return (page.blocks || []).map(function (b, i) {
      var node = (BLOCK[b.type] || unknown)(b);
      if (node) { node.classList.add("reveal"); node.style.setProperty("--i", i); }
      return node;
    });
  })())]);
  root.appendChild(main);
  root.appendChild(footer());

  document.title = (page.title ? page.title + " · " : "") + (site.name || "CodeMaster");
})();
