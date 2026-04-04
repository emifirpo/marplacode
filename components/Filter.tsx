"use client";

export default function Filter() {
  const notFor = [
    "Proyectos sin validar que buscan el diseño antes que el negocio",
    "Clientes que miden el éxito por cantidad de páginas o pantallas",
    "Equipos que buscan el precio más bajo del mercado",
    "Ideas que necesitan 'verse bonitas' pero no tienen usuario definido",
  ];

  const yesFor = [
    "Founders que tienen tracción y quieren escalar el producto",
    "Equipos que toman decisiones basadas en datos, no en opiniones",
    "Negocios que entienden que el diseño es una inversión, no un gasto",
    "Startups que necesitan velocidad sin perder criterio",
  ];

  return (
    <section
      id="capacidades"
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
          (Quiénes somos)
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
          No somos para todos.
          <br />
          <em>Intencionalmente.</em>
        </h2>

        {/* Two-column grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-px"
          style={{ background: "rgba(26,26,26,0.1)" }}
        >
          {/* NO column */}
          <div className="p-10 md:p-14" style={{ background: "#F0EBE1" }}>
            <p
              className="text-xs tracking-widest mb-8 uppercase"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "#9A948D",
              }}
            >
              No trabajamos con
            </p>
            <ul className="space-y-6">
              {notFor.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <span
                    className="mt-0.5 text-sm flex-shrink-0"
                    style={{ color: "rgba(26,26,26,0.25)" }}
                  >
                    ✕
                  </span>
                  <span
                    className="text-base leading-snug"
                    style={{ color: "#6B6560" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* YES column */}
          <div className="p-10 md:p-14" style={{ background: "#F0EBE1" }}>
            <p
              className="text-xs tracking-widest mb-8 uppercase"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "#E8341E",
              }}
            >
              Sí trabajamos con
            </p>
            <ul className="space-y-6">
              {yesFor.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <span
                    className="mt-0.5 text-sm flex-shrink-0"
                    style={{ color: "#E8341E" }}
                  >
                    →
                  </span>
                  <span
                    className="text-base leading-snug"
                    style={{ color: "#1A1A1A" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom note */}
        <p
          className="mt-8 text-sm text-center"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: "#9A948D",
          }}
        >
          Si dudás si encajás,{" "}
          <a
            href="#contacto"
            style={{ color: "#1A1A1A", textDecoration: "underline", textUnderlineOffset: "3px" }}
          >
            escribinos igual
          </a>
          . Lo evaluamos juntos.
        </p>
      </div>
    </section>
  );
}
