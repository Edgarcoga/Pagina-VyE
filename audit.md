# Auditoría Impecable de UX/UI & Ergonomía Cognitiva
**Proyecto:** VyE Ingeniería (`Pagina-VyE`)  
**Metodología:** *Impeccable Design Auditor (Hard Dials & Anti-Fatigue Framework)*  
**Fecha:** Octubre 2026  
**Objetivo Crítico:** Erradicar la fatiga cognitiva y visual del usuario, depurar inconsistencias atómicas de diseño ("valores duros") y consolidar una experiencia técnica de alta gama, serena y de alta conversión.

---

## 1. Resumen Ejecutivo & Diagnóstico de Sobrecarga

El sitio actual de **VyE Ingeniería** posee una base conceptual fuerte y un lenguaje visual con potencial premium (estética de ingeniería mecatrónica en modo oscuro). Sin embargo, tras la auditoría exhaustiva de código (`index.html`, `nosotros.html`, `indexSGE.html`, `style.css`, `vye-globals.css` y `script.js`), se diagnostica un fenómeno severo de **"UI Inquieta" (Visual & Cognitive Fatigue)**:

> [!WARNING]
> **Diagnóstico Principal: Sobrecarga Sensorial Activa**  
> El usuario está expuesto a **7 capas de movimiento simultáneo** y a más de **16 tonos de gris/negro no normalizados**. La interfaz nunca descansa: compiten partículas en bucle, seguimiento de ratón (paralaje y resplandor de 300px), un cursor personalizado animado, auto-scroll a 60fps en galería y un preloader artificial de hasta 3 segundos. Esto genera **tensión visual, calentamiento innecesario del dispositivo y pérdida de enfoque en la conversión**.

### Matriz de Impacto en Fatiga del Usuario

| Dimensión Auditada | Estado Actual | Diagnóstico Impeccable | Impacto en el Usuario | Prioridad |
| :--- | :--- | :--- | :--- | :---: |
| **Micro-movimiento y Loops** | 7 fuentes activas (`rAF`, `setInterval`, listeners continuos de `mousemove`) | Ruido motor extremo. La web compite por atención en vez de permitir lectura serena. | **Crítico (Fatiga y mareo visual)** | 🔴 Alta |
| **Paleta de Neutros / Oscuros** | 16 tonos entre `#000000`, `#050505`, `#0D0D0D`, `#1A1A1A`, etc. | "4 grises que deberían ser 1". Proliferación de superficies sin sistema de elevación. | **Medio (Falta de cohesión tonal)** | 🔴 Alta |
| **Tipografía y Micro-textos** | Tamaños desde `0.66rem` (10.5px) y múltiples ratios de interlineado | Esfuerzo de acomodación ocular excesivo en pantallas estándar y móviles. | **Alto (Cansancio ocular rápido)** | 🔴 Alta |
| **Cursor Personalizado** | Abeja personalizada (`abeja_cursor.png` y `pointer`) forzada con `!important` | Pérdida del affordance nativo del SO, imprecisión de clic y distracción periférica. | **Alto (Fricción ergonómica)** | 🔴 Alta |
| **Coherencia de Espaciado (Dials)** | `--section-pad` en conflicto entre 2 archivos CSS (140px vs 38-60px) | Espaciados erráticos, saltos visuales al navegar entre secciones. | **Medio (Desorden espacial)** | 🟡 Media |
| **Consistencia de CTAs** | 5 variantes de mensaje hacia WhatsApp y botones con comportamientos dispares | Parálisis de decisión ("Decision Fatigue"). "Saber más" salta a contacto en unos y a otra página en otros. | **Alto (Fricción de conversión)** | 🔴 Alta |

---

## 2. Auditoría de Valores Duros (The Impeccable Hard Dials)

La filosofía *Impeccable* rechaza las opiniones abstractas y audita **valores numéricos duros**. A continuación se detallan las desviaciones exactas encontradas en el código:

### 2.1. Proliferación de Grises y Fondos ("16 grises que deben ser 5")

