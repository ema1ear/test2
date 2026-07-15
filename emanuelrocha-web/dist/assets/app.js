import { copies, routePages, routes } from "./content.js";

const body = document.body;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const elements = {
    main: document.getElementById("main-content"),
    header: document.querySelector(".main-header"),
    footer: document.querySelector(".main-footer"),
    brandHome: document.getElementById("brand-home"),
    brandTag: document.getElementById("brand-tag"),
    welcomeTitle: document.getElementById("node-welcome"),
    welcomeProse: document.getElementById("prose-text"),
    teleprompter: document.getElementById("teleprompter"),
    narrative: document.getElementById("narrative-content"),
    contactForm: document.getElementById("contact-form"),
    contactButton: document.getElementById("btn-contact"),
    backButton: document.getElementById("btn-back"),
    cancelButton: document.getElementById("btn-cancel-contact"),
    operationsButton: document.getElementById("btn-operations-footer"),
    operationsIntro: document.getElementById("operations-intro"),
    cabinet: document.getElementById("cabinet-container"),
    languageContainer: document.getElementById("lang-inline-container"),
    languageToggle: document.getElementById("lang-toggle"),
    languageOptions: document.getElementById("language-options"),
    name: document.getElementById("form-name"),
    email: document.getElementById("form-email"),
    honeypot: document.getElementById("website"),
    intent: document.getElementById("form-intent"),
    language: document.getElementById("form-language"),
    formStatus: document.getElementById("form-status")
};

let currentLang = document.documentElement.lang === "es" ? "es" : "ca";
let preferredLang = currentLang;
let currentPage = routeFromPath(location.pathname) ?? pageFor(currentLang, "home");
let currentIntent = new URLSearchParams(location.search).get("intent") === "B" ? "B" : "A";
let narrativeObserver = null;
let introTimers = [];
let submitting = false;
let languageTransitioning = false;

function normalizePath(path) {
    const normalized = `/${path}`.replace(/\/{2,}/g, "/");
    return normalized.endsWith("/") ? normalized : `${normalized}/`;
}

function pageFor(lang, key) {
    return routePages.find((page) => page.lang === lang && page.key === key);
}

function routeFromPath(path) {
    const normalized = normalizePath(path);
    return routePages.find((page) => routes[page.lang][page.key] === normalized);
}

function routeUrl(lang, key) {
    return routes[lang][key];
}

function setMeta(page) {
    const canonical = `https://emanuelrocha.cat${routeUrl(page.lang, page.key)}`;
    document.title = page.title;
    document.documentElement.lang = page.lang;
    document.querySelector('meta[name="description"]').content = page.description;
    document.querySelector('meta[name="robots"]').content = page.index ? "index, follow" : "noindex, follow";
    document.querySelector('link[rel="canonical"]').href = canonical;
    document.querySelector('link[hreflang="ca"]').href = `https://emanuelrocha.cat${routeUrl("ca", page.key)}`;
    document.querySelector('link[hreflang="es"]').href = `https://emanuelrocha.cat${routeUrl("es", page.key)}`;
    document.querySelector('meta[property="og:url"]').content = canonical;
    document.querySelector('meta[property="og:title"]').content = page.title;
    document.querySelector('meta[property="og:description"]').content = page.description;
    document.querySelector('meta[property="og:locale"]').content = page.lang === "ca" ? "ca_ES" : "es_ES";
    document.querySelector('meta[name="twitter:title"]').content = page.title;
    document.querySelector('meta[name="twitter:description"]').content = page.description;
}

function renderCabinet() {
    elements.cabinet.innerHTML = copies[currentLang].cabinet.map((folder, index) => `
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
    `).join("");
}

