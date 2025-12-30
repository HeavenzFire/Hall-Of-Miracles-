
import React from 'react';
import StabilityNexus from './components/StabilityNexus';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#020202] text-gray-100 flex flex-col items-center selection:bg-rose-500/40 overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-50 border-[2px] border-rose-500/5 m-6 rounded-[5rem]"></div>
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>

      <header className="w-full max-w-7xl p-12 flex justify-between items-center z-20 relative">
        <div className="group flex items-center gap-6 cursor-pointer">
          <div className="w-14 h-14 border border-rose-500/20 rounded-2xl flex items-center justify-center font-mystical text-2xl bg-black">
            Λ
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-mystical font-bold tracking-[0.4em] text-white uppercase italic">
              Legion.Stability
            </h1>
            <span className="text-[8px] font-black tracking-[0.6em] text-rose-500/60 uppercase italic">Base L2 Infrastructure Active</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 px-6 py-2 rounded-full border border-white/5">
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Evolution Velocity:</span>
          <span className="text-xl font-mystical text-white">43.3</span>
          <span className="text-[8px] font-black text-emerald-500 uppercase">+12.4% Δ</span>
        </div>
      </header>

      <main className="w-full max-w-7xl px-12 pb-24 z-10 flex-grow flex flex-col items-center relative">
        <StabilityNexus />
      </main>

      <footer className="w-full p-12 text-center opacity-30">
        <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] font-black tracking-[1em] uppercase italic text-rose-500">Protection-First Protocol v1.0</p>
            <p className="text-[8px] font-bold tracking-[0.5em] uppercase text-white/20">© 2025 The Legion • Grounded Reality Mapping</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
