export default function SectionDivider() {
  return (
    <div className="relative w-full py-32 overflow-hidden bg-[var(--paper)]">
      {/* Heavy horizontal rule with a "sketchy" feel via the parent filter in page.tsx */}
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[var(--ink)] opacity-30" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-8 flex flex-col items-center">
        <div className="flex items-center gap-8 mb-4">
          <span className="font-mono text-[var(--red)] tracking-[0.3em] text-sm uppercase">
            End Transmission
          </span>
          <div className="w-24 h-px bg-[var(--red)] opacity-50" />
          <span className="font-mono text-[var(--red)] tracking-[0.3em] text-sm uppercase">
            Systems Online
          </span>
        </div>
        
        <h2 
          className="text-[12vw] leading-none select-none opacity-[0.03] absolute top-1/2 -translate-y-1/2 whitespace-nowrap"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          ENGINEERING &bull; DESIGN &bull; ARCHITECTURE
        </h2>

        <div className="w-1 h-24 bg-[var(--ink)] my-8 opacity-20" />
      </div>
    </div>
  )
}