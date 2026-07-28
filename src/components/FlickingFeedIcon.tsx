"use client";

type FlickingFeedIconProps = {
  width?: number;
  height?: number;
  className?: string;
};

const FRAMES = Array.from({ length: 6 });

export default function FlickingFeedIcon({
  width = 60,
  height = 120,
  className,
}: FlickingFeedIconProps) {
  const gap = Math.max(8, Math.round(height * 0.1));
  const itemHeight = height;

  return (
    <div
      className={className}
      aria-hidden
      style={{
        width,
        height,
        overflow: "hidden",
        position: "relative",
        display: "inline-block",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap,
          animation: "feedFlick 3000ms cubic-bezier(0.3, 0.08, 0.22, 1) infinite",
          willChange: "transform",
        }}
      >
        {FRAMES.map((_, index) => (
          <div
            key={index}
            style={{
              width: "100%",
              height: itemHeight,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: Math.max(2, Math.round(height * 0.02)),
            }}
          >
            

            <span
              style={{
                width: "86%",
                height: "70%",
                borderRadius: Math.max(8, Math.round(width * 0.12)),
                background: "rgba(255,255,255,0.88)",
                display: "block",
              }}
            />

          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes feedFlick {
          0% {
            transform: translateY(0) ;
          }
          20% {
            transform: translateY(0) ;
          }
          28% {
            transform: translateY(calc(-1 * (${itemHeight}px + ${gap}px)));
          }
          52% {
            transform: translateY(calc(-1 * (${itemHeight}px + ${gap}px)));
          }
          60% {
            transform: translateY(calc(-2 * (${itemHeight}px + ${gap}px)));
          }
          84% {
            transform: translateY(calc(-2 * (${itemHeight}px + ${gap}px)));
          }
          92% {
            transform: translateY(calc(-3 * (${itemHeight}px + ${gap}px)));
          }
          100% {
            transform: translateY(calc(-3 * (${itemHeight}px + ${gap}px)));
          }
        }
      `}</style>
    </div>
  );
}
