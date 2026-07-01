import { useState, useEffect } from 'react';

interface RippleType {
  x: number;
  y: number;
  size: number;
  id: number;
}

interface RippleProps {
  duration?: number;
  color?: string;
}

export function Ripple({ duration = 600, color = 'rgba(255, 255, 255, 0.6)' }: RippleProps) {
  const [ripples, setRipples] = useState<RippleType[]>([]);

  useEffect(() => {
    if (ripples.length === 0) return;

    const timer = setTimeout(() => {
      setRipples((prevRipples) => prevRipples.slice(1));
    }, duration);

    return () => clearTimeout(timer);
  }, [ripples, duration]);

  const addRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    const rippleContainer = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rippleContainer.width, rippleContainer.height);
    const x = event.clientX - rippleContainer.left - size / 2;
    const y = event.clientY - rippleContainer.top - size / 2;

    const newRipple: RippleType = {
      x,
      y,
      size: size * 2,
      id: Date.now(),
    };

    setRipples((prevRipples) => [...prevRipples, newRipple]);
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-[inherit]"
      onMouseDown={addRipple}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: color,
            animationDuration: `${duration}ms`,
          }}
        />
      ))}
    </div>
  );
}
