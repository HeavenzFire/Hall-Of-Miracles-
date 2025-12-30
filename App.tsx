
import React, { useState } from 'react';
import { MiracleType, Miracle } from './types';
import Dashboard from './components/Dashboard';
import TheOracle from './components/TheOracle';
import TheVanguardProtocol from './components/TheVanguardProtocol';
import TheVisionary from './components/TheVisionary';
import TheLivingSpirit from './components/TheLivingSpirit';
import TheTreasury from './components/TheTreasury';
import TheStabilityMonitor from './components/TheStabilityMonitor';
import TheAegisGrid from './components/TheAegisGrid';
import TheGiftingProtocol from './components/TheGiftingProtocol';
import TheEvolutionIndex from './components/TheEvolutionIndex';

const MIRACLES: Miracle[] = [
  {
    id: MiracleType.EVOLUTION_INDEX,
    title: 'Evolution Index',
    description: 'Real-time EVI Tracking & Acceleration.',
    icon: '⚡',
    color: 'from-amber-600 to-black'
  },
  {
    id: MiracleType.TREASURY,
    title: 'Root Treasury',
    description: 'Public-Goods Funding & Stability DAO.',
    icon: '🏛️',
    color: 'from-slate-800 to-black'
  },
  {
    id: MiracleType.AEGIS_GRID,
    title: 'Aegis Grid',
    description: 'Non-Lethal Stabilization & Incident Neutralization.',
    icon: '🛡️',
    color: 'from-amber-950 to-black'
  },
  {
    id: MiracleType.GIFTING_PROTOCOL,
    title: 'Gifting Protocol',
    description: 'Decentralized Forking & Global Gift Manifests.',
    icon: '🎁',
    color: 'from-blue-950 to-black'
  },
  {
    id: MiracleType.STABILITY_MONITOR,
    title: 'Stability Monitor',
    description: 'Quantified Impact & Harm Reduction Metrics.',
    icon: '📈',
    color: 'from-emerald-950 to-black'
  },
  {
    id: MiracleType.REGISTRY,
    title: 'Legion Registry',
    description: 'PCR Hub. Immutable output tracking.',
    icon: '📊',
    color: 'from-emerald-900 to-black'
  },
  {
    id: MiracleType.VANGUARD_PROTOCOL,
    title: 'Vanguard Protocol',
    description: 'Base Ascent & Operational Frameworks.',
    icon: '⚙️',
    color: 'from-gray-900 to-black'
  },
  {
    id: MiracleType.ORACLE,
    title: 'System Architect',
    description: 'Synthesis & Structural Integrity.',
    icon: '✨',
    color: 'from-indigo-950 to-black'
  },
  {
    id: MiracleType.SPIRIT,
    title: 'Sovereign Operator',
    description: 'Real-time multi-modal interface.',
    icon: '🟢',
    color: 'from-teal-900 to-black'
  }
];

