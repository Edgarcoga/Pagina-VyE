# Manual de Diseño VyE: Minimalismo Técnico & Guía Anti-Efecto IA
**Proyecto:** VyE Ingeniería (`Pagina-VyE`)  
**Documento:** Guía Maestra de Diseño, Ergonomía Cognitiva & Estándar Visual  
**Propósito:** Servir como marco de referencia permanente para esta web y futuros desarrollos digitales de la empresa, garantizando una estética de ingeniería de precisión, sobria, minimalista y libre de clichés generados por inteligencia artificial.

---

## 1. Filosofía Central: Diseñar como Ingenieros para Dueños de Negocio

El cliente de VyE Ingeniería es un dueño, director o gerente de operaciones. No busca fuegos artificiales ni adornos futuristas: busca **orden, control, reducción de costos y certidumbre técnica**.

> [!IMPORTANT]
> **La Regla de Oro del Minimalismo VyE:**  
> *Si un elemento visual solo sirve para "decorar" o "llenar espacio" y no comunica una función, un dato o una ventaja real de negocio, **se elimina**.*  
> El diseño premium no se logra agregando cosas; se logra quitando todo lo innecesario hasta que solo quede lo esencial ejecutado con precisión milimétrica.

---

## 2. La Lista Negra: Catálogo de Vicios del "Efecto IA" (Terminantemente Prohibidos)

Cuando una web es generada por herramientas de IA o plantillas genéricas, suele caer en una serie de patrones reconocibles que transmiten falsedad, baratura y sobrecarga. Esta lista negra define lo que **NUNCA** debe implementarse en un proyecto de VyE:

### 2.1. Vicios Visuales y de Interfaz

| Vicio "Estilo IA" | Por qué daña la percepción | Estándar VyE (Qué hacer en su lugar) |
| :--- | :--- | :--- |
| **Recuadros o cápsulas neón amarillo/dorado** encerrando palabras o números. | Parece una plantilla barata de Web3 o "cyberpunk" barato; sobrecarga la lectura. | **Cero recuadros.** El énfasis se da únicamente mediante la jerarquía del texto: negritas nítidas (`font-weight: 700`) y números monospaced sutiles. |
| **Textos y etiquetas encimados sobre capturas o fotos** (cajas flotando sobre monitores). | Tapa la pantalla del software real, luce artificial y genera ruido visual. | **Pantallas limpias.** Los datos y el software deben apreciarse al 100%. Las explicaciones van al pie o en columnas dedicadas, nunca tapando la imagen. |
| **Tinte azulado frío ("Slate / Navy")** en el modo oscuro (`#0e0e12`, `#121218`). | Es el color por defecto de librerías automáticas (Tailwind/v0/ChatGPT). Rompe la estética industrial de hardware y mecatrónica. | **Negro carbón neutro puro.** Usar únicamente tonos neutros sin tinte azul ni violeta (`#000000`, `#0A0A0A`, `#111111`, `#141414`). |
| **Incoherencia geométrica en esquinas:** mezclar tarjetas cuadradas (`2px`) con otras muy redondeadas (`24px`). | Produce sensación de desorden, de estar armado con pedazos de distintas fuentes. | **Escala geométrica unificada:** Tarjetas a `12px`, botones a `10px`, badges a `6px`. Sin excepciones. |
| **Efecto "caja dentro de caja":** enmarcar cada párrafo en una tarjeta individual con bordes. | Convierte la página en un mosaico asfixiante de bordes y líneas que cansan la vista. | **Espacio negativo (aire).** Separar conceptos con espaciado vertical armónico, no con cajas divisorias. |
| **Separadores diagonales tipo slash (`/`)** entre palabras o listas. | Adorno innecesario que compite con la separación numérica natural. | Separación por espaciado generoso o numeración monoespaciada (`01`, `02`). |
| **Micro-movimiento infinito no solicitado:** partículas flotando, rejillas en bucle, glow gigante en el mouse. | Mareo visual, fatiga cognitiva periférica y alto consumo innecesario de GPU/batería. | **Fondo sereno.** El fondo es un lienzo arquitectónico estático. Las animaciones solo existen en respuesta a la interacción del usuario. |
| **Elementos que se desbordan de su columna:** logotipos o cajas que invaden el espacio vecino. | Rompe la simetría y genera sensación de interfaz rota o descuidada. | **Regla de la línea vertical imaginaria:** Los elementos superiores respetan estrictamente la frontera derecha definida por los botones y títulos. |

### 2.2. Vicios de Copywriting (Redacción IA)

* ❌ **Prohibido el lenguaje inflado y vacío:** Frases como *"Revolucionamos el ecosistema digital"*, *"Soluciones sinérgicas e innovadoras de vanguardia"*, *"Impulsamos tu visión al siguiente nivel"*.  
  * ✔️ **Enfoque VyE:** Directo, concreto y de ingeniería: *"Software a la medida y automatización mecatrónica para erradicar el caos operativo, las hojas de Excel desincronizadas y la dependencia del dueño."*
