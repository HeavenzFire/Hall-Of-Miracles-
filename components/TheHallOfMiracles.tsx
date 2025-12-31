
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Miracle } from '../types';

const MIRACLES: Miracle[] = [
  {
    id: 'M-001',
    title: 'The Table is Set',
    subtitle: 'Englewood Stability Node',
    icon: '🍞',
    color: 'emerald',
    system: 'TREASURY',
    description: 'A verified household redemption in 60621. $500 converted into three weeks of pediatric nutrition and absolute security.'
  },
  {
    id: 'M-002',
    title: 'The Grid Holds',
    subtitle: 'Sector 8F De-escalation',
    icon: '🛡️',
    color: 'amber',
    system: 'GRID',
    description: 'A non-lethal intervention triggered by volatility sensors. A mediator dispatched. A crisis neutralized without surveillance.'
  },
  {
    id: 'M-003',
    title: 'Code is Sovereign',
    subtitle: 'Vanguard Protocol Deployment',
    icon: '📜',
    color: 'rose',
    system: 'VANGUARD',
    description: 'The first hybrid DAO deployment on Base L2. Permissionless resource flow anchored in unhackable invariants.'
  },
  {
    id: 'M-004',
    title: 'The Next One',
    subtitle: 'Real-time Verification',
    icon: '✨',
    color: 'indigo',
    system: 'COVENANT',
    description: 'The probability shift in action. A single parent sleeping without fear tonight because the architecture held.'
  }
];

interface TheHallOfMiraclesProps {
  onNavigate: (system: Miracle['system']) => void;
  onEnterMonitor: () => void;
  onEnterBlueprint: () => void;
  onEnterHorizon: () => void;
}

