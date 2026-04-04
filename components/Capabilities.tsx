"use client";

import { useState } from "react";

const capabilities = [
  {
    number: "01",
    title: "Product Thinking",
    tagline: "Definimos qué construir — y qué no.",
    description:
      "Antes de escribir una línea de código o diseñar una pantalla, entendemos el negocio. Mapeamos usuarios, validamos hipótesis y priorizamos funcionalidades según impacto real. El resultado: un roadmap claro y sin ruido.",
    impact: "Evita gastar meses construyendo lo incorrecto.",
    deliverable: "Product brief, user flows, priorización de features",
    tags: ["Discovery", "UX Research", "Roadmap"],
  },
  {
    number: "02",
    title: "Design that Converts",
    tagline: "Interfaces que guían decisiones, no que se ven lindas.",
    description:
      "Diseñamos con un objetivo específico: que el usuario haga lo que el negocio necesita. Cada decisión de diseño tiene un porqué medible. Nada es decorativo.",
    impact: "Evita rediseñar cada 6 meses porque 'no convierte'.",
    deliverable: "Design system, prototipos navegables, especificaciones de UI",
    tags: ["UX/UI", "Design Systems", "Prototyping"],
  },
  {
    number: "03",
    title: "Engineering Ready to Scale",
    tagline: "Tecnología que aguanta el crecimiento.",
    description:
      "Construimos con Next.js, React y arquitecturas modernas pensadas para escalar. El código que entregamos es mantenible, documentado y preparado para crecer. No hacemos patchwork.",
    impact: "Evita refactorings costosos cuando lleguen los usuarios.",
    deliverable: "Código en producción, CI/CD, documentación técnica",
    tags: ["Next.js", "React", "TypeScript", "Node.js"],
  },
];

export default function Capabilities() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="capacidades-detalle"
      className="py-32 px-6"
      style={{ background: "#0D0D0D" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <span
          className="text-xs tracking-wide"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: "rgba(237,232,223,0.4)",
          }}
        >
          (Capacidades)
        </span>

        {/* Headline */}
        <h2
          className="mt-4 mb-16 font-light leading-tight"
          style={{
            fontFamily: "'Cormorant', Georgia, serif",
            fontSize: "clamp(2.8rem, 6vw, 5rem)",
            color: "#EDE8DF",
          }}
        >
          No ofrecemos servicios.
          <br />
          <em style={{ color: "rgba(237,232,223,0.4)" }}>Aportamos capacidades.</em>
        </h2>

        {/* Accordion */}
        <div>
          {capabilities.map((cap, i) => (
            <div
              key={i}
              style={{
                borderTop: "1px solid rgba(237,232,223,0.08)",
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-8 text-left group"
              >
                <div className="flex items-baseline gap-6">
                  <span
                    className="text-xs"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "rgba(237,232,223,0.25)",
                    }}
                  >
                    {cap.number}
                  </span>
                  <div>
                    <h3
                      className="font-light transition-colors"
                      style={{
                        fontFamily: "'Cormorant', Georgia, serif",
                        fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                        color: "#EDE8DF",
                      }}
                    >
                      {cap.title}
                    </h3>
                    <p
                      className="text-sm mt-1"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: "rgba(237,232,223,0.4)",
                      }}
                    >
                      {cap.tagline}
                    </p>
                  </div>
                </div>
                <span
                  className="text-2xl font-light transition-transform duration-300"
                  style={{
                    color: "rgba(237,232,223,0.3)",
                    transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  +
                </span>
              </button>

              <div
                style={{
                  maxHeight: open === i ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.5s ease",
                }}
              >
                <div className="pb-10 grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <p
                      className="text-base leading-relaxed mb-6"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: "rgba(237,232,223,0.6)",
                      }}
                    >
                      {cap.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {cap.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1 rounded-full"
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            background: "rgba(237,232,223,0.05)",
                            color: "rgba(237,232,223,0.4)",
                            border: "1px solid rgba(237,232,223,0.08)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div
                      className="p-5 rounded-xl"
                      style={{
                        background: "rgba(232,52,30,0.06)",
                        border: "1px solid rgba(232,52,30,0.15)",
                      }}
                    >
                      <span
                        className="text-xs tracking-widest uppercase block mb-2"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          color: "#E8341E",
                        }}
                      >
                        Qué evita
                      </span>
                      <p
                        className="text-sm leading-snug"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          color: "rgba(237,232,223,0.6)",
                        }}
                      >
                        {cap.impact}
                      </p>
                    </div>
                    <div>
                      <span
                        className="text-xs tracking-widest uppercase block mb-2"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          color: "rgba(237,232,223,0.3)",
                        }}
                      >
                        Qué entregamos
                      </span>
                      <p
                        className="text-sm leading-snug"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          color: "rgba(237,232,223,0.5)",
                        }}
                      >
                        {cap.deliverable}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Bottom border */}
          <div style={{ borderTop: "1px solid rgba(237,232,223,0.08)" }} />
        </div>
      </div>
    </section>
  );
}
