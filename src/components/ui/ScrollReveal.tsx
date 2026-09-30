"use client";

import { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  yOffset?: number;
}

export default function ScrollReveal({ children, delay = 0, yOffset = 50 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(el, {
              y: 0,
              opacity: 1,
              duration: 1,
              delay: delay,
              ease: "power3.out",
            });
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    gsap.set(el, { y: yOffset, opacity: 0 });
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [delay, yOffset]);

  return <div ref={ref} style={{ opacity: 0 }}>{children}</div>;
}