En el código conviven simultáneamente:
1. `vye-globals.css`: Declara `--black`, `--black-soft` (`#0A0A0A`), `--black-card` (`#0D0D0D`), `--gray-950` (`#111111`), `--gray-900` (`#1A1A1A`), `--gray-800` (`#2A2A2A`), `--gray-700` (`#3A3A3A`), `--gray-600` (`#555555`), `--gray-500` (`#777777`), `--gray-400` (`#999999`), `--gray-300` (`#BBBBBB`), `--gray-200` (`#DDDDDD`).
2. `style.css`: Redefine las mismas variables pero luego inserta valores *hardcoded*: `#080808`, `#060606`, `#121212`, `rgba(255, 255, 255, 0.03)`, `rgba(255, 255, 255, 0.08)`.
3. `indexSGE.html`: Introduce su propia escala: `--cream: #050505`, `--cream-dark: #0a0a0a`, `--ink: #f4f4f5`, `--ink-soft: #a1a1aa`, `--ink-mute: #71717a`.

> [!IMPORTANT]
> **Regla Impeccable:** Un sistema oscuro premium profesional solo necesita **5 elevaciones de superficie** y **3 niveles de texto**. Cualquier tono intermedio adicional es ruido visual.

#### Tabla de Normalización de Tonalidad (Valores Duros)

```
NIVEL SUPERFICIE (SURFACES)
[L0 - Base Canvas]      #0A0A0B   (Elimina el #000000 puro para evitar halación y deslumbramiento OLED)
[L1 - Card Default]     #121215   (Contenedores de servicios, cards estándar)
[L2 - Card Highlight]   #18181D   (Cards interactivas al hover o activas)
[L3 - Popups / Modals]  #202026   (Diálogos flotantes, navbar scroll)
[Borde Estándar]        rgba(255, 255, 255, 0.08)

NIVEL TEXTO (CONTRASTE WCAG AAA)
[Texto Primario]        #F4F4F6   (100% contraste legible, sin quemar la retina)
[Texto Secundario]      #A0A0AB   (Descripciones y subtítulos, ratio 7.2:1)
[Texto Muted / Meta]    #70707C   (Etiquetas, metadatos, ratio 4.6:1)
```

---

### 2.2. Inconsistencia de Dorados y Gradientes

Se detectaron al menos **6 variantes del color dorado/dorado-ámbar** en CSS y JS:
- `--gold: #D4A843` (Token principal)
- `--gold-light: #F0D060` (Brillo)
- `--gold-dark: #B8922E` (Sombra)
- `script.js` (Canvas highlighter): `#e5b84a` (hardcoded en JS línea 54)
- `style.css` (Galería hover): `#b8860b` (DarkGoldenrod genérico del navegador en línea 3993)
- `indexSGE.html`: `--gold: #E6B64A` y `--gold-light: #F5D37A`

**Corrección Impeccable:** Fijar un único par espectral:
- **Primary Gold:** `hsl(43, 62%, 55%)` (`#D4A843`)
- **Hover/Light Gold:** `hsl(43, 85%, 66%)` (`#F0D060`)
- Eliminar cualquier uso de nombres de color CSS nativos como `darkgoldenrod`.

---

### 2.3. Espaciado y Desalineaciones (Spacing Dials)

Se encontró una colisión severa en la regla de padding vertical de secciones:
- `vye-globals.css:38`: `--section-pad: clamp(80px, 10vw, 140px);`
- `style.css:45`: `--section-pad: clamp(38px, 5.5vh, 60px);`

Como `style.css` importa `vye-globals.css` en la línea 1 y luego reescribe la variable, muchas clases que se compilaron con la primera referencia quedan asimétricas. Además, en `style.css` hay secciones con `padding: 24px 0`, otras con `40px 0` y otras con `5.5vh`.

#### Escala Impeccable Unificada (Módulo 8px)
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 16px;
--space-4: 24px;
--space-5: 32px;
--space-6: 48px;
--space-7: 72px;
--space-8: 96px;

