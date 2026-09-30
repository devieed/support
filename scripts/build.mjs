import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "dist");
const contentDir = path.join(root, "content");

const LANGS = [
  { id: "en", html: "en", og: "en_US", prefix: "" },
  { id: "zh-Hans", html: "zh-Hans", og: "zh_CN", prefix: "/zh-Hans" },
  { id: "zh-Hant", html: "zh-Hant", og: "zh_TW", prefix: "/zh-Hant" },
  { id: "es", html: "es", og: "es_ES", prefix: "/es" },
  { id: "ja", html: "ja", og: "ja_JP", prefix: "/ja" },
  { id: "ko", html: "ko", og: "ko_KR", prefix: "/ko" },
  { id: "de", html: "de", og: "de_DE", prefix: "/de" },
  { id: "fr", html: "fr", og: "fr_FR", prefix: "/fr" },
];

const LANG_LABELS = {
  en: "English",
  "zh-Hans": "简体中文",
  "zh-Hant": "繁體中文",
  es: "Español",
  ja: "日本語",
  ko: "한국어",
  de: "Deutsch",
  fr: "Français",
};

const SECTIONS = [
  { id: "game", anchor: "games", title: "games", lead: "gamesLead", empty: "emptyGames" },
  { id: "app", anchor: "apps", title: "apps", lead: "appsLead", empty: "emptyApps" },
  { id: "site", anchor: "sites", title: "sites", lead: "sitesLead", empty: "emptySites" },
];

const ICONS = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.5v17a1 1 0 0 0 1.5.86l14-8.5a1 1 0 0 0 0-1.72l-14-8.5A1 1 0 0 0 5 3.5Z" fill="currentColor"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10.5 18.5h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  flask: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6A2 2 0 0 0 19 18l-5-9V3" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M7.5 15h9" stroke="currentColor" stroke-width="2"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  external: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v6c0 4.5 3 7.7 7 9 4-1.3 7-4.5 7-9V6l-7-3Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  doc: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 3v5h5M9 13h6M9 17h6" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  game: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8h10a4 4 0 0 1 4 4v1.5a3.5 3.5 0 0 1-6.3 2.1L14 15h-4l-.7.6A3.5 3.5 0 0 1 3 13.5V12a4 4 0 0 1 4-4Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8 11v3M6.5 12.5h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="15.5" cy="11.5" r="1" fill="currentColor"/><circle cx="17.5" cy="13.5" r="1" fill="currentColor"/></svg>',
  app: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="7" height="7" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="13" y="4" width="7" height="7" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="4" y="13" width="7" height="7" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="13" y="13" width="7" height="7" rx="2" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
};
ICONS.site = ICONS.globe;

const site = JSON.parse(fs.readFileSync(path.join(contentDir, "site.json"), "utf8"));
const apps = JSON.parse(fs.readFileSync(path.join(contentDir, "apps.json"), "utf8"));
const messages = Object.fromEntries(
  LANGS.map((lang) => [lang.id, JSON.parse(fs.readFileSync(path.join(contentDir, "i18n", `${lang.id}.json`), "utf8"))]),
);

assertSameKeys(messages.en);
validateApps(apps);

const host = new URL(site.domain).host;
const privacyHtml = fs
  .readFileSync(path.join(contentDir, "legal", "privacy.html"), "utf8")
  .replaceAll("support.z-rex.net", host)
  .replaceAll("support@z-rex.net", site.email);
const termsHtml = fs
  .readFileSync(path.join(contentDir, "legal", "terms.html"), "utf8")
  .replaceAll("support.z-rex.net", host)
  .replaceAll("support@z-rex.net", site.email);

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
for (const dir of ["apps", "beta", "privacy", "terms", ...LANGS.filter((lang) => lang.prefix).map((lang) => lang.id)]) {
  fs.rmSync(path.join(root, dir), { recursive: true, force: true });
}
for (const file of ["index.html", "404.html", "sitemap.xml"]) fs.rmSync(path.join(root, file), { force: true });

const sitemap = [];