* ❌ **Prohibido repetir sinónimos en la misma sección:** Decir "diagnóstico sin costo", "análisis gratuito" y "propuesta sin costo inicial" en tres lugares seguidos. Si ya se dijo una vez, **no se repite**.
* ❌ **Prohibido el uso de clichés genéricos:** Expresiones como *"Sin intermediarios"* o *"Trato directo con ingenieros"* no aportan valor real diferenciador. Es infinitamente más poderoso: *"Precios cerrados por contrato"*, *"Capacitamos a tu equipo y te damos soporte técnico en producción"*.
* ❌ **Prohibidas las listas de 3 palomitas típicas:** No usar los clásicos checks verdes/dorados debajo de los formularios con frases genéricas. Usar párrafos contundentes de dos renglones que ataquen el dolor real del negocio.

---

## 3. La Regla Cromática: 60% Negro, 30% Blanco y 10% Dorado

La paleta se rige por el estándar del **diseño suizo de alta precisión** (estilo *Braun, Leica, Teenage Engineering, Apple y Linear*):

```
┌────────────────────────────────────────────────────────────────────────┐
│  60% NEGRO CARBÓN (Lienzo Arquitectónico y Estructura)                  │
│  Fondo base profundo (#000000 / #0A0A0A) + Módulos (#111111)           │
├────────────────────────────────────────┬───────────────────────────────┤
│  30% BLANCO & NEUTROS (Contenido)      │  10% DORADO (Acento Quirúrgico)│
│  Títulos (#FFFFFF), textos (#A0A0A0)   │  Énfasis (#D4AF37)             │
└────────────────────────────────────────┴───────────────────────────────┘
```

### 3.1. 60% Negro Carbón Neutro (Superficies)
* **Base global del sitio:** `#000000` o `#0A0A0A` mate profundo. Sin mallas ni mallas wireframe brillantes.
* **Superficie de tarjetas y módulos (`.feat-box`, `.proj-card`, `.process-card`):** `#111111` sólido.
* **Superficie interactiva / Hover:** `#141414` o `#161616`.
* **Bordes estructurales:** `1px solid rgba(255, 255, 255, 0.08)` o `#222222`. Líneas ultra-finas que definen el límite sin gritar.
* **Prohibición estricta:** Cero tonos con tinte azul (`#0e0e12`, `#121218`, `#161622`).

### 3.2. 30% Blanco y Neutros de Alta Densidad (Información)
* **Texto Primario / Titulares:** `#FFFFFF` puro para dar impacto, contraste y máxima legibilidad.
* **Botón Primario de Conversión:** Fondo blanco sólido `#FFFFFF` con texto negro `#0A0A0A` (alta visibilidad inmediata).
* **Texto Secundario / Párrafos descriptivos:** `#A0A0A0` a `#B4B4B4` (contraste equilibrado que no quema la retina en sesiones de lectura).
* **Metadatos y Etiquetas secundarias:** `#666666` a `#777777` (mínimo `12px` de tamaño).

### 3.3. 10% Dorado Satinado (El Acento Quirúrgico)
* **Tonalidad insignia:** `--gold: #D4AF37` (oro satinado clásico / champagne cálido).
* **Regla de uso:** Se reserva **exclusivamente** para:
  1. La palabra o frase de impacto clave dentro de un titular (`<span class="text-gold">`).
  2. Los números de paso o telemetría (`01`, `02`, `03`).
  3. La barra de progreso de tiempo real en el visor interactivo.
  4. Flechas y micro-interacciones sutiles al pasar el cursor.
* **Prohibición estricta:** Nunca usar dorado en fondos de bloques completos, nunca usar dorado fluorescente/neón y nunca aplicarlo en párrafos largos de lectura.

---

## 4. Geometría y Proporciones Matemáticas Unificadas

La armonía visual proviene de una cuadrícula rigurosa donde cada elemento comparte la misma proporción:

### 4.1. Escala Universal de Redondeos (`border-radius`)
* **Contenedores y Tarjetas Principales:** `12px` en toda la web (tarjetas de portafolio, módulos de servicio, bloque Nissan, modales de zoom, tarjeta de contacto).
* **Botones Principales y Secundarios:** `10px` a `12px`.
* **Badges internos, avatares y controles pequeños:** `6px` a `8px`.
* **Prohibido:** No usar radios casi rectos de `2px` (estilo tosco de software antiguo) ni píldoras redondeadas exageradas de `100px` (estilo juguetón no profesional).

### 4.2. La Regla de la Línea Vertical Imaginaria (Alineación en Bounding Box)
En composiciones asimétricas (como la columna izquierda del Hero):
* Los botones inferiores de acción (*"Solicitar diagnóstico gratis"* y *"Ver proyectos reales →"*) y el titular principal definen el ancho límite de la columna (~430px - 450px).
* El logotipo o marca superior **jamás debe rebasar la línea vertical imaginaria** que sube desde el extremo derecho del segundo botón.
* Si el logo rebasa esa línea e invade el espacio de la imagen o del visor de la derecha, debe reducirse de escala hasta que coincida con la frontera vertical del contenido inferior.

