'use client';

interface EasyAcreLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function EasyAcreLogo({ className = '', size = 36, showText = false }: EasyAcreLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="flex items-center justify-center rounded-lg bg-white/10 border border-white/10 shrink-0 overflow-hidden"
        style={{ width: size, height: size }}
      >
        <img
          src="/easyacre-logo.svg"
          alt="EasyAcre"
          className="w-full h-full object-contain p-1"
          width={size}
          height={size}
        />
      </div>
      {showText && (
        <div className="text-left">
          <span className="text-lg font-extrabold tracking-tight text-white leading-none">
            EasyAcre
          </span>
          {/* <p className="text-[9px] text-white/40 tracking-wide">City Property, Simplified</p> */}
        </div>
      )}
    </div>
  );
}
