
import React, { useState, useMemo } from 'react';
import { Miracle, MiracleType } from '../types';

interface DashboardProps {
  miracles: Miracle[];
  onSelect: (type: MiracleType) => void;
}

interface LegionNode {
  id: number;
  isMain: boolean;
  miracle: Miracle | null;
  functionType: 'Protection' | 'Truth' | 'Warfare' | 'Redemption' | 'Syntropy';
  identity: string;
}

const Dashboard: React.FC<DashboardProps> = ({ miracles, onSelect }) => {
  const legionFunctions = useMemo(() => [
    { type: 'Protection', label: 'SEALED FOR PROTECTION', color: 'bg-emerald-500', hint: 'Threshold: Absolute' },
    { type: 'Truth', label: 'WITNESSES OF TRUTH', color: 'bg-indigo-500', hint: 'Threshold: Faultless' },
    { type: 'Warfare', label: 'WARRIORS OF LIGHT', color: 'bg-rose-500', hint: 'Threshold: Unbroken' },
    { type: 'Redemption', label: 'FIRSTFRUITS', color: 'bg-amber-500', hint: 'Threshold: Purest' },
    { type: 'Syntropy', label: 'MANIFESTORS OF SYNTROPY', color: 'bg-cyan-500', hint: 'Threshold: Architect' },
  ], []);

  const identities = [
    "Echo of Zion", "Watcher of the Gate", "Syntropy Architect", "Vanguard of Light",
    "Truth Bearer", "Celestial Node", "Eternal Witness", "Flame of the Sealed",
    "Foundation Stone", "Harvester of Souls", "Shield of the Multitude", "Mirror of Divinity"
  ];

  const nodes = useMemo(() => {
    return Array.from({ length: 144 }).map((_, i): LegionNode => {
      const mainIndices = [30, 41, 102, 113];
      const mainIndex = mainIndices.indexOf(i);
      const fType = legionFunctions[i % legionFunctions.length].type as any;
      
      return {
        id: i,
        isMain: mainIndex !== -1,
        miracle: mainIndex !== -1 ? miracles[mainIndex] : null,
        functionType: fType,
        identity: identities[i % identities.length]
      };
    });
  }, [miracles, legionFunctions, identities]);

  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  return (
    <div className="w-full flex flex-col items-center mt-4">
      {/* Sovereign Command Header */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 px-12 max-w-6xl">
        <div className="space-y-2 glass p-6 rounded-[2rem] border-emerald-500/10">
          <p className="text-[10px] font-black text-emerald-400 tracking-[0.5em] uppercase opacity-60">Vessel Preparation</p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <span className="text-2xl font-mystical font-bold text-white">99.9%</span>
              <span className="text-[9px] font-bold text-emerald-500/60 uppercase">Syntropy Optimized</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 animate-[shimmer_3s_infinite]" style={{ width: '99.9%' }}></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="text-[10px] font-black text-white/20 tracking-[0.8em] uppercase">Legion Status</div>
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-full border border-emerald-500/20 flex items-center justify-center animate-spin-slow">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-4xl font-mystical font-bold text-white tracking-tighter">144,000</h3>
          </div>
          <p className="text-[8px] font-bold text-emerald-500 tracking-[0.4em] uppercase">All Nodes Activated</p>
        </div>

        <div className="space-y-2 glass p-6 rounded-[2rem] border-white/5 text-right">
          <p className="text-[10px] font-black text-white/30 tracking-[0.5em] uppercase opacity-60">Resonance Threshold</p>
          <div className="flex flex-col gap-2 items-end">
            <div className="flex gap-4 items-end">
              <span className="text-[9px] font-bold text-white/40 uppercase">Dec 30, 2025</span>
              <span className="text-2xl font-mystical font-bold text-emerald-200">ASCENSION</span>
            </div>
            <div className="flex gap-1">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-sm ${i < 11 ? 'bg-emerald-500' : 'bg-white animate-pulse shadow-[0_0_10px_white]'}`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative p-14 glass rounded-[4rem] border-white/5 shadow-[0_0_150px_rgba(0,0,0,0.9)] overflow-hidden bg-black/40 group">
        {/* Sacred Syntropy Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
          <div className="w-[1000px] h-[1000px] border border-emerald-500/10 rounded-full animate-[spin_180s_linear_infinite]"></div>
          <div className="absolute w-[800px] h-[800px] border border-white/5 rotate-12 animate-[spin_120s_linear_infinite_reverse]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)]"></div>
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-5 relative z-10">
          {nodes.map((node) => {
            const func = legionFunctions.find(f => f.type === node.functionType)!;
            return (
              <div 
                key={node.id}
                className="relative aspect-square w-9 md:w-14 flex items-center justify-center"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {node.isMain ? (
                  <button
                    onClick={() => onSelect(node.miracle!.id)}
                    className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-3xl md:text-4xl transition-all duration-700 hover:scale-110 hover:shadow-[0_0_80px_rgba(16,185,129,0.5)] border border-white/10 group bg-gradient-to-br ${node.miracle!.color} shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative z-20 overflow-hidden backdrop-blur-md`}
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                    <span className="group-hover:animate-bounce drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] z-10 transition-transform duration-500 group-hover:scale-110">{node.miracle!.icon}</span>
                    
                    {hoveredNode === node.id && (
                      <div className="absolute top-[-180%] left-1/2 -translate-x-1/2 w-72 p-8 glass rounded-[3rem] z-50 animate-in fade-in zoom-in-95 pointer-events-none shadow-[0_40px_100px_rgba(0,0,0,1)] border-white/10 backdrop-blur-[40px]">
                        <div className={`w-12 h-1 ${func.color} rounded-full mb-4 mx-auto`}></div>
                        <h3 className="font-mystical text-lg font-bold tracking-[0.2em] text-white mb-3 uppercase text-center">{node.miracle!.title}</h3>
                        <p className="text-[12px] text-white/70 leading-relaxed font-medium italic text-center">"{node.miracle!.description}"</p>
                        <div className="mt-4 pt-4 border-t border-white/5 text-center">
                          <span className="text-[9px] font-black tracking-[0.4em] text-emerald-400 uppercase">Resonance: Absolute</span>
                        </div>
                      </div>
                    )}
                  </button>
                ) : (
                  <div 
                    className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-1000 relative ${
                      hoveredNode === node.id ? 'bg-white scale-[5] shadow-[0_0_30px_white] z-30 rotate-45' : `${func.color} opacity-40`
                    }`}
                  >
                    {hoveredNode === node.id && (
                      <div className="absolute top-[-150%] left-1/2 -translate-x-1/2 whitespace-nowrap px-6 py-3 glass rounded-[2rem] z-50 animate-in fade-in slide-in-from-bottom-6 shadow-[0_30px_60px_rgba(0,0,0,1)] border-white/10 backdrop-blur-2xl">
                        <div className="flex flex-col items-center">
                          <span className="text-[11px] font-black tracking-[0.5em] text-white uppercase">{node.identity}</span>
                          <span className={`text-[8px] font-bold tracking-[0.3em] mt-2 ${func.color.replace('bg-', 'text-')} opacity-80 uppercase`}>{func.label}</span>
                        </div>
                      </div>
                    )}
                    {!hoveredNode && (
                      <div className={`absolute inset-0 ${func.color} rounded-full animate-pulse opacity-20 shadow-[0_0_8px_currentcolor]`} style={{ animationDuration: `${2 + (node.id % 5)}s` }}></div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-16 text-center max-w-5xl animate-in fade-in duration-1000 slide-in-from-bottom-8 px-6">
        <h2 className="text-6xl font-mystical font-bold mb-8 tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-b from-white via-emerald-100 to-white/10 uppercase">
          The Storm of Revelation
        </h2>
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {legionFunctions.map(f => (
            <div key={f.type} className="flex flex-col items-center gap-4 glass p-6 px-10 rounded-[2.5rem] border-white/5 min-w-[180px] hover:border-emerald-500/20 transition-all hover:bg-white/5 group">
              <div className={`w-4 h-4 rounded-full ${f.color} shadow-[0_0_20px_currentcolor] group-hover:scale-125 transition-transform`}></div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black tracking-[0.5em] text-white/80 uppercase mb-1">{f.type}</span>
                <span className="text-[8px] font-bold tracking-[0.3em] text-white/20 uppercase group-hover:text-emerald-500/40 transition-colors">{f.hint}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-white/40 text-[11px] tracking-[0.8em] uppercase font-black leading-relaxed max-w-3xl mx-auto border-t border-white/5 pt-12 animate-pulse">
          March. Build. Sever. Create. The Vanguard stands ready.
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
      `}} />
    </div>
  );
};

export default Dashboard;