### 4.3. Regla del Centrado Matemático en Elementos Fijos (Navbar)
* En barras fijas con `position: fixed`, los elementos hijos desvinculados del flujo flexbox deben calcular su posición vertical de forma exacta:
  $$\text{top} = \frac{\text{alto total de la barra} - \text{alto del elemento}}{2}$$
* Evitar valores arbitrarios empíricos (como `top: 12px` en una barra de 75px) que pegan los logos al techo y los dejan desfasados respecto a los enlaces de navegación y botones CTA.

---

## 5. Copywriting Humano: "Menos Texto, Palabras Boom"

La redacción de VyE se enfoca en resolver dudas operativas concretas de dueños de empresas con honestidad técnica:

### 5.1. Ejemplos de Fórmulas Validadas en Producción

| Sección | Mensaje Clave | Por qué funciona |
| :--- | :--- | :--- |
| **El Reto (Punchline)** | *"Seguir operando como antes también cuesta."* | Convierte la decisión de contratar software de un "gasto opcional" a una "necesidad urgente para dejar de perder dinero". |
| **Servicios (Subtítulo)** | *"Soluciones para problemas reales: tiempo perdido, errores manuales y datos que nadie encuentra cuando los necesitan."* | Nombra los 3 dolores diarios exactos de cualquier negocio en una sola línea clara. |
| **Cómo Trabajamos (Proceso)** | **01 Diagnóstico sin costo:** *"Revisamos tu operación y te decimos con honestidad técnica qué conviene automatizar y qué no."*<br>**02 Propuesta y precio cerrado:** *"Entregables específicos, fechas de entrega y cotización fija por contrato antes de iniciar, sin cobros sorpresa."*<br>**03 Construcción y control total:** *"Desarrollamos en etapas funcionales, capacitamos a tu equipo y te acompañamos con soporte técnico en producción."* | Elimina el miedo número uno de contratar software: que cobren de más, que no acaben a tiempo o que dejen al equipo abandonado sin capacitación. |
| **Contacto (Cierre)** | *¿Dónde estás perdiendo dinero? Cuéntanos qué está frenando tu negocio.*<br>*Analizamos tu caso y te decimos con honestidad técnica la ruta para recuperar el control.* | Directo al punto, humano, profesional y sin formularios laberínticos ni palomitas de relleno. |

---

## 6. Demostración de Producto Real sobre Renders Abstractos

* **Showcase Interactivo en Vivo:**  
  En lugar de imágenes de stock o maquetas abstractas, el Hero cuenta con un visor dinámico de 5 especialidades:
  1. `Páginas Web & E-Commerce`
  2. `Software a la Medida & ERP`
  3. `Punto de Venta (POS) & Stock`
  4. `Automatización & Mecatrónica IPN`
  5. `Plataformas Cloud & SaaS`
  * Cambia automáticamente cada **4.5 segundos** con una **barra de progreso lineal en tiempo real**.
  * Permite control total al usuario: al hacer clic en cualquier opción, la barra se reinicia y muestra inmediatamente la interfaz real correspondiente.
* **Portafolio en Producción:**  
  * Primero se muestran las 3 soluciones modulares clave (Control Contable, POS Billar & Bar, POS General CFDI 4.0).
  * Inmediatamente después se corona la sección con el proyecto de mayor envergadura: **ERP Integral Nissan Universidad**, demostrando volumen transaccional real ($73.78M facturados, reglas de SLA y monitoreo industrial).
  * Toda pantalla cuenta con visor de alta resolución para inspección técnica.

---

## 7. Checklist Anti-IA para Nuevas Páginas (Pre-Lanzamiento)

Antes de dar por terminada cualquier nueva página o sección en VyE, verificar cada punto de esta lista:

- [ ] **1. Colores limpios:** ¿El fondo es negro carbón neutro (`#000000` / `#0A0A0A`) y las tarjetas son `#111111`, sin tintes azulados (`#0e0e12`)?
- [ ] **2. Regla 60-30-10:** ¿El dorado solo representa el 10% de los acentos y el blanco puro el 30% del contenido?
- [ ] **3. Cero recuadros neón:** ¿Se eliminaron todos los marcos o cápsulas amarillas alrededor de palabras o números?
- [ ] **4. Redondeos unificados:** ¿Todas las tarjetas están a `12px` y los botones a `10px`?
- [ ] **5. Bounding box y alineación:** ¿El logo y los encabezados respetan la línea vertical imaginaria de los botones sin desbordar hacia la derecha?
- [ ] **6. Centrado en barra superior:** ¿El logo en la barra fija está matemáticamente centrado respecto a la altura total de la navbar?
- [ ] **7. Copywriting sin relleno:** ¿Se eliminaron las palabras vacías de IA ("revolucionario", "holístico", "innovador") y se habla de dinero, tiempo, errores y control?
- [ ] **8. Cero redundancias:** ¿Cada beneficio o promesa se menciona **una sola vez** en toda la sección?
- [ ] **9. Capturas reales sin estorbos:** ¿Las capturas de pantalla están al descubierto, nítidas y sin textos flotantes encimados?
- [ ] **10. Movimiento sereno:** ¿No hay partículas flotantes, ni cursores personalizados de abeja, ni tickers mareantes en el campo visual del usuario?