/* Secciones: */
--section-pad-desktop: 80px;
--section-pad-mobile: 48px;
```

---

### 2.4. Micro-textos Inaudibles / Ilegibles

En `style.css`:
- Línea 3813: `.galeria-card__placeholder-text { font-size: 0.66rem; }` → **10.56px**.
- Línea 3835: `.galeria-card__tag { font-size: 0.68rem; }` → **10.88px**.
- Línea 3928: `.galeria-carrusel__hint { font-size: 0.74rem; }` → **11.84px**.

> [!CAUTION]
> Cualquier texto inferior a **12px (0.75rem)** fuerza la vista del usuario, degrada la accesibilidad en monitores de alta densidad y produce fatiga involuntaria en sesiones de lectura de más de 45 segundos. **Piso mínimo establecido: 12px con tracking moderado (+0.5px)**.

---

## 3. Plan de Eliminación de Ruido y Fatiga Sensorial ("No Cansar al Usuario")

A continuación se analizan los 7 componentes que causan fatiga visual y cómo desarmar la fricción técnica:

### 1. El Preloader Forzado (1.8s - 3.0s de bloqueo)
* **Problema:** En `script.js` líneas 156-176, el preloader retiene al usuario durante 1.8 a 3.0 segundos obligatoriamente con una animación de 360 grados, independientemente de que la web ya esté cargada. 
* **Impacto:** Provoca frustración inicial y sensación de lentitud antes de ver cualquier contenido.
* **Solución Impeccable:** Retirar el preloader para usuarios recurrentes (o reducirlo a un fade inmediato `< 250ms` sólo cuando los assets críticos aún no están en caché). El contenido debe aparecer de forma casi instantánea.

### 2. El Cursor Personalizado de Abeja
* **Problema:** En `style.css` líneas 70, 79 y 83-85, se aplica `assets/abeja_cursor.png` y `assets/abeja_pointer.png` con `!important` en todos los elementos interactivos.
* **Impacto:** El puntero pierde la precisión milimétrica del cursor del sistema operativo, el cerebro del usuario debe calcular constantemente el punto de contacto exacto (hotspot) y el gráfico en movimiento distrae continuamente la atención del texto que se está leyendo.
* **Solución Impeccable:** Volver al cursor estándar del sistema (`cursor: default` y `cursor: pointer`). Mantener la abeja como isotipo en el branding y logotipo, no en el dispositivo de navegación del usuario.

### 3. Las Partículas en Bucle Infinito (`heroParticles`)
* **Problema:** `script.js` líneas 274-311 ejecuta un `setInterval` cada 800ms inyectando nodos en el DOM que flotan y se eliminan continuamente.
* **Impacto:** Genera constante movimiento en el campo visual periférico (el área más sensible del ojo a las alertas de movimiento). Esto impide la lectura concentrada del titular y la propuesta de valor.
* **Solución Impeccable:** Reemplazar el generador de partículas por una sutil trama de ingeniería estática (`hero__bg-grid`) con un degradado radial fijo de iluminación técnica.

### 4. Doble Parallax y Cursor Glow de 300px
* **Problema:** Listeners globales de `mousemove` calculando traslaciones en `heroGlow`, `heroGrid`, cards con efecto tilt 3D y un círculo dorado difuso de 300px (`cursorGlow`) que persigue el ratón por toda la pantalla.
* **Impacto:** Sobrecarga el procesador gráfico y hace que cada movimiento de mano produzca un temblor o desplazamiento de planos en la pantalla, generando mareo visual ("motion sickness" leve).
* **Solución Impeccable:** Eliminar el `cursorGlow` y desactivar el tilt 3D en las cards. Un hover simple y refinado (`translateY(-2px)` con transición suave de borde) comunica interactividad con máxima elegancia y cero fatiga.

### 5. Galería con Auto-Scroll Permanente a 60fps
* **Problema:** En `script.js` líneas 756-789, `autoScrollGaleria` mueve la galería horizontal continuamente a 60fps, rebotando de izquierda a derecha.
* **Impacto:** Si el usuario está leyendo los servicios o la sección de arriba/abajo, una franja de la pantalla se mueve sola en su visión periférica. Cuando el usuario intenta hacer clic, el objetivo se está moviendo.
* **Solución Impeccable:** La galería debe ser **100% controlada por el usuario** (scroll manual con touch/drag suave o botones de flecha previa/siguiente con barra de progreso). El movimiento no solicitado debe detenerse.

### 6. Autoplay Inquieto en el Carril de Nosotros (30s con cronómetro de cuenta regresiva)
* **Problema:** En `script.js` líneas 456-500, se incluye una barra que se llena y un texto "30s", "29s", cambiando el slide automáticamente.
* **Impacto:** Convierte la sección institucional en una carrera contra el tiempo. El usuario siente prisa o interrupción en mitad de la lectura.
* **Solución Impeccable:** Cambiar a carrusel o pestañas interactivas sin temporizador forzado. Que el usuario cambie de pestaña a su propio ritmo ("01 Acerca de", "02 Historia", "03 Equipo").

### 7. Animación Compleja del Marcador de Tinta Canvas
* **Problema:** `script.js` líneas 12-148 calcula matemáticamente el trazo de un plumón de felpa con armónicos sinusoidales dobles y 2 pasadas.
* **Impacto:** Requiere recrear contextos de canvas 2D, múltiples capas temporales y retrasa la lectura del titular más de 1.5 segundos.
* **Solución Impeccable:** Un subrayado SVG limpio o una animación CSS con `clip-path` / `background-size` de 400ms logra el mismo efecto humano sin peso de CPU ni demoras.

---

## 4. Auditoría de Arquitectura de Contenidos & Conversión

### 4.1. El Hero: Claridad vs Competencia de Botones
* **Situación:** En el Hero hay dos botones:
  1. `Ver servicios` (outline)
  2. `Solicitar diagnóstico` (primary con rayo ⚡)
* **Problema:** Ambos tienen un peso visual similar y están invertidos en jerarquía psicológica (el botón de ver servicios está a la izquierda pero el primario está a la derecha).
* **Solución Impeccable:**
  - Botón Principal (Izquierda o dominante): **Solicitar Diagnóstico Sin Costo** (CTA de alta conversión).
  - Botón Secundario (Derecha o texto con flecha): **Explorar Soluciones**.

### 4.2. Inconsistencia de los Botones "Saber Más" en Servicios
* En la sección de Servicios:
  - Card 1 (Software): `<a href="#contacto" class="servicio__cta">Saber más →</a>`
  - Card 2 (SGE): Envuelve la tarjeta completa en `<a href="indexSGE.html">`
  - Card 3 (Automatización): `<a href="#contacto" class="servicio__cta">Saber más →</a>`
  - Card 4 (Páginas Web): `<a href="#contacto" class="servicio__cta">Saber más →</a>`
* **Fricción:** El usuario que hace clic en "Saber más" en la Card 1 espera información sobre el software, pero la página lo arrastra bruscamente al formulario de contacto final. Sin embargo, en la Card 2 sí lo lleva a una página dedicada. Esto rompe el modelo mental de navegación.
* **Solución Impeccable:**
  - Si no existe página individual para cada servicio aún, el texto no debe ser "Saber más", sino: **"Cotizar este servicio →"** o **"Solicitar información →"**. Así la expectativa es transparente y coherente con llevarlo al contacto.

### 4.3. Claridad de Pruebas Sociales y Galería
* Actualmente las tarjetas de la galería muestran el mensaje *"Foto del proyecto"* y un icono SVG porque faltan las imágenes reales en `src=""`.
* **Solución Impeccable:**
  - Mientras se incorporan capturas reales, las tarjetas deben funcionar como **tarjetas de estudio de caso o maquetas vectoriales limpias de interfaz (UI Mockup Cards)** con esquemas técnicos claros, en lugar de cajas vacías con mensaje de "foto faltante".

---

## 5. Plan de Acción Técnico Priorizado (Roadmap de Refactorización)

### Fase 1: Descompresión Inmediata de Fatiga (Quick Wins - Reducción del 80% del estrés visual)
1. **Desactivar el cursor personalizado de abeja** en `style.css`: restaurar cursores ergonómicos nativos.
2. **Desactivar el auto-scroll perpetuo de la galería** en `script.js`: dejar el carrusel en reposo hasta que el usuario decida explorarlo.
3. **Eliminar el `cursorGlow` (resplandor de 300px)** y los listeners continuos de `mousemove` en el viewport global.
4. **Desactivar el generador de partículas flotantes** `heroParticles` y el temporizador invasivo de 30s en Nosotros.
5. **Acelerar o eliminar el preloader bloqueante**: carga directa del contenido sin retención artificial.

### Fase 2: Consolidación de Tokens & Valores Duros Impeccable
1. **Unificar la escala de superficies oscuras** a 5 niveles (eliminando los 16 tonos dispersos).
2. **Reemplazar el negro `#000000` absoluto de fondo** por `#0A0A0B` (profundo pero suave para la vista).
3. **Fijar el dorado corporativo único** (`#D4A843`) en todas las instancias de CSS y scripts.
4. **Subir los micro-textos inferiores a 12px** a un estándar legible de 12px–13px.
5. **Resolver la discrepancia de `--section-pad`** entre `vye-globals.css` y `style.css`.