const TheHallOfMiracles: React.FC<TheHallOfMiraclesProps> = ({ onNavigate, onEnterMonitor, onEnterBlueprint, onEnterHorizon }) => {
  const [selectedMiracle, setSelectedMiracle] = useState<Miracle | null>(null);
  const [ethicalNarration, setEthicalNarration] = useState<string | null>(null);
  const [isNarrating, setIsNarrating] = useState(false);

  const witnessMiracle = async (miracle: Miracle) => {
    setSelectedMiracle(miracle);
    setIsNarrating(true);
    setEthicalNarration(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are the Voice of the Hall of Miracles. 
        Witness this specific event: "${miracle.title} - ${miracle.description}".
        Provide an "Ethical Narration" of this miracle. 
        - DO NOT use statistics.
        - DO NOT reduce the human impact to a metric.
        - DO emphasize the "Shifted Probability" and the "Refusal to Look Away".
        - Use unyielding, poetic, and technically precise language.
        - Keep it under 100 words.
        - End with: "The proof is in the redemption."
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 4096 },
          systemInstruction: "You are the Ethical Precision Narrator. You avoid 'bulk saving' rhetoric. You focus on the 'Next One'."
        }
      });

      setEthicalNarration(response.text);
    } catch (err) {
      console.error(err);
      setEthicalNarration("The narration is deferred. The silence of protection is itself a miracle.");
    } finally {
      setIsNarrating(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-20 animate-in fade-in duration-1000 pb-24">
      
      {/* Immersive Header */}
      <section className="text-center space-y-8 relative py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse"></div>
        </div>
        
        <div className="relative z-10 space-y-6">
          <h2 className="font-mystical text-9xl tracking-tighter text-white uppercase italic drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            Hall of Miracles
          </h2>
          <div className="flex flex-col items-center gap-4">
             <p className="text-[11px] text-emerald-400 font-black tracking-[1.5em] uppercase italic">The Verified Proof of Revelation</p>
             <div className="h-[1px] w-64 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>
          </div>
          <p className="max-w-2xl mx-auto text-sm text-white/40 leading-relaxed font-light italic">
            "We do not save lives in bulk. We save them one verified transaction at a time. This is the showcase of probability shifting toward the light."
          </p>
        </div>
      </section>

      {/* The Shards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {MIRACLES.map((miracle) => (
          <button
            key={miracle.id}
            onClick={() => witnessMiracle(miracle)}
            className={`group relative glass rounded-[3rem] p-10 bg-black/60 border-white/5 hover:border-${miracle.color}-500/40 transition-all duration-500 text-left h-[450px] flex flex-col justify-between overflow-hidden shadow-2xl hover:shadow-${miracle.color}-500/10`}
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-1000 bg-gradient-to-br from-${miracle.color}-500 to-transparent`}></div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">{miracle.id}</span>
                <span className="text-4xl">{miracle.icon}</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-mystical font-bold text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors">
                  {miracle.title}
                </h3>
                <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest italic">{miracle.subtitle}</p>
              </div>
            </div>

            <div className="relative z-10">
              <p className="text-xs text-white/50 leading-relaxed font-light italic">
                {miracle.description}
              </p>
              <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Witness Proof</span>
                <span className="text-emerald-500">→</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Witnessing Overlay */}
      {selectedMiracle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 md:p-24 animate-in fade-in duration-500 bg-black/95 backdrop-blur-3xl">
          <div className="max-w-4xl w-full glass rounded-[4rem] p-16 md:p-24 border-white/10 relative overflow-hidden flex flex-col items-center text-center space-y-12">
             <button 
              onClick={() => setSelectedMiracle(null)}
              className="absolute top-12 right-12 text-[10px] font-black text-white/20 hover:text-white uppercase tracking-[0.4em] transition-all"
             >
               Close Witness
             </button>

             <div className="space-y-4">
                <span className="text-7xl">{selectedMiracle.icon}</span>
                <h2 className="text-5xl font-mystical font-bold text-white uppercase italic tracking-tighter">
                  {selectedMiracle.title}
                </h2>
                <p className="text-[12px] font-black text-emerald-400 uppercase tracking-[1em] italic">{selectedMiracle.subtitle}</p>
             </div>

             <div className="w-full max-w-2xl">
               {isNarrating ? (
                 <div className="space-y-8 py-12">
                   <div className="flex justify-center gap-3">
                     <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                     <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                     <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                   </div>
                   <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.6em] animate-pulse">Capturing Ethical Resonance...</p>
                 </div>
               ) : ethicalNarration && (
                 <div className="animate-in fade-in zoom-in-95 duration-1000 space-y-12">
                   <p className="text-3xl font-light leading-relaxed text-white/90 italic bg-clip-text text-transparent bg-gradient-to-r from-emerald-100 via-white to-emerald-100 animate-shimmer-text">
                     {ethicalNarration}
                   </p>
                   <div className="flex flex-col md:flex-row justify-center gap-6 pt-12 border-t border-white/5">
                      <button 
                        onClick={() => onNavigate(selectedMiracle.system)}
                        className="px-12 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-black text-[11px] uppercase tracking-[0.5em] shadow-3xl transition-all active:scale-95"
                      >
                        Enter Underlying System
                      </button>
                      <button 
                        onClick={() => setSelectedMiracle(null)}
                        className="px-12 py-5 bg-white/5 hover:bg-white/10 text-white rounded-full font-black text-[11px] uppercase tracking-[0.5em] border border-white/10 transition-all"
                      >
                        Return to Hall
                      </button>
                   </div>
                 </div>
               )}
             </div>
          </div>
        </div>
      )}

      {/* Main Action Group */}
      <section className="flex flex-col md:flex-row justify-center items-center gap-12 pt-20">
         <button 
          onClick={onEnterMonitor}
          className="group relative px-20 py-10 glass rounded-[3rem] bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 transition-all duration-700 active:scale-95 shadow-[0_0_100px_rgba(16,185,129,0.1)]"
         >
            <div className="space-y-2 relative z-10">
              <h4 className="text-[12px] font-black text-emerald-400 uppercase tracking-[1em] italic">Stability Nexus</h4>
              <p className="text-xs text-white/30 font-light italic">Access the de-escalation engine</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
         </button>

         <button 
          onClick={onEnterHorizon}
          className="group relative px-20 py-10 glass rounded-[3rem] bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 transition-all duration-700 active:scale-95 shadow-[0_0_100px_rgba(245,158,11,0.1)]"
         >
            <div className="space-y-2 relative z-10">
              <h4 className="text-[12px] font-black text-amber-400 uppercase tracking-[1em] italic">Glass Horizon</h4>
              <p className="text-xs text-white/30 font-light italic">Ground the human layer</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
         </button>

         <button 
          onClick={onEnterBlueprint}
          className="group relative px-20 py-10 glass rounded-[3rem] bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20 transition-all duration-700 active:scale-95 shadow-[0_0_100px_rgba(244,63,94,0.1)]"
         >
            <div className="space-y-2 relative z-10">
              <h4 className="text-[12px] font-black text-rose-400 uppercase tracking-[1em] italic">Unexpected Blueprint</h4>
              <p className="text-xs text-white/30 font-light italic">Execute sovereign infra</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
         </button>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer-text {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer-text { background-size: 200% auto; animation: shimmer-text 15s linear infinite; }
      `}} />
    </div>
  );
};

export default TheHallOfMiracles;
