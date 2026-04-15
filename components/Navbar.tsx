"use client";

import { useState, useEffect, useRef } from "react";
import CTAButton from "./CTAButton";

// ─── Logo SVG inline ────────────────────────────────────────────────────────
function LogoIcon() {
  return (
    <svg width="28" height="25" viewBox="0 0 580 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M377.178 372.233C377.291 373.104 377.007 373.866 376.327 374.52C375.759 375.173 375.079 375.499 374.284 375.499H319.991C318.289 375.499 317.325 374.628 317.098 372.887L305.694 254.167C305.581 252.643 304.673 251.827 302.971 251.718C301.383 251.5 300.361 252.153 299.908 253.677L259.911 373.54C259.571 374.846 258.663 375.499 257.188 375.499H220.085C218.61 375.499 217.702 374.846 217.361 373.54L177.365 253.677C176.911 252.153 175.833 251.5 174.131 251.718C172.543 251.827 171.692 252.643 171.578 254.167L160.175 372.887C159.948 374.628 158.983 375.499 157.281 375.499H102.988C102.194 375.499 101.456 375.173 100.776 374.52C100.208 373.866 99.9813 373.104 100.095 372.233L130.73 143.45C130.957 141.817 131.922 141 133.624 141H196.257C197.845 141 198.81 141.653 199.15 142.96L236.253 259.066C236.707 260.373 237.615 261.026 238.977 261.026C240.452 261.026 241.416 260.373 241.87 259.066L277.782 142.96C278.122 141.653 279.087 141 280.675 141H343.649C345.351 141 346.315 141.817 346.542 143.45L377.178 372.233Z" fill="currentColor"/>
      <path d="M480.026 275.191C480.945 275.191 481.693 275.583 482.267 276.365C482.957 277.148 483.187 277.987 482.957 278.881L441.744 373.48C441.399 374.821 440.421 375.492 438.812 375.492H401.565C400.645 375.492 399.898 375.101 399.323 374.318C398.633 373.647 398.403 372.865 398.633 371.97L421.913 277.54C422.258 275.974 423.235 275.191 424.844 275.191H480.026Z" fill="currentColor"/>
      <path d="M483.818 165.166C483.818 163.265 482.841 162.314 480.887 162.314H425.533C423.579 162.314 422.602 163.265 422.602 165.166V219.006C422.602 220.907 423.579 221.858 425.533 221.858H480.887C482.841 221.858 483.818 220.907 483.818 219.006V165.166Z" fill="currentColor"/>
    </svg>
  );
}

// ─── Links ───────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Capacidades", href: "#capacidades" },
  { label: "Casos",       href: "#casos"        },
  { label: "Proceso",     href: "#proceso"      },
  { label: "Contacto",    href: "#contacto"     },
];

const E  = "cubic-bezier(0.16, 1, 0.3, 1)";
// Curva para expansiones de layout — spring suave con micro-overshoot
const EX = "cubic-bezier(0.34, 1.15, 0.64, 1)";


