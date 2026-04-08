"use client";

import { motion } from "framer-motion";

const DURATION = 0.25;
const STAGGER  = 0.025;

interface FlipLinkProps {
  children: string;
  href:     string;
  className?: string;
  style?:     React.CSSProperties;
  onClick?:   () => void;
}

export default function FlipLink({ children, href, className, style, onClick }: FlipLinkProps) {
  const chars = children.trim().split("");

  return (
    <motion.a
      href={href}
      onClick={onClick}
      initial="initial"
      whileHover="hovered"
      className={className}
      style={{
        display:       "inline-block",
        verticalAlign: "bottom",
        position:      "relative",
        overflow:      "hidden",
        whiteSpace:    "nowrap",
        ...style,
      }}
    >
      {/* Línea 1: sale hacia arriba */}
      <span style={{ display: "block" }}>
        {chars.map((l, i) => (
          <motion.span
            key={i}
            variants={{ initial: { y: 0 }, hovered: { y: "-100%" } }}
            transition={{ duration: DURATION, ease: "easeInOut", delay: STAGGER * i }}
            style={{ display: "inline-block" }}
          >
            {l === " " ? "\u00A0" : l}
          </motion.span>
        ))}
      </span>

      {/* Línea 2: entra desde abajo */}
      <span style={{ display: "block", position: "absolute", inset: 0 }}>
        {chars.map((l, i) => (
          <motion.span
            key={i}
            variants={{ initial: { y: "100%" }, hovered: { y: 0 } }}
            transition={{ duration: DURATION, ease: "easeInOut", delay: STAGGER * i }}
            style={{ display: "inline-block" }}
          >
            {l === " " ? "\u00A0" : l}
          </motion.span>
        ))}
      </span>
    </motion.a>
  );
}