function renderLanguage() {
    const copy = copies[currentLang];
    elements.brandTag.textContent = copy.tag;
    elements.welcomeTitle.textContent = copy.title;
    elements.welcomeProse.innerHTML = copy.proseHTML;
    elements.backButton.textContent = copy.back;
    elements.contactButton.textContent = body.dataset.state === "contact" ? copy.submit : copy.contact;
    elements.cancelButton.textContent = copy.cancel;
    elements.operationsButton.textContent = copy.btnOperations;
    elements.languageToggle.textContent = copy.langActive;
    elements.brandHome.setAttribute("aria-label", copy.homeAria);
    elements.contactButton.setAttribute("aria-label", copy.contactAria);
    elements.operationsButton.setAttribute("aria-label", copy.operationsAria);
    elements.languageContainer.setAttribute("aria-label", copy.languageAria);
    document.getElementById("opt-ca").classList.toggle("is-active", currentLang === "ca");
    document.getElementById("opt-es").classList.toggle("is-active", currentLang === "es");

    document.getElementById("form-lead").textContent = copy.formLead;
    document.getElementById("form-bridge").textContent = copy.formBridge;
    document.getElementById("form-intent-lead").textContent = copy.formIntentLead;
    document.getElementById("form-name-label").textContent = copy.nameLabel;
    document.getElementById("form-email-label").textContent = copy.emailLabel;
    elements.name.placeholder = copy.namePlaceholder;
    elements.email.placeholder = copy.emailPlaceholder;
    document.getElementById("choice-intent-A").textContent = copy.intentA;
    document.getElementById("choice-intent-B").textContent = copy.intentB;
    elements.language.value = currentLang;

    if (currentPage.key === "A" || currentPage.key === "B") {
        elements.narrative.innerHTML = copy[currentPage.key];
    }
    elements.operationsIntro.textContent = copy.operationsIntro;
    renderCabinet();
    setIntent(currentIntent, false);
}

function activeSectionForState(state) {
    if (["intro", "welcome-center", "welcome-left", "welcome-ready"].includes(state)) return "view-welcome";
    if (state === "narrative") return "teleprompter";
    if (state === "contact") return "view-contact";
    return "operations-view";
}

function syncAccessibility(state) {
    const activeId = activeSectionForState(state);
    document.querySelectorAll("main > section").forEach((section) => {
        const active = section.id === activeId;
        section.inert = !active;
        section.setAttribute("aria-hidden", String(!active));
    });

    const headerAvailable = ["narrative", "contact", "operations"].includes(state);
    elements.header.inert = !headerAvailable;
    elements.header.setAttribute("aria-hidden", String(!headerAvailable));
    elements.footer.inert = state === "intro" || state === "welcome-center" || state === "welcome-left";
    elements.footer.setAttribute("aria-hidden", String(elements.footer.inert));
    closeLanguageMenu(false);
}

function setState(state) {
    body.dataset.state = state;
    syncAccessibility(state);
    elements.contactButton.textContent = state === "contact" ? copies[currentLang].submit : copies[currentLang].contact;
    if (state !== "narrative") disconnectNarrativeObserver();
}

function scheduleIntro() {
    introTimers.forEach(clearTimeout);
    introTimers = [];
    if (reducedMotion.matches) {
        setState("welcome-ready");
        return;
    }
    setState("intro");
    introTimers.push(setTimeout(() => setState("welcome-center"), 2000));
    introTimers.push(setTimeout(() => setState("welcome-left"), 4000));
    introTimers.push(setTimeout(() => setState("welcome-ready"), 5800));
}

function disconnectNarrativeObserver() {
    narrativeObserver?.disconnect();
    narrativeObserver = null;
}

function initNarrativeObserver() {
    disconnectNarrativeObserver();
    const paragraphs = elements.narrative.querySelectorAll(".scrolling-p, .image-box");
    paragraphs.forEach((element) => element.classList.remove("is-reading"));
    paragraphs[0]?.classList.add("is-reading");
    narrativeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => entry.target.classList.toggle("is-reading", entry.isIntersecting));
    }, { root: elements.teleprompter, rootMargin: "-42% 0px -42% 0px", threshold: 0.05 });
    paragraphs.forEach((element) => narrativeObserver.observe(element));
}

function renderPage(page, { focus = false } = {}) {
    introTimers.forEach(clearTimeout);
    currentPage = page;
    currentLang = page.lang;
    body.dataset.routeKey = page.key;
    setMeta(page);
    renderLanguage();

    if (page.state === "narrative") {
        setState("narrative");
        elements.teleprompter.scrollTop = 0;
        requestAnimationFrame(initNarrativeObserver);
    } else if (page.state === "contact") {
        setState("contact");
    } else if (page.state === "operations") {
        setState("operations");
    } else if (body.dataset.initialized === "true") {
        setState("welcome-ready");
    } else {
        scheduleIntro();
    }

    body.dataset.initialized = "true";
    if (focus) {
        requestAnimationFrame(() => {
            if (page.state === "contact") elements.name.focus({ preventScroll: true });
            else elements.main.focus({ preventScroll: true });
        });
    }
}

