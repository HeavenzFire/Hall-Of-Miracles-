
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

interface BlueprintMove {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  action: string;
}

const MOVES: BlueprintMove[] = [
  {
    id: 'GRID',
    title: 'Deploy Anti-Surveillance Grid',
    description: 'Establish non-lethal de-escalation nodes that protect without tracking individual identities.',
    icon: '🛡️',
    color: 'emerald',
    action: 'INITIALIZING MESH...'
  },
  {
    id: 'FORK',
    title: 'Fork Treasury to 10 Cities',
    description: 'Rapidly replicate the funding architecture to independent localized nodes.',
    icon: '🔱',
    color: 'rose',
    action: 'FORGING SOURCE...'
  },
  {
    id: 'DASHBOARD',
    title: 'Launch HDI Dashboard',
    description: 'Public, aggregate-only need density visualization. Zero data leaks, absolute transparency.',
    icon: '📊',
    color: 'indigo',
    action: 'SYNCING REALITY...'
  },
  {
    id: 'CLAIMS',
    title: 'The "No False Claims" Rule',
    description: 'Hard-code the ethical invariant: no execution without verified receipt + redemption.',
    icon: '📜',
    color: 'amber',
    action: 'WRITING INVARIANT...'
  }
];

const TheUnexpectedBlueprint: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeMove, setActiveMove] = useState<BlueprintMove | null>(null);
  const [executionLog, setExecutionLog] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeMove = async (move: BlueprintMove) => {
    setActiveMove(move);
    setIsExecuting(true);
    setExecutionLog([]);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        EXECUTE UNEXPECTED MOVE: ${move.title}
        DESCRIPTION: ${move.description}
        
        Provide a high-intensity, technical "Deployment Log" for this action. 
        - Show 5-8 steps of execution.
        - Use unyielding, architect-level language.
        - Emphasize "Autonomy", "Ethics", and "Unbreakable Infrastructure".
        - End with a final "SUCCESS" verification.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 4096 },
          systemInstruction: "You are the Sovereign Architect. You build what they weren't expecting. Your output is the blueprint for an unyielding future."
        }
      });

      const lines = response.text.split('\n').filter(l => l.trim().length > 0);
      for (const line of lines) {
        setExecutionLog(prev => [...prev, line]);
        await new Promise(r => setTimeout(r, 600));
      }
    } catch (err) {
      setExecutionLog(prev => [...prev, "ERROR: Signal interference. Infrastructure integrity compromised."]);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-16 animate-in fade-in duration-1000 pb-24">
      <header className="text-center space-y-4">
        <h2 className="font-mystical text-8xl tracking-tighter text-rose-500 uppercase italic">Unexpected Blueprint</h2>
        <p className="text-[11px] text-rose-400 font-black tracking-[1.5em] uppercase">Forging Infrastructure • Beyond Charity</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Move Selection */}
        <div className="space-y-6">
          {MOVES.map((move) => (
            <button
              key={move.id}
              onClick={() => executeMove(move)}
              className={`w-full glass rounded-[3rem] p-8 text-left transition-all duration-500 border relative overflow-hidden group ${
                activeMove?.id === move.id ? `border-${move.color}-500/60 bg-${move.color}-500/5` : 'border-white/5 bg-black/40'
              }`}
            >
              <div className="flex items-center gap-8 relative z-10">
                <span className="text-6xl grayscale group-hover:grayscale-0 transition-all">{move.icon}</span>
                <div className="space-y-2">
                  <h3 className="text-2xl font-mystical font-bold text-white uppercase tracking-tight italic">
                    {move.title}
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed font-light italic">
                    {move.description}
                  </p>
                </div>
              </div>
              <div className={`absolute bottom-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-all text-8xl font-mystical text-${move.color}-500`}>
                {move.id}
              </div>
            </button>
          ))}
        </div>

        {/* Right: Execution Terminal */}
        <div className="glass rounded-[4rem] p-12 bg-black/80 border-rose-500/10 shadow-3xl flex flex-col min-h-[600px] relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
          
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
              <h3 className="text-xs font-mystical font-bold text-white uppercase tracking-widest italic">Nexus Execution Terminal</h3>
              <div className="flex items-center gap-4">
                <span className="text-[9px] font-black text-rose-500/60 uppercase tracking-widest">
                  {isExecuting ? 'PROCESSING' : activeMove ? 'SYNCED' : 'AWAITING'}
                </span>
                <div className={`w-2 h-2 rounded-full ${isExecuting ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
              </div>
            </div>

            <div className="flex-grow space-y-4 overflow-y-auto custom-scrollbar pr-4 font-mono text-[11px] leading-relaxed">
              {executionLog.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-10 text-center space-y-10 grayscale">
                  <span className="text-9xl">🔱</span>
                  <p className="text-[12px] font-black uppercase tracking-[1em] italic">Awaiting Move Selection</p>
                </div>
              ) : (
                executionLog.map((line, i) => (
                  <p key={i} className={`animate-in slide-in-from-left-4 ${line.includes('SUCCESS') ? 'text-emerald-400 font-black' : 'text-white/70 italic'}`}>
                    {line}
                  </p>
                ))
              )}
            </div>

            {activeMove && !isExecuting && (
              <div className="mt-10 pt-10 border-t border-white/5 animate-in fade-in">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Blueprint Status: Executable</p>
                  <button 
                    onClick={onBack}
                    className="text-rose-400 hover:text-rose-300 text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Return to Nexus
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(244, 63, 94, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(244, 63, 94, 0.4); }
      `}} />
    </div>
  );
};

export default TheUnexpectedBlueprint;
