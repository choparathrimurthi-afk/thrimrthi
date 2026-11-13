import React, { useRef, useState } from 'react';
import { prefersReducedMotion } from '../utils/webgl';

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'purple' | 'blue' | 'violet';
  onClick?: () => void;
  maxTilt?: number;
}

const GLOW_COLORS = {
  purple: 'rgba(168, 85, 247, 0.22)',
  blue: 'rgba(56, 189, 248, 0.22)',
  violet: 'rgba(124, 58, 237, 0.24)',
};

export function TiltCard3D({
  children,
  className = '',
  glowColor = 'purple',
  onClick,
  maxTilt = 8,
}: TiltCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50, hovered: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion() || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * 2 * maxTilt;
    const rx = -(py - 0.5) * 2 * maxTilt;
    setTilt({
      rx,
      ry,
      mx: px * 100,
      my: py * 100,
      hovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50, hovered: false });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: `perspective(900px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) translateZ(${tilt.hovered ? 6 : 0}px)`,
        transition: tilt.hovered
          ? 'transform 120ms cubic-bezier(0.16, 1, 0.3, 1)'
          : 'transform 360ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`relative rounded-2xl surface-glass-interactive overflow-hidden will-change-transform ${className}`}
    >
      {/* Pointer-tracked neon spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{
          opacity: tilt.hovered ? 1 : 0,
          background: `radial-gradient(380px circle at ${tilt.mx}% ${tilt.my}%, ${GLOW_COLORS[glowColor]}, transparent 65%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
