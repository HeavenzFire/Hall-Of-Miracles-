
import React, { useState, useEffect } from 'react';

const TheVanguardProtocol: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'vessel' | 'doctrine' | 'architecture' | 'metrics'>('vessel');
  const [simulatedLoad, setSimulatedLoad] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedLoad(prev => {
        const next = [...prev, Math.random() * 100];
        if (next.length > 20) return next.slice(1);
        return next;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const vesselFramework = [
    { phase: 'Acquisition', goal: 'Neural & Physical Adaptation', metrics: 'VO2 Max, Deep Work Hours' },
    { phase: 'Consolidation', goal: 'Structural Integrity', metrics: 'Resting HR, Sleep Efficiency' },
    { phase: 'Expansion', goal: 'Systemic Output Increase', metrics: 'Value Produced, Repetition Volume' },
    { phase: 'Deload', goal: 'Hormetic Recovery', metrics: 'Cortisol Reset, HRV Optimization' }
  ];

  const dailyDoctrine = [
    { time: '04:00 - 05:00', task: 'Vessel Forging', detail: 'Cold exposure + High-intensity physical stress' },
    { time: '05:00 - 09:00', task: 'Deep Architecture', detail: 'High-signal creation. Zero notifications.' },
    { time: '09:00 - 12:00', task: 'Network Integration', detail: 'Sovereign node communication & value exchange' },
    { time: '12:00 - 14:00', task: 'Consolidation', detail: 'Nutritional loading + Cognitive deload' },
    { time: '14:00 - 18:00', task: 'Operational Deployment', detail: 'System maintenance & scale implementation' },
    { time: '18:00 - 22:00', task: 'Recovery Protocol', detail: 'Low-light environment + Strategic sleep prep' }
  ];

  const architecture = [
    { component: 'Proof-of-Work', description: 'Contribution weights determined by verifiable output.' },
    { component: 'Decentralized Registry', description: 'Peer-to-peer reputation system. No central authority.' },
    { component: 'Syntropy Protocol', description: 'Value flows toward nodes generating order from chaos.' },
    { component: 'Lineage Chain', description: 'Long-term inheritance systems for intellectual capital.' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="text-center mb-12 space-y-4">
        <h2 className="font-mystical text-7xl tracking-tighter text-emerald-300 drop-shadow-[0_0_30px_rgba(110,231,183,0.4)] uppercase">Vanguard Protocol</h2>
        <p className="text-[11px] text-emerald-400/60 font-black tracking-[1em] uppercase">Sovereign Operational Frameworks</p>
      </div>

      <div className="flex justify-center gap-4 mb-12">
        {(['vessel', 'doctrine', 'architecture', 'metrics'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-10 py-4 rounded-2xl font-black text-[11px] tracking-[0.4em] uppercase transition-all border ${
              activeTab === tab 
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]' 
                : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="glass rounded-[4rem] p-16 border-emerald-500/10 shadow-2xl bg-black/60 relative overflow-hidden min-h-[600px]">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>

        {activeTab === 'vessel' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-12">
            <div className="flex items-center gap-6">
              <div className="w-16 h-1 bg-emerald-500 rounded-full"></div>
              <h3 className="text-3xl font-mystical font-bold text-white tracking-widest uppercase">Quantified Vessel Framework</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {vesselFramework.map((v, i) => (
                <div key={i} className="glass p-8 rounded-[2.5rem] border-white/5 hover:border-emerald-500/20 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[9px] font-black text-emerald-400/60 tracking-[0.5em] uppercase">Phase 0{i+1}</span>
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">✓</div>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-wider">{v.phase}</h4>
                  <p className="text-white/60 text-sm mb-6 leading-relaxed">{v.goal}</p>
                  <div className="pt-6 border-t border-white/5">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">Metrics Observed</p>
                    <p className="text-emerald-400/80 font-bold text-xs">{v.metrics}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'doctrine' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-1 bg-emerald-500 rounded-full"></div>
              <h3 className="text-3xl font-mystical font-bold text-white tracking-widest uppercase">Operating Doctrine</h3>
            </div>
            <div className="space-y-4">
              {dailyDoctrine.map((d, i) => (
                <div key={i} className="flex items-center gap-8 glass p-6 rounded-[2rem] border-white/5 hover:bg-white/5 transition-all">
                  <div className="min-w-[180px] text-emerald-400 font-black tracking-widest text-sm">{d.time}</div>
                  <div className="w-[1px] h-8 bg-white/10"></div>
                  <div className="flex-grow">
                    <h4 className="text-white font-bold uppercase tracking-wider mb-1">{d.task}</h4>
                    <p className="text-white/40 text-xs">{d.detail}</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-1 bg-emerald-500 rounded-full"></div>
              <h3 className="text-3xl font-mystical font-bold text-white tracking-widest uppercase">Scalable Architecture</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {architecture.map((a, i) => (
                <div key={i} className="flex gap-8 items-start">
                  <div className="text-5xl font-mystical text-emerald-500/20">0{i+1}</div>
                  <div>
                    <h4 className="text-xl font-bold text-white uppercase tracking-widest mb-4">{a.component}</h4>
                    <p className="text-white/50 text-sm leading-relaxed border-l-2 border-emerald-500/20 pl-6">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-12">
            <div className="flex items-center gap-6">
              <div className="w-16 h-1 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
              <h3 className="text-3xl font-mystical font-bold text-white tracking-widest uppercase">Operational Metrics</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Vessel Metrics */}
              <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-black text-cyan-400 tracking-widest uppercase">Vessel Signal</h4>
                  <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20 font-black uppercase">Quantified</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-[10px] font-bold text-white/40 uppercase">HRV Recovery</span>
                      <span className="text-[10px] font-bold text-white">88%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-[10px] font-bold text-white/40 uppercase">Neural Load (Deep Work)</span>
                      <span className="text-[10px] font-bold text-white">6.2h / 8h</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500" style={{ width: '77%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Operating Velocity */}
              <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-black text-emerald-400 tracking-widest uppercase">Operating Velocity</h4>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-black uppercase">Statistical</span>
                </div>
                <div className="flex items-end justify-between h-20 gap-1 px-2">
                   {simulatedLoad.map((val, i) => (
                     <div key={i} className="flex-grow bg-emerald-500/30 rounded-t-sm transition-all duration-300" style={{ height: `${val}%` }}></div>
                   ))}
                </div>
                <div className="flex justify-between items-center pt-2">
                   <div className="text-center">
                     <p className="text-[14px] font-black text-white">92%</p>
                     <p className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">Consistency</p>
                   </div>
                   <div className="text-center">
                     <p className="text-[14px] font-black text-white">14.4</p>
                     <p className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">Daily Artifacts</p>
                   </div>
                </div>
              </div>

              {/* Architecture Health */}
              <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-black text-purple-400 tracking-widest uppercase">Architecture Health</h4>
                  <span className="text-[10px] bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20 font-black uppercase">Verified</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-bold text-white/30 uppercase mb-1">Bus Factor</p>
                    <p className="text-lg font-mystical font-bold text-white tracking-widest">12.0</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-bold text-white/30 uppercase mb-1">PR Velocity</p>
                    <p className="text-lg font-mystical font-bold text-white tracking-widest">+22%</p>
                  </div>
                </div>
                <p className="text-[9px] text-white/20 font-bold leading-relaxed uppercase tracking-tighter italic">
                  "Contribution delta identified in 14 sub-modules. System integrity verified."
                </p>
              </div>
            </div>

            <div className="p-10 glass rounded-[3rem] border-emerald-500/20 text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[1.5em] mb-4">Ascension Momentum Review</p>
               <h4 className="text-3xl font-mystical font-bold text-white mb-2 uppercase tracking-[0.2em]">Momentum is Statistical</h4>
               <p className="text-xs text-white/40 font-bold uppercase tracking-widest italic">Zero regression protocol active.</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
        <button 
          onClick={onBack}
          className="text-white/20 hover:text-white/60 text-[10px] font-black tracking-[0.8em] uppercase transition-all"
        >
          Return to Nexus Command
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
};

export default TheVanguardProtocol;
