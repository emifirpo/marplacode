"use client";

import { useEffect, useRef, ReactNode, CSSProperties } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function AnimatedHeadline({ children, className = "", style }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const words = wrap.querySelectorAll<HTMLElement>("[data-word]");
    words.forEach((word, i) => {
      word.style.opacity    = "0";
      word.style.transform  = "translateY(0.6em)";
      word.style.transition = `opacity 0.7s ease ${i * 0.09}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.09}s`;
    });

    // Trigger on next frame so initial hidden state paints
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        words.forEach((word) => {
          word.style.opacity   = "1";
          word.style.transform = "translateY(0)";
        });
      });
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  // Convert children string lines into word spans
  const text = typeof children === "string" ? children : "";
  const lines = text.split("\n").filter(Boolean);

  return (
    <div ref={wrapRef} className={className} style={{ ...style, overflow: "visible" }}>
      {lines.map((line, li) => (
        <div key={li} style={{ display: "block", overflow: "hidden" }}>
          {line.split(" ").map((word, wi) => (
            <span
              key={wi}
              data-word=""
              style={{
                display: "inline-block",
                marginRight: wi < line.split(" ").length - 1 ? "0.28em" : 0,
                willChange: "transform, opacity",
              }}
            >
              {word}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