// ─── Menu Button ─────────────────────────────────────────────────────────────
function MenuBtn({ open, onClick }: { open: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:     "flex",
        alignItems:  "center",
        gap:         "10px",
        padding:     "8px 14px",
        borderRadius:"999px",
        background:  hov || open ? "rgba(237,232,223,0.07)" : "transparent",
        color:       "#EDE8DF",
        fontSize:    "0.875rem",
        border:      "none",
        cursor:      "pointer",
        transition:  "background 0.2s",
        fontFamily:  "'DM Sans', sans-serif",
        outline:     "none",
      }}
    >
      {/* Hamburger → X */}
      <span style={{ position: "relative", width: 18, height: 13, display: "flex", alignItems: "center" }}>
        <span style={{
          position:    "absolute",
          width:       "100%",
          height:      "1.5px",
          background:  "#EDE8DF",
          borderRadius:"2px",
          top:         "50%",
          marginTop:   "-3.5px",
          transform:   open ? "rotate(45deg) translateY(3.5px)" : "translateY(0)",
          transition:  `transform 0.35s ${E}`,
        }} />
        <span style={{
          position:    "absolute",
          width:       "100%",
          height:      "1.5px",
          background:  "#EDE8DF",
          borderRadius:"2px",
          top:         "50%",
          marginTop:   "2px",
          transform:   open ? "rotate(-45deg) translateY(-3.5px)" : "translateY(0)",
          transition:  `transform 0.35s ${E}`,
        }} />
      </span>

      {/* Menú ↔ Cerrar flip */}
      <span style={{ overflow: "hidden", height: "1.15em", display: "inline-block" }}>
        <span style={{ display: "flex", flexDirection: "column" }}>
          <span style={{
            lineHeight:  1.15,
            transition:  `transform 0.35s ${E}`,
            transform:   open ? "translateY(-100%)" : "translateY(0%)",
          }}>Menú</span>
          <span style={{
            lineHeight:  1.15,
            transition:  `transform 0.35s ${E}`,
            transform:   open ? "translateY(-100%)" : "translateY(0%)",
          }}>Cerrar</span>
        </span>
      </span>
    </button>
  );
}

