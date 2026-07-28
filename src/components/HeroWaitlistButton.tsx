"use client";

type HeroWaitlistButtonProps = {
  reveal: number;
  isMobile: boolean;
};

export default function HeroWaitlistButton({
  reveal,
  isMobile,
}: HeroWaitlistButtonProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: isMobile ? "clamp(20px, 4vh, 36px)" : "clamp(28px, 5vh, 48px)",
        zIndex: 30,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        opacity: reveal,
        filter: `blur(${(1 - reveal) * 10}px)`,
        transform: `translateY(${(1 - reveal) * 28}px)`,
        transition: `
          opacity 900ms cubic-bezier(0.22, 1, 0.36, 1),
          transform 900ms cubic-bezier(0.22, 1, 0.36, 1),
          filter 900ms cubic-bezier(0.22, 1, 0.36, 1)
        `,
      }}
    >
      <button
        type="button"
        style={{
          pointerEvents: reveal > 0 ? "auto" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: isMobile ? 14 : 18,
          margin: 0,
          border: "none",
          cursor: "pointer",
          borderRadius: 20,
          padding: isMobile ? "8px 10px 8px 10px" : "10px 12px 10px 12px",
          background: "#fff",
          boxShadow: `
            0 18px 40px rgba(0, 0, 0, 0.28),
            0 2px 8px rgba(0, 0, 0, 0.12)
          `,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
            padding: isMobile ? "14px 28px" : "16px 36px",
            background: "linear-gradient(180deg, #5B6FE8 0%, #3A4FD4 100%)",
            color: "#fff",
            fontSize: isMobile ? 16 : 18,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
          }}
        >
          Join the waitlist
        </span>

        <span
          aria-hidden
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: isMobile ? 28 : 32,
            height: isMobile ? 28 : 32,
            marginRight: isMobile ? 6 : 8,
            color: "#1A1A1A",
            flexShrink: 0,
          }}
        >
          <svg
            width={isMobile ? 22 : 24}
            height={isMobile ? 22 : 24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12h12.5M13 6.5 18.5 12 13 17.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
    </div>
  );
}