for (const lang of LANGS) {
  const bundle = messages[lang.id];
  writePage(lang, "/", "index.html", "home", {
    title: bundle.meta.homeTitle,
    description: bundle.meta.homeDescription,
    main: renderHome(lang, bundle),
    index: true,
    image: site.ogImage,
  });
  writePage(lang, "/beta/", "beta/index.html", "beta", {
    title: `${bundle.meta.betaTitle} · ${bundle.meta.siteName}`,
    description: bundle.meta.betaDescription,
    main: renderBeta(lang, bundle),
    index: true,
    image: site.ogImage,
  });
  writePage(lang, "/privacy/", "privacy/index.html", "privacy", {
    title: `${bundle.meta.privacyTitle} · ${bundle.meta.siteName}`,
    description: bundle.meta.privacyDescription,
    main: renderLegal(lang, bundle, bundle.meta.privacyTitle, privacyHtml),
    index: lang.id === "en",
    canonical: "/privacy/",
  });
  writePage(lang, "/terms/", "terms/index.html", "terms", {
    title: `${bundle.meta.termsTitle} · ${bundle.meta.siteName}`,
    description: bundle.meta.termsDescription,
    main: renderLegal(lang, bundle, bundle.meta.termsTitle, termsHtml),
    index: lang.id === "en",
    canonical: "/terms/",
  });
  for (const app of apps) {
    const text = appText(app, lang.id);
    writePage(lang, `/apps/${app.slug}/`, `apps/${app.slug}/index.html`, "app", {
      title: `${text.name} · ${bundle.meta.siteName}`,
      description: text.summary,
      main: renderApp(lang, bundle, app, text),
      index: !app.sample,
      image: assetUrl(app.cover) || assetUrl(app.icon) || site.ogImage,
      jsonLd: app.sample ? "" : appJsonLd(lang, app, text),
    });
  }
}

write404();
writeSitemap();
copyStatic();
console.log(`Built ${LANGS.length} languages, ${apps.length} listings into dist/.`);

function writePage(lang, basePath, relFile, active, page) {
  const canonicalPath = page.canonical || withPrefix(lang, basePath);
  const html = shell(lang, basePath, active, {
    title: page.title,
    description: page.description,
    canonicalPath,
    robots: page.index ? "index, follow" : "noindex, follow",
    hreflang: !page.canonical,
    image: page.image ? absAsset(page.image) : "",
    jsonLd: [websiteJsonLd(lang), page.jsonLd].filter(Boolean),
    main: page.main,
    redirect: lang.id === "en" && !page.canonical,
  });
  const out = path.join(outDir, lang.prefix.replace(/^\//, ""), relFile);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  if (page.index) {
    sitemap.push({
      loc: abs(withPrefix(lang, basePath)),
      alternates: page.canonical ? [] : LANGS.map((item) => ({ lang: item.id, href: abs(withPrefix(item, basePath)) })),
    });
  }
}

function shell(lang, basePath, active, page) {
  const bundle = messages[lang.id];
  const canonical = abs(page.canonicalPath);
  const alternates = page.hreflang
    ? `${LANGS.map((item) => `    <link rel="alternate" hreflang="${item.html}" href="${esc(abs(withPrefix(item, basePath)))}">`).join("\n")}
    <link rel="alternate" hreflang="x-default" href="${esc(abs(withPrefix(LANGS[0], basePath)))}">`
    : "";
  const ogAlternates = LANGS.filter((item) => item.id !== lang.id)
    .map((item) => `    <meta property="og:locale:alternate" content="${item.og}">`)
    .join("\n");
  const image = page.image
    ? `    <meta property="og:image" content="${esc(page.image)}">\n    <meta name="twitter:image" content="${esc(page.image)}">`
    : "";
  const ld = (page.jsonLd || []).map((block) => `<script type="application/ld+json">${block}</script>`).join("\n    ");
  return `<!DOCTYPE html>
<html lang="${lang.html}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>${esc(page.title)}</title>
    <meta name="description" content="${esc(page.description)}">
    <meta name="robots" content="${page.robots}">
    <meta name="theme-color" content="#f4f5f9">
    <link rel="canonical" href="${esc(canonical)}">
${alternates}
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${esc(bundle.meta.siteName)}">
    <meta property="og:title" content="${esc(page.title)}">
    <meta property="og:description" content="${esc(page.description)}">
    <meta property="og:url" content="${esc(canonical)}">
    <meta property="og:locale" content="${lang.og}">
${ogAlternates}
${image}
    <meta name="twitter:card" content="${page.image ? "summary_large_image" : "summary"}">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/site.css">
    ${ld}
    ${page.redirect ? redirectScript() : ""}
  </head>
  <body data-persist-lang="${lang.id}" data-page="${active || "other"}">
    <a class="skip" href="#main">${esc(bundle.nav.skip)}</a>
    ${header(lang, basePath, active)}
    <main id="main" tabindex="-1">
      ${page.main}
    </main>
    ${footer(lang, active)}
    <script src="/js/site.js" defer></script>
  </body>
</html>
`;
}

function header(lang, basePath, active) {
  const bundle = messages[lang.id];
  const home = withPrefix(lang, "/");
  const sectionLinks = SECTIONS.map(
    (section) => `<a href="${esc(home)}#${section.anchor}" data-nav="${section.anchor}">${esc(bundle.home[section.title])}</a>`,
  ).join("");
  return `<header class="site-header">
      <div class="wrap header-inner">
        <a class="brand" href="${esc(home)}" aria-label="${esc(bundle.meta.siteName)}">
          <span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M9 9.5h14M22 9.5 10 22.5M9 22.5h14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
          <span class="brand-text">
            <strong>${esc(site.name)}</strong>
            <small>${esc(site.supportLabel)}</small>
          </span>
        </a>
        <nav class="nav" aria-label="${esc(bundle.nav.browse)}">
          ${sectionLinks}
          <a href="${esc(withPrefix(lang, "/beta/"))}" class="nav-beta"${active === "beta" ? ' aria-current="page"' : ""}>${ICONS.flask}<span>${esc(bundle.nav.testing)}</span></a>
        </nav>
        <div class="lang" data-lang-switch>
          <button type="button" class="lang-btn" aria-expanded="false" aria-haspopup="listbox" aria-controls="lang-menu" aria-label="${esc(bundle.nav.language)}">
            ${ICONS.globe}
            <span>${esc(LANG_LABELS[lang.id])}</span>
            <svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <ul class="lang-menu" id="lang-menu" role="listbox" hidden>${LANGS.map((itemLang) => {
            const current = itemLang.id === lang.id;
            return `<li><a role="option" href="${esc(langHref(itemLang, basePath))}" data-lang="${itemLang.id}"${current ? ' aria-selected="true"' : ""}>${esc(LANG_LABELS[itemLang.id])}</a></li>`;
          }).join("")}</ul>
        </div>
      </div>
    </header>`;
}

function footer(lang, active) {
  const bundle = messages[lang.id];
  const home = withPrefix(lang, "/");
  const link = (key, href, label) => `<a href="${esc(href)}"${active === key ? ' aria-current="page"' : ""}>${esc(label)}</a>`;
  return `<footer class="site-footer">
      <div class="wrap footer-grid">
        <div class="footer-brand">
          <a class="brand" href="${esc(home)}">
            <span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M9 9.5h14M22 9.5 10 22.5M9 22.5h14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            <span class="brand-text"><strong>${esc(site.name)}</strong><small>${esc(site.supportLabel)}</small></span>
          </a>
          <p>${esc(bundle.nav.blurb)}</p>
        </div>
        <nav class="footer-col" aria-label="${esc(bundle.nav.browse)}">
          <h2>${esc(bundle.nav.browse)}</h2>
          ${SECTIONS.map((section) => `<a href="${esc(home)}#${section.anchor}">${esc(bundle.home[section.title])}</a>`).join("")}
          ${link("beta", withPrefix(lang, "/beta/"), bundle.nav.testing)}
        </nav>
        <nav class="footer-col" aria-label="${esc(bundle.nav.contact)}">
          <h2>${esc(bundle.nav.contact)}</h2>
          ${link("privacy", withPrefix(lang, "/privacy/"), bundle.nav.privacy)}
          ${link("terms", withPrefix(lang, "/terms/"), bundle.nav.terms)}
          <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>
        </nav>
      </div>
      <div class="wrap footer-bottom">
        <p>© ${esc(String(site.year))} ${esc(site.name)}</p>
      </div>
    </footer>`;
}

function renderHome(lang, bundle) {
  const featured = apps.find((app) => app.featured) || apps.find((app) => app.status === "released");
  const counts = SECTIONS.map((section) => ({ section, count: apps.filter((app) => app.category === section.id).length }));
  const stats = counts
    .map(
      ({ section, count }) =>
        `<a class="stat" href="#${section.anchor}"><span class="stat-icon">${ICONS[section.id]}</span><strong>${count}</strong><span>${esc(bundle.home[section.title])}</span></a>`,
    )
    .join("");
  const tabs = SECTIONS.map(
    (section) =>
      `<a class="tab" href="#${section.anchor}" data-tab="${section.anchor}">${ICONS[section.id]}<span>${esc(bundle.home[section.title])}</span><em>${counts.find((item) => item.section === section).count}</em></a>`,
  ).join("");
  const sections = SECTIONS.map((section) => {
    const items = apps.filter((app) => app.category === section.id);
    const body = items.length
      ? `<div class="card-grid">${items.map((app) => renderCard(lang, bundle, app)).join("")}</div>`
      : `<p class="empty">${ICONS[section.id]}<span>${esc(bundle.home[section.empty])}</span></p>`;
    return `<section class="catalog-section" id="${section.anchor}" data-section="${section.anchor}" aria-labelledby="${section.anchor}-title">
          <header class="section-head">
            <span class="section-icon">${ICONS[section.id]}</span>
            <div>
              <h2 id="${section.anchor}-title">${esc(bundle.home[section.title])}</h2>
              <p>${esc(bundle.home[section.lead])}</p>
            </div>
          </header>
          ${body}
        </section>`;
  }).join("");
  const testing = apps.filter((app) => app.status === "beta");
  const testingIcons = testing.length
    ? `<ul class="band-icons">${testing
        .map(
          (app) =>
            `<li><a href="${esc(withPrefix(lang, `/apps/${app.slug}/`))}">${iconHtml(app, appText(app, lang.id), "band-icon")}<span>${esc(appText(app, lang.id).name)}</span></a></li>`,
        )
        .join("")}</ul>`
    : "";
  return `<section class="hero">
      <div class="wrap hero-grid">
        <div class="hero-copy">
          <p class="eyebrow"><span class="dot"></span>${esc(bundle.home.eyebrow)}</p>
          <h1>${esc(bundle.home.title)}</h1>
          <p class="lead">${esc(bundle.home.lead)}</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#catalog">${esc(bundle.home.browse)}${ICONS.arrow}</a>
            <a class="btn btn-ghost" href="${esc(withPrefix(lang, "/beta/"))}">${ICONS.flask}${esc(bundle.home.joinTesting)}</a>
          </div>
          <div class="stats">${stats}</div>
        </div>
        ${heroArt(lang)}
      </div>
    </section>
    ${featured ? renderFeatured(lang, bundle, featured) : ""}
    <div class="wrap catalog" id="catalog">
      <header class="catalog-head">
        <div>
          <h2>${esc(bundle.home.catalogTitle)}</h2>
          <p>${esc(bundle.home.catalogLead)}</p>
        </div>
      </header>
      <nav class="tabs" aria-label="${esc(bundle.home.catalogTitle)}">${tabs}</nav>
      ${sections}
    </div>
    <div class="wrap">
      <section class="band" aria-labelledby="band-title">
        <div class="band-copy">
          <p class="eyebrow eyebrow-light"><span class="dot"></span>${esc(bundle.home.workshopEyebrow)}</p>
          <h2 id="band-title">${esc(bundle.home.workshopTitle)}</h2>
          <p>${esc(bundle.home.workshopLead)}</p>
          <a class="btn btn-light" href="${esc(withPrefix(lang, "/beta/"))}">${esc(bundle.home.workshopCta)}${ICONS.arrow}</a>
        </div>
        ${testingIcons}
      </section>
    </div>`;
}

function heroArt(lang) {
  const tiles = apps.slice(0, 6).map((app) => {
    const text = appText(app, lang.id);
    return `<a class="tile" href="${esc(withPrefix(lang, `/apps/${app.slug}/`))}" style="--tone:${safeColor(app.accent)}" tabindex="-1" aria-hidden="true">${iconHtml(app, text, "tile-icon")}</a>`;
  });
  const ghosts = ["game", "app", "site", "game", "app", "site"];
  while (tiles.length < 6) {
    const kind = ghosts[tiles.length];
    tiles.push(`<span class="tile tile-ghost" aria-hidden="true">${ICONS[kind]}</span>`);
  }
  return `<div class="hero-art" aria-hidden="true">
          <div class="orbit"></div>
          <div class="tiles">${tiles.join("")}</div>
        </div>`;
}

function renderFeatured(lang, bundle, app) {
  const text = appText(app, lang.id);
  const cover = assetUrl(app.cover);
  return `<div class="wrap">
      <article class="featured" style="--tone:${safeColor(app.accent)}">
        ${cover ? `<img class="featured-cover" src="${esc(cover)}" alt="" loading="eager" decoding="async">` : ""}
        <div class="featured-shade"></div>
        <div class="featured-body">
          <p class="featured-label">${esc(bundle.home.featured)} · ${esc(categoryLabel(bundle, app))}</p>
          <div class="featured-title">
            ${iconHtml(app, text, "featured-icon")}
            <div>
              <h2>${esc(text.name)}</h2>
              <p>${esc(text.tagline)}</p>
            </div>
          </div>
          <div class="featured-actions">
            <a class="btn btn-light" href="${esc(withPrefix(lang, `/apps/${app.slug}/`))}">${esc(bundle.home.details)}${ICONS.arrow}</a>
            ${storeButtons(bundle, app, "on-dark")}
          </div>
        </div>
      </article>
    </div>`;
}

function renderCard(lang, bundle, app) {
  const text = appText(app, lang.id);
  const cover = assetUrl(app.cover);
  const detail = withPrefix(lang, `/apps/${app.slug}/`);
  const web = safeUrl(app.links?.web);
  const status = app.status === "beta"
    ? `<span class="badge badge-beta">${ICONS.flask}${esc(bundle.app.betaStatus)}</span>`
    : `<span class="badge">${esc(bundle.app.released)}</span>`;
  const foot = app.category === "site" && web
    ? `<a class="card-action" href="${esc(web)}" target="_blank" rel="noopener noreferrer">${esc(hostname(web))}${ICONS.external}</a>`
    : `<a class="card-action" href="${esc(detail)}" tabindex="-1" aria-hidden="true">${esc(bundle.home.details)}${ICONS.arrow}</a>`;
  return `<article class="card" style="--tone:${safeColor(app.accent)}">
      <a class="card-link" href="${esc(detail)}">
        <span class="card-art">${cover ? `<img src="${esc(cover)}" alt="" loading="lazy" decoding="async">` : ""}</span>
        <span class="card-head">
          ${iconHtml(app, text, "card-icon")}
          <span class="card-title">
            <span class="card-name">${esc(text.name)}</span>
            <span class="card-meta">${esc(categoryLabel(bundle, app))} · ${esc(platformNames(bundle, app).join(" / "))}</span>
          </span>
        </span>
        <span class="card-tagline">${esc(text.tagline)}</span>
      </a>
      <div class="card-foot">${status}${foot}</div>
    </article>`;
}

function renderBeta(lang, bundle) {
  const testing = apps.filter((app) => app.status === "beta");
  const groupUrl = safeUrl(site.betaGroupUrl);
  const join = groupUrl
    ? `<a class="btn btn-light" href="${esc(groupUrl)}" target="_blank" rel="noopener noreferrer">${ICONS.flask}${esc(bundle.beta.join)}</a>`
    : `<p class="pending">${esc(bundle.beta.pending)}</p>`;
  const steps = [1, 2, 3]
    .map(
      (n) => `<li class="step"><span class="step-no">0${n}</span><h3>${esc(bundle.beta[`step${n}Title`])}</h3><p>${esc(bundle.beta[`step${n}`])}</p></li>`,
    )
    .join("");
  const list = testing.length
    ? `<div class="card-grid">${testing.map((app) => renderCard(lang, bundle, app)).join("")}</div>`
    : `<p class="empty">${ICONS.flask}<span>${esc(bundle.beta.empty)}</span></p>`;
  return `<section class="page-hero page-hero-dark">
      <div class="wrap page-hero-inner">
        <p class="eyebrow eyebrow-light"><span class="dot"></span>${esc(bundle.beta.eyebrow)}</p>
        <h1>${esc(bundle.beta.title)}</h1>
        <p class="lead">${esc(bundle.beta.lead)}</p>
        <div class="hero-actions">
          ${join}
        </div>
        <p class="fineprint">${esc(bundle.beta.disclaimer)}</p>
      </div>
    </section>
    <div class="wrap page-body">
      <section aria-labelledby="steps-title">
        <h2 class="block-title" id="steps-title">${esc(bundle.beta.stepsTitle)}</h2>
        <ol class="steps">${steps}</ol>
      </section>
      <section aria-labelledby="open-title">
        <h2 class="block-title" id="open-title">${esc(bundle.beta.openLabel)}</h2>
        ${list}
      </section>
    </div>`;
}

function renderApp(lang, bundle, app, text) {
  const cover = assetUrl(app.cover);
  const links = app.links || {};
  const shots = (app.screenshots || []).map(assetUrl).filter(Boolean);
  const paragraphs = (text.body || []).map((paragraph) => `<p>${esc(paragraph)}</p>`).join("\n");
  const stores = storeButtons(bundle, app, "");
  const betaUrl = safeUrl(links.beta);
  const policyLinks = [
    policyLink(safeUrl(links.privacy), bundle.app.privacy, ICONS.shield),
    policyLink(safeUrl(links.terms), bundle.app.terms, ICONS.doc),
  ].filter(Boolean);
  const status = app.status === "beta"
    ? `<span class="badge badge-beta">${ICONS.flask}${esc(bundle.app.betaStatus)}</span>`
    : `<span class="badge">${esc(bundle.app.released)}</span>`;
  const others = apps.filter((item) => item.slug !== app.slug).slice(0, 3);
  const shotsBlock = shots.length
    ? `<section class="panel-plain" aria-labelledby="shots-title">
          <h2 class="block-title" id="shots-title">${esc(bundle.app.screenshots)}</h2>
          <div class="shots">${shots
            .map((src, index) => `<figure class="shot"><img src="${esc(src)}" alt="${esc(`${text.name} ${index + 1}`)}" loading="lazy" decoding="async"></figure>`)
            .join("")}</div>
        </section>`
    : "";
  return `<section class="product-hero" style="--tone:${safeColor(app.accent)}">
      <div class="product-cover">${cover ? `<img src="${esc(cover)}" alt="" decoding="async">` : ""}</div>
      <div class="wrap product-head">
        <a class="crumb" href="${esc(withPrefix(lang, "/"))}#${sectionFor(app).anchor}">${ICONS[app.category]}<span>${esc(bundle.home[sectionFor(app).title])}</span></a>
        <div class="product-title">
          ${iconHtml(app, text, "product-icon")}
          <div>
            <div class="badges"><span class="badge">${esc(categoryLabel(bundle, app))}</span>${status}</div>
            <h1>${esc(text.name)}</h1>
            <p class="lead">${esc(text.tagline)}</p>
          </div>
        </div>
        <div class="product-actions">
          ${stores || `<p class="pending">${esc(bundle.app.pending)}</p>`}
          ${betaUrl ? `<a class="btn btn-ghost" href="${esc(betaUrl)}" target="_blank" rel="noopener noreferrer">${ICONS.flask}${esc(bundle.app.beta)}</a>` : ""}
        </div>
      </div>
    </section>
    <div class="wrap product-layout">
      <div class="product-main">
        ${shotsBlock}
        <section class="panel-plain prose" aria-labelledby="about-title">
          <h2 class="block-title" id="about-title">${esc(bundle.app.about)}</h2>
          ${paragraphs}
        </section>
      </div>
      <aside class="product-aside">
        <section class="side-card" aria-labelledby="info-title">
          <h2 id="info-title">${esc(bundle.app.info)}</h2>
          <dl class="info">
            <div><dt>${esc(bundle.app.infoCategory)}</dt><dd>${esc(categoryLabel(bundle, app))}</dd></div>
            <div><dt>${esc(bundle.app.infoPlatforms)}</dt><dd>${esc(platformNames(bundle, app).join(", "))}</dd></div>
            <div><dt>${esc(bundle.app.infoUpdated)}</dt><dd>${esc(app.updated)}</dd></div>
            <div><dt>${esc(bundle.app.infoDeveloper)}</dt><dd>${esc(site.name)}</dd></div>
          </dl>
        </section>
        <section class="side-card" aria-labelledby="policy-title">
          <h2 id="policy-title">${esc(bundle.app.policies)}</h2>
          <p class="side-note">${esc(bundle.app.policiesNote)}</p>
          <div class="link-list">
            ${policyLinks.length ? policyLinks.join("") : `<p class="pending">${esc(bundle.app.pending)}</p>`}
            <a class="link-row" href="mailto:${esc(site.email)}">${ICONS.mail}<span>${esc(bundle.app.support)}</span></a>
          </div>
        </section>
      </aside>
    </div>
    ${
      others.length
        ? `<div class="wrap more">
      <h2 class="block-title">${esc(bundle.app.more)}</h2>
      <div class="card-grid">${others.map((item) => renderCard(lang, bundle, item)).join("")}</div>
    </div>`
        : ""
    }`;
}

function renderLegal(lang, bundle, title, body) {
  return `<section class="page-hero">
      <div class="wrap page-hero-inner">
        <p class="eyebrow"><span class="dot"></span>${esc(site.name)} ${esc(site.supportLabel)}</p>
        <h1>${esc(title)}</h1>
        <p class="meta">${esc(bundle.legal.updated)} ${esc(site.legalUpdated)}${lang.id === "en" ? "" : ` · ${esc(bundle.legal.englishOnly)}`}</p>
      </div>
    </section>
    <div class="wrap page-body">
      <article class="legal-card prose" lang="en">${body}</article>
    </div>`;
}

function storeButtons(bundle, app, variant) {
  const links = app.links || {};
  const out = [];
  const cls = `store${variant ? ` ${variant}` : ""}`;
  if (app.category === "site") {
    const web = safeUrl(links.web);
    if (web) out.push(storeLink(cls, web, ICONS.globe, hostname(web), bundle.app.visit));
    return out.join("");
  }
  const play = safeUrl(links.play);
  const appstore = safeUrl(links.appstore);
  const web = safeUrl(links.web);
  if (play) out.push(storeLink(cls, play, ICONS.play, bundle.app.getOn, bundle.app.play));
  if (appstore) out.push(storeLink(cls, appstore, ICONS.phone, bundle.app.getOn, bundle.app.appstore));
  if (web) out.push(storeLink(cls, web, ICONS.globe, hostname(web), bundle.app.web));
  return out.join("");
}

function storeLink(cls, href, icon, small, big) {
  return `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${icon}<span><small>${esc(small)}</small><strong>${esc(big)}</strong></span></a>`;
}

function policyLink(href, label, icon) {
  if (!href) return "";
  return `<a class="link-row" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${icon}<span>${esc(label)}</span>${ICONS.external}</a>`;
}

function iconHtml(app, text, cls) {
  const src = assetUrl(app.icon);
  if (src) {
    return `<img class="${cls} app-icon" src="${esc(src)}" alt="" width="256" height="256" loading="lazy" decoding="async" style="--tone:${safeColor(app.accent)}">`;
  }
  return `<span class="${cls} app-icon icon-fallback" style="--tone:${safeColor(app.accent)}" aria-hidden="true">${esc(initial(text.name))}</span>`;
}

function write404() {
  const packs = Object.fromEntries(
    LANGS.map((lang) => [
      lang.id,
      {
        title: messages[lang.id].notFound.title,
        lead: messages[lang.id].notFound.lead,
        cta: messages[lang.id].notFound.cta,
        pageTitle: `${messages[lang.id].meta.notFoundTitle} · ${messages[lang.id].meta.siteName}`,
      },
    ]),
  );
  const bundle = messages.en;
  const main = `<section class="page-hero not-found">
        <div class="wrap page-hero-inner">
          <p class="big-code">404</p>
          <h1 id="not-found-title">${esc(bundle.notFound.title)}</h1>
          <p class="lead" id="not-found-lead">${esc(bundle.notFound.lead)}</p>
          <div class="hero-actions"><a class="btn btn-primary" id="not-found-cta" href="/">${esc(bundle.notFound.cta)}</a></div>
        </div>
      </section>
      <script type="application/json" id="not-found-i18n">${JSON.stringify(packs).replaceAll("<", "\\u003c")}</script>`;
  const html = shell(LANGS[0], "/", "", {
    title: `${bundle.meta.notFoundTitle} · ${bundle.meta.siteName}`,
    description: bundle.meta.notFoundDescription,
    canonicalPath: "/",
    robots: "noindex, follow",
    hreflang: false,
    image: "",
    jsonLd: [],
    main,
    redirect: false,
  }).replace('data-persist-lang="en"', "");
  fs.writeFileSync(path.join(outDir, "404.html"), html);
}

function writeSitemap() {
  const body = sitemap
    .map((entry) => {
      const links = entry.alternates
        .map((alt) => `    <xhtml:link rel="alternate" hreflang="${xml(alt.lang)}" href="${xml(alt.href)}"/>`)
        .join("\n");
      const xDefault = entry.alternates.length
        ? `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${xml(entry.alternates[0].href)}"/>`
        : "";
      return `  <url>\n    <loc>${xml(entry.loc)}</loc>${links ? `\n${links}` : ""}${xDefault}\n  </url>`;
    })
    .join("\n");
  fs.writeFileSync(
    path.join(outDir, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}\n</urlset>\n`,
  );
}

function websiteJsonLd(lang) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: messages[lang.id].meta.siteName,
    url: abs("/"),
    inLanguage: lang.html,
    publisher: { "@type": "Organization", name: site.name, url: abs("/"), email: site.email },
  }).replaceAll("<", "\\u003c");
}

function appJsonLd(lang, app, text) {
  const base = {
    "@context": "https://schema.org",
    name: text.name,
    description: text.summary,
    url: abs(withPrefix(lang, `/apps/${app.slug}/`)),
    inLanguage: lang.html,
    author: { "@type": "Organization", name: site.name, url: abs("/") },
  };
  const image = absAsset(app.icon) || absAsset(app.cover);
  if (image) base.image = image;
  if (app.category === "site") {
    return JSON.stringify({ ...base, "@type": "WebSite", sameAs: safeUrl(app.links?.web) || undefined }).replaceAll("<", "\\u003c");
  }
  return JSON.stringify({
    ...base,
    "@type": app.category === "game" ? "VideoGame" : "SoftwareApplication",
    applicationCategory: app.category === "game" ? "GameApplication" : "UtilitiesApplication",
    operatingSystem: platformNames(messages[lang.id], app).join(", "),
    screenshot: (app.screenshots || []).map(absAsset).filter(Boolean),
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  }).replaceAll("<", "\\u003c");
}

function platformNames(bundle, app) {
  const labels = { android: bundle.app.android, ios: bundle.app.ios, web: bundle.app.webPlatform };
  return (app.platforms || []).map((id) => labels[id] || id);
}

function categoryLabel(bundle, app) {
  if (app.category === "game") return bundle.app.catGame;
  if (app.category === "app") return bundle.app.catApp;
  return bundle.app.catSite;
}

function sectionFor(app) {
  return SECTIONS.find((section) => section.id === app.category);
}

function appText(app, langId) {
  return app.text[langId] || app.text.en;
}

function langHref(lang, basePath) {
  const base = basePath.endsWith("/") ? basePath : `${basePath}/`;
  const prefix = lang.id === "en" ? "" : `/${lang.id}`;
  return `${prefix}${base.startsWith("/") ? base : `/${base}`}`;
}

function withPrefix(lang, basePath) {
  const base = basePath.startsWith("/") ? basePath : `/${basePath}`;
  if (!lang.prefix) return base;
  return base === "/" ? `${lang.prefix}/` : `${lang.prefix}${base}`;
}

function abs(urlPath) {
  return site.domain.replace(/\/$/, "") + urlPath;
}

function absAsset(value) {
  const url = assetUrl(value);
  if (!url) return "";
  return url.startsWith("/") ? abs(url) : url;
}

function assetUrl(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (/^https:\/\/[^\s<>"]+$/i.test(text)) return text;
  if (/^\/[A-Za-z0-9._~\-\/]+$/.test(text)) {
    return fs.existsSync(path.join(root, text)) ? text : "";
  }
  return "";
}

function copyStatic() {
  for (const rel of ["css", "js", "assets", "favicon.svg", "app-ads.txt", "robots.txt", "CNAME", "_headers"]) {
    const from = path.join(root, rel);
    if (!fs.existsSync(from)) continue;
    fs.cpSync(from, path.join(outDir, rel), { recursive: true });
  }
}

function hostname(url) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function initial(name) {
  const char = Array.from(name.trim())[0] || "Z";
  return char.toLocaleUpperCase();
}

function safeColor(value) {
  return /^#[0-9a-fA-F]{6}$/.test(value || "") ? value : "#4f46e5";
}

function safeUrl(value) {
  const text = String(value || "").trim();
  return /^https?:\/\/[^\s<>"]+$/i.test(text) ? text : "";
}

function redirectScript() {
  return `<script>
(function () {
  try {
    var ua = navigator.userAgent || "";
    if (/bot|crawl|spider|slurp|mediapartners|google-adstxt|adsbot|bingpreview/i.test(ua)) return;
    var saved = localStorage.getItem("zx-lang");
    function mapLang(tag) {
      if (!tag) return "en";
      var t = String(tag).toLowerCase().replace(/_/g, "-");
      if (t === "zh-tw" || t === "zh-hk" || t === "zh-mo" || t.indexOf("zh-hant") === 0) return "zh-Hant";
      if (t === "zh" || t.indexOf("zh-") === 0) return "zh-Hans";
      var base = t.split("-")[0];
      if (base === "es" || base === "ja" || base === "ko" || base === "de" || base === "fr") return base;
      return "en";
    }
    var lang = saved || mapLang((navigator.languages && navigator.languages[0]) || navigator.language);
    var supported = { "zh-Hans": 1, "zh-Hant": 1, es: 1, ja: 1, ko: 1, de: 1, fr: 1 };
    if (!supported[lang]) return;
    try { localStorage.setItem("zx-lang", lang); } catch (err) {}
    var path = location.pathname;
    if (path.slice(-11) === "/index.html") path = path.slice(0, -10);
    if (!path || path.charAt(0) !== "/") path = "/" + path;
    if (path.charAt(path.length - 1) !== "/") path += "/";
    var prefixes = ["zh-Hans", "zh-Hant", "es", "ja", "ko", "de", "fr"];
    for (var i = 0; i < prefixes.length; i++) {
      var p = "/" + prefixes[i] + "/";
      if (path === p || path.indexOf(p) === 0) return;
    }
    location.replace("/" + lang + path + location.search + location.hash);
  } catch (e) {}
})();
</script>`;
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
}

function xml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[ch]);
}

function assertSameKeys(source) {
  for (const lang of LANGS) walk(source, messages[lang.id], lang.id);
}

function walk(source, other, trail) {
  if (!other || typeof other !== "object") throw new Error(`Missing messages at ${trail}`);
  for (const key of Object.keys(source)) {
    if (!(key in other)) throw new Error(`Missing ${trail}.${key}`);
    if (source[key] && typeof source[key] === "object") walk(source[key], other[key], `${trail}.${key}`);
  }
}

function validateApps(list) {
  const slugs = new Set();
  for (const app of list) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(app.slug || "")) throw new Error(`Invalid slug: ${app.slug}`);
    if (slugs.has(app.slug)) throw new Error(`Duplicate slug: ${app.slug}`);
    slugs.add(app.slug);
    if (!["game", "app", "site"].includes(app.category)) throw new Error(`Invalid category for ${app.slug}`);
    if (app.status !== "released" && app.status !== "beta") throw new Error(`Invalid status for ${app.slug}`);
    const english = app.text && app.text.en;
    if (!english?.name || !english.tagline || !english.summary || !Array.isArray(english.body)) {
      throw new Error(`English copy is incomplete for ${app.slug}`);
    }
    for (const field of ["icon", "cover", ...(app.screenshots || []).map((_, index) => `screenshots[${index}]`)]) {
      const value = field.startsWith("screenshots") ? app.screenshots[Number(field.slice(12, -1))] : app[field];
      if (!value) continue;
      if (!/^https:\/\/[^\s<>"]+$/i.test(value) && !/^\/[A-Za-z0-9._~\-\/]+$/.test(value)) {
        throw new Error(`${app.slug}.${field} must be a /path or https URL: ${value}`);
      }
    }
  }
}
