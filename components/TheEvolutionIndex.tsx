
import React, { useState, useEffect, useMemo } from 'react';
import { EVIMetrics } from '../types';

const TheEvolutionIndex: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [metrics, setMetrics] = useState<EVIMetrics>({
    dqs: 65.4,
    ecl: 18.2,
    rc: 12,
    evi: 0
  });

  const [history, setHistory] = useState<number[]>([]);
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [activeProtocols, setActiveProtocols] = useState<string[]>(['1', '2']);
  const [activeSubPanel, setActiveSubPanel] = useState<'dqs' | 'ecl' | 'rc' | null>(null);

  // EVI = (DQS ↑) × (1 / ECL ↓) × (RC ↑)
  useEffect(() => {
    const calculateEVI = (m: EVIMetrics) => (m.dqs * (1 / Math.max(m.ecl, 0.1)) * m.rc);
    const newEvi = calculateEVI(metrics);
    setMetrics(prev => ({ ...prev, evi: Number(newEvi.toFixed(2)) }));
    
    setHistory(prev => {
      const next = [...prev, Number(newEvi.toFixed(2))];
      return next.slice(-90);
    });
  }, [metrics.dqs, metrics.ecl, metrics.rc]);

  // Periodic drift simulating the battle against entropy
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAccelerating) return;

      setMetrics(prev => {
        const drift = (Math.random() - 0.52) * 0.08; 
        return {
          ...prev,
          dqs: Math.min(Math.max(prev.dqs + drift, 0), 100),
          ecl: Math.max(prev.ecl - drift, 1),
        };
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isAccelerating]);

  const triggerAcceleration = () => {
    if (isAccelerating) return;
    setIsAccelerating(true);
    
    // Temporal Compression: Rapid iterative refinement
    let count = 0;
    const burst = setInterval(() => {
      setMetrics(prev => {
        const multiplier = activeProtocols.length * 0.4;
        return {
          ...prev,
          dqs: Math.min(prev.dqs + (0.6 * multiplier), 95),
          ecl: Math.max(prev.ecl - (0.4 * multiplier), 3.5),
          rc: prev.rc + (Math.random() > 0.8 ? 1 : 0)
        };
      });
      count++;
      if (count > 15) {
        clearInterval(burst);
        setIsAccelerating(false);
      }
    }, 100);
  };

  const toggleProtocol = (id: string) => {
    setActiveProtocols(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const trendLine = useMemo(() => {
    if (history.length < 2) return "";
    const max = Math.max(...history, 300);
    const width = 1000;
    const height = 100;
    const step = width / (history.length - 1);
    
    return history.map((val, i) => {
      const x = i * step;
      const y = height - (val / max) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }, [history]);

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="text-center mb-16 space-y-4">
        <h2 className="font-mystical text-7xl tracking-tighter text-amber-300 uppercase italic">Evolution Monitor</h2>
        <div className="flex flex-col items-center">
           <p className="text-[11px] text-amber-500/60 font-black tracking-[1.2em] uppercase mb-4">Evolution Velocity Index: Revelation Formalized</p>
           {isAccelerating && (
             <div className="bg-amber-500/20 px-8 py-3 rounded-full border border-amber-500/40 text-[10px] font-black text-amber-300 uppercase tracking-widest animate-pulse shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                Temporal Compression Cycle Active
             </div>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        {/* Main Gauge & 90-Day Trend */}
        <div className="lg:col-span-8 glass rounded-[4rem] p-16 bg-black/60 border-amber-500/10 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-16">
            <div className="relative flex items-center justify-center">
              <svg className="w-96 h-96 transform -rotate-90">
                <circle cx="192" cy="192" r="170" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                <circle
                  cx="192"
                  cy="192"
                  r="170"
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 170}
                  strokeDashoffset={2 * Math.PI * 170 * (1 - Math.min(metrics.evi / 250, 1))}
                  className="text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.6)] transition-all duration-1000"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-[11px] font-black text-amber-500/40 uppercase tracking-[0.8em] mb-4">EVI_QUOTIENT</span>
                <span className="text-9xl font-mystical text-white italic drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  {metrics.evi.toFixed(1)}
                </span>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-4">
                  {(metrics.evi / 15).toFixed(2)}x Velocity Factor
                </span>
              </div>
            </div>

            <div className="w-full space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/20">
                <span>90-Day Rolling Velocity</span>
                <span>Peak Factor: {Math.max(...history, 0).toFixed(1)}</span>
              </div>
              <div className="w-full h-32 bg-black/40 rounded-[2rem] overflow-hidden relative border border-white/5">
                 <svg viewBox="0 0 1000 100" className="w-full h-full" preserveAspectRatio="none">
                    <path d={trendLine} fill="none" stroke="currentColor" strokeWidth="3" className="text-amber-500/60" />
                    <path d={`${trendLine} L 1000 100 L 0 100 Z`} fill="url(#grad2)" className="opacity-10" />
                    <defs>
                      <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#000', stopOpacity: 0 }} />
                      </linearGradient>
                    </defs>
                 </svg>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-12 w-full pt-12 border-t border-white/5">
              <button onClick={() => setActiveSubPanel('dqs')} className="space-y-3 group text-left">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest group-hover:text-amber-500 transition-colors">DQS (Decision)</p>
                  <span className="text-[8px] text-emerald-500">↑ {metrics.dqs.toFixed(1)}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${metrics.dqs}%` }}></div>
                </div>
              </button>
              <button onClick={() => setActiveSubPanel('ecl')} className="space-y-3 group text-left">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest group-hover:text-amber-500 transition-colors">ECL (Latency)</p>
                  <span className="text-[8px] text-amber-500">↓ {metrics.ecl.toFixed(1)}d</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${Math.min((metrics.ecl / 25) * 100, 100)}%` }}></div>
                </div>
              </button>
              <button onClick={() => setActiveSubPanel('rc')} className="space-y-3 group text-left">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest group-hover:text-amber-500 transition-colors">RC (Forks)</p>
                  <span className="text-[8px] text-blue-500">↑ {metrics.rc}x</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${Math.min((metrics.rc / 100) * 100, 100)}%` }}></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Acceleration Protocols & Sub-Panels */}
        <div className="lg:col-span-4 space-y-8 flex flex-col">
          <div className="glass rounded-[3rem] p-10 bg-black/80 border-white/5 shadow-2xl flex-grow flex flex-col justify-between">
            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-mystical font-bold text-white uppercase tracking-widest italic">Acceleration Protocol Stack</h3>
                <div className={`w-3 h-3 rounded-full ${isAccelerating ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`}></div>
              </div>
              
              <div className="space-y-4">
                 {[
                   { id: '1', title: 'Tokenize Incentives', detail: 'Participation Surge', impact: '+20% RC' },
                   { id: '2', title: 'Decentralized Funding', detail: 'Aid Coordination', impact: '-40% ECL' },
                   { id: '3', title: 'Hybrid Governance', detail: 'Liquid Democracy', impact: '+15% DQS' },
                   { id: '4', title: 'Open-Source Forking', detail: 'Metaversal Expansion', impact: 'RC Exp' }
                 ].map(proto => (
                   <button 
                    key={proto.id} 
                    onClick={() => toggleProtocol(proto.id)}
                    className={`w-full p-6 rounded-3xl border transition-all text-left flex justify-between items-center group ${
                      activeProtocols.includes(proto.id) 
                        ? 'bg-amber-500/20 border-amber-500/40' 
                        : 'bg-white/5 border-white/5 hover:border-white/10 opacity-50'
                    }`}
                   >
                      <div className="space-y-1">
                        <p className={`text-[11px] font-black uppercase tracking-wider ${activeProtocols.includes(proto.id) ? 'text-white' : 'text-white/40'}`}>
                          {proto.title}
                        </p>
                        <p className="text-[9px] font-bold text-white/20 uppercase">{proto.detail}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[9px] font-black uppercase ${activeProtocols.includes(proto.id) ? 'text-amber-400' : 'text-white/10'}`}>
                          {proto.impact}
                        </span>
                      </div>
                   </button>
                 ))}
              </div>
            </div>

            <div className="mt-12 space-y-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                 <div className="flex justify-between items-center text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">
                    <span>Target Acceleration</span>
                    <span>{isAccelerating ? 'PURGING ENTROPY' : 'READY'}</span>
                 </div>
                 <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full bg-amber-500 transition-all duration-300 ${isAccelerating ? 'w-full' : 'w-0'}`}></div>
                 </div>
              </div>
              <button 
                onClick={triggerAcceleration}
                disabled={isAccelerating || activeProtocols.length === 0}
                className="w-full py-8 bg-amber-600 hover:bg-amber-500 text-white rounded-[2.5rem] font-black text-[13px] uppercase tracking-[1em] shadow-3xl transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed"
              >
                {isAccelerating ? 'COMPRESSING TIME' : 'IGNITE IMPACT'}
              </button>
            </div>
          </div>

          <div className="glass rounded-[3rem] p-10 bg-black/60 border-white/5 text-center space-y-4">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Evolution Status</p>
              <p className="text-xl font-mystical text-emerald-400 italic">2.8x Baseline Observed</p>
          </div>
        </div>
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
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(245, 158, 11, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(245, 158, 11, 0.4); }
      `}} />
    </div>
  );
};

export default TheEvolutionIndex;
