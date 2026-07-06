"use client";

import { useEffect, useState } from "react";

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    let frame: number;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setPos({ x: e.clientX, y: e.clientY }));
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        background: `radial-gradient(600px at ${pos.x}px ${pos.y}px, rgba(45, 212, 191, 0.06), transparent 60%)`,
      }}
    />
  );
}
