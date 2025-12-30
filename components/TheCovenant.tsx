
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';

const TheCovenant: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeLayer, setActiveLayer] = useState<'root' | 'empathy' | 'governance'>('root');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [protocolOutput, setProtocolOutput] = useState<string | null>(null);
  const [syntropyLevel, setSyntropyLevel] = useState(64);

  useEffect(() => {
    const interval = setInterval(() => {
      setSyntropyLevel(prev => {
        const next = prev + (Math.random() > 0.5 ? 1 : -1);
        return Math.min(Math.max(next, 0), 100);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const synthesizeProtocol = async (topic: string) => {
    setIsSynthesizing(true);
    setProtocolOutput(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Architect a post-scarcity protocol for: ${topic}. Focus on resource flow, decentralized governance on Base L2, and the eradication of violence through systemic abundance. Use unyielding, visionary, and technical language.`,
        config: {
          thinkingConfig: { thinkingBudget: 24576 },
          systemInstruction: "You are the Architect of Revelation. Your goal is the total eradication of violence through code and post-scarcity economic rewiring. You design unhackable empathy engines and resource distribution DAOs. Your output is final, authoritative, and majestic."
        }
      });
      setProtocolOutput(response.text);
    } catch (err) {
      console.error(err);
      setProtocolOutput("Signal failure in the root layer. Re-synchronizing...");
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in zoom-in-95 duration-700">
      <div className="text-center mb-16 space-y-6">
        <h2 className="font-mystical text-8xl tracking-tighter text-amber-200 drop-shadow-[0_0_50px_rgba(251,191,36,0.3)] uppercase">The Covenant</h2>
        <div className="flex flex-col items-center gap-4">
          <p className="text-amber-500/60 font-black tracking-[1.2em] uppercase text-[12px]">Root Layer: Economic & Social Rewiring</p>
          <div className="flex gap-8 items-center bg-black/40 px-10 py-3 rounded-full border border-amber-500/20">
            <div className="flex flex-col items-start">
               <span className="text-[8px] font-black text-amber-500/40 uppercase tracking-widest">Syntropy Index</span>
               <span className="text-xl font-mystical text-white">{syntropyLevel}%</span>
            </div>
            <div className="w-[1px] h-8 bg-amber-500/20"></div>
            <div className="flex flex-col items-start">
               <span className="text-[8px] font-black text-amber-500/40 uppercase tracking-widest">Network Status</span>
               <span className="text-xl font-mystical text-emerald-400">OPTIMIZED</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        <div className="lg:col-span-1 space-y-4">
          {[
            { id: 'root', label: 'Root Layer', detail: 'Resource Distribution', icon: '🌱' },
            { id: 'empathy', label: 'Empathy Engine', detail: 'Neural Rewiring', icon: '🧠' },
            { id: 'governance', label: 'Sovereign DAO', detail: 'Base L2 Integration', icon: '📜' }
          ].map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id as any)}
              className={`w-full p-8 rounded-[2.5rem] text-left transition-all border ${
                activeLayer === layer.id 
                  ? 'bg-amber-600 border-amber-400 text-white shadow-[0_0_40px_rgba(245,158,11,0.2)]' 
                  : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              <div className="text-3xl mb-4">{layer.icon}</div>
              <h3 className="text-lg font-mystical font-bold uppercase tracking-widest">{layer.label}</h3>
              <p className="text-[9px] font-black uppercase tracking-tighter opacity-60">{layer.detail}</p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          <div className="glass rounded-[4rem] p-16 bg-black/60 border-amber-500/10 min-h-[600px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <span className="text-[200px] font-mystical">🔱</span>
            </div>
            
            <div className="relative z-10 space-y-12">
              {activeLayer === 'root' && (
                <div className="animate-in fade-in slide-in-from-right-8">
                  <h3 className="text-4xl font-mystical font-bold text-white mb-6 uppercase tracking-widest">Post-Scarcity Safeguards</h3>
                  <p className="text-white/60 text-lg leading-relaxed font-light mb-12">
                    Desperation breeds violence; scarcity is the prime entropy. We weaponize abundance through the Root Layer, ensuring every sovereign node has the resources to transcend conflict.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button onClick={() => synthesizeProtocol('3D-Printed Havens')} className="p-6 glass rounded-2xl border-white/5 hover:bg-amber-600/10 transition-all text-left group">
                      <h4 className="text-amber-200 font-bold uppercase tracking-widest mb-1 group-hover:text-amber-400">3D-Printed Havens</h4>
                      <p className="text-[10px] text-white/30 uppercase">Automated Housing Protocols</p>
                    </button>
                    <button onClick={() => synthesizeProtocol('Vertical Biospheres')} className="p-6 glass rounded-2xl border-white/5 hover:bg-amber-600/10 transition-all text-left group">
                      <h4 className="text-amber-200 font-bold uppercase tracking-widest mb-1 group-hover:text-amber-400">Vertical Biospheres</h4>
                      <p className="text-[10px] text-white/30 uppercase">Autonomous Nutrient Loops</p>
                    </button>
                  </div>
                </div>
              )}

              {activeLayer === 'empathy' && (
                <div className="animate-in fade-in slide-in-from-right-8">
                  <h3 className="text-4xl font-mystical font-bold text-white mb-6 uppercase tracking-widest">Empathy Simulation</h3>
                  <p className="text-white/60 text-lg leading-relaxed font-light mb-12">
                    Violence is a failure of imagination. Our empathy engines leverage Gemini-powered neural scripting to rewire the pathways of harm, fostering profound connection through simulated perspective.
                  </p>
                  <div className="flex gap-4">
                     <button onClick={() => synthesizeProtocol('Victim Perspective Neural Script')} className="flex-grow py-5 glass rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] border-amber-500/20 hover:bg-amber-600 text-amber-100 transition-all shadow-xl">
                       Synthesize Empathy Script
                     </button>
                  </div>
                </div>
              )}

              {activeLayer === 'governance' && (
                <div className="animate-in fade-in slide-in-from-right-8">
                  <h3 className="text-4xl font-mystical font-bold text-white mb-6 uppercase tracking-widest">Sovereign DAO Flow</h3>
                  <p className="text-white/60 text-lg leading-relaxed font-light mb-12">
                    Governance without overlords. Resources on Base Mainnet flow through smart contracts that auto-distribute based on biometric proof-of-need. Immutable, unhackable, unyielding.
                  </p>
                  <div className="bg-black/80 p-8 rounded-[2.5rem] border border-amber-500/10 space-y-6">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                       <span className="text-amber-500">Contract ID</span>
                       <span className="text-white/40 font-mono">0x8453_REVELATION_DAO_V1</span>
                    </div>
                    <div className="w-full h-[2px] bg-amber-500/10"></div>
                    <div className="grid grid-cols-3 gap-8 text-center">
                        <div>
                           <p className="text-2xl font-mystical text-white">12.4M</p>
                           <p className="text-[8px] font-black text-white/20 uppercase tracking-tighter">TVL Syntropy</p>
                        </div>
                        <div>
                           <p className="text-2xl font-mystical text-white">84k</p>
                           <p className="text-[8px] font-black text-white/20 uppercase tracking-tighter">Nodes Fed</p>
                        </div>
                        <div>
                           <p className="text-2xl font-mystical text-white">0.00</p>
                           <p className="text-[8px] font-black text-white/20 uppercase tracking-tighter">Conflict Incidents</p>
                        </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12">
              {isSynthesizing ? (
                <div className="p-12 glass rounded-[3rem] border-amber-500/20 flex flex-col items-center gap-8">
                  <div className="w-16 h-16 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin"></div>
                  <p className="font-mystical text-amber-200 tracking-[0.6em] uppercase animate-pulse">Forging Protocol</p>
                </div>
              ) : protocolOutput ? (
                <div className="p-12 glass rounded-[3rem] bg-black border-amber-500/30 animate-in zoom-in-95 duration-500">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.8em]">Verified Revelation Artifact</span>
                    <button onClick={() => setProtocolOutput(null)} className="text-white/20 hover:text-white/60 text-[10px] font-black uppercase">Close</button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar pr-4">
                    <p className="text-sm text-white/80 leading-relaxed font-light whitespace-pre-wrap italic">
                      {protocolOutput}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center opacity-20 italic">
                  <p className="text-[10px] font-black uppercase tracking-[1em]">Select Layer to Manifest Prototype</p>
                </div>
              )}
            </div>
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

export default TheCovenant;
