"use client";

import { useState, useRef, useEffect } from "react";
import WavyLines  from "./WavyLines";
import CTAButton  from "./CTAButton";

// ─── Underline field ──────────────────────────────────────────────────────────
function LineField({
  label, type = "text", value, onChange, placeholder, required = false, multiline = false,
}: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
  required?: boolean; multiline?: boolean;
}) {
  const [active, setActive] = useState(false);
  const shared: React.CSSProperties = {
    display:"block", width:"100%", background:"transparent",
    border:"none", outline:"none", color:"#EDE8DF",
    fontFamily:"'DM Sans', sans-serif", fontSize:"0.95rem",
    fontWeight:300, padding:"6px 0 12px", resize:"none",
    caretColor:"#EDE8DF", lineHeight:1.6,
    // prevent browser fill
    WebkitTextFillColor:"#EDE8DF",
  };
  return (
    <div style={{ position:"relative", paddingBottom:"2px" }}>
      <label style={{
        fontFamily:"'DM Sans', sans-serif", fontSize:"0.6rem",
        letterSpacing:"0.14em", textTransform:"uppercase" as const,
        color: active ? "rgba(237,232,223,0.55)" : "rgba(237,232,223,0.25)",
        display:"block", marginBottom:"8px", transition:"color 0.3s",
      }}>{label}</label>
      {multiline
        ? <textarea rows={3} required={required} value={value} placeholder={placeholder}
            className="input-bare"
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setActive(true)} onBlur={() => setActive(false)}
            style={{ ...shared, minHeight:"72px" }} />
        : <input type={type} required={required} value={value} placeholder={placeholder}
            className="input-bare"
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setActive(true)} onBlur={() => setActive(false)}
            style={shared} />
      }
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"1px", background:"rgba(237,232,223,0.1)" }} />
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, height:"1px",
        background:"#EDE8DF", transformOrigin:"left center",
        transform: active ? "scaleX(1)" : "scaleX(0)",
        transition:"transform 0.45s cubic-bezier(0.16,1,0.3,1)",
      }} />
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
// visible lo controla el padre para evitar race conditions con la animación de salida
function Modal({ email, visible, onClose, onSent }: {
  email:string; visible:boolean; onClose:()=>void; onSent:()=>void;
}) {
  const [data, setData] = useState({ name:"", budget:"", message:"" });
  const budgets = ["< $5k", "$5k – $15k", "$15k – $30k", "$30k+"];

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [visible]);

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position:"fixed", inset:0, zIndex:1000,
        display:"flex", alignItems:"center", justifyContent:"center",
        background:"rgba(13,13,13,0.82)",
        backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition:"opacity 0.32s ease",
        padding:"1.5rem",
      }}
    >
      <div
        className="modal-dark"
        style={{
          width:"100%", maxWidth:"460px",
          background:"#111",
          border:"1px solid rgba(237,232,223,0.07)",
          borderRadius:"4px",
          padding:"2.5rem",
          position:"relative",
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition:"transform 0.38s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Close */}
        <button onClick={onClose} style={{
          position:"absolute", top:"1.2rem", right:"1.2rem",
          background:"none", border:"none", cursor:"pointer",
          color:"rgba(237,232,223,0.25)", fontSize:"1rem", lineHeight:1, padding:"4px",
          transition:"color 0.2s",
        }}
          onMouseEnter={(e) => (e.currentTarget.style.color="#EDE8DF")}
          onMouseLeave={(e) => (e.currentTarget.style.color="rgba(237,232,223,0.25)")}
        >✕</button>

        <p style={{
          fontFamily:"'DM Sans', sans-serif", fontSize:"0.7rem",
          color:"rgba(237,232,223,0.3)", marginBottom:"2rem",
          letterSpacing:"0.03em",
        }}>
          Respondemos a{" "}<span style={{ color:"#EDE8DF" }}>{email}</span>
        </p>

        <form
          onSubmit={(e) => { e.preventDefault(); onSent(); }}
          style={{ display:"flex", flexDirection:"column", gap:"1.8rem" }}
        >
          <LineField label="Tu nombre" required value={data.name}
            onChange={(v) => setData({ ...data, name:v })}
            placeholder="Nombre o empresa" />

          <div>
            <label style={{
              fontFamily:"'DM Sans', sans-serif", fontSize:"0.6rem",
              letterSpacing:"0.14em", textTransform:"uppercase" as const,
              color:"rgba(237,232,223,0.25)", display:"block", marginBottom:"12px",
            }}>Presupuesto estimado</label>
            <div style={{ display:"flex", flexWrap:"wrap" as const, gap:"8px" }}>
              {budgets.map(b => (
                <button key={b} type="button" onClick={() => setData({ ...data, budget:b })}
                  style={{
                    fontFamily:"'DM Sans', sans-serif", fontSize:"0.75rem",
                    padding:"5px 14px", borderRadius:"999px", cursor:"pointer",
                    background: data.budget===b ? "#E8341E" : "transparent",
                    color:      data.budget===b ? "#fff"    : "rgba(237,232,223,0.35)",
                    border:     data.budget===b ? "1px solid #E8341E" : "1px solid rgba(237,232,223,0.1)",
                    transition:"all 0.2s ease",
                  }}
                >{b}</button>
              ))}
            </div>
          </div>

          <LineField label="¿Qué estás construyendo?" required multiline
            value={data.message} onChange={(v) => setData({ ...data, message:v })}
            placeholder="Contexto, problema, qué querés lograr..." />

          <CTAButton label="Enviar mensaje" type="submit" />
        </form>
      </div>
    </div>
  );
}

