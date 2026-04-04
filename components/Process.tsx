"use client";

const steps = [
  {
    number: "01",
    title: "Entender el negocio",
    description:
      "Antes de hablar de diseño o tecnología, entendemos qué problema real tiene el negocio. Hacemos las preguntas incómodas. ¿Qué métrica mueve la aguja? ¿Quién es el usuario? ¿Qué está fallando hoy?",
    deliverable: "Diagnóstico, mapa de oportunidades",
    avoid: "Construir sin dirección clara",
    duration: "1–2 semanas",
  },
  {
    number: "02",
    title: "Definir el producto",
    description:
      "Con el contexto claro, definimos qué construir primero. No el producto perfecto: el producto correcto para este momento. Priorizamos por impacto, esfuerzo y aprendizaje.",
    deliverable: "Product brief, roadmap, alcance acordado",
    avoid: "Feature creep desde el día uno",
    duration: "1 semana",
  },
  {
    number: "03",
    title: "Diseñar con intención",
    description:
      "Cada pantalla tiene un objetivo. Diseñamos flujos antes que mockups. Validamos con usuarios reales antes de pasar a producción. El pixel perfect viene después del 'funciona'.",
    deliverable: "Prototipos validados, design system, handoff listo",
    avoid: "Rediseñar por capricho en producción",
    duration: "2–4 semanas",
  },
  {
    number: "04",
    title: "Construir e iterar",
    description:
      "Desarrollo en ciclos cortos con entregables reales. Nada de 'estamos trabajando'. Cada sprint tiene un resultado visible, testeado y en staging. Iteramos sobre datos, no sobre opiniones.",
    deliverable: "Producto en producción, métricas base",
    avoid: "Proyectos que nunca terminan",
    duration: "4–12 semanas",
  },
];

export default function Process() {
  return (
    <section
      id="proceso"
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
          (Proceso)
        </span>

        {/* Headline */}
        <h2
          className="mt-4 mb-4 font-light leading-tight"
          style={{
            fontFamily: "'Cormorant', Georgia, serif",
            fontSize: "clamp(2.8rem, 6vw, 5rem)",
            color: "#EDE8DF",
          }}
        >
          Sin humo.
        </h2>
        <p
          className="mb-16 font-light leading-tight"
          style={{
            fontFamily: "'Cormorant', Georgia, serif",
            fontSize: "clamp(2.8rem, 6vw, 5rem)",
            color: "rgba(237,232,223,0.35)",
          }}
        >
          <em>Cuatro etapas, entregables reales.</em>
        </p>

        {/* Steps */}
        <div>
          {steps.map((step, i) => (
            <div
              key={i}
              className="grid md:grid-cols-[80px_1fr_1fr] gap-6 py-10"
              style={{ borderTop: "1px solid rgba(237,232,223,0.08)" }}
            >
              {/* Number */}
              <div className="flex items-start">
                <span
                  className="text-xs pt-1"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "rgba(237,232,223,0.25)",
                  }}
                >
                  {step.number}
                </span>
              </div>

              {/* Title + description */}
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <h3
                    className="font-light"
                    style={{
                      fontFamily: "'Cormorant', Georgia, serif",
                      fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
                      color: "#EDE8DF",
                    }}
                  >
                    {step.title}
                  </h3>
                  <span
                    className="text-xs px-3 py-1 rounded-full flex-shrink-0"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      background: "rgba(237,232,223,0.04)",
                      color: "rgba(237,232,223,0.25)",
                      border: "1px solid rgba(237,232,223,0.06)",
                    }}
                  >
                    {step.duration}
                  </span>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "rgba(237,232,223,0.5)",
                  }}
                >
                  {step.description}
                </p>
              </div>

              {/* Deliverables + avoid */}
              <div className="space-y-5">
                <div>
                  <span
                    className="text-xs tracking-widest uppercase block mb-2"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "rgba(237,232,223,0.25)",
                    }}
                  >
                    Entregamos
                  </span>
                  <span
                    className="text-sm"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "rgba(237,232,223,0.5)",
                    }}
                  >
                    {step.deliverable}
                  </span>
                </div>
                <div>
                  <span
                    className="text-xs tracking-widest uppercase block mb-2"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "rgba(232,52,30,0.6)",
                    }}
                  >
                    Evitamos
                  </span>
                  <span
                    className="text-sm"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "rgba(237,232,223,0.3)",
                    }}
                  >
                    {step.avoid}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid rgba(237,232,223,0.08)" }} />
        </div>
      </div>
    </section>
  );
}
