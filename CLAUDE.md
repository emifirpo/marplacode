# Marplacode Project Guidelines

## Project Overview
Marplacode es la landing page de una agencia de productos digitales. Construida con Next.js 14, React 18, animaciones nativas (scroll + RAF) y Three.js para efectos WebGL.

**Tech Stack:**
- Next.js 14.2.5 con App Router
- React 18 con componentes `"use client"`
- Three.js (v0.183) — instalado, usado en CursorTrail
- Tailwind CSS para estilos base
- TypeScript con strict mode
- Fuentes: Boldonse (h1 hero), Cormorant, DM Sans — cargadas via Google Fonts en `layout.tsx`

> ⚠️ GSAP y Splitting.js fueron removidos. Todas las animaciones usan scroll events nativos + `requestAnimationFrame` + DOM manipulation directa.

## Componentes

### Animación
- **CursorTrail.tsx** — Trail de cursor WebGL usando Three.js. Implementación exacta de [rock-biter/cursor-trail](https://github.com/rock-biter/cursor-trail): ping-pong render targets con `HalfFloatType`, curl noise en fragment shader, `mix-blend-mode: screen` para overlay transparente. Solo visible en el hero (scroll fade).
- **DitherBg.tsx** — Grid de puntos Bayer dither (canvas 2D). Click genera rings. Se desvanece al scrollear.
- **AnimatedHeadline.tsx** — Reveal word-by-word con CSS transition (opacity + translateY), stagger por índice.

### Secciones
- **Hero.tsx** — Sticky scroll. Tipografía Boldonse. Animación de entrada word-level (translateY + opacity). Exit en scroll: Demo9 scatter 3D por caracter (rotateX/Y/Z + translate3d), pre-calculado con vectores random. Sub y CTAs se desvanecen con el scroll.
- **Capabilities.tsx** — Carrusel horizontal sticky. Header colapsa en height durante Phase 1 para centrar el gallery en 100vh. Phase 2: translateX + scale(1.35) desde origen izquierdo. Border-radius animado en el container (floating card effect). Chars de título se dispersan en 3D al scrollear.
- **Cases.tsx** — Mini case studies con texto animado.
- **Process.tsx** — 4 etapas con texto animado.
- **Differentiator.tsx** — Comparación con agencias tradicionales, texto animado.
- **CTA.tsx** — Call to action final.
- **Filter.tsx** — Sección de filtro interactivo.
- **Navbar.tsx** / **Footer.tsx**

## Estructura de página (`app/page.tsx`)
```
<main background="#0D0D0D">
  <div sticky zIndex=0>   ← Hero queda pegado mientras las demás secciones pasan arriba
    <Hero />
  </div>
  <div relative zIndex=1>
    <Filter /> <Capabilities /> <Cases /> <Process />
    <Differentiator /> <CTA /> <Footer />
  </div>
  <Navbar />   ← fuera del flow, fixed
</main>
```

## Animaciones — notas técnicas

### Demo9 exit (Hero h1)
- Splitting.js reemplazado por DOM manual: `charRefs[wordIdx][charIdx]`
- Vectores scatter pre-computados al mount: `rx ±720°, ry ±720°, rz ±180°, tx ±500px, ty ±400px, tz ±700px`
- Trigger: scroll 5% → 55% de vh, easing easeInCubic
- `perspective: 1200px` en el contenedor del h1

### Capabilities floating card
- `stickyRef.style.borderRadius`: `"0px"` → `"20px"` cuando `p > 0.01`
- `overflowX: "clip"`, `overflowY: "visible"` para no clipear el scatter sin generar scrollbar

### CursorTrail
- Render targets a 0.25x resolución (performance)
- `mix-blend-mode: screen`: negro = transparente, los colores se suman al fondo oscuro
- Colores del shader: purple `(0.25, 0.1, 0.9)` → cyan `(0.1, 0.9, 0.8)` → white `(1.0)`

## Fixes conocidos

1. **TypeScript + Three.js**: castear a `any` cuando las definiciones de tipo no coinciden con runtime
2. **SSR**: dynamic imports con `ssr: false` en `page.tsx` para componentes que usan `document`
3. **Quotes en JSX**: usar `&quot;` en lugar de `"`
4. **overflow en scatter**: nunca poner `overflow: hidden` en contenedores padres de chars animados

## Deploy
- Push a `main` → Vercel auto-deploya
- Proyecto: https://marplacode.vercel.app
- Commits y push los maneja el usuario desde su terminal

## Notas para Claude
- Priorizar calidad de animación sobre simplicidad de código
- Respuestas cortas, sin resúmenes al final
- No agregar abstracciones innecesarias
- Si el usuario pasa un link a código externo que no es accesible → pedir que adjunte el archivo antes de implementar alternativas
- npm disponible desde la terminal del usuario (no desde el sandbox de Cowork)

## Last Updated
April 6, 2026