function navigate(key, { lang = currentLang, intent = currentIntent, replace = false, focus = true } = {}) {
    const page = pageFor(lang, key);
    if (!page) return;
    const query = key === "contact" ? `?intent=${intent}` : "";
    const target = `${routeUrl(lang, key)}${query}`;
    const state = { key, lang, intent, from: `${location.pathname}${location.search}` };
    history[replace ? "replaceState" : "pushState"](state, "", target);
    currentIntent = intent;
    renderPage(page, { focus });
}

function setIntent(intent, animate = true) {
    currentIntent = intent === "B" ? "B" : "A";
    const buttonA = document.getElementById("choice-intent-A");
    const buttonB = document.getElementById("choice-intent-B");
    const tail = document.getElementById("form-dynamic-tail");
    buttonA.classList.toggle("is-active", currentIntent === "A");
    buttonB.classList.toggle("is-active", currentIntent === "B");
    buttonA.setAttribute("aria-pressed", String(currentIntent === "A"));
    buttonB.setAttribute("aria-pressed", String(currentIntent === "B"));
    elements.intent.value = currentIntent;
    const nextText = currentIntent === "A" ? copies[currentLang].tailA : copies[currentLang].tailB;
    if (!animate || reducedMotion.matches) {
        tail.textContent = nextText;
        return;
    }
    tail.style.opacity = "0";
    setTimeout(() => {
        tail.textContent = nextText;
        tail.style.opacity = "1";
    }, 150);
}

function goBack() {
    const fallback = routeUrl(currentLang, "home");
    if (history.state?.from?.startsWith("/")) history.back();
    else {
        history.replaceState({}, "", fallback);
        renderPage(pageFor(currentLang, "home"), { focus: true });
    }
}

function toggleFolder(button) {
    const row = button.closest(".folder-row");
    const wasOpen = row.classList.contains("is-open");
    elements.cabinet.querySelectorAll(".folder-row").forEach((folder) => {
        folder.classList.remove("is-open");
        folder.querySelector(".folder-header").setAttribute("aria-expanded", "false");
    });
    if (!wasOpen) {
        row.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
    }
}

function openLanguageMenu() {
    elements.languageContainer.classList.add("is-open");
    elements.languageToggle.setAttribute("aria-expanded", "true");
    elements.languageOptions.setAttribute("aria-hidden", "false");
    elements.languageOptions.querySelectorAll("button").forEach((button) => { button.tabIndex = 0; });
    elements.languageOptions.querySelector(`[data-lang="${currentLang}"]`)?.focus();
}

function closeLanguageMenu(returnFocus = false) {
    elements.languageContainer.classList.remove("is-open");
    elements.languageToggle.setAttribute("aria-expanded", "false");
    elements.languageOptions.setAttribute("aria-hidden", "true");
    elements.languageOptions.querySelectorAll("button").forEach((button) => { button.tabIndex = -1; });
    if (returnFocus) elements.languageToggle.focus();
}

function toggleLanguageMenu() {
    if (elements.languageContainer.classList.contains("is-open")) closeLanguageMenu(true);
    else openLanguageMenu();
}

function triggerFooterLockout() {
    elements.footer.classList.add("footer-resting");
    setTimeout(() => elements.footer.classList.remove("footer-resting"), 400);
}

function waitForAnimation(element, fallbackMs) {
    return new Promise((resolve) => {
        let settled = false;
        const finish = () => {
            if (settled) return;
            settled = true;
            element.removeEventListener("animationend", finish);
            clearTimeout(fallback);
            resolve();
        };
        const fallback = setTimeout(finish, fallbackMs);
        element.addEventListener("animationend", finish, { once: true });
    });
}

