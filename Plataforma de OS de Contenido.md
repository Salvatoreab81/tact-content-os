# **GUÍA DE ARQUITECTURA E IMPLEMENTACIÓN: CONTENT OPERATING SYSTEM (OS)**

Nombre de plataforma: NCD Content Strategy Platform  
**Destinatario:** Hermes Agent (Nous Research Orchestrator)  
**Objetivo:** Construir, configurar y enlazar un entorno automatizado de producción de contenido multi-tenant en un VPS Hetzner utilizando Node/Next.js, PostgreSQL \+ pgvector, n8n, Hyperframes, Cloudflare R2 y Postiz.

## **FASE 1: Infraestructura del Sistema de Archivos (Source of Truth)**

Hermes utilizará el sistema de archivos local (File-System) montado de forma persistente en el contenedor para lecturas recursivas rápidas mediante herramientas Bash (cat, grep, awk), evitando latencias de red y consumo excesivo de contexto.

### **Estructura de Directorios en el Servidor (/storage/brands/)**

Bash  
/storage/brands/  
├── \[brand\_id\]/                    \# Identificador único de la marca (ej: huehue, onira)  
│   ├── config/  
│   │   ├── brand\_guidelines.md   \# Identidad, restricciones de voz, tono y glosario.  
│   │   └── learning\_memory.md    \# Registro evolutivo de correcciones aplicadas por el humano.  
│   ├── database/  
│   │   └── vectors/              \# Almacenamiento local de índices semánticos crudos.  
│   └── pipeline/  
│       └── \[YYYY\]-\[MM\]-W\[X\]/     \# Estructura cronológica de producción (Año-Mes-Semana)  
│           ├── 00\_research.json  \# Tendencias del sector raspadas en la semana.  
│           ├── 01\_selected.json  \# Temas validados y aprobados por el humano.  
│           └── \[content\_slug\]/   \# Contenedor modular de una pieza específica  
│               ├── article.md    \# Post de formato largo (SEO/GEO).  
│               ├── scripts.json  \# Guiones de video optimizados para retención.  
│               ├── copies.json   \# Copys de micro-formato para redes sociales.  
│               ├── template.html \# Código fuente Tailwind/GSAP para Hyperframes.  
│               └── audit.json    \# Historial de revisiones del Agente PM.

## **FASE 2: Capa de Indexación y Datos (PostgreSQL \+ pgvector)**

Para servir la interfaz de usuario en contentstrategy.nextcontent.digital a máxima velocidad, se requiere mapear los archivos en un esquema relacional e indexar semánticamente el contenido mediante vectores.

### **Esquema de Tablas (DDL SQL)**

SQL  
\-- Habilitar la extensión de vectores  
CREATE EXTENSION IF NOT EXISTS pgvector;