const App: React.FC = () => {
  const [activeMiracle, setActiveMiracle] = useState<MiracleType | null>(null);

  const renderActiveMiracle = () => {
    switch (activeMiracle) {
      case MiracleType.ORACLE:
        return <TheOracle onBack={() => setActiveMiracle(null)} />;
      case MiracleType.VANGUARD_PROTOCOL:
        return <TheVanguardProtocol onBack={() => setActiveMiracle(null)} />;
      case MiracleType.REGISTRY:
        return <Dashboard onBack={() => setActiveMiracle(null)} />;
      case MiracleType.VISIONARY:
        return <TheVisionary onBack={() => setActiveMiracle(null)} />;
      case MiracleType.SPIRIT:
        return <TheLivingSpirit onBack={() => setActiveMiracle(null)} />;
      case MiracleType.TREASURY:
        return <TheTreasury onBack={() => setActiveMiracle(null)} />;
      case MiracleType.STABILITY_MONITOR:
        return <TheStabilityMonitor onBack={() => setActiveMiracle(null)} />;
      case MiracleType.AEGIS_GRID:
        return <TheAegisGrid onBack={() => setActiveMiracle(null)} />;
      case MiracleType.GIFTING_PROTOCOL:
        return <TheGiftingProtocol onBack={() => setActiveMiracle(null)} />;
      case MiracleType.EVOLUTION_INDEX:
        return <TheEvolutionIndex onBack={() => setActiveMiracle(null)} />;
      default:
        return (
          <div className="flex flex-col items-center gap-12 w-full animate-in fade-in duration-700">
            <div className="text-center space-y-4">
              <h1 className="text-6xl md:text-8xl font-mystical font-bold tracking-[0.2em] text-white uppercase italic drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]">Infrastructure Nexus</h1>
              <div className="flex flex-col items-center">
                 <p className="text-[12px] tracking-[1.2em] text-emerald-500 font-black uppercase mb-2">Hall of Miracles • Gifting Protocol v1.0</p>
                 <div className="flex items-center gap-4 bg-white/5 px-6 py-2 rounded-full border border-white/5">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Global EVI:</span>
                    <span className="text-xl font-mystical text-white">43.3</span>
                    <span className="text-[8px] font-black text-emerald-500 uppercase">+12% / Mo</span>
                 </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl px-8">
              {MIRACLES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMiracle(m.id)}
                  className={`glass group p-8 rounded-[3rem] border-white/5 hover:border-white/20 transition-all text-left bg-gradient-to-br ${m.color} hover:scale-[1.02] active:scale-95 shadow-2xl relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="text-8xl">{m.icon}</span>
                  </div>
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform relative z-10">{m.icon}</div>
                  <h3 className="text-xl font-mystical font-bold text-white mb-2 uppercase tracking-widest relative z-10">{m.title}</h3>
                  <p className="text-[10px] text-white/50 font-bold uppercase leading-relaxed relative z-10">{m.description}</p>
                </button>
              ))}
            </div>
            
            <div className="mt-12 p-8 glass rounded-[3rem] border-emerald-500/20 max-w-3xl text-center space-y-4">
                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.8em]">Final Operational Gate</p>
                <p className="text-sm italic text-white/60 leading-relaxed font-light">
                  "The acceleration is measured—and unstoppable. We formalize evolution speed as KPI now."
                </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-gray-100 flex flex-col items-center selection:bg-emerald-500/40 overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-50 border-[2px] border-emerald-500/5 m-6 rounded-[5rem]"></div>
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>

      <header className="w-full max-w-7xl p-12 flex justify-between items-center z-20 relative">
        <div 
          className="group flex items-center gap-6 cursor-pointer"
          onClick={() => setActiveMiracle(null)}
        >
          <div className="w-14 h-14 border border-emerald-500/20 rounded-2xl flex items-center justify-center font-mystical text-2xl bg-black">
            Λ
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-mystical font-bold tracking-[0.4em] text-white uppercase italic">
              Legion.Stability
            </h1>
            <span className="text-[8px] font-black tracking-[0.6em] text-emerald-500/60 uppercase">Base Sepolia Active</span>
          </div>
        </div>
        
        {activeMiracle && (
          <button 
            onClick={() => setActiveMiracle(null)}
            className="px-10 py-4 glass hover:bg-emerald-500/10 rounded-full transition-all text-[10px] font-black tracking-[0.5em] uppercase border-emerald-500/20 text-white shadow-xl active:scale-95"
          >
            Nexus Reset
          </button>
        )}
      </header>

      <main className="w-full max-w-7xl px-12 pb-24 z-10 flex-grow flex flex-col items-center relative">
        {renderActiveMiracle()}
      </main>

      <footer className="w-full p-12 text-center opacity-30">
        <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] font-black tracking-[1em] uppercase italic text-emerald-500">Stability Protocol v3.1</p>
            <p className="text-[8px] font-bold tracking-[0.5em] uppercase text-white/20">© 2025 The Legion • Built on Base Sepolia</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