// ─── Popover link ─────────────────────────────────────────────────────────────
function PopLink({ label, href, index, open, onClose }: {
  label: string; href: string; index: number; open: boolean; onClose: () => void;
}) {
  const [hov, setHov] = useState(false);

  return (
    <a
      href={href}
      onClick={onClose}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:       "flex",
        alignItems:    "center",
        justifyContent:"space-between",
        padding:       "11px 14px",
        borderRadius:  "13px",
        color:         hov ? "#fff" : "#EDE8DF",
        fontSize:      "0.92rem",
        fontWeight:    400,
        textDecoration:"none",
        background:    hov ? "rgba(237,232,223,0.06)" : "transparent",
        opacity:       open ? 1 : 0,
        transform:     open ? "translateY(0px)" : "translateY(8px)",
        transition:    [
          `background 0.15s`,
          `color 0.15s`,
          `opacity 0.32s ${E} ${open ? index * 45 : 0}ms`,
          `transform 0.38s ${E} ${open ? index * 45 : 0}ms`,
        ].join(", "),
      }}
    >
      <span>{label}</span>
      <span style={{
        fontSize:   "0.7rem",
        color:      hov ? "rgba(237,232,223,0.5)" : "rgba(237,232,223,0.18)",
        transition: "color 0.15s",
        fontWeight: 300,
      }}>↗</span>
    </a>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const [open,    setOpen]    = useState(false);
  const [visible, setVisible] = useState(false);
  const [pillHov, setPillHov] = useState(false);
  const [ctaHov,  setCtaHov]  = useState(false);
  const [pillW,   setPillW]   = useState(0);
  const navRef  = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  // Entrada: espera evento del Hero loader
  useEffect(() => {
    const onDone = () => {
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    };
    window.addEventListener("hero:loaderDone", onDone);
    return () => window.removeEventListener("hero:loaderDone", onDone);
  }, []);

  // Cerrar al click fuera
  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  // Cerrar con Escape
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, []);

  // Medir ancho del pill para expandir CTA
  useEffect(() => {
    const measure = () => {
      if (pillRef.current) setPillW(pillRef.current.offsetWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [visible]);

  return (
    <>
      {/* ── Backdrop ──────────────────────────────────────────────────────── */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position:       "fixed",
          inset:          0,
          zIndex:         48,
          background:     "rgba(13,13,13,0.45)",
          backdropFilter: open ? "blur(4px)" : "blur(0px)",
          opacity:        open ? 1 : 0,
          pointerEvents:  open ? "auto" : "none",
          transition:     `opacity 0.3s ${E}, backdrop-filter 0.3s ${E}`,
        }}
      />

      {/* ── Floating pill ─────────────────────────────────────────────────── */}
      <nav
        ref={navRef}
        style={{
          position:         "fixed",
          bottom:           "2rem",
          left:             "50%",
          transform:        `translateX(-50%) translateY(${visible ? "0px" : "28px"})`,
          opacity:          visible ? 1 : 0,
          transition:       `opacity 0.7s ${E} 0.15s, transform 0.7s ${E} 0.15s`,
          zIndex:           50,
          fontFamily:       "'DM Sans', sans-serif",
          display:          "flex",
          flexDirection:    "column",
          alignItems:       "center",
          gap:              "8px",
        }}
      >
        {/* ── POPOVER ───────────────────────────────────────────────────── */}
        <div
          style={{
            background:      "#181818",
            border:          "1px solid rgba(237,232,223,0.07)",
            borderRadius:    "20px",
            padding:         "8px",
            minWidth:        "264px",
            boxShadow:       "0 28px 64px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.03)",
            transformOrigin: "bottom center",
            transform:       open ? "scale(1) translateY(0px)" : "scale(0.94) translateY(12px)",
            opacity:         open ? 1 : 0,
            pointerEvents:   open ? "auto" : "none",
            transition:      `opacity 0.28s ${E}, transform 0.35s ${E}`,
          }}
        >
          {NAV_LINKS.map((link, i) => (
            <PopLink
              key={link.label}
              label={link.label}
              href={link.href}
              index={i}
              open={open}
              onClose={() => setOpen(false)}
            />
          ))}

          <div style={{
            height:     "1px",
            background: "rgba(237,232,223,0.06)",
            margin:     "6px 4px",
          }} />

          <div style={{
            display:         "flex",
            justifyContent:  "space-between",
            padding:         "7px 14px 5px",
            opacity:         open ? 0.4 : 0,
            transition:      `opacity 0.35s ${E} ${open ? "200ms" : "0ms"}`,
          }}>
            <span style={{ fontSize: "0.68rem", color: "#9A948D" }}>hello@marplacode.com</span>
            <span style={{ fontSize: "0.68rem", color: "#9A948D" }}>MdP, Argentina</span>
          </div>
        </div>

        {/* ── PILL ──────────────────────────────────────────────────────── */}
        <div
          ref={pillRef}
          onMouseEnter={() => setPillHov(true)}
          onMouseLeave={() => setPillHov(false)}
          style={{
            display:      "flex",
            alignItems:   "center",
            // Ancho BLOQUEADO al valor medido → el pill nunca cambia de tamaño
            width:        pillW > 0 ? `${pillW}px` : undefined,
            gap:          ctaHov ? "0px" : "4px",
            background:   pillHov ? "#242424" : "#1A1A1A",
            borderRadius: "999px",
            padding:      ctaHov ? "5px" : "5px 5px 5px 16px",
            border:       "1px solid rgba(237,232,223,0.08)",
            boxShadow:    "0 8px 32px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.3)",
            transition:   `background 0.3s ${E}, padding 0.6s ${EX}, gap 0.6s ${EX}`,
            overflow:     "hidden",
          }}
        >
          {/* Logo + separator + menu — se ocultan cuando CTA se expande */}
          <div style={{
            display:    "flex",
            alignItems: "center",
            gap:        "4px",
            overflow:   "hidden",
            maxWidth:   ctaHov ? "0px" : "260px",
            opacity:    ctaHov ? 0 : 1,
            transition: `max-width 0.6s ${EX}, opacity 0.25s ${E}`,
            flexShrink: 0,
          }}>
            <div style={{ color: "#EDE8DF", display: "flex", alignItems: "center", paddingRight: "10px", flexShrink: 0 }}>
              <LogoIcon />
            </div>
            <div style={{ width: "1px", height: "16px", background: "rgba(237,232,223,0.1)", flexShrink: 0 }} />
            <MenuBtn open={open} onClick={() => setOpen(v => !v)} />
          </div>

          <CTAButton onHoverChange={setCtaHov} flex="1" minWidth={140} />
        </div>
      </nav>
    </>
  );
}
