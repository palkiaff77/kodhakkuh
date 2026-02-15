import { useState, useEffect } from "react";

export type TimeOfDay = "morning" | "afternoon" | "night";

export interface TimeTheme {
  timeOfDay: TimeOfDay;
  greeting: string;
  is1111: boolean;
  isAnniversary: boolean;
  isBirthday: boolean;
  particleColor: string;
  bgTint: string;
}

export function useTimeTheme(birthdayMonth = 1, birthdayDay = 1): TimeTheme {
  const [theme, setTheme] = useState<TimeTheme>(getTheme(birthdayMonth, birthdayDay));

  useEffect(() => {
    const interval = setInterval(() => setTheme(getTheme(birthdayMonth, birthdayDay)), 60000);
    return () => clearInterval(interval);
  }, [birthdayMonth, birthdayDay]);

  return theme;
}

function getTheme(bm: number, bd: number): TimeTheme {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const is1111 = h === 11 && m === 11;
  const isAnniversary = month === 7 && day === 1;
  const isBirthday = month === bm && day === bd;

  let timeOfDay: TimeOfDay;
  let greeting: string;
  let particleColor: string;
  let bgTint: string;

  if (h >= 5 && h < 12) {
    timeOfDay = "morning";
    greeting = "Good morning, Kodhakuhh ☀️";
    particleColor = "hsla(40, 80%, 55%, 0.8)";
    bgTint = "hsla(40, 30%, 15%, 0.3)";
  } else if (h >= 12 && h < 17) {
    timeOfDay = "afternoon";
    greeting = "Hope your day is beautiful, Nivetha 🌸";
    particleColor = "hsla(330, 70%, 65%, 0.8)";
    bgTint = "hsla(330, 20%, 12%, 0.3)";
  } else {
    timeOfDay = "night";
    greeting = "Good evening, Kannuhh 🌙\nEven the moon looks softer tonight.";
    particleColor = "hsla(220, 60%, 70%, 0.8)";
    bgTint = "hsla(230, 30%, 8%, 0.3)";
  }

  return { timeOfDay, greeting, is1111, isAnniversary, isBirthday, particleColor, bgTint };
}