async function switchLanguage(lang) {
    if (languageTransitioning) return;
    if (lang === currentLang) {
        closeLanguageMenu(true);
        return;
    }

    const targets = [
        elements.brandTag,
        elements.welcomeProse,
        elements.backButton,
        elements.contactButton,
        elements.welcomeTitle,
        elements.cancelButton,
        document.getElementById("contact-prose-text"),
        elements.operationsIntro,
        elements.languageToggle,
        elements.operationsButton,
        elements.narrative
    ];

    preferredLang = lang;
    languageTransitioning = true;
    closeLanguageMenu(false);
    targets.forEach((element) => {
        element.classList.remove("lang-materializing");
        element.classList.add("lang-evaporating");
    });

    try {
        await waitForAnimation(elements.brandTag, 260);
        navigate(currentPage.key, { lang, intent: currentIntent, replace: true, focus: false });
        targets.forEach((element) => {
            element.classList.remove("lang-evaporating");
            element.classList.add("lang-materializing");
        });

        await waitForAnimation(elements.brandTag, 520);
    } finally {
        targets.forEach((element) => {
            element.classList.remove("lang-evaporating");
            element.classList.remove("lang-materializing");
        });
        languageTransitioning = false;
        triggerFooterLockout();
    }
}

function markInvalid(input, invalid) {
    input.classList.toggle("input-error", invalid);
    input.setAttribute("aria-invalid", String(invalid));
}

async function submitContact() {
    if (submitting) return;
    const nameInvalid = !elements.name.value.trim();
    const emailInvalid = !elements.email.validity.valid;
    markInvalid(elements.name, nameInvalid);
    markInvalid(elements.email, emailInvalid);
    if (nameInvalid || emailInvalid) {
        elements.formStatus.dataset.kind = "error";
        elements.formStatus.textContent = copies[currentLang].formError;
        (nameInvalid ? elements.name : elements.email).focus();
        return;
    }

    submitting = true;
    elements.contactButton.disabled = true;
    elements.contactButton.textContent = copies[currentLang].sending;
    elements.formStatus.textContent = "";
    try {
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: elements.name.value.trim(),
                email: elements.email.value.trim(),
                intent: currentIntent,
                language: currentLang,
                website: elements.honeypot.value,
                sourceUrl: location.href
            })
        });
        if (!response.ok) throw new Error("contact_request_failed");
        elements.contactForm.reset();
        setIntent("A", false);
        elements.formStatus.dataset.kind = "success";
        elements.formStatus.textContent = copies[currentLang].formSuccess;
    } catch {
        elements.formStatus.dataset.kind = "error";
        elements.formStatus.textContent = copies[currentLang].formNetworkError;
    } finally {
        submitting = false;
        elements.contactButton.disabled = false;
        elements.contactButton.textContent = copies[currentLang].submit;
    }
}

document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) {
        if (!elements.languageContainer.contains(event.target)) closeLanguageMenu(false);
        return;
    }
    const { action, intent, lang } = target.dataset;
    if (action === "narrative") navigate(intent, { intent });
    if (action === "contact-from-narrative") navigate("contact", { intent });
    if (action === "intent") setIntent(intent);
    if (action === "contact") {
        if (body.dataset.state === "contact") submitContact();
        else navigate("contact", { intent: currentIntent });
    }
    if (action === "operations") navigate("operations");
    if (action === "back" || action === "cancel") goBack();
    if (action === "folder") toggleFolder(target);
    if (action === "language-menu") toggleLanguageMenu();
    if (action === "language") {
        switchLanguage(lang);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && elements.languageContainer.classList.contains("is-open")) closeLanguageMenu(true);
});

elements.brandHome.addEventListener("click", () => navigate("home"));
elements.contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submitContact();
});
elements.name.addEventListener("input", () => markInvalid(elements.name, false));
elements.email.addEventListener("input", () => markInvalid(elements.email, false));

window.addEventListener("popstate", () => {
    let page = routeFromPath(location.pathname) ?? pageFor(preferredLang, "home");
    currentIntent = new URLSearchParams(location.search).get("intent") === "B" ? "B" : "A";
    if (page.lang !== preferredLang) {
        page = pageFor(preferredLang, page.key) ?? pageFor(preferredLang, "home");
        const query = page.key === "contact" ? `?intent=${currentIntent}` : "";
        history.replaceState(
            { key: page.key, lang: preferredLang, intent: currentIntent },
            "",
            `${routeUrl(preferredLang, page.key)}${query}`
        );
    }
    renderPage(page, { focus: true });
});

reducedMotion.addEventListener("change", () => {
    if (currentPage.key === "home") setState("welcome-ready");
    if (currentPage.state === "narrative") initNarrativeObserver();
});

history.replaceState({ key: currentPage.key, lang: currentPage.lang, intent: currentIntent }, "", `${location.pathname}${location.search}`);
renderPage(currentPage);
