import React, { useState, useEffect, useRef, useCallback } from "react";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";

// Persistent first-party anonymous visitor identifier (stored in localStorage & 2-year cookie)
function getOrCreateVisitorId(): string {
  const KEY = "portfolio_vid";
  let vid: string | null = null;

  // 1. Check localStorage
  try {
    vid = localStorage.getItem(KEY);
  } catch {}

  // 2. Check Cookie if localStorage was empty or cleared
  if (!vid) {
    try {
      const match = document.cookie.match(new RegExp(`(?:^|; )${KEY}=([^;]*)`));
      if (match) vid = decodeURIComponent(match[1]);
    } catch {}
  }

  // 3. Generate anonymous random ID if newly visiting
  if (!vid || typeof vid !== "string" || vid.length < 10) {
    const randomPart =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID().replace(/-/g, "")
        : Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    vid = `usr_${randomPart}`;
  }

  // 4. Persist in both localStorage and Cookie (2-year lifetime)
  try {
    localStorage.setItem(KEY, vid);
  } catch {}
  try {
    document.cookie = `${KEY}=${encodeURIComponent(vid)}; path=/; max-age=63072000; SameSite=Lax`;
  } catch {}

  return vid;
}

// Custom animated counter hook for smooth number transition
function useAnimatedCounter(targetValue: number | null, duration: number = 1000): number | null {
  const [displayValue, setDisplayValue] = useState<number | null>(null);
  const startValueRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (targetValue === null) {
      return;
    }

    if (displayValue === null) {
      // First value received - animate up smoothly from 0 to target
      const start = 0;
      startValueRef.current = start;
      const startTime = performance.now();
      startTimeRef.current = startTime;

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (targetValue - start) * ease);
        setDisplayValue(current);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayValue(targetValue);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    } else if (displayValue !== targetValue) {
      // Value updated (e.g. on 15s refresh) - animate smoothly from previous count
      const start = displayValue;
      startValueRef.current = start;
      const startTime = performance.now();
      const updateDuration = 500;

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / updateDuration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (targetValue - start) * ease);
        setDisplayValue(current);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayValue(targetValue);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetValue, duration, displayValue]);

  return displayValue;
}

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const hasInitiatedRef = useRef(false);
  const animatedCount = useAnimatedCounter(count);

  const fetchCurrentCount = useCallback(async () => {
    try {
      const res = await fetch("/api/visits", {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        // Fallback check to /api/visitors if needed
        const fallbackRes = await fetch("/api/visitors", {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          if (typeof fallbackData.totalVisits === "number") {
            setCount(fallbackData.totalVisits);
          }
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (typeof data.totalVisits === "number") {
        setCount(data.totalVisits);
      }
    } catch {
      // In dev mode or temporary network drop, retain current count gracefully
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registerVisitorAndFetch = useCallback(async () => {
    try {
      const visitorId = getOrCreateVisitorId();
      const res = await fetch("/api/visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ visitorId }),
      });

      if (!res.ok) {
        // Fallback to /api/visitors
        const fallbackRes = await fetch("/api/visitors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ visitorId }),
        });
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          if (typeof fallbackData.totalVisits === "number") {
            setCount(fallbackData.totalVisits);
          }
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      if (typeof data.totalVisits === "number") {
        setCount(data.totalVisits);
      }
    } catch {
      // Fallback to GET if POST encounters an issue
      await fetchCurrentCount();
    } finally {
      setIsLoading(false);
    }
  }, [fetchCurrentCount]);

  useEffect(() => {
    // Prevent React 18 StrictMode double-call in development
    if (!hasInitiatedRef.current) {
      hasInitiatedRef.current = true;
      registerVisitorAndFetch();
    }

    // Auto-refresh counter every 15 seconds (read-only GET)
    const intervalId = setInterval(() => {
      if (!document.hidden) {
        fetchCurrentCount();
      }
    }, 15000);

    // Refresh count when user switches back to this tab
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchCurrentCount();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchCurrentCount, registerVisitorAndFetch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "8px auto 4px",
      }}
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 11,
          padding: "6px 14px",
          borderRadius: 9999,
          background: isHovered
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(255, 255, 255, 0.03)",
          border: `1px solid ${
            isHovered ? "rgba(0, 245, 255, 0.4)" : "rgba(255, 255, 255, 0.12)"
          }`,
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: isHovered
            ? "0 4px 24px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 245, 255, 0.15)"
            : "0 2px 14px rgba(0, 0, 0, 0.3), 0 0 12px rgba(0, 245, 255, 0.05)",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: isHovered ? "translateY(-1px)" : "translateY(0)",
          userSelect: "none",
        }}
      >
        {/* Glowing Live Indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              position: "relative",
              display: "flex",
              width: 7,
              height: 7,
            }}
          >
            <span
              className="animate-ping"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "#10B981",
                opacity: 0.75,
              }}
            />
            <span
              style={{
                position: "relative",
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#10B981",
                boxShadow: "0 0 8px #10B981, 0 0 14px rgba(16, 185, 129, 0.45)",
              }}
            />
          </span>
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "1.5px",
              color: "#10B981",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            LIVE
          </span>
        </div>

        {/* Subtle Vertical Divider */}
        <div
          style={{
            width: 1,
            height: 12,
            background: "rgba(255, 255, 255, 0.18)",
          }}
        />

        {/* Eye Icon & Count Data */}
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Eye
            size={14}
            style={{
              color: "#00F5FF",
              filter: isHovered
                ? "drop-shadow(0 0 6px rgba(0, 245, 255, 0.7))"
                : "drop-shadow(0 0 3px rgba(0, 245, 255, 0.3))",
              transition: "filter 0.3s ease",
            }}
          />

          {isLoading && count === null ? (
            <div
              className="animate-pulse"
              style={{
                width: 38,
                height: 14,
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.15)",
              }}
            />
          ) : (
            <span
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "0.5px",
                fontVariantNumeric: "tabular-nums",
                display: "inline-block",
                textShadow: isHovered
                  ? "0 0 12px rgba(0, 245, 255, 0.6), 0 0 20px rgba(0, 245, 255, 0.3)"
                  : "0 0 8px rgba(0, 245, 255, 0.25)",
                transition: "text-shadow 0.3s ease",
              }}
            >
              {typeof count === "number"
                ? (animatedCount !== null ? animatedCount.toLocaleString() : count.toLocaleString())
                : "0"}
            </span>
          )}

          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 11,
              fontWeight: 500,
              color: isHovered ? "#ffffff" : "rgba(255, 255, 255, 0.85)",
              letterSpacing: "0.3px",
              transition: "color 0.3s ease",
            }}
          >
            Total Portfolio Views
          </span>
        </div>
      </div>
    </motion.div>
  );
}
