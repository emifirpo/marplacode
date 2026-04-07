"use client";

const comparisons = [
  {
    them: "Ejecutan lo que pedís",
    us: "Cuestionamos si lo que pedís es lo correcto",
  },
  {
    them: "Miden el éxito en entregables",
    us: "Medimos el éxito en impacto de negocio",
  },
  {
    them: "Presentan opciones y esperan decisión",
    us: "Recomendamos una dirección con criterio",
  },
  {
    them: "Equipo asignado según disponibilidad",
    us: "Equipo senior en cada proyecto, sin excepción",
  },
  {
    them: "El diseño y el código son equipos separados",
    us: "Diseño y desarrollo piensan juntos desde el día uno",
  },
];

export default function Differentiator() {
  return (
    <section
      className="py-32 px-6"
      style={{ background: "#F0EBE1" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <span
          className="text-xs tracking-wide"
          style={{
            fontFamily: "'Tilt Warp', sans-serif",
            color: "#9A948D",
          }}
        >
          (Por qué elegirnos)
        </span>

        {/* Headline */}
        <h2
          className="mt-4 mb-16 font-light leading-tight"
          style={{
            fontFamily: "'Tilt Warp', sans-serif",
            fontSize: "clamp(2.8rem, 6vw, 5rem)",
            color: "#1A1A1A",
          }}
        >
          No somos una agencia tradicional.
          <br />
          <em style={{ color: "#9A948D" }}>Acá está la diferencia.</em>
        </h2>

        {/* Comparison table */}
        <div style={{ border: "1px solid rgba(26,26,26,0.1)", borderRadius: "16px", overflow: "hidden" }}>
          {/* Header row */}
          <div
            className="grid grid-cols-2"
            style={{ background: "rgba(26,26,26,0.03)" }}
          >
            <div
              className="p-6"
              style={{ borderRight: "1px solid rgba(26,26,26,0.1)" }}
            >
              <span
                className="text-xs tracking-widest uppercase"
                style={{
                  fontFamily: "'Tilt Warp', sans-serif",
                  color: "rgba(26,26,26,0.3)",
                }}
              >
                Agencia tradicional
              </span>
            </div>
            <div className="p-6">
              <span
                className="text-xs tracking-widest uppercase"
                style={{
                  fontFamily: "'Tilt Warp', sans-serif",
                  color: "#E8341E",
                }}
              >
                Marplacode
              </span>
            </div>
          </div>

          {/* Rows */}
          {comparisons.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-2"
              style={{ borderTop: "1px solid rgba(26,26,26,0.08)" }}
            >
              <div
                className="p-6 flex items-center gap-3"
                style={{ borderRight: "1px solid rgba(26,26,26,0.08)" }}
              >
                <span
                  className="text-xs flex-shrink-0"
                  style={{ color: "rgba(26,26,26,0.2)" }}
                >
                  ✕
                </span>
                <span
                  className="text-sm leading-snug"
                  style={{
                    fontFamily: "'Tilt Warp', sans-serif",
                    color: "#9A948D",
                  }}
                >
                  {row.them}
                </span>
              </div>
              <div className="p-6 flex items-center gap-3">
                <span className="text-xs flex-shrink-0" style={{ color: "#E8341E" }}>
                  →
                </span>
                <span
                  className="text-sm leading-snug"
                  style={{
                    fontFamily: "'Tilt Warp', sans-serif",
                    color: "#1A1A1A",
                    fontWeight: 500,
                  }}
                >
                  {row.us}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="mt-20">
          <blockquote
            className="font-light leading-tight"
            style={{
              fontFamily: "'Tilt Warp', sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "#1A1A1A",
            }}
          >
            "No ejecutamos tickets.
            <br />
            <em style={{ color: "#9A948D" }}>
              Somos el equipo que pregunta por qué antes de cómo."
            </em>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
