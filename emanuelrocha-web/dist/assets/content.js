export const routes = {
    ca: {
        home: "/ca/",
        A: "/ca/accio/",
        B: "/ca/cosmovisio/",
        contact: "/ca/contacte/",
        operations: "/ca/operacions/"
    },
    es: {
        home: "/es/",
        A: "/es/accion/",
        B: "/es/cosmovision/",
        contact: "/es/contacto/",
        operations: "/es/operaciones/"
    }
};

export const copies = {
    ca: {
        tag: "Consultoria de comunicació",
        title: "Benvingut",
        back: "← Tornar",
        contact: "Contacte",
        submit: "Enviar",
        sending: "Enviant…",
        cancel: "Cancel·lar",
        langActive: "Català",
        btnOperations: "Operacions",
        homeAria: "Anar a la pàgina d'inici",
        languageAria: "Canviar idioma",
        contactAria: "Obrir contacte",
        operationsAria: "Obrir operacions",
        nameLabel: "Nom",
        namePlaceholder: "[ el teu nom ]",
        emailLabel: "Correu electrònic",
        emailPlaceholder: "[ el teu correu ]",
        formLead: "Hola, em dic",
        formBridge: "i em pots escriure a",
        formIntentLead: "M'interessa obrir una via",
        intentA: "d'acció i propòsit",
        intentB: "de descobriment",
        tailA: ", definint els objectius d'execució i posant en marxa el projecte amb propòsit.",
        tailB: ", per explorar la teva cosmovisió de treball i veure si realment encaixem.",
        formError: "Revisa el nom i introdueix un correu electrònic vàlid.",
        formNetworkError: "No s'ha pogut enviar. Torna-ho a provar o escriu a hola@emanuelrocha.cat.",
        formSuccess: "Missatge enviat. Et respondré tan aviat com sigui possible.",
        proseHTML: `A un espai d'estratègia i arquitectura de la paraula adaptat a sistemes d'alt rendiment. Des d'aquí, pots triar entre confirmar la nostra sintonia i <button type="button" class="btn-inline-option" data-action="narrative" data-intent="A">passar a l'acció amb propòsit</button>, o bé aturar el temps per endinsar-te en la meva <button type="button" class="btn-inline-option" data-action="narrative" data-intent="B">cosmovisió de treball</button>.`,
        A: `<p class="scrolling-p">[ TEXT GUIA PER A CLIENT CALENT: confirmació de biaixos, certeses operatives, filosofia d'acció immediata i validació del seu propòsit comercial. ]</p><p class="scrolling-p">Si has llegit fins aquí, és perquè compartim la mateixa visió del rendiment. El següent pas és natural. <button type="button" class="btn-inline-option" data-action="contact-from-narrative" data-intent="A">Comencem?</button></p>`,
        B: `<p class="scrolling-p">[ TEXT GUIA PER A CLIENT TEMPERAT: la teva cosmovisió, el silenci de Puigcerdà, Bitcoin, el valor intangible del temps i la maduració lenta de les grans idees. ]</p><p class="scrolling-p">Aquest mètode no busca l'acció precipitada, sinó la sintonia real de valors. Si sents que és el moment d'explorar-ho, obrim un diàleg. <button type="button" class="btn-inline-option" data-action="contact-from-narrative" data-intent="B">Parlem?</button></p>`,
        operationsIntro: "La claredat operativa no és un acte, sinó un sistema rigorós de decisions i referències. A sota pots obrir cadascun dels meus arxius per explorar la metodologia de treball, les fonts d'informació que audito de forma activa i la meva prestatgeria de referents.",
        cabinet: [
            {
                num: "01",
                name: "Operativa de treball",
                status: "Mètode",
                content: `<p>Treball concentrat basat en transmissions asíncrones de dades. Eliminem el soroll i la fricció de les reunions innecessàries. Execució d'energia directa basada en documentació arquitectònica i de disseny rigorosa.</p>`
            },
            {
                num: "02",
                name: "Fonts d'informació",
                status: "Arxiu",
                content: `<p>Monitorem dades agregades sobre models d'interfície, sistemes de disseny natius d'alt rendiment i fluxos de pensament clàssic. Registres oberts a fonts d'anàlisi geopolítica de xarxes.</p><a href="https://fontshare.com" target="_blank" rel="noopener noreferrer" class="inspiration-link">Fontshare</a><a href="https://apple.com/design" target="_blank" rel="noopener noreferrer" class="inspiration-link">Apple Design</a>`
            },
            {
                num: "03",
                name: "Inspiració i referències",
                status: "Prestatgeria",
                content: `<p>Estructures geomètriques de l'escola clàssica suïssa de mitjans del segle XX, arquitectura brutalista, disseny de hardware i la recerca obsessiva del silenci creatiu des de la Cerdanya.</p><a href="https://ca.wikipedia.org/wiki/Estil_tipogr%C3%A0fic_internacional" target="_blank" rel="noopener noreferrer" class="inspiration-link">Swiss Style</a>`
            }
        ]
    },
    es: {
        tag: "Consultoría de comunicación",
        title: "Bienvenido",
        back: "← Volver",
        contact: "Contacto",
        submit: "Enviar",
        sending: "Enviando…",
        cancel: "Cancelar",
        langActive: "Castellano",
        btnOperations: "Operaciones",
        homeAria: "Ir a la página de inicio",
        languageAria: "Cambiar idioma",
        contactAria: "Abrir contacto",
        operationsAria: "Abrir operaciones",
        nameLabel: "Nombre",
        namePlaceholder: "[ tu nombre ]",
        emailLabel: "Correo electrónico",
        emailPlaceholder: "[ tu correo ]",
        formLead: "Hola, me llamo",
        formBridge: "y puedes escribirme a",
        formIntentLead: "Me interesa abrir una vía",
        intentA: "de acción y propósito",
        intentB: "de descubrimiento",
        tailA: ", definiendo los objetivos de ejecución y poniendo en marcha el proyecto con propósito.",
        tailB: ", para explorar tu cosmovisión de trabajo y ver si realmente encajamos.",
        formError: "Revisa el nombre e introduce un correo electrónico válido.",
        formNetworkError: "No se ha podido enviar. Inténtalo de nuevo o escribe a hola@emanuelrocha.cat.",
        formSuccess: "Mensaje enviado. Te responderé lo antes posible.",
        proseHTML: `A un espacio de estrategia y arquitectura de la palabra adaptado a sistemas de alto rendimiento. Desde aquí, puedes elegir entre confirmar nuestra sintonía y <button type="button" class="btn-inline-option" data-action="narrative" data-intent="A">pasar a la acción con propósito</button>, o bien detener el tiempo para adentrarte en mi <button type="button" class="btn-inline-option" data-action="narrative" data-intent="B">cosmovisión de trabajo</button>.`,
        A: `<p class="scrolling-p">[ TEXTO GUÍA PARA CLIENTE CALIENTE: confirmación de sesgos, certezas operativas, filosofía de acción inmediata y validación de su propósito comercial. ]</p><p class="scrolling-p">Si has leído hasta aquí, es porque compartimos la misma visión del rendimiento. El siguiente paso es natural. <button type="button" class="btn-inline-option" data-action="contact-from-narrative" data-intent="A">¿Empezamos?</button></p>`,
        B: `<p class="scrolling-p">[ TEXTO GUÍA PARA CLIENTE TEMPLADO: tu cosmovisión, el silencio de Puigcerdà, Bitcoin, el valor intangible del tiempo y la maduración lenta de las grandes ideas. ]</p><p class="scrolling-p">Este método no busca la acción precipitada, sino la sintonía real de valores. Si sientes que es el momento de explorarlo, abramos un diálogo. <button type="button" class="btn-inline-option" data-action="contact-from-narrative" data-intent="B">¿Hablamos?</button></p>`,
        operationsIntro: "La claridad operativa no es un acto, sino un sistema riguroso de decisiones y referencias. Abajo puedes abrir cada uno de mis archivos para explorar la metodología de trabajo, las fuentes de información que audito de forma activa y mi estantería de referentes.",
        cabinet: [
            {
                num: "01",
                name: "Operativa de trabajo",
                status: "Método",
                content: `<p>Trabajo concentrado basado en transmisiones asíncronas de datos. Eliminamos el ruido y la fricción de las reuniones innecesarias. Ejecución de energía directa basada en documentación arquitectónica y de diseño rigurosa.</p>`
            },
            {
                num: "02",
                name: "Fuentes de información",
                status: "Archivo",
                content: `<p>Monitoreamos datos agregados sobre modelos de interfaz, sistemas de diseño nativos de alto rendimiento y flujos de pensamiento clásico. Registros abiertos a fuentes de análisis geopolítico de redes.</p><a href="https://fontshare.com" target="_blank" rel="noopener noreferrer" class="inspiration-link">Fontshare</a><a href="https://apple.com/design" target="_blank" rel="noopener noreferrer" class="inspiration-link">Apple Design</a>`
            },
            {
                num: "03",
                name: "Inspiración y referentes",
                status: "Estantería",
                content: `<p>Estructuras geométricas de la escuela clásica suiza de mediados del siglo XX, arquitectura brutalista, diseño de hardware y la búsqueda obsesiva del silencio creativo desde la Cerdanya.</p><a href="https://es.wikipedia.org/wiki/Estilo_tipogr%C3%A1fico_internacional" target="_blank" rel="noopener noreferrer" class="inspiration-link">Swiss Style</a>`
            }
        ]
    }
};

