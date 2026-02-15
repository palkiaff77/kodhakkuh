import { useRef, useEffect, useCallback } from "react";

interface StarfieldProps {
  particleColor?: string;
  speed?: number;
  density?: number;
  className?: string;
}

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

const StarfieldCanvas = ({ particleColor = "hsla(220, 60%, 80%, 0.8)", speed = 1, density = 120, className = "" }: StarfieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animRef = useRef<number>(0);

  const initStars = useCallback((w: number, h: number) => {
    const stars: Star[] = [];
    for (let i = 0; i < density; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 2.5 + 0.5,
        speed: (Math.random() * 0.3 + 0.1) * speed,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }
    starsRef.current = stars;
  }, [density, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (starsRef.current.length === 0) initStars(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let time = 0;
    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of starsRef.current) {
        star.y -= star.speed;
        if (star.y < -5) {
          star.y = canvas.height + 5;
          star.x = Math.random() * canvas.width;
        }
        const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinklePhase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor.replace(/[\d.]+\)$/, `${star.opacity * twinkle})`);
        ctx.fill();
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [particleColor, initStars]);

  return <canvas ref={canvasRef} className={`fixed inset-0 ${className}`} style={{ zIndex: 0 }} />;
};

export default StarfieldCanvas;
