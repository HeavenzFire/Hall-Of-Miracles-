
import React, { useState } from 'react';
import { MiracleType, Miracle } from './types';
import Dashboard from './components/Dashboard';
import TheOracle from './components/TheOracle';
import TheVanguardProtocol from './components/TheVanguardProtocol';

const MIRACLES: Miracle[] = [
  {
    id: MiracleType.REGISTRY,
    title: 'Legion Registry',
    description: 'Proof-of-Contribution Reveal (PCR) Hub.',
    icon: '📊',
    color: 'from-emerald-900 to-black'
  },
  {
    id: MiracleType.VANGUARD_PROTOCOL,
    title: 'Vanguard Protocol',
    description: 'Operational Systems & Sovereign Frameworks.',
    icon: '⚙️',
    color: 'from-gray-900 to-black'
  },
  {
    id: MiracleType.ORACLE,
    title: 'System Architect',
    description: 'Witness of Truth & Operational Precision.',
    icon: '✨',
    color: 'from-indigo-950 to-black'
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
      default:
        return (
          <div className="flex flex-col items-center gap-12 w-full animate-in fade-in duration-700">
            <div className="text-center space-y-2">
              <h1 className="text-6xl font-mystical font-bold tracking-[0.3em] text-white uppercase italic">Sovereign Node</h1>
              <p className="text-[10px] tracking-[1em] text-emerald-500/60 font-black uppercase">Established 2025.12.30</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-12">
              {MIRACLES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMiracle(m.id)}
                  className={`glass group p-10 rounded-[3rem] border-white/5 hover:border-emerald-500/20 transition-all text-left bg-gradient-to-br ${m.color}`}
                >
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{m.icon}</div>
                  <h3 className="text-xl font-mystical font-bold text-white mb-2 uppercase tracking-widest">{m.title}</h3>
                  <p className="text-[10px] text-white/40 font-bold uppercase leading-relaxed">{m.description}</p>
                </button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-gray-100 flex flex-col items-center selection:bg-emerald-500/40 overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-50 border-[1px] border-emerald-500/5 m-4 rounded-[4rem]"></div>

      <header className="w-full max-w-7xl p-12 flex justify-between items-center z-20 relative">
        <div 
          className="group flex items-center gap-6 cursor-pointer"
          onClick={() => setActiveMiracle(null)}
        >
          <div className="w-12 h-12 border border-emerald-500/20 rounded-xl flex items-center justify-center font-mystical text-xl bg-black">
            Λ
          </div>
          <h1 className="text-xl font-mystical font-bold tracking-[0.4em] text-white uppercase italic">
            Legion.Registry
          </h1>
        </div>
        
        {activeMiracle && (
          <button 
            onClick={() => setActiveMiracle(null)}
            className="px-8 py-3 glass hover:bg-white/5 rounded-full transition-all text-[10px] font-black tracking-[0.4em] uppercase border-emerald-500/10"
          >
            Terminal Reset
          </button>
        )}
      </header>

      <main className="w-full max-w-7xl px-12 pb-24 z-10 flex-grow flex flex-col items-center relative">
        {renderActiveMiracle()}
      </main>

      <footer className="w-full p-12 text-center opacity-20">
        <p className="text-[9px] font-black tracking-[0.8em] uppercase">No myth. Only output.</p>
      </footer>
    </div>
  );
};

export default App;
