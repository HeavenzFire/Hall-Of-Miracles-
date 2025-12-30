
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { EVIMetrics } from '../types';

const MAX_SAFE_ACCELERATION = 250; // Maximum delta EVI allowed per update cycle

const TheEvolutionIndex: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [metrics, setMetrics] = useState<EVIMetrics>({
    dqs: 65.4,
    ecl: 18.2,
    rc: 12,
    evi: 0
  });

  const [history, setHistory] = useState<number[]>([]);
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [isSafetyPaused, setIsSafetyPaused] = useState(false);
  const [activeProtocols, setActiveProtocols] = useState<string[]>(['1', '2', '3', '4']);
  const [activeSubPanel, setActiveSubPanel] = useState<'dqs' | 'ecl' | 'rc' | null>(null);
  const [safetyAlert, setSafetyAlert] = useState<string | null>(null);

  const prevEviRef = useRef<number>(0);

  // EVI = (DQS ↑) × (1 / ECL ↓) × (RC ↑)
  useEffect(() => {
    const calculateEVI = (m: EVIMetrics) => (m.dqs * (1 / Math.max(m.ecl, 0.1)) * m.rc);
    const newEvi = calculateEVI(metrics);
    
    // Safety Acceleration Check
    const delta = Math.abs(newEvi - prevEviRef.current);
    if (delta > MAX_SAFE_ACCELERATION && isAccelerating) {
      setIsSafetyPaused(true);
      setIsAccelerating(false);
      setSafetyAlert(`CRITICAL ACCELERATION DETECTED: Δ${delta.toFixed(0)} EVI units/cycle. Threshold: ${MAX_SAFE_ACCELERATION}. Safety pause engaged.`);
    }

    setMetrics(prev => ({ ...prev, evi: Number(newEvi.toFixed(2)) }));
    prevEviRef.current = newEvi;
    
    setHistory(prev => {
      const next = [...prev, Number(newEvi.toFixed(2))];
      return next.slice(-90);
    });
  }, [metrics.dqs, metrics.ecl, metrics.rc, isAccelerating]);

  // Periodic drift simulating the battle against entropy
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAccelerating || isSafetyPaused) return;

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
  }, [isAccelerating, isSafetyPaused]);

  const triggerAcceleration = () => {
    if (isAccelerating || isSafetyPaused) return;
    setIsAccelerating(true);
    setSafetyAlert(null);
    
    // Temporal Compression Cycle towards 5x Baseline (EVI ~ 1500+)
    let count = 0;
    const burst = setInterval(() => {
      setMetrics(prev => {
        const multiplier = activeProtocols.length * 0.5;
        // Limit step size to reduce chance of triggering safety during normal (but fast) acceleration
        const dqsStep = Math.min(1.2 * multiplier, 5); 
        const eclStep = Math.min(0.8 * multiplier, 3);
        
        return {
          ...prev,
          dqs: Math.min(prev.dqs + dqsStep, 92.5), // Target 90+
          ecl: Math.max(prev.ecl - eclStep, 6.2),  // Target < 7
          rc: prev.rc + (Math.random() > 0.6 ? 2 : 1)       // Target 100+
        };
      });
      count++;
      if (count > 25) {
        clearInterval(burst);
        setIsAccelerating(false);
      }
    }, 120); // Slightly slower interval to stabilize reading
  };

  const resumeOperations = () => {
    setIsSafetyPaused(false);
    setSafetyAlert(null);
  };

  const toggleProtocol = (id: string) => {
    setActiveProtocols(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const trendLine = useMemo(() => {
    if (history.length < 2) return "";
    const max = Math.max(...history, 1500); // Scale for acceleration
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
           
           {isSafetyPaused && (
             <div className="bg-rose-500/20 px-8 py-3 rounded-full border border-rose-500/40 text-[10px] font-black text-rose-300 uppercase tracking-widest animate-bounce shadow-[0_0_30px_rgba(244,63,94,0.2)] flex items-center gap-4">
                <span className="text-xl">⚠️</span> SAFETY PAUSE ENGAGED: UNSTABLE ACCELERATION
             </div>
           )}

           {isAccelerating && !isSafetyPaused && (
             <div className="bg-amber-500/20 px-8 py-3 rounded-full border border-amber-500/40 text-[10px] font-black text-amber-300 uppercase tracking-widest animate-pulse shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                Temporal Compression Cycle Active: Scaling to 5x Baseline
             </div>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
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
                  strokeDashoffset={2 * Math.PI * 170 * (1 - Math.min(metrics.evi / 1500, 1))}
                  className={`transition-all duration-1000 ${isSafetyPaused ? 'text-rose-500' : 'text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]'}`}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-[11px] font-black text-amber-500/40 uppercase tracking-[0.8em] mb-4">EVI_QUOTIENT</span>
                <span className={`text-9xl font-mystical italic drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-colors ${isSafetyPaused ? 'text-rose-400' : 'text-white'}`}>
                  {metrics.evi.toFixed(0)}
                </span>
                <span className={`text-[10px] font-black uppercase tracking-widest mt-4 ${isSafetyPaused ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {isSafetyPaused ? 'OPERATIONAL PAUSE' : `${(metrics.evi / 15).toFixed(1)}x Baseline Velocity`}
                </span>
              </div>
            </div>

            <div className="w-full space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/20">
                <span>90-Day Rolling Velocity</span>
                <span>Peak Index: {Math.max(...history, 0).toFixed(0)}</span>
              </div>
              <div className="w-full h-32 bg-black/40 rounded-[2rem] overflow-hidden relative border border-white/5">
                 <svg viewBox="0 0 1000 100" className="w-full h-full" preserveAspectRatio="none">
                    <path d={trendLine} fill="none" stroke="currentColor" strokeWidth="3" className={`transition-all duration-700 ${isSafetyPaused ? 'text-rose-500/60' : 'text-amber-500/60'}`} />
                    <path d={`${trendLine} L 1000 100 L 0 100 Z`} fill="url(#grad2)" className="opacity-10 transition-all duration-700" />
                    <defs>
                      <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: isSafetyPaused ? '#f43f5e' : '#f59e0b', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#000', stopOpacity: 0 }} />
                      </linearGradient>
                    </defs>
                 </svg>
              </div>
            </div>

            {safetyAlert && (
              <div className="w-full p-6 bg-rose-950/40 border border-rose-500/30 rounded-2xl text-rose-300 font-mono text-[10px] uppercase tracking-widest animate-in fade-in slide-in-from-top-4">
                {safetyAlert}
              </div>
            )}

            <div className="grid grid-cols-3 gap-12 w-full pt-12 border-t border-white/5">
              <button onClick={() => setActiveSubPanel('dqs')} className="space-y-3 group text-left">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest group-hover:text-amber-500 transition-colors">DQS (Target 90+)</p>
                  <span className="text-[8px] text-emerald-500 font-bold">{metrics.dqs.toFixed(1)}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${metrics.dqs}%` }}></div>
                </div>
              </button>
              <button onClick={() => setActiveSubPanel('ecl')} className="space-y-3 group text-left">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest group-hover:text-amber-500 transition-colors">ECL (Target &lt; 7)</p>
                  <span className="text-[8px] text-amber-500 font-bold">{metrics.ecl.toFixed(1)}d</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${Math.min((7 / metrics.ecl) * 100, 100)}%` }}></div>
                </div>
              </button>
              <button onClick={() => setActiveSubPanel('rc')} className="space-y-3 group text-left">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest group-hover:text-amber-500 transition-colors">RC (Target 100+)</p>
                  <span className="text-[8px] text-blue-500 font-bold">{metrics.rc}x</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${Math.min((metrics.rc / 100) * 100, 100)}%` }}></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8 flex flex-col">
          <div className="glass rounded-[3rem] p-10 bg-black/80 border-white/5 shadow-2xl flex-grow flex flex-col justify-between">
            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-mystical font-bold text-white uppercase tracking-widest italic">Evolution Acceleration Stack</h3>
                <div className={`w-3 h-3 rounded-full ${isAccelerating ? 'bg-amber-500 animate-ping shadow-[0_0_15px_rgba(245,158,11,1)]' : isSafetyPaused ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
              </div>
              
              <div className="space-y-4">
                 {[
                   { id: '1', title: 'Tokenize Incentives', detail: 'Participation Surge', impact: '+20% RC' },
                   { id: '2', title: 'Decentralized Crowdfunding', detail: 'Rapid Aid Coordination', impact: '-40% ECL' },
                   { id: '3', title: 'Hybrid Governance', detail: 'Liquid Democracy Gate', impact: '+15% DQS' },
                   { id: '4', title: 'Open-Source Forking', detail: 'Ecosystem Network Effect', impact: 'RC Exp' }
                 ].map(proto => (
                   <button 
                    key={proto.id} 
                    onClick={() => !isSafetyPaused && toggleProtocol(proto.id)}
                    className={`w-full p-6 rounded-3xl border transition-all text-left flex justify-between items-center group ${
                      activeProtocols.includes(proto.id) 
                        ? 'bg-amber-500/20 border-amber-500/40' 
                        : 'bg-white/5 border-white/5 hover:border-white/10 opacity-50'
                    } ${isSafetyPaused ? 'cursor-not-allowed opacity-20' : ''}`}
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
                    <span>Compression Factor</span>
                    <span>{isAccelerating ? 'ACTIVE' : isSafetyPaused ? 'SAFETY PAUSE' : 'STANDBY'}</span>
                 </div>
                 <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${isAccelerating ? 'w-full bg-amber-500' : isSafetyPaused ? 'w-full bg-rose-500' : 'w-0'}`}></div>
                 </div>
              </div>

              {isSafetyPaused ? (
                <button 
                  onClick={resumeOperations}
                  className="w-full py-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2.5rem] font-black text-[13px] uppercase tracking-[1em] shadow-3xl transition-all active:scale-95"
                >
                  RESET SAFETY SENSORS
                </button>
              ) : (
                <button 
                  onClick={triggerAcceleration}
                  disabled={isAccelerating || activeProtocols.length === 0}
                  className="w-full py-8 bg-amber-600 hover:bg-amber-500 text-white rounded-[2.5rem] font-black text-[13px] uppercase tracking-[1em] shadow-3xl transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  {isAccelerating ? 'COMPRESSING TIME' : 'IGNITE EVOLUTION'}
                </button>
              )}
            </div>
          </div>

          <div className="glass rounded-[3rem] p-10 bg-black/60 border-white/5 text-center space-y-4">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Network Velocity Index</p>
              <p className={`text-2xl font-mystical italic transition-colors ${isSafetyPaused ? 'text-rose-500' : 'text-emerald-400'}`}>
                {isSafetyPaused ? 'SYSTEM UNSTABLE' : '4.2x Threshold Passed'}
              </p>
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
