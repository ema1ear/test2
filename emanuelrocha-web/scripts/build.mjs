import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { copies, equivalentRoute, routePages, routes } from "../assets/content.js";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = join(projectRoot, "dist");
const template = await readFile(join(projectRoot, "src/template.html"), "utf8");

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

function cabinetHtml(lang) {
    return copies[lang].cabinet.map((folder, index) => `
        <div class="folder-row" id="folder-row-${index}">
            <button type="button" class="folder-header" data-action="folder" aria-expanded="false" aria-controls="folder-drawer-${index}">
                <span class="folder-num">${folder.num}/</span>
                <span class="folder-name">${folder.name}</span>
                <span class="folder-status">● ${folder.status}</span>
            </button>
            <div class="folder-drawer" id="folder-drawer-${index}">
                <div class="folder-content">${folder.content}</div>
            </div>
        </div>
    `.trim()).join("\n");
}

function replacements(page) {
    const copy = copies[page.lang];
    const canonicalPath = routes[page.lang][page.key];
    const narrative = page.key === "A" || page.key === "B" ? copy[page.key] : "";
    return {
        LANG: page.lang,
        ROBOTS: page.index ? "index, follow" : "noindex, follow",
        TITLE: escapeHtml(page.title),
        DESCRIPTION: escapeHtml(page.description),
        CANONICAL: `https://emanuelrocha.cat${canonicalPath}`,
        ALTERNATE_CA: `https://emanuelrocha.cat${equivalentRoute(page, "ca")}`,
        ALTERNATE_ES: `https://emanuelrocha.cat${equivalentRoute(page, "es")}`,
        OG_LOCALE: page.lang === "ca" ? "ca_ES" : "es_ES",
        INITIAL_STATE: page.key === "home" ? "intro" : page.state,
        ROUTE_KEY: page.key,
        SKIP_TEXT: page.lang === "ca" ? "Saltar al contingut" : "Saltar al contenido",
        TAG: copy.tag,
        WELCOME_TITLE: copy.title,
        WELCOME_HTML: copy.proseHTML,
        NARRATIVE_LABEL: page.lang === "ca" ? "Text narratiu" : "Texto narrativo",
        NARRATIVE_HTML: narrative,
        CONTACT_HEADING: page.lang === "ca" ? "Formulari de contacte" : "Formulario de contacto",
        FORM_LEAD: copy.formLead,
        NAME_LABEL: copy.nameLabel,
        NAME_PLACEHOLDER: copy.namePlaceholder,
        FORM_BRIDGE: copy.formBridge,
        EMAIL_LABEL: copy.emailLabel,
        EMAIL_PLACEHOLDER: copy.emailPlaceholder,
        FORM_INTENT_LEAD: copy.formIntentLead,
        INTENT_A: copy.intentA,
        INTENT_B: copy.intentB,
        TAIL_A: copy.tailA,
        SUBMIT: copy.submit,
        OPERATIONS_HEADING: page.lang === "ca" ? "Operacions de treball" : "Operaciones de trabajo",
        OPERATIONS_INTRO: copy.operationsIntro,
        CABINET_HTML: cabinetHtml(page.lang),
        CONTACT: copy.contact,
        BACK: copy.back,
        OPERATIONS: copy.btnOperations,
        LANGUAGE_ARIA: copy.languageAria,
        LANGUAGE_ACTIVE: copy.langActive,
        CANCEL: copy.cancel
    };
}

function render(page) {
    const values = replacements(page);
    return Object.entries(values).reduce(
        (html, [key, value]) => html.replaceAll(`{{${key}}}`, value),
        template
    );
}

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });
await cp(join(projectRoot, "assets"), join(outputRoot, "assets"), { recursive: true });
await cp(join(projectRoot, "public"), outputRoot, { recursive: true });

for (const page of routePages) {
    const directory = join(outputRoot, routes[page.lang][page.key]);
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, "index.html"), render(page), "utf8");
}

const rootHtml = `<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, follow">
    <meta http-equiv="refresh" content="0; url=/ca/">
    <link rel="canonical" href="https://emanuelrocha.cat/ca/">
    <title>Emanuel Rocha</title>
</head>
<body>
    <p><a href="/ca/">Continua en català</a> · <a href="/es/">Continuar en castellano</a></p>
</body>
</html>`;
await writeFile(join(outputRoot, "index.html"), rootHtml, "utf8");

const indexedPages = routePages.filter((page) => page.index);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexedPages.map((page) => `    <url><loc>https://emanuelrocha.cat${routes[page.lang][page.key]}</loc></url>`).join("\n")}
</urlset>`;
await writeFile(join(outputRoot, "sitemap.xml"), sitemap, "utf8");

const robots = `User-agent: *
Allow: /
Disallow: /ca/contacte/
Disallow: /es/contacto/

Sitemap: https://emanuelrocha.cat/sitemap.xml
`;
await writeFile(join(outputRoot, "robots.txt"), robots, "utf8");

console.log(`Built ${routePages.length} localized pages in dist/.`);
