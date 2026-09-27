
import { useState, useEffect, useRef, useCallback } from "react";
import Landing from "./Landing";

import '../App.css';

export default function ScrambleLoadingPage({
  wordA = "SIN",
  wordB = "!SDEATH",
  accentColor = "#ffff",
  minDuration = 2200,
  isReady,
  onLoadingComplete,
  children = <Landing />,
}) {
  const full = wordA + wordB;
  const CHARSET =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(){}[]/\\<>?";

  const [displayChars, setDisplayChars] = useState(() => full.split(""));
  const [cursorVisible, setCursorVisible] = useState(true);
  const [scrambleDone, setScrambleDone] = useState(false);
  const [minTimeDone, setMinTimeDone] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(true); // loader present in DOM at all

  const timers = useRef([]);
  const trackTimer = (t) => timers.current.push(t);

  const randomChar = useCallback(
    () => CHARSET[Math.floor(Math.random() * CHARSET.length)],
    []
  );

  // scramble-in animation, runs once on mount
  useEffect(() => {
    let revealed = 0;
    let frame = 0;
    const total = full.length;
    const scrambleSpeed = 40;
    const revealEvery = 4;

    const interval = setInterval(() => {
      frame++;
      setDisplayChars((prev) => {
        const next = [...prev];
        for (let i = revealed; i < total; i++) next[i] = randomChar();
        for (let i = 0; i < revealed; i++) next[i] = full[i];
        return next;
      });

      if (frame % revealEvery === 0 && revealed < total) revealed++;

      if (revealed >= total) {
        clearInterval(interval);
        setDisplayChars(full.split(""));
        const cursorOff = setTimeout(() => {
          setCursorVisible(false);
          setScrambleDone(true);
        }, 300);
        trackTimer(cursorOff);
      }
    }, scrambleSpeed);
    trackTimer(interval);

    const minTimer = setTimeout(() => setMinTimeDone(true), minDuration);
    trackTimer(minTimer);

    return () => timers.current.forEach((t) => clearInterval(t) || clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // decide when to start exiting: scramble finished + min time passed,
  // and (if controlled) isReady is true
  useEffect(() => {
    const controlled = typeof isReady === "boolean";
    const contentReady = controlled ? isReady : true;
    if (scrambleDone && minTimeDone && contentReady && !exiting) {
      setExiting(true);
      const unmount = setTimeout(() => {
        setMounted(false);
        onLoadingComplete && onLoadingComplete();
      }, 700); // matches the fade-out transition duration below
      trackTimer(unmount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrambleDone, minTimeDone, isReady]);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* real page content, always mounted underneath so it's ready to show */}
      <div style={{ minHeight: "100vh" }}>{children}</div>

      {mounted && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            overflow: "hidden",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 900,
            background: "black",
            opacity: exiting ? 0 : 1,
            transform: exiting ? "scale(1.04)" : "scale(1)",
            // filter: exiting ? "blur(6px)" : "blur(0px)",
            transition:
              "opacity 0.7s ease, transform 0.7s ease",
            pointerEvents: exiting ? "none" : "auto",
          }}
        >
          {/* animated ripple bands */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.35,
              mixBlendMode: "overlay",
              filter: "blur(2px)",
            //   background:
            //     "repeating-radial-gradient(ellipse at 50% 120%, rgba(255,120,120,0.25) 0px, rgba(120,180,255,0.2) 40px, rgba(255,255,255,0.05) 80px, transparent 120px)",
              animation: "slp-ripple 6s ease-in-out infinite",
            }}
          />

          {/* faint pixel grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.06,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "3px 3px",
            }}
          />

          <h1
            style={{
              position: "relative",
              fontSize: "clamp(2.2rem, 7vw, 4.5rem)",
              fontWeight: 700,
              letterSpacing: "0.01em",
              margin: 0,
              whiteSpace: "nowrap",
            }}
          >
            {displayChars.map((ch, i) => {
              const isWhite = i < wordA.length;
              return (
                <span
                  key={i}
                  style={{
                    color: isWhite ? "#F1C712" : accentColor,
                  }}
                >
                  {ch}
                </span>
              );
            })}
            <span
              style={{
                display: "inline-block",
                width: "0.42em",
                height: "0.72em",
                background: accentColor,
                boxShadow: `0 0 18px ${accentColor}cc`,
                marginLeft: "0.06em",
                verticalAlign: "-0.08em",
                opacity: cursorVisible ? 1 : 0,
                animation: cursorVisible
                  ? "slp-blink 0.35s steps(1) infinite"
                  : "none",
              }}
            />
          </h1>

          {/* small status line — swap for a real progress % if you have one */}

          <style>{`
            @keyframes slp-ripple {
              0%   { transform: translateY(0) scale(1); }
              50%  { transform: translateY(-2%) scale(1.03); }
              100% { transform: translateY(0) scale(1); }
            }
            @keyframes slp-blink {
              0%, 49%  { opacity: 1; }
              50%, 100% { opacity: 0; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

/* -----------------------------------------------------------------------
   Demo page content, shown once loading finishes. Delete this and pass
   your real app/page as children instead:

     <ScrambleLoadingPage minDuration={2000}>
       <App />
     </ScrambleLoadingPage>
----------------------------------------------------------------------- */
 
 