// ─── Email input con micro-interacción ───────────────────────────────────────
function EmailInput({ value, onChange }: { value:string; onChange:(v:string)=>void }) {
  const [active, setActive] = useState(false);
  return (
    <div style={{ position:"relative", paddingBottom:"2px", width:"100%", maxWidth:"360px" }}>
      <input
        type="email"
        required
        className="input-bare"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        placeholder="tu@email.com"
        autoComplete="email"
        style={{
          display:"block", width:"100%",
          background:"transparent",
          border:"none", outline:"none",
          textAlign:"center",
          color:"#EDE8DF",
          fontFamily:"'DM Sans', sans-serif",
          fontSize:"clamp(1rem, 2vw, 1.2rem)",
          fontWeight:300,
          padding:"6px 0 14px",
          caretColor:"#EDE8DF",
          WebkitTextFillColor:"#EDE8DF",
          letterSpacing:"0.01em",
        }}
      />
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"1px", background:"rgba(237,232,223,0.1)" }} />
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, height:"1px",
        background:"#EDE8DF", transformOrigin:"left center",
        transform: active ? "scaleX(1)" : "scaleX(0)",
        transition:"transform 0.45s cubic-bezier(0.16,1,0.3,1)",
      }} />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CTA() {
  const [email, setEmail]       = useState("");
  const [showModal, setModal]   = useState(false);
  const [sent,  setSent]        = useState(false);

  // ── h2 scroll-reveal (word by word) ─────────────────────────────────────
  const h2Ref    = useRef<HTMLHeadingElement>(null);
  const wordsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const h2 = h2Ref.current;
    if (!h2) return;
    const words = Array.from(h2.querySelectorAll<HTMLElement>("[data-w]"));
    wordsRef.current = words;
    words.forEach((w, i) => {
      w.style.opacity   = "0";
      w.style.transform = "translateY(0.55em)";
      w.style.transition = `opacity 0.7s ease ${i * 0.1}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s`;
    });
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      requestAnimationFrame(() => {
        words.forEach(w => { w.style.opacity="1"; w.style.transform="translateY(0)"; });
      });
      obs.disconnect();
    }, { threshold: 0.2 });
    obs.observe(h2);
    return () => obs.disconnect();
  }, []);

  const openModal = () => {
    if (!email) return;
    setModal(true);
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    openModal();
  };

  // Helper: wrap each word in a span
  const wordSpan = (text: string, startIdx: number) =>
    text.split(" ").map((w, i) => (
      <span
        key={startIdx + i}
        data-w=""
        style={{ display:"inline-block", marginRight:"0.25em", willChange:"transform, opacity" }}
      >{w}</span>
    ));

  return (
    <>
      <section
        id="contacto"
        style={{
          position:"relative",
          background:"#0D0D0D",
          minHeight:"100vh",
          display:"flex",
          flexDirection:"column",
          alignItems:"center",
          justifyContent:"center",
          padding:"8rem 1.5rem",
          overflow:"hidden",
          textAlign:"center",
        }}
      >
        {/* WavyLines bg — 30% */}
        <div style={{ position:"absolute", inset:0, opacity:0.3, pointerEvents:"none" }}>
          <WavyLines color="rgba(237,232,223,0.4)" xGap={10} yGap={32} />
        </div>

        <div style={{ position:"relative", width:"100%", maxWidth:"820px" }}>

          {/* Label */}
          <span style={{
            fontFamily:"'DM Sans', sans-serif", fontSize:"0.68rem",
            letterSpacing:"0.1em", color:"rgba(237,232,223,0.35)",
            display:"block", marginBottom:"2rem",
          }}>(Contacto)</span>

          {/* H2 — scroll reveal */}
          <h2
            ref={h2Ref}
            style={{
              fontFamily:"'DM Sans', sans-serif",
              fontSize:"clamp(2.8rem, 6.5vw, 5.5rem)",
              fontWeight:300,
              lineHeight:1.0,
              color:"#EDE8DF",
              margin:"0 0 3.5rem",
              letterSpacing:"-0.01em",
              overflow:"visible",
            }}
          >
            <span style={{ display:"block" }}>
              {wordSpan("Contanos qué estás", 0)}
            </span>
            <span style={{ display:"block", fontStyle:"italic" }}>
              {wordSpan("construyendo.", 4)}
            </span>
          </h2>

          {/* Email + button */}
          {!sent ? (
            <form onSubmit={handleContinue} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"2rem" }}>
              <EmailInput value={email} onChange={setEmail} />
              <CTAButton label="Continuar" type="submit" />
            </form>
          ) : (
            <div>
              <p style={{
                fontFamily:"'DM Sans', sans-serif", fontSize:"1.1rem",
                fontWeight:300, color:"rgba(237,232,223,0.55)", marginBottom:"0.5rem",
              }}>Mensaje recibido.</p>
              <p style={{
                fontFamily:"'DM Sans', sans-serif", fontSize:"0.85rem",
                color:"rgba(237,232,223,0.3)",
              }}>Te respondemos en menos de 24h.</p>
            </div>
          )}

          {/* Footer email */}
          <div style={{ marginTop:"5rem" }}>
            <a href="mailto:hello@marplacode.com" style={{
              fontFamily:"'DM Sans', sans-serif", fontSize:"0.72rem",
              color:"rgba(237,232,223,0.22)", textDecoration:"none",
              letterSpacing:"0.05em", transition:"color 0.2s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color="rgba(237,232,223,0.6)")}
              onMouseLeave={(e) => (e.currentTarget.style.color="rgba(237,232,223,0.22)")}
            >
              hello@marplacode.com
            </a>
          </div>
        </div>
      </section>

      <Modal
        email={email}
        visible={showModal}
        onClose={() => setModal(false)}
        onSent={() => { setModal(false); setSent(true); }}
      />
    </>
  );
}
