"use client";

import { useEffect, useRef, useState } from "react";

export default function LazySection({
  children,
  rootMargin = "400px",
}: {
  children: React.ReactNode;
  rootMargin?: string;
}) {
  const ref      = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShow(true); obs.disconnect(); } },
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  return <div ref={ref}>{show ? children : null}</div>;
}
