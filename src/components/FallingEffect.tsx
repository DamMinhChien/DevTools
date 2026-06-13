import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Lấy danh sách icon từ env, fallback về lá mùa thu
const RAW_EMOJIS = import.meta.env.VITE_FALLING_EMOJIS || "🍂,🍁,🍄";
const EMOJIS: string[] = RAW_EMOJIS.split(",").map((e: string) => e.trim()).filter(Boolean);

const SPAWN_INTERVAL_MS = 800; // Tốc độ sinh icon (ms)
const MAX_ICONS = 20; // Số lượng tối đa trên màn hình

interface FallingIcon {
  id: number;
  emoji: string;
  x: number;       // % theo chiều ngang
  size: number;    // px
  duration: number; // giây để rơi hết màn hình
  delay: number;   // delay ban đầu
  rotation: number; // xoay ban đầu
  rotationEnd: number;
  speedMultiplier: number; // 1 = bình thường, 3 = được click
}

let nextId = 0;

function createIcon(speedMult = 1): FallingIcon {
  const size = 18 + Math.random() * 32; // 18px - 50px (random)
  const baseDuration = 5 + Math.random() * 5; // 5-10 giây
  return {
    id: nextId++,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    x: Math.random() * 96, // 0-96%
    size,
    duration: baseDuration / speedMult,
    delay: 0,
    rotation: Math.random() * 30 - 15,
    rotationEnd: Math.random() * 120 - 60,
    speedMultiplier: speedMult,
  };
}

interface FallingEffectProps {
  active: boolean;
}

export default function FallingEffect({ active }: FallingEffectProps) {
  const [icons, setIcons] = useState<FallingIcon[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Spawn icon mới liên tục khi active
  useEffect(() => {
    if (active) {
      // Spawn ngay vài cái đầu tiên
      setIcons(Array.from({ length: 5 }, () => ({ ...createIcon(), delay: Math.random() * 2 })));

      intervalRef.current = setInterval(() => {
        setIcons((prev) => {
          if (prev.length >= MAX_ICONS) return prev;
          return [...prev, createIcon()];
        });
      }, SPAWN_INTERVAL_MS);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIcons([]);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active]);

  const handleIconClick = useCallback((id: number) => {
    setIcons((prev) =>
      prev.map((icon) =>
        icon.id === id
          ? { ...icon, duration: icon.duration / 3, speedMultiplier: icon.speedMultiplier * 3 }
          : icon
      )
    );
  }, []);

  const handleAnimationComplete = useCallback((id: number) => {
    setIcons((prev) => prev.filter((icon) => icon.id !== id));
  }, []);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {icons.map((icon) => (
          <motion.div
            key={icon.id}
            initial={{ y: -80, x: `${icon.x}vw`, rotate: icon.rotation, opacity: 1 }}
            animate={{ y: "110vh", rotate: icon.rotationEnd, opacity: 0.85 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: icon.duration,
              delay: icon.delay,
              ease: "linear",
            }}
            onAnimationComplete={() => handleAnimationComplete(icon.id)}
            onClick={(e) => {
              e.stopPropagation();
              handleIconClick(icon.id);
            }}
            className="absolute top-0 select-none pointer-events-auto cursor-pointer"
            style={{ fontSize: icon.size, left: 0, top: 0, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}
          >
            {icon.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
