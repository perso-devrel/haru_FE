import type { ReactNode } from 'react';

/**
 * Reusable iPhone-style mockup frame. Children render inside the screen at
 * 320×640 (1:2 aspect), the same proportions as the real device target so
 * landing-page mockups visually transfer to actual app screenshots later
 * without reflow. The notch + soft glow are CSS-only — no image assets.
 */
export default function PhoneFrame({
  children,
  className = '',
  withGlow = true,
}: {
  children: ReactNode;
  className?: string;
  withGlow?: boolean;
}) {
  return (
    <div className={`relative ${className}`}>
      {withGlow && <span className="aura" aria-hidden />}
      <div className="relative mx-auto w-[320px] rounded-[44px] bg-[#1B0E22] p-2 shadow-glow ring-1 ring-black/10">
        <div className="relative h-[640px] w-full overflow-hidden rounded-[36px] bg-[color:var(--color-bg)]">
          {/* Notch */}
          <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-[#1B0E22]" />
          {children}
        </div>
      </div>
    </div>
  );
}