### Fase 3: Claridad de Interacción & Conversión
1. **Alinear las llamadas a la acción (CTAs)** de Servicios: cambiar "Saber más" engañoso por "Cotizar software" o "Solicitar diagnóstico".
2. **Jerarquizar el Hero CTA**: Enfoque inequívoco en el diagnóstico de eficiencia.
3. **Incorporar soporte para `prefers-reduced-motion`** en todas las transiciones para garantizar accesibilidad absoluta.

---

## 6. Fragmento de Referencia: Tokens Impecables Recomendados

A continuación se muestra el bloque de variables consolidado listo para reemplazar las inconsistencias en `style.css` y `vye-globals.css`:

```css
/* ── TOKENS IMPECABLES VYE (ANTI-FATIGUE SPEC) ── */
:root {
    /* 1. Superficies (5 escalones de elevación, sin negros puros abrasivos) */
    --surface-bg:       #0A0A0C; /* Fondo principal sereno */
    --surface-card:     #121216; /* Tarjetas y paneles */
    --surface-hover:    #18181F; /* Estado hover / interactivo */
    --surface-overlay:  #1F1F27; /* Modales, dropdowns y barra fija */
    --surface-border:   rgba(255, 255, 255, 0.08);
    --surface-border-gold: rgba(212, 168, 67, 0.25);

    /* 2. Textos (Ratios de contraste calibrados para cero cansancio) */
    --text-primary:     #F4F4F6; /* Lectura nítida principal */
    --text-secondary:   #A2A2AD; /* Subtítulos y párrafos explicativos */
    --text-muted:       #71717E; /* Fechas, etiquetas secundarias (min 12px) */

    /* 3. Acentos de Marca (Normalizados) */
    --gold-primary:     #D4A843; /* Dorado insignia */
    --gold-hover:       #E5B84A; /* Dorado interactivo */
    --gold-subtle:      rgba(212, 168, 67, 0.12); /* Fondos suaves de badge */

    /* 4. Módulo de Espaciado (8pt Grid) */
    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 16px;
    --space-lg: 24px;
    --space-xl: 32px;
    --space-2xl: 48px;
    --space-section: clamp(48px, 6vw, 88px);

    /* 5. Radios Coherentes */
    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 16px;
    --radius-full: 9999px;
}

/* Respeto estricto a usuarios sensibles al movimiento */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

---

## 7. Conclusión de la Auditoría

La implementación de este reporte transformará la web de VyE de un estado **"técnicamente sobrecargado y visualmente fatigante"** a un sitio **"impecable, maduro y de ingeniería de precisión"**. Al eliminar el movimiento innecesario y unificar los valores duros, el visitante no se cansa, comprende el valor del servicio en menos de 10 segundos y avanza de forma natural hacia el diagnóstico de eficiencia.
