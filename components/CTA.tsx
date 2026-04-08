"use client";

import { useState } from "react";

export default function CTA() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    budget: "",
  });
  const [sent, setSent] = useState(false);

  const budgets = ["< $5k", "$5k – $15k", "$15k – $30k", "$30k+"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section
      id="contacto"
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
          (Contacto)
        </span>

        <div className="mt-4 grid md:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <h2
              className="font-light leading-[0.95] mb-8"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "clamp(3rem, 7vw, 6rem)",
                color: "#EDE8DF",
              }}
            >
              Contanos qué
              <br />
              <em>estás</em>
              <br />
              construyendo.
            </h2>
            <p
              className="text-sm leading-relaxed mb-12"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "rgba(237,232,223,0.45)",
                maxWidth: "300px",
              }}
            >
              Evaluamos si tiene sentido trabajar juntos. Sin compromiso.
              Respondemos en menos de 24h.
            </p>

            {/* Contact alternatives */}
            <div className="space-y-4">
              <a
                href="mailto:hello@marplacode.com"
                className="flex items-center gap-3 transition-colors group"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "rgba(237,232,223,0.45)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#EDE8DF")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(237,232,223,0.45)")}
              >
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs"
                  style={{
                    background: "rgba(237,232,223,0.05)",
                    border: "1px solid rgba(237,232,223,0.08)",
                  }}
                >
                  @
                </span>
                <span className="text-sm">hello@marplacode.com</span>
              </a>
              <a
                href="https://wa.me/5492235000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition-colors"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "rgba(237,232,223,0.45)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#EDE8DF")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(237,232,223,0.45)")}
              >
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs"
                  style={{
                    background: "rgba(237,232,223,0.05)",
                    border: "1px solid rgba(237,232,223,0.08)",
                  }}
                >
                  ↗
                </span>
                <span className="text-sm">WhatsApp directo</span>
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            {sent ? (
              <div
                className="p-10 text-center rounded-2xl"
                style={{
                  background: "rgba(232,52,30,0.06)",
                  border: "1px solid rgba(232,52,30,0.15)",
                }}
              >
                <div
                  className="text-4xl mb-4"
                  style={{ color: "#E8341E" }}
                >
                  ✓
                </div>
                <h3
                  className="text-xl mb-2"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "#EDE8DF",
                  }}
                >
                  Mensaje recibido
                </h3>
                <p
                  className="text-sm"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "rgba(237,232,223,0.5)",
                  }}
                >
                  Te respondemos en menos de 24h.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    className="text-xs tracking-widest uppercase block mb-2"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "rgba(237,232,223,0.3)",
                    }}
                  >
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Tu nombre o el de tu empresa"
                    className="w-full px-5 py-4 text-sm outline-none transition-all"
                    style={{
                      background: "rgba(237,232,223,0.04)",
                      border: "1px solid rgba(237,232,223,0.08)",
                      borderRadius: "12px",
                      color: "#EDE8DF",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    className="text-xs tracking-widest uppercase block mb-2"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "rgba(237,232,223,0.3)",
                    }}
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="hola@tuempresa.com"
                    className="w-full px-5 py-4 text-sm outline-none transition-all"
                    style={{
                      background: "rgba(237,232,237,0.04)",
                      border: "1px solid rgba(237,232,223,0.08)",
                      borderRadius: "12px",
                      color: "#EDE8DF",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                </div>

                {/* Budget */}
                <div>
                  <label
                    className="text-xs tracking-widest uppercase block mb-3"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "rgba(237,232,223,0.3)",
                    }}
                  >
                    Presupuesto estimado
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {budgets.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setFormData({ ...formData, budget: b })}
                        className="px-4 py-2 rounded-full text-sm transition-all"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          background: formData.budget === b ? "#E8341E" : "transparent",
                          color: formData.budget === b ? "#fff" : "rgba(237,232,223,0.4)",
                          border: formData.budget === b
                            ? "1px solid #E8341E"
                            : "1px solid rgba(237,232,223,0.1)",
                        }}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    className="text-xs tracking-widest uppercase block mb-2"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "rgba(237,232,223,0.3)",
                    }}
                  >
                    ¿Qué estás construyendo? *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Contanos el contexto: qué tiene hoy, qué problema tiene, qué querés lograr..."
                    className="w-full px-5 py-4 text-sm outline-none resize-none"
                    style={{
                      background: "rgba(237,232,223,0.04)",
                      border: "1px solid rgba(237,232,223,0.08)",
                      borderRadius: "12px",
                      color: "#EDE8DF",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-full text-sm font-medium transition-colors"
                  style={{
                    background: "#E8341E",
                    color: "#fff",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#C82D19")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#E8341E")}
                >
                  Enviar mensaje →
                </button>

                <p
                  className="text-xs text-center"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "rgba(237,232,223,0.2)",
                  }}
                >
                  No spam. No cold sales. Solo respondemos si tiene sentido trabajar juntos.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