export const routePages = [
    { lang: "ca", key: "home", state: "welcome-ready", title: "Emanuel Rocha — Consultoria de comunicació", description: "Estratègia de comunicació i arquitectura de la paraula per ordenar decisions, narratives i sistemes de negoci.", index: true },
    { lang: "ca", key: "A", state: "narrative", title: "Acció i propòsit — Emanuel Rocha", description: "Una ruta per convertir objectius de comunicació en decisions i execució amb propòsit.", index: true },
    { lang: "ca", key: "B", state: "narrative", title: "Cosmovisió de treball — Emanuel Rocha", description: "La mirada, els criteris i les tensions que sostenen la manera de treballar d'Emanuel Rocha.", index: true },
    { lang: "ca", key: "contact", state: "contact", title: "Contacte — Emanuel Rocha", description: "Obre una conversa amb Emanuel Rocha sobre comunicació, estratègia o arquitectura de la paraula.", index: false },
    { lang: "ca", key: "operations", state: "operations", title: "Operacions — Emanuel Rocha", description: "Metodologia, fonts i referències que estructuren la manera de treballar d'Emanuel Rocha.", index: true },
    { lang: "es", key: "home", state: "welcome-ready", title: "Emanuel Rocha — Consultoría de comunicación", description: "Estrategia de comunicación y arquitectura de la palabra para ordenar decisiones, narrativas y sistemas de negocio.", index: true },
    { lang: "es", key: "A", state: "narrative", title: "Acción y propósito — Emanuel Rocha", description: "Una ruta para convertir objetivos de comunicación en decisiones y ejecución con propósito.", index: true },
    { lang: "es", key: "B", state: "narrative", title: "Cosmovisión de trabajo — Emanuel Rocha", description: "La mirada, los criterios y las tensiones que sostienen la forma de trabajar de Emanuel Rocha.", index: true },
    { lang: "es", key: "contact", state: "contact", title: "Contacto — Emanuel Rocha", description: "Abre una conversación con Emanuel Rocha sobre comunicación, estrategia o arquitectura de la palabra.", index: false },
    { lang: "es", key: "operations", state: "operations", title: "Operaciones — Emanuel Rocha", description: "Metodología, fuentes y referencias que estructuran la forma de trabajar de Emanuel Rocha.", index: true }
];

export function equivalentRoute(page, lang) {
    return routes[lang][page.key];
}
