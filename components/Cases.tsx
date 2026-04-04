"use client";

const cases = [
  {
    client: "Fintech startup",
    year: "2024",
    tag: "Producto / Web App",
    context:
      "Una startup de pagos digitales con tracción inicial necesitaba reemplazar un prototipo funcional por un producto real que pudiera escalar.",
    problem:
      "El flujo de onboarding tenía una tasa de abandono del 68%. Los usuarios llegaban pero no terminaban el proceso de alta.",
    decision:
      "Rediseñamos el onboarding completo desde cero basándonos en entrevistas con usuarios reales. Simplificamos de 11 pasos a 4, con validación en tiempo real.",
    result: "Tasa de abandono bajó al 23% en los primeros 30 días.",
  },
  {
    client: "SaaS B2B",
    year: "2023",
    tag: "Design System / Frontend",
    context:
      "Un SaaS de gestión de inventarios con 200+ clientes tenía inconsistencias visuales graves entre módulos desarrollados por distintos equipos.",
    problem:
      "Cada actualización de UI tomaba 3x más tiempo de lo esperado. El producto se veía como 3 productos distintos.",
    decision:
      "Construimos un design system desde cero con componentes documentados y tipados. Lo integramos directamente al repositorio con Storybook.",
    result:
      "Tiempo de desarrollo de nuevas features redujo un 40% en el trimestre siguiente.",
  },
  {
    client: "E-commerce regional",
    year: "2024",
    tag: "Web / Performance",
    context:
      "Una marca de indumentaria con presencia en 3 países necesitaba migrar de una plataforma legacy a un stack moderno sin perder SEO.",
    problem:
      "El sitio cargaba en 8.4 segundos en mobile. Las conversiones en mobile eran un 60% menores que en desktop.",
    decision:
      "Migramos a Next.js con ISR, optimizamos assets y rediseñamos el flujo de compra mobile-first. SEO preservado con redirecciones 301 estratégicas.",
    result:
      "Tiempo de carga: 1.8s. Conversiones mobile: +47% en el primer mes post-lanzamiento.",
  },
];

export default function Cases() {
  return (
    <section
      id="casos"
      className="py-32 px-6"
      style={{ background: "#F0EBE1" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <span
          className="text-xs tracking-wide"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: "#9A948D",
          }}
        >
          (Casos)
        </span>

        {/* Headline */}
        <h2
          className="mt-4 mb-16 font-light leading-tight"
          style={{
            fontFamily: "'Cormorant', Georgia, serif",
            fontSize: "clamp(2.8rem, 6vw, 5rem)",
            color: "#1A1A1A",
          }}
        >
          Sin portfolio pasivo.
          <br />
          <em>Con contexto, problema y resultado.</em>
        </h2>

        {/* Cases list */}
        <div>
          {cases.map((c, i) => (
            <div
              key={i}
              style={{
                borderTop: "1px solid rgba(26,26,26,0.1)",
                paddingTop: "3rem",
                paddingBottom: "3rem",
              }}
            >
              {/* Case header */}
              <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
                <div className="flex items-baseline gap-4">
                  <h3
                    className="font-light"
                    style={{
                      fontFamily: "'Cormorant', Georgia, serif",
                      fontSize: "clamp(1.6rem, 3vw, 2rem)",
                      color: "#1A1A1A",
                    }}
                  >
                    {c.client}
                  </h3>
                  <span
                    className="text-xs px-3 py-1 rounded-full"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      background: "rgba(26,26,26,0.06)",
                      color: "#6B6560",
                      border: "1px solid rgba(26,26,26,0.08)",
                    }}
                  >
                    {c.tag}
                  </span>
                </div>
                <span
                  className="text-sm"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "rgba(26,26,26,0.3)",
                  }}
                >
                  {c.year}
                </span>
              </div>

              {/* Case grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
                <div>
                  <span
                    className="text-xs tracking-widest uppercase block mb-3"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "#9A948D",
                    }}
                  >
                    Contexto
                  </span>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "#6B6560",
                    }}
                  >
                    {c.context}
                  </p>
                </div>
                <div>
                  <span
                    className="text-xs tracking-widest uppercase block mb-3"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "#9A948D",
                    }}
                  >
                    Problema
                  </span>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "#6B6560",
                    }}
                  >
                    {c.problem}
                  </p>
                </div>
                <div>
                  <span
                    className="text-xs tracking-widest uppercase block mb-3"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "#9A948D",
                    }}
                  >
                    Decisión clave
                  </span>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "#6B6560",
                    }}
                  >
                    {c.decision}
                  </p>
                </div>
                <div
                  className="p-5 rounded-xl"
                  style={{
                    background: "rgba(26,26,26,0.04)",
                    border: "1px solid rgba(26,26,26,0.08)",
                  }}
                >
                  <span
                    className="text-xs tracking-widest uppercase block mb-3"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "#E8341E",
                    }}
                  >
                    Resultado
                  </span>
                  <p
                    className="text-sm leading-relaxed font-medium"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "#1A1A1A",
                    }}
                  >
                    {c.result}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid rgba(26,26,26,0.1)" }} />
        </div>

        <p
          className="mt-8 text-sm text-center"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: "#9A948D",
          }}
        >
          Los nombres de clientes son confidenciales por acuerdo.{" "}
          <a
            href="#contacto"
            style={{ color: "#1A1A1A", textDecoration: "underline", textUnderlineOffset: "3px" }}
          >
            Pedinos referencias directas.
          </a>
        </p>
      </div>
    </section>
  );
}
