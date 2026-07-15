# Emanuel Rocha — web

Versión estática bilingüe preparada para GitHub y Vercel. Conserva la experiencia narrativa original y añade rutas indexables, navegación con historial, accesibilidad, SEO técnico y contacto mediante una Vercel Function.

## Rutas

| Català | Castellano | Uso |
| --- | --- | --- |
| `/ca/` | `/es/` | Entrada principal |
| `/ca/accio/` | `/es/accion/` | Acción y propósito |
| `/ca/cosmovisio/` | `/es/cosmovision/` | Cosmovisión |
| `/ca/contacte/` | `/es/contacto/` | Contacto, no indexado |
| `/ca/operacions/` | `/es/operaciones/` | Operaciones |

## Construcción local

Requiere Node.js 20 o superior.

```bash
npm run check
npm run build
python3 -m http.server 4173 -d dist
```

La web quedará disponible en `http://localhost:4173/ca/`. El servidor estático permite revisar la interfaz, pero el envío de correo requiere el entorno de Vercel.

## Contacto con Resend

1. Añadir y verificar `emanuelrocha.cat` en Resend.
2. Crear una API key.
3. Configurar estas variables en Vercel para Production, Preview y Development:

```text
RESEND_API_KEY
CONTACT_TO_EMAIL=hola@emanuelrocha.cat
CONTACT_FROM_EMAIL=Web Emanuel Rocha <web@emanuelrocha.cat>
```

`web@emanuelrocha.cat` se utiliza como remitente técnico; las respuestas se dirigen automáticamente al correo introducido por el visitante.

La protección incluida limita tamaño y frecuencia por instancia y añade un honeypot. Antes de una campaña de tráfico alto conviene añadir una regla de rate limiting persistente en Vercel.

## Despliegue

1. Subir esta carpeta a un repositorio de GitHub.
2. Importar el repositorio en Vercel.
3. Vercel leerá `vercel.json`, ejecutará `npm run build` y publicará `dist`.
4. Añadir las variables de entorno.
5. Asociar `emanuelrocha.cat` y seguir las instrucciones DNS de Vercel.
6. Verificar `/ca/`, `/es/`, el formulario, `robots.txt` y `sitemap.xml` en producción.

## Contenido

Los textos editables se concentran en `assets/content.js`. Cada modificación debe ir seguida de `npm run build`; el sitemap y todas las páginas localizadas se regeneran automáticamente.
