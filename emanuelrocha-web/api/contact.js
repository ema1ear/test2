const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const attempts = new Map();

function json(data, status = 200) {
    return Response.json(data, {
        status,
        headers: {
            "Cache-Control": "no-store",
            "Content-Security-Policy": "default-src 'none'"
        }
    });
}

function clean(value, maxLength) {
    return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function isRateLimited(request) {
    const forwarded = request.headers.get("x-forwarded-for") ?? "unknown";
    const ip = forwarded.split(",")[0].trim();
    const now = Date.now();
    const recent = (attempts.get(ip) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);
    recent.push(now);
    attempts.set(ip, recent);
    return recent.length > MAX_REQUESTS;
}

export async function POST(request) {
    if (!request.headers.get("content-type")?.includes("application/json")) {
        return json({ ok: false, error: "unsupported_media_type" }, 415);
    }

    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > 8_192) return json({ ok: false, error: "payload_too_large" }, 413);
    if (isRateLimited(request)) return json({ ok: false, error: "too_many_requests" }, 429);

    let payload;
    try {
        payload = await request.json();
    } catch {
        return json({ ok: false, error: "invalid_json" }, 400);
    }

    const website = clean(payload.website, 200);
    if (website) return json({ ok: true }, 200);

    const name = clean(payload.name, 100);
    const email = clean(payload.email, 254).toLowerCase();
    const intent = payload.intent === "B" ? "B" : "A";
    const language = payload.language === "es" ? "es" : "ca";
    const sourceUrl = clean(payload.sourceUrl, 500);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !emailPattern.test(email)) {
        return json({ ok: false, error: "invalid_fields" }, 400);
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error("RESEND_API_KEY is not configured");
        return json({ ok: false, error: "service_unavailable" }, 503);
    }

    const to = process.env.CONTACT_TO_EMAIL ?? "hola@emanuelrocha.cat";
    const from = process.env.CONTACT_FROM_EMAIL ?? "Web Emanuel Rocha <web@emanuelrocha.cat>";
    const intentLabel = intent === "A" ? "Acción y propósito" : "Descubrimiento";
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSource = escapeHtml(sourceUrl || "No indicada");

    const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            from,
            to: [to],
            reply_to: email,
            subject: `Nuevo contacto web — ${intentLabel}`,
            text: `Nombre: ${name}\nCorreo: ${email}\nIntención: ${intentLabel}\nIdioma: ${language}\nOrigen: ${sourceUrl || "No indicado"}`,
            html: `<h1>Nuevo contacto web</h1><p><strong>Nombre:</strong> ${safeName}</p><p><strong>Correo:</strong> ${safeEmail}</p><p><strong>Intención:</strong> ${intentLabel}</p><p><strong>Idioma:</strong> ${language}</p><p><strong>Origen:</strong> ${safeSource}</p>`
        })
    });

    if (!resendResponse.ok) {
        console.error("Resend request failed", resendResponse.status, await resendResponse.text());
        return json({ ok: false, error: "delivery_failed" }, 502);
    }

    return json({ ok: true }, 200);
}
