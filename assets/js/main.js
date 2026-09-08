// GreenSplit site behavior

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  // Mobile navigation
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Footer year
  var year = document.querySelector("[data-year]");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Reference: open or close every collapsed member list at once, so the whole
  // page can be searched with the browser's own find.
  var expandAll = document.querySelector("[data-expand-all]");
  var groups = document.querySelectorAll("details.reference-group");

  if (expandAll && groups.length) {
    expandAll.addEventListener("click", function () {
      var open = expandAll.getAttribute("aria-pressed") !== "true";

      for (var i = 0; i < groups.length; i++) {
        groups[i].open = open;
      }

      expandAll.setAttribute("aria-pressed", open ? "true" : "false");
      expandAll.textContent = open
        ? "Collapse all member lists"
        : "Expand all member lists";
    });
  }

  // Documentation table of contents
  var toc = document.querySelector(".toc");
  var tocToggle = document.querySelector(".toc-toggle");
  var tocLinks = Array.prototype.slice.call(
    document.querySelectorAll(".toc nav a[href^='#']")
  );

  if (toc && tocToggle) {
    tocToggle.addEventListener("click", function () {
      var open = toc.classList.toggle("open");
      tocToggle.setAttribute("aria-expanded", open ? "true" : "false");
      tocToggle.textContent = open ? "Hide" : "Show";
    });

    tocLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 900px)").matches) {
          toc.classList.remove("open");
          tocToggle.setAttribute("aria-expanded", "false");
          tocToggle.textContent = "Show";
        }
      });
    });
  }

  if (tocLinks.length) {
    var tocTargets = tocLinks.map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    }).filter(Boolean);
    var ticking = false;

    function setActiveTocLink() {
      var current = tocTargets[0];

      tocTargets.forEach(function (target) {
        if (target.getBoundingClientRect().top <= 130) {
          current = target;
        }
      });

      tocLinks.forEach(function (link) {
        var active = current && link.getAttribute("href") === "#" + current.id;
        link.classList.toggle("active", active);
        if (active) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });

      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(setActiveTocLink);
        ticking = true;
      }
    }, { passive: true });
    setActiveTocLink();
  }
})();
