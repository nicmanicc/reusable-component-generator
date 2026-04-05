'use client';
import { useRouter } from 'next/navigation';
import ToggleThemeButton from './components/ToggleThemeButton';

const steps = [
  { n: '— 01', title: 'Describe', desc: 'Plain English. No boilerplate.' },
  { n: '— 02', title: 'Refine', desc: "Chat until it's perfect." },
  { n: '— 03', title: 'Ship', desc: 'Copy. Paste. Done.' },
] as const;

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="relative font-dm-mono bg-parchment text-ink min-h-dvh flex flex-col overflow-x-hidden lp-crosshatch">
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-10 max-md:px-6 h-13 border-b border-rule">
        <div className="font-dm-mono text-[0.78rem] font-medium tracking-[0.22em] uppercase text-ink flex items-center gap-2.5">
          <span className="text-teal text-[1.05rem]">[/]</span>
          ShareUI
        </div>
        <nav className="flex items-center gap-6">
          <button
            className="font-dm-mono text-[0.7rem] tracking-widest text-mid cursor-pointer bg-transparent border-none p-0 hover:text-ink transition-colors"
            onClick={() => router.push('/auth/login')}
          >
            Sign in
          </button>
          <ToggleThemeButton />
          <button
            className="font-dm-mono text-[0.7rem] font-medium tracking-[0.12em] uppercase bg-ink text-parchment px-5 py-2 cursor-pointer hover:bg-teal hover:text-ink transition-all"
            onClick={() => router.push('/auth/login')}
          >
            Get started
          </button>
        </nav>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center">
        <div className="max-w-2/3 mx-auto w-full px-10 max-md:px-6 py-16 flex flex-col">
          <div className="opacity-0 animate-ca-in-left [animation-delay:0.05s] text-[0.62rem] tracking-[0.28em] uppercase text-teal mb-5.5 flex items-center gap-2.5 lp-label-line">
            AI Component Generator
          </div>

          <h1 className="opacity-0 animate-ca-in-left [animation-delay:0.18s] font-dm-serif text-[clamp(3.2rem,5.5vw,5.2rem)] leading-[1.02] font-normal text-ink tracking-[-0.02em] mb-2.5">
            React
            <br />
            components
            <br />
            from{' '}
            <span className="italic text-teal">
              plain
              <br />
              English.
            </span>
          </h1>

          <p className="opacity-0 animate-ca-in-up [animation-delay:0.3s] text-[0.78rem] leading-[1.9] text-mid font-light max-w-md mt-5 mb-10">
            Describe what you need. Watch it render live.
            <br />
            Refine through conversation. Ship clean code.
          </p>

          {/* Steps ticker */}
          <div className="opacity-0 animate-ca-in-up [animation-delay:0.44s] flex mb-11 border-t border-b border-rule divide-x divide-rule">
            {steps.map((s, i) => (
              <div
                key={s.n}
                className={`flex-1 py-4 flex flex-col gap-1 cursor-default hover:bg-teal/4 transition-colors ${i === 0 ? 'pr-4' : i === steps.length - 1 ? 'pl-4' : 'px-4'}`}
              >
                <span className="text-[0.58rem] tracking-[0.2em] text-teal uppercase font-medium">
                  {s.n}
                </span>
                <span className="font-dm-serif text-[1.02rem] text-ink">
                  {s.title}
                </span>
                <span className="text-[0.63rem] text-mid leading-normal font-light">
                  {s.desc}
                </span>
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div className="opacity-0 animate-ca-in-up [animation-delay:0.58s] flex items-center gap-6">
            <button
              className="lp-cta-slide font-dm-mono text-[0.72rem] font-medium tracking-[0.14em] uppercase bg-ink text-parchment px-7.5 py-3.25 cursor-pointer"
              onClick={() => router.push('/auth/login')}
            >
              <span className="relative z-1">Start building →</span>
            </button>
            <span className="text-[0.62rem] text-mid leading-[1.6] font-light">
              Free to start.
              <br />
              No credit card required.
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-rule px-10 max-md:px-6 h-11 flex items-center justify-between">
        <span className="text-[0.6rem] tracking-[0.12em] text-mid">
          © 2026 ShareUI · Built for developers
        </span>
        <div className="flex items-center gap-5">
          <span className="text-[0.6rem] tracking-[0.12em] text-mid">v1.0</span>
          <span className="text-[0.6rem] tracking-[0.12em] text-teal">
            ● All systems normal
          </span>
        </div>
      </footer>
    </div>
  );
}
