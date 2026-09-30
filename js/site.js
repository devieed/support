(function () {
  var langSwitch = document.querySelector("[data-lang-switch]");
  if (langSwitch) {
    var langBtn = langSwitch.querySelector(".lang-btn");
    var langMenu = langSwitch.querySelector(".lang-menu");
    var closeLang = function () {
      langSwitch.classList.remove("is-open");
      langBtn.setAttribute("aria-expanded", "false");
      langMenu.hidden = true;
    };
    langBtn.addEventListener("click", function () {
      var open = langSwitch.classList.toggle("is-open");
      langBtn.setAttribute("aria-expanded", open ? "true" : "false");
      langMenu.hidden = !open;
    });
    document.addEventListener("click", function (event) {
      if (!langSwitch.contains(event.target)) closeLang();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeLang();
    });
    var langLinks = langMenu.querySelectorAll("[data-lang]");
    for (var i = 0; i < langLinks.length; i++) {
      langLinks[i].addEventListener("click", function (event) {
        try {
          localStorage.setItem("zx-lang", event.currentTarget.getAttribute("data-lang"));
        } catch (e) {}
        event.preventDefault();
        window.location.href = event.currentTarget.getAttribute("href") + window.location.hash;
      });
    }
  }

  var persist = document.body && document.body.getAttribute("data-persist-lang");
  if (persist) {
    try {
      if (!localStorage.getItem("zx-lang")) localStorage.setItem("zx-lang", persist);
    } catch (e) {}
  }

  var sections = document.querySelectorAll("[data-section]");
  if (sections.length && "IntersectionObserver" in window) {
    var tabs = document.querySelectorAll("[data-tab]");
    var navs = document.querySelectorAll("[data-nav]");
    var setActive = function (id) {
      for (var i = 0; i < tabs.length; i++) tabs[i].classList.toggle("is-active", tabs[i].getAttribute("data-tab") === id);
      for (var j = 0; j < navs.length; j++) navs[j].classList.toggle("is-active", navs[j].getAttribute("data-nav") === id);
    };
    var visible = {};
    var observer = new IntersectionObserver(
      function (entries) {
        for (var k = 0; k < entries.length; k++) {
          visible[entries[k].target.getAttribute("data-section")] = entries[k].isIntersecting;
        }
        var current = "";
        for (var s = 0; s < sections.length; s++) {
          var id = sections[s].getAttribute("data-section");
          if (visible[id]) {
            current = id;
            break;
          }
        }
        setActive(current);
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    for (var n = 0; n < sections.length; n++) observer.observe(sections[n]);
  }

  var bundle = document.getElementById("not-found-i18n");
  if (!bundle) return;

  function mapLang(tag) {
    if (!tag) return "en";
    var t = String(tag).toLowerCase().replace(/_/g, "-");
    if (t === "zh-tw" || t === "zh-hk" || t === "zh-mo" || t.indexOf("zh-hant") === 0) return "zh-Hant";
    if (t === "zh" || t.indexOf("zh-") === 0) return "zh-Hans";
    var base = t.split("-")[0];
    if (base === "es" || base === "ja" || base === "ko" || base === "de" || base === "fr") return base;
    return "en";
  }

  var saved = "en";
  try {
    saved = localStorage.getItem("zx-lang") || mapLang((navigator.languages && navigator.languages[0]) || navigator.language);
  } catch (e) {
    saved = mapLang((navigator.languages && navigator.languages[0]) || navigator.language);
  }

  var dict;
  try {
    dict = JSON.parse(bundle.textContent);
  } catch (e) {
    return;
  }
  var pack = dict[saved] || dict.en;
  if (!pack) return;
  var title = document.getElementById("not-found-title");
  var lead = document.getElementById("not-found-lead");
  var cta = document.getElementById("not-found-cta");
  if (title) title.textContent = pack.title;
  if (lead) lead.textContent = pack.lead;
  if (cta) {
    cta.textContent = pack.cta;
    cta.setAttribute("href", saved === "en" ? "/" : "/" + saved + "/");
  }
  document.documentElement.lang = saved;
  document.title = pack.pageTitle;
})();
