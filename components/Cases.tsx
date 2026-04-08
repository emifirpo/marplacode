"use client";

import { useState } from "react";
import FlipLink from "./FlipLink";

const cases = [
  {
    client: "Fintech startup",
    year: "2024",
    tag: "Producto / Web App",
    result: "Tasa de abandono: 68% → 23% en los primeros 30 días.",
    panelBg: "linear-gradient(160deg, #1a0900 0%, #2d1100 40%, #1f0a00 70%, #150700 100%)",
    thumbBg: "linear-gradient(135deg, #2d1100 0%, #1a0900 100%)",
  },
  {
    client: "SaaS B2B",
    year: "2023",
    tag: "Design System / Frontend",
    result: "Tiempo de desarrollo de nuevas features: −40% en el trimestre.",
    panelBg: "linear-gradient(160deg, #0d0500 0%, #150700 40%, #0a0300 70%, #050100 100%)",
    thumbBg: "linear-gradient(135deg, #150700 0%, #0a0300 100%)",
  },
  {
    client: "E-commerce regional",
    year: "2024",
    tag: "Web / Performance",
    result: "Carga mobile: 8.4s → 1.8s. Conversiones mobile: +47%.",
    panelBg: "linear-gradient(160deg, #040100 0%, #080200 40%, #020100 70%, #000000 100%)",
    thumbBg: "linear-gradient(135deg, #080200 0%, #020000 100%)",
  },
];

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")";

export default function Cases() {
  const [active, setActive] = useState(0);

  const leftBgs = ["#1f0a00", "#0d0400", "#070200"];

  return (
    <section
      ref={sectionRef}
      id="casos"
      style={{
        display: "flex",
        alignItems: "flex-start",
        background: "#1a0900",
      }}
    >
      {/* ── Left sticky panel ──────────────────────────────────────────────── */}
      <div
        ref={leftRef}
        style={{
          width: "36%",
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "4rem 3rem 3.5rem",
          boxSizing: "border-box",
          background: leftBgs[active],
          transition: "background 0.8s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Noise layer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: NOISE,
            backgroundRepeat: "repeat",
            backgroundSize: "180px 180px",
            opacity: 0.06,
            pointerEvents: "none",
          }}
        />

        {/* Top */}
        <div style={{ position: "relative" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)" }}>
            (Casos)
          </span>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(2rem, 3vw, 2.8rem)", color: "rgba(255,255,255,0.9)", fontWeight: 300, lineHeight: 1.15, marginTop: "1rem", marginBottom: "1.1rem" }}>
            Sin portfolio
            <br /><em style={{ color: "rgba(255,255,255,0.4)" }}>pasivo.</em>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.65, maxWidth: "26ch" }}>
            Contexto, problema, decisión y resultado real. Sin casos de estudio genéricos.
          </p>
        </div>

        {/* Vertical tabs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", position: "relative" }}>
          {cases.map((c, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{ display: "flex", alignItems: "center", gap: "1rem", background: "none", border: "none", cursor: "pointer", padding: "0.65rem 0.7rem", borderRadius: "10px", backgroundColor: active === i ? "rgba(255,255,255,0.07)" : "transparent", transition: "background-color 0.25s", textAlign: "left" }}
            >
              <div style={{ width: 76, height: 48, borderRadius: 7, background: c.thumbBg, flexShrink: 0, border: active === i ? "1.5px solid rgba(255,255,255,0.3)" : "1.5px solid rgba(255,255,255,0.06)", transition: "border-color 0.25s", overflow: "hidden", position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: NOISE, backgroundSize: "80px 80px", opacity: 0.1 }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: active === i ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)", transition: "color 0.25s", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.client}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", color: "rgba(255,255,255,0.2)", marginTop: "0.2rem" }}>{c.tag}</div>
              </div>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.6)", flexShrink: 0, opacity: active === i ? 1 : 0, transition: "opacity 0.25s" }} />
            </button>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ position: "relative" }}>
          <button style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", letterSpacing: "0.09em", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "999px", padding: "0.75rem 1.6rem", cursor: "pointer" }}>
            VER TODOS
          </button>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.58rem", color: "rgba(255,255,255,0.2)", marginTop: "0.85rem", lineHeight: 1.5 }}>
            Los nombres son confidenciales por acuerdo.{" "}
            <FlipLink href="#contacto" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "underline", textUnderlineOffset: "2px" }}>Pedinos referencias.</FlipLink>
          </p>
        </div>
      </div>

      {/* ── Right panel — shows active case ───────────────────────────────── */}
      <div style={{ width: "64%", background: "#0D0D0D", padding: "8px 8px 8px 0", height: "100vh" }}>
        <div style={{ position: "relative", height: "100%", clipPath: "inset(0 round 16px)" }}>
          {cases.map((c, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                opacity: active === i ? 1 : 0,
                transition: "opacity 0.5s cubic-bezier(0.16,1,0.3,1)",
                pointerEvents: active === i ? "auto" : "none",
              }}
            >
              <div style={{ position: "absolute", inset: 0, background: c.panelBg }} />
              <div style={{ position: "absolute", inset: 0, backgroundImage: NOISE, backgroundRepeat: "repeat", backgroundSize: "180px 180px", opacity: 0.08, mixBlendMode: "overlay" }} />
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 65% 45%, transparent 35%, rgba(0,0,0,0.45) 100%)" }} />
              <div style={{ position: "absolute", top: "50%", right: "5%", transform: "translateY(-50%)", fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(8rem, 20vw, 18rem)", color: "rgba(255,255,255,0.03)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>
                0{i + 1}
              </div>
              <div style={{ position: "relative", zIndex: 1, padding: "2.5rem 3rem", background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.4rem" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)" }}>{c.year}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", padding: "0.3rem 0.85rem", borderRadius: "999px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    [{c.tag.toUpperCase()}]
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "2rem" }}>
                  <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: "rgba(255,255,255,0.92)", fontWeight: 300, lineHeight: 1.1, margin: 0 }}>{c.client}</h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.55, maxWidth: "32ch", textAlign: "right", margin: 0, flexShrink: 0 }}>{c.result}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
