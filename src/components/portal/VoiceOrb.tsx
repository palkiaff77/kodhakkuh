import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

/* ========== VOICE NOTE PLACEHOLDERS ========== */
const VOICE_NOTES = [
  { label: "Did you eat🤗?", file: "/media/audio/voice1.mp3" },
  { label: "Im always with uuu🫂.", file: "/media/audio/voice2.mp3" },
  { label: "Love youu💞.", file: "/media/audio/voice3.mp3" },
  { label: "I miss you🥹.", file: "/media/audio/voice4.mp3" },
  { label: "Sorry 😮‍💨.", file: "/media/audio/voice5.mp3" },
  { label: "Surprise🤫.", file: "/media/audio/voice6.mp3" },
];
/* ============================================== */

const VoiceOrb = () => {
  const [playing, setPlaying] = useState<number | null>(null);
  const [waveAmplitudes, setWaveAmplitudes] = useState<number[]>(Array(30).fill(0.1));
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playNote = (index: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (playing === index) {
      setPlaying(null);
      return;
    }
    const audio = new Audio(VOICE_NOTES[index].file);
    audio.play().catch(() => {});
    audio.onended = () => setPlaying(null);
    audioRef.current = audio;
    setPlaying(index);
  };

  useEffect(() => {
    if (playing === null) return;
    const interval = setInterval(() => {
      setWaveAmplitudes(Array(30).fill(0).map(() => Math.random() * 0.8 + 0.2));
    }, 100);
    return () => clearInterval(interval);
  }, [playing]);

  useEffect(() => {
    return () => { if (audioRef.current) audioRef.current.pause(); };
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <h3 className="text-2xl font-serif text-foreground text-glow">🎧 Hear My Voice</h3>

      {/* Waveform */}
      {playing !== null && (
        <div className="flex items-end gap-0.5 h-12 mb-2">
          {waveAmplitudes.map((amp, i) => (
            <motion.div
              key={i}
              className="w-1 bg-primary/70 rounded-full"
              animate={{ height: amp * 48 }}
              transition={{ duration: 0.1 }}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 w-full">
        {VOICE_NOTES.map((note, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => playNote(i)}
            className={`w-full py-3 px-5 rounded-xl glass text-sm font-sans text-left transition-all ${
              playing === i ? "box-glow border-primary/40" : "hover:box-glow"
            }`}
          >
            <span className="mr-2">{playing === i ? "⏸" : "▶"}</span>
            {note.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default VoiceOrb;
