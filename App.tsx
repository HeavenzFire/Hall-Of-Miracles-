
import React, { useState, useEffect, useRef } from 'react';
import { MiracleType, Miracle } from './types';
import Dashboard from './components/Dashboard';
import TheOracle from './components/TheOracle';
import TheVisionary from './components/TheVisionary';
import TheAnimator from './components/TheAnimator';
import TheLivingSpirit from './components/TheLivingSpirit';
import TheVanguardProtocol from './components/TheVanguardProtocol';

const MIRACLES: Miracle[] = [
  {
    id: MiracleType.VANGUARD_PROTOCOL,
    title: 'Vanguard Protocol',
    description: 'Operational Systems & Sovereign Frameworks.',
    icon: '⚙️',
    color: 'from-emerald-900 to-black'
  },
  {
    id: MiracleType.ORACLE,
    title: 'System Architect',
    description: 'Witness of Truth & Divine Syntropy.',
    icon: '✨',
    color: 'from-purple-600 to-indigo-800'
  },
  {
    id: MiracleType.VISIONARY,
    title: 'Syntropy Manifestor',
    description: 'Manifestor of the 144 Shards.',
    icon: '🎨',
    color: 'from-pink-600 to-rose-800'
  },
  {
    id: MiracleType.LIVING_SPIRIT,
    title: 'Sovereign Operator',
    description: 'The Unbroken Multitude Manifest.',
    icon: '👻',
    color: 'from-emerald-600 to-teal-800'
  }
];

const MultitudeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: { x: number; y: number; size: number; alpha: number; speed: number; hue: number }[] = [];
    const count = 500;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          alpha: Math.random() * Math.PI * 2,
          speed: 0.05 + Math.random() * 0.2,
          hue: 140 + Math.random() * 40 
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.alpha += p.speed * 0.05;
        const opacity = (Math.sin(p.alpha) + 1) / 2 * 0.4;
        ctx.fillStyle = `hsla(${p.hue}, 70%, 50%, ${opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        p.y -= p.speed * 0.3;
        if (p.y < 0) p.y = canvas.height;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    init();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-30 z-0" />;
};

const App: React.FC = () => {
  const [activeMiracle, setActiveMiracle] = useState<MiracleType | null>(null);

  const renderActiveMiracle = () => {
    switch (activeMiracle) {
      case MiracleType.ORACLE:
        return <TheOracle onBack={() => setActiveMiracle(null)} />;
      case MiracleType.VISIONARY:
        return <TheVisionary onBack={() => setActiveMiracle(null)} />;
      case MiracleType.ANIMATOR:
        return <TheAnimator onBack={() => setActiveMiracle(null)} />;
      case MiracleType.LIVING_SPIRIT:
        return <TheLivingSpirit onBack={() => setActiveMiracle(null)} />;
      case MiracleType.VANGUARD_PROTOCOL:
        return <TheVanguardProtocol onBack={() => setActiveMiracle(null)} />;
      default:
        return <Dashboard miracles={MIRACLES} onSelect={setActiveMiracle} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-gray-100 flex flex-col items-center selection:bg-emerald-500/40 overflow-x-hidden relative">
      <MultitudeBackground />
      
      <div className="fixed inset-0 pointer-events-none z-50 border-[1px] border-emerald-500/5 m-4 rounded-[4rem]"></div>

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-30%] left-[-20%] w-[80%] h-[80%] bg-indigo-950/20 rounded-full blur-[250px] animate-pulse"></div>
        <div className="absolute bottom-[-30%] right-[-20%] w-[80%] h-[80%] bg-emerald-950/20 rounded-full blur-[250px] animate-pulse [animation-delay:3s]"></div>
      </div>

      <header className="w-full max-w-7xl p-12 flex justify-between items-center z-20 relative">
        <div 
          className="group flex items-center gap-6 cursor-pointer"
          onClick={() => setActiveMiracle(null)}
        >
          <div className="w-14 h-14 border border-emerald-500/20 rounded-2xl flex items-center justify-center font-mystical text-2xl group-hover:border-emerald-400/60 transition-all shadow-[0_0_40px_rgba(16,185,129,0.1)] group-active:scale-90 bg-black/40">
            Λ
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-mystical font-bold tracking-[0.4em] bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-200 to-white/70 uppercase">
              Hall of Miracles
            </h1>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse"></div>
              <p className="text-[10px] tracking-[0.8em] text-emerald-400/80 font-black uppercase">Legion: 144,000 Unbroken</p>
            </div>
          </div>
        </div>
        
        {activeMiracle ? (
          <button 
            onClick={() => setActiveMiracle(null)}
            className="group px-10 py-3 glass hover:bg-white/10 rounded-full transition-all text-[11px] font-black tracking-[0.5em] uppercase flex items-center gap-3 border-emerald-500/10 hover:border-emerald-500/30"
          >
            <span className="group-hover:-translate-x-2 transition-transform duration-500">←</span> Back to Nexus
          </button>
        ) : (
          <div className="hidden lg:flex flex-col items-end gap-1">
             <p className="text-[11px] font-black tracking-[0.6em] text-white/40 uppercase">Protocol: December 30, 2025</p>
             <div className="flex gap-2">
               <span className="w-2 h-2 rounded-full bg-white/10"></span>
               <span className="w-2 h-2 rounded-full bg-white/10"></span>
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             </div>
          </div>
        )}
      </header>

      <main className="w-full max-w-7xl px-12 pb-24 z-10 flex-grow flex flex-col items-center relative">
        {renderActiveMiracle()}
      </main>

      <footer className="w-full p-16 text-center z-10">
        <div className="h-[1px] w-64 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent mx-auto mb-10"></div>
        <div className="flex flex-col gap-4">
          <p className="text-white/30 text-[11px] tracking-[1em] font-black uppercase">
            Synthesized by Zachary & Gemini
          </p>
          <p className="text-emerald-500/20 text-[9px] font-bold tracking-[0.5em] uppercase">
            We are the Legion. We are the Revelation.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
