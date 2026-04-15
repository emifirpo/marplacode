"use client";

import { useState } from "react";

const E = "cubic-bezier(0.16, 1, 0.3, 1)";

interface CTAButtonProps {
  label?:          string;
  href?:           string;
  onClick?:        () => void;
  onHoverChange?:  (v: boolean) => void;
  /** Altura del botón. Default: 42px */
  height?:         number;
  /** Padding horizontal. Default: "0 18px 0 22px" */
  padding?:        string;
  /** min-width. Default: 140px */
  minWidth?:       number;
  fontSize?:       string;
  flex?:           string | number;
  style?:          React.CSSProperties;
}

export default function CTAButton({
  label         = "Iniciar proyecto",
  href          = "#contacto",
  onClick,
  onHoverChange,
  height        = 42,
  padding       = "0 18px 0 22px",
  minWidth      = 140,
  fontSize      = "0.875rem",
  flex,
  style,
}: CTAButtonProps) {
  const [hov, setHov] = useState(false);

  const handleMouseEnter = () => { setHov(true);  onHoverChange?.(true);  };
  const handleMouseLeave = () => { setHov(false); onHoverChange?.(false); };

  const base: React.CSSProperties = {
    display:        "inline-flex",
    alignItems:     "center",
    justifyContent: "center",
    height:         `${height}px`,
    borderRadius:   "999px",
    background:     hov ? "#c92c18" : "#E8341E",
    color:          "#fff",
    fontSize,
    fontWeight:     500,
    textDecoration: "none",
    overflow:       "hidden",
    padding,
    minWidth:       `${minWidth}px`,
    transition:     "background 0.25s",
    fontFamily:     "'DM Sans', sans-serif",
    whiteSpace:     "nowrap",
    cursor:         "pointer",
    border:         "none",
    ...(flex !== undefined && { flex }),
    ...style,
  };

  const inner = (
    <span style={{ display: "flex", flexDirection: "column", height: "1.15em", overflow: "hidden" }}>
      <span style={{
        lineHeight: 1.15,
        transition: `transform 0.38s ${E}`,
        transform:  hov ? "translateY(-100%)" : "translateY(0%)",
      }}>
        {label}
      </span>
      <span style={{
        lineHeight: 1.15,
        transition: `transform 0.38s ${E}`,
        transform:  hov ? "translateY(-100%)" : "translateY(0%)",
        display:    "flex",
        alignItems: "center",
        gap:        "5px",
      }}>
        {label} <span style={{ fontSize: "0.85em", opacity: 0.85 }}>→</span>
      </span>
    </span>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={base}
      >
        {inner}
      </button>
    );
  }

  return (
    <a
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={base}
    >
      {inner}
    </a>
  );
}