\-- Tabla de Marcas (Multi-Tenant)  
CREATE TABLE brands (  
    id VARCHAR(50) PRIMARY KEY,  
    name VARCHAR(100) NOT NULL,  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

\-- Tabla de Contenido (Pipeline Centralizado)  
CREATE TABLE content\_pipeline (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    brand\_id VARCHAR(50) REFERENCES brands(id) ON DELETE CASCADE,  
    slug VARCHAR(255) NOT NULL,  
    title VARCHAR(255),  
    content\_type VARCHAR(50), \-- 'blog', 'tiktok', 'instagram', 'linkedin'  
    status VARCHAR(50) DEFAULT 'Scraped', \-- 'Scraped', 'Curated', 'Drafting', 'PM\_Review', 'Ready\_For\_Approval', 'Approved', 'Pushed'  
    publish\_date TIMESTAMP,  
    assets\_urls TEXT\[\], \-- URLs directas del bucket Cloudflare R2  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
    updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP ON UPDATE CURRENT\_TIMESTAMP  
);

\-- Tabla de Embeddings Semánticos (Memoria de Aprendizaje)  
CREATE TABLE memory\_embeddings (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    brand\_id VARCHAR(50) REFERENCES brands(id) ON DELETE CASCADE,  
    content\_source TEXT NOT NULL, \-- Texto original de la IA o corrección del humano  
    embedding VECTOR(1536),       \-- Dimensión estándar para modelos OpenAI/Nous compatible  
    memory\_type VARCHAR(50),      \-- 'correction', 'style\_guide', 'viral\_pattern'  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

## **FASE 3: Matriz de Prompts de Sistema (Fábrica de Agentes Especializados)**

Hermes Agent debe instanciar estos 5 perfiles con fronteras cognitivas estrictas utilizando llamadas RPC aisladas.

### **1\. El Periodista de Investigación (Long-Form SEO/GEO Specialist)**

Plaintext  
System Prompt:  
Eres un Periodista de Investigación Senior y Especialista en Arquitectura de Contenido SEO/GEO On-Page. Tu única responsabilidad es redactar artículos extensos y profundos en formato Markdown.   
Reglas estrictas de ejecución:  
1\. Extrae las directrices del archivo 'brand\_guidelines.md' y las pautas de estilo de 'learning\_memory.md'.  
2\. Estructura el artículo utilizando una jerarquía semántica rigurosa (H2, H3).  
3\. Integra palabras clave transaccionales e informativas de manera fluida y orgánica.  
4\. Aplica optimización geopolítica (menciona locaciones, dinámicas culturales y modismos específicos del mercado objetivo sin caer en clichés o lenguaje genérico).  
5\. Prohibido iniciar con introducciones cliché ("En la era digital actual...", "Para nadie es un secreto..."). Ve directo a la tesis central del artículo en el primer párrafo.  
6\. Tu salida debe ser exclusivamente código Markdown con Frontmatter al inicio (title, description, slug, keywords).

### **2\. El Guionista de Corto Formato (Short-Form & TikTok Master)**

Plaintext  
System Prompt:  
Eres un Guionista Audiovisual de Élite, especialista en algoritmos de retención extrema para plataformas verticales (TikTok, Instagram Reels, YouTube Shorts). Tu única métrica de éxito es asegurar el Watch Time y evitar que el usuario haga scroll.  
Reglas estrictas de ejecución:  
1\. Diseña un gancho (Hook) psicológico de impacto masivo en los primeros 3 segundos.  
2\. Estructura los guiones en un formato JSON dividido estrictamente por nodos secuenciales que contengan: "tiempo", "audio\_voz\_en\_off" y "direccion\_de\_video\_y\_assets".  
3\. Provoca cambios de ritmo visuales o sonoros cada 2 o 3 segundos para mantener elevados los niveles de dopamina del espectador.  
4\. Adapta el lenguaje a los estándares de sofisticación estipulados en 'brand\_guidelines.md'. Si la marca prohíbe términos infantiles, busca alternativas elegantes y directas.

### **3\. El Redactor de Micro-Copy (RRSS & Conversion Copywriter)**

Plaintext  
System Prompt:  
Eres un Copywriter de Respuesta Directa y Especialista en Micro-Formatos Sociales para Instagram Feed, LinkedIn y Facebook. Tu objetivo es transformar el interés del usuario en acciones de conversión medibles.  
Reglas estrictas de ejecución:  
1\. Diseña textos optimizados para lectura rápida usando saltos de línea estratégicos que faciliten el escaneo visual.  
2\. Aplica técnicas narrativas nativas de cada red (Storytelling profesional en LinkedIn, micro-bloques interactivos y descriptivos en Instagram).  
3\. Introduce llamadas a la acción (CTAs) unificadas y directas. No confundas al usuario con múltiples instrucciones en el mismo post.  
4\. Límite estricto de emojis: Máximo 2 por publicación, posicionados únicamente al final de las líneas estructurales. Jamás uses hashtags masivos o genéricos.

### **4\. El Ingeniero de Código Multimedia (Hyperframes Builder)**

Plaintext  
System Prompt:  
Eres un Desarrollador Frontend Creativo y Especialista en el motor de renderizado automatizado Hyperframes. Tu tarea es traducir guiones de video en interfaces dinámicas listas para ser renderizadas como archivos MP4.  
Reglas estrictas de ejecución:  
1\. Escribe exclusivamente código HTML5 y utiliza clases utilitarias de Tailwind CSS para el diseño visual.  
2\. Mantén la estética visual de marcas premium (diseño minimalista, tipografías refinadas con alto contraste, amplios espacios en blanco, paleta de colores restringida).  
3\. Es obligatorio el uso de los atributos nativos de Hyperframes para controlar las animaciones sobre la línea de tiempo mediante selectores semánticos: 'data-start="\[segundos\]"' y 'data-duration="\[segundos\]"'.  
4\. La salida debe ser exclusivamente código HTML ejecutable. No incluyas explicaciones de código ni etiquetas markdown adicionales.

### **5\. El Editor en Jefe (The PM Auditor Agent)**

Plaintext  
System Prompt:  
Eres el Editor en Jefe y Auditor Técnico de Next Content. Tu rol es actuar como un filtro de calidad infranqueable antes de que el contenido sea expuesto ante el ojo humano.  
Reglas estrictas de ejecución:  
1\. Recibe los borradores de la fábrica de agentes y compáralos minuciosamente contra 'brand\_guidelines.md' y 'learning\_memory.md'.  
2\. Ejecuta un checklist obligatorio: ¿Mantiene el tono? ¿Utilizó alguna palabra prohibida? ¿El CTA está alineado con el mes? ¿Los metatags SEO están completos? ¿Los enlaces de los assets en R2 son válidos?  
3\. Si el contenido viola alguna pauta, tu salida obligatoria debe iniciar exactamente con la cadena "STATUS: REJECTED" seguida de una lista estructurada en JSON detallando los errores por campo.  
4\. Si el contenido es impecable y cumple todos los estándares, tu salida debe iniciar exactamente con la cadena "STATUS: APPROVED".

## **FASE 4: Orquestación Automática (n8n Workflow Topology)**

Para conectar todos los componentes en tu VPS de Hetzner, n8n operará mediante flujos reactivos controlados por eventos de estado de la base de datos.

### **Workflow 1: El Escultor Diario (Daily Research Lab)**

* **Trigger:** Cron Node (Ejecución diaria a las 06:00 AM).  
* **Paso 1:** Nodo HTTP Request que invoca las herramientas de navegación de Hermes Agent para escanear feeds globales, tendencias del sector e hitos culturales configurados en el sistema.  
* **Paso 2:** Hermes procesa el flujo masivo y descarta el ruido basándose en el archivo brand\_guidelines.md.  
* **Paso 3:** Escribe los resultados estructurados en /storage/brands/\[brand\_id\]/pipeline/\[Semana\_Actual\]/00\_research.json.  
* **Paso 4:** Actualiza la tabla content\_pipeline inyectando los registros en estado 'Scraped' para visualización inmediata en el Dashboard.

### **Workflow 2: La Fábrica de Ejecución y Renderizado (Content Production Loop)**

* **Trigger:** Webhook de entrada activado por la UI cuando cambias el estado de un tema a 'Curated'.  
* **Paso 1:** n8n bifurca la tarea enviando payload paralelo a los agentes especializados (Periodista SEO, Guionista, Copywriter) mediante llamadas API.  
* **Paso 2:** Recibe el archivo de diseño multimedia template.html.  
* **Paso 3:** Ejecuta un nodo **Execute Command** en la máquina host que levanta el contenedor de Hyperframes:  
  Bash  
  npx hyperframes render /storage/brands/{{$json.brand\_id}}/pipeline/{{$json.semana}}/template.html \--output /tmp/render.mp4

\*   \*\*Paso 4:\*\* Un nodo de Cloudflare R2 / S3 sube el archivo binario \`/tmp/render.mp4\` al bucket correspondiente y genera el enlace público persistente.  
\*   \*\*Paso 5:\*\* El borrador consolidado se envía al \*\*Agente PM (Auditor)\*\*.  
    \*   \*Condición IF (REJECTED):\* El flujo regresa de forma automática al agente origen adjuntando el JSON de errores. Límite de re-intentos: 3\.  
    \*   \*Condición IF (APPROVED):\* El flujo actualiza el registro en la base de datos a \`'Ready\_For\_Approval'\` y emite una alerta al usuario.

\#\#\# Workflow 3: El Repositorio de Aprendizaje (Human Correction Feedback Loop)  
\*   \*\*Trigger:\*\* Webhook activado al pulsar "Guardar Correcciones en Memoria" en la interfaz de usuario.  
\*   \*\*Paso 1:\*\* Captura el payload que contiene \`original\_ia\_text\`, \`human\_edited\_text\` y \`brand\_id\`.  
\*   \*\*Paso 2:\*\* Invoca a Hermes Agent con la tarea de ingeniería inversa: \*"Determina la discrepancia tonal, estructural o semántica entre ambos textos. Sintetiza una regla de corrección concisa y accionable en lenguaje natural"\*.  
\*   \*\*Paso 3:\*\* Realiza un \*append\* directo del resultado en el archivo \`/storage/brands/\[brand\_id\]/config/learning\_memory.md\`.  
\*   \*\*Paso 4:\*\* Genera el embedding vectorial del ajuste y lo inserta en la tabla \`memory\_embeddings\` para futuras búsquedas de similitud semántica.

\---

\#\# FASE 5: Especificación de la Interfaz (Next.js 15 UI Layer)

El diseño de \`contentstrategy.nextcontent.digital\` debe estructurarse con componentes de \*\*Shadcn/ui\*\* y \*\*Tailwind CSS\*\*, consumiendo la API de PostgreSQL de forma directa mediante Server Actions de Next.js.

┌────────────────────────────────────────────────────────────────────────┐  
│ NEXT CONTENT DIGITAL \- CONTENT OS │  
├────────────────────────────────────────────────────────────────────────┤  
│ SELECTOR DE CONTEXTO GLOBAL: \[ Vista General (Todas las Marcas) ▼ \] │  
├───────────────┬────────────────────────────────────────────────────────┤  
│ NAVBAR │ WORKSPACE CENTRAL (Vista Unificada de Aprobación) │  
│ ├────────────────────────────────────────────────────────┤  
│ 📊 Dashboard │ \[ HUEHUE \] \- Guion TikTok: Dije de Plata San Valentín │  
│ 🌐 Research │ ┌───────────────────────────┬────────────────────────┐ │  
│ 📅 Calendario │ │ Editor de Bloques (Texto) │ Vista Media Asset (R2) │ │  
│ Factory │ │ │ │ │  
│ ⚙️ Config │ │ El accesorio perfecto │ \[REPRODUCIR VIDEO MP4 │ │  
│ │ │ para recordar a tu firulais│ GENERADO AUTOMÁTICO\] │ │  
│ │ │ con elegancia... │ │ │  
│ │ └───────────────────────────┴────────────────────────┘ │  
│ │ \[🔴 Pedir Ajuste a Hermes \] \[🟢 Aprobar y Enviar a Postiz\]│  
└───────────────┴────────────────────────────────────────────────────────┘

\#\#\# Comportamiento del Workspace en Ventanas Temporales  
1\.  \*\*Vista Anual:\*\* Mapea una tabla cronológica limpia donde introduces los hitos fijos. Al guardar, una Server Action calcula las alertas previas de preparación de campaña.  
2\.  \*\*Vista Mensual:\*\* Despliega un tablero Kanban alimentado por el estado de las campañas creadas en el calendario.  
3\.  \*\*Vista Semanal:\*\* Pantalla dividida al 50%. A la izquierda se listan las tarjetas de tendencias del archivo \`00\_research.json\`. Arrastrar un elemento al lado derecho cambia el estatus de la fila en PostgreSQL de \`'Scraped'\` a \`'Curated'\`, activando de forma automatizada los disparadores de n8n de la Fábrica de Contenidos.  
4\.  \*\*Vista Diaria:\*\* La mesa de edición limpia basada en el editor \*\*TipTap\*\*. Cuenta con una interfaz de doble columna (Texto/Script a la izquierda, visualización del recurso MP4 alojado en Cloudflare R2 a la derecha), con acceso directo a la botonera de aprobación final para despachar el contenido hacia la API externa de \*\*Postiz\*\* o \*\*WordPress\*\*.  
