import { useState, useRef, useCallback } from "react";

export function useEasterEgg(requiredTaps = 7, timeWindow = 2000) {
  const [triggered, setTriggered] = useState(false);
  const taps = useRef<number[]>([]);

  const handleTap = useCallback(() => {
    const now = Date.now();
    taps.current.push(now);
    taps.current = taps.current.filter((t) => now - t < timeWindow);
    if (taps.current.length >= requiredTaps) {
      setTriggered(true);
      taps.current = [];
      setTimeout(() => setTriggered(false), 4000);
    }
  }, [requiredTaps, timeWindow]);

  return { triggered, handleTap };
}
