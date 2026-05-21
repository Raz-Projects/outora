"use client";

import { useState, useRef, useEffect } from "react";

export function AudioToggle() {
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/audio/ambient.mp3");
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    // Show after 2 seconds
    const t = setTimeout(() => setVisible(true), 2000);
    return () => {
      clearTimeout(t);
      audio.pause();
      audio.src = "";
    };
  }, []);

  function fadeVolume(target: number, duration = 1200) {
    const audio = audioRef.current;
    if (!audio) return;
    const steps = 30;
    const interval = duration / steps;
    const delta = (target - audio.volume) / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      audio.volume = Math.max(0, Math.min(1, audio.volume + delta));
      if (step >= steps) {
        clearInterval(timer);
        if (target === 0) audio.pause();
      }
    }, interval);
  }

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!playing) {
      try {
        audio.volume = 0;
        await audio.play();
        fadeVolume(0.35);
        setPlaying(true);
      } catch {
        // autoplay blocked — user must interact first, which they did
      }
    } else {
      fadeVolume(0);
      setTimeout(() => setPlaying(false), 1200);
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={playing ? "עצור מוזיקה" : "הפעל מוזיקת אווירה"}
      title={playing ? "עצור מוזיקה" : "מוזיקת אווירה — לחץ להפעלה"}
      style={{
        position: "fixed",
        bottom: "96px",
        left: "18px",
        zIndex: 50,
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        border: "1px solid rgba(196,149,74,0.5)",
        backgroundColor: playing ? "rgba(196,149,74,0.18)" : "rgba(28,20,16,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.4s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.8)",
      }}
    >
      {playing ? (
        /* Speaker ON — with waves */
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#C4954A" strokeWidth="1.5" strokeLinecap="round">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ) : (
        /* Speaker OFF — muted */
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#C4954A" strokeWidth="1.5" strokeLinecap="round">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
}
