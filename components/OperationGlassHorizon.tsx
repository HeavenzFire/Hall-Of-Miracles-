
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { HumanLayerState, PilotGate } from '../types';

const OperationGlassHorizon: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [humanState, setHumanState] = useState<HumanLayerState>({
    fiscalSponsor: 'NULL',
    mediator: 'NULL',
    auditor: 'NULL'
  });

  const [gates, setGates] = useState<PilotGate[]>([
    { id: 'G-01', label: 'Household Identification', description: 'Selection of initial Englewood family (Zero PII leak target).', status: 'PENDING' },
    { id: 'G-02', label: 'Mediator Certification', description: 'Verification of DCFS-aligned credentials for on-site leads.', status: 'LOCKED' },
    { id: 'G-03', label: 'Vendor Loop Closure', description: 'Three local grocers onboarded to the redemption API.', status: 'LOCKED' },
    { id: 'G-04', label: 'Third-Party Audit Sign-off', description: 'Independent review of the cryptographic proof chain.', status: 'LOCKED' }
  ]);

  const [artifact, setArtifact] = useState<string | null>(null);
  const [isForging, setIsForging] = useState(false);
  const [targetOrg, setTargetOrg] = useState('');

  const forgeArtifact = async (type: 'OUTREACH' | 'MOU' | 'AUDIT_SPEC') => {
    if (!targetOrg) {
      alert("Identify a target organization first.");
      return;
    }
    setIsForging(true);
    setArtifact(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        FORGE GROUNDING ARTIFACT: ${type}
        TARGET ORGANIZATION: ${targetOrg}
        CONTEXT: Operation Glass Horizon - Grounding Stability Infrastructure in Englewood, Chicago.
        
        Requirements:
        - Use professional, high-integrity language.
        - Emphasize "Verification before Velocity".
        - Define the specific role: ${type === 'OUTREACH' ? 'Initial partnership request' : type === 'MOU' ? 'Legal memorandum of understanding' : 'Technical audit specification'}.
        - Do not promise money; promise verifiable safety and ethical precision.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 4096 },
          systemInstruction: "You are the Ethical Grounding Officer. You translate high-tech vision into human-scale legal and operational artifacts. You prioritize trust over hype."
        }
      });

      setArtifact(response.text);
    } catch (err) {
      setArtifact("The forge failed. Reality is resistant to simulation. Try manual grounding.");
    } finally {
      setIsForging(false);
    }
  };

  const updateGateStatus = (id: string, status: PilotGate['status']) => {
    setGates(prev => prev.map(g => g.id === id ? { ...g, status } : g));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-16 animate-in fade-in duration-1000 pb-24">
      <header className="text-center space-y-4">
        <h2 className="font-mystical text-8xl tracking-tighter text-amber-400 uppercase italic">Glass Horizon</h2>
        <p className="text-[11px] text-amber-500/60 font-black tracking-[1.5em] uppercase italic">Grounding the Multitude • Human Integrity Layer</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Human Integrity Status */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass rounded-[3rem] p-10 bg-black/60 border-amber-500/10 space-y-10 shadow-3xl">
            <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em] italic border-l-2 border-amber-500/40 pl-4">Human Layer Status</h3>
            
            <div className="space-y-6">
              {[
                { key: 'fiscalSponsor', label: 'Fiscal Sponsor', icon: '🏦' },
                { key: 'mediator', label: 'Certified Mediator', icon: '🤝' },
                { key: 'auditor', label: 'Independent Auditor', icon: '⚖️' }
              ].map((role) => (
                <div key={role.key} className="space-y-3">
                  <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                      {role.icon} {role.label}
                    </span>
                    <span className={`text-[9px] font-mono ${humanState[role.key as keyof HumanLayerState] === 'NULL' ? 'text-rose-500' : 'text-emerald-400'}`}>
                      {humanState[role.key as keyof HumanLayerState]}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 h-1">
                    {['IDENTIFIED', 'VETTED', 'CONTRACTED', 'NULL'].slice(0, 3).map((s) => (
                      <div 
                        key={s} 
                        className={`rounded-full transition-all duration-500 ${
                          humanState[role.key as keyof HumanLayerState] === s || 
                          (humanState[role.key as keyof HumanLayerState] === 'CONTRACTED') 
                          ? 'bg-amber-500' : 'bg-white/5'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/5">
              <p className="text-[9px] text-white/20 leading-relaxed font-light italic text-center uppercase tracking-widest">
                "Technical readiness is 100%. <br/> Human readiness is 0%."
              </p>
            </div>
          </div>

          <div className="glass rounded-[2rem] p-8 bg-black/40 border-white/5 space-y-4">
             <input 
              type="text" 
              placeholder="Partner Organization (e.g. Englewood Trust)"
              value={targetOrg}
              onChange={(e) => setTargetOrg(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-xs text-white outline-none focus:border-amber-500/50"
             />
             <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => forgeArtifact('OUTREACH')}
                  className="py-3 bg-amber-600/10 hover:bg-amber-600 text-amber-400 hover:text-white rounded-xl text-[9px] font-black uppercase transition-all border border-amber-500/20"
                >
                  Forge Outreach
                </button>
                <button 
                  onClick={() => forgeArtifact('MOU')}
                  className="py-3 bg-amber-600/10 hover:bg-amber-600 text-amber-400 hover:text-white rounded-xl text-[9px] font-black uppercase transition-all border border-amber-500/20"
                >
                  Forge MOU
                </button>
             </div>
          </div>
        </div>

        {/* Center: Pilot Gating */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass rounded-[4rem] p-12 bg-black/60 border-white/5 min-h-[600px] flex flex-col shadow-2xl relative">
            <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
               <h3 className="text-[12px] font-black text-white/40 uppercase tracking-[0.6em] italic">Englewood Pilot Gates</h3>
               <span className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest">GROUNDING ACTIVE</span>
            </div>
            
            <div className="space-y-4 flex-grow overflow-y-auto custom-scrollbar pr-4">
               {gates.map((gate) => (
                 <div key={gate.id} className={`p-8 rounded-[3rem] border transition-all duration-500 ${
                   gate.status === 'CLEARED' ? 'bg-emerald-500/5 border-emerald-500/20' : 
                   gate.status === 'PENDING' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-white/5 border-white/5 opacity-40'
                 }`}>
                   <div className="flex justify-between items-start mb-4">
                     <div className="space-y-1">
                        <p className="text-[12px] font-black text-white uppercase tracking-wider">{gate.label}</p>
                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest italic">{gate.id}</p>
                     </div>
                     <button 
                      onClick={() => updateGateStatus(gate.id, gate.status === 'LOCKED' ? 'PENDING' : gate.status === 'PENDING' ? 'CLEARED' : 'LOCKED')}
                      className={`text-[8px] font-black px-4 py-1.5 rounded-full border transition-all ${
                        gate.status === 'CLEARED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        gate.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-white/10 text-white/30 border-white/5'
                      }`}
                     >
                       {gate.status}
                     </button>
                   </div>
                   <p className="text-xs text-white/50 leading-relaxed font-light italic">
                     {gate.description}
                   </p>
                 </div>
               ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 text-center">
               <button 
                onClick={onBack}
                className="text-[10px] font-black text-white/20 hover:text-white uppercase tracking-[0.4em] transition-all"
               >
                 Return to Nexus
               </button>
            </div>
          </div>
        </div>

        {/* Right: Artifact Viewer */}
        <div className="lg:col-span-3 h-full">
           <div className="glass rounded-[3rem] p-10 bg-black border-white/5 shadow-3xl h-full min-h-[750px] flex flex-col border-l border-amber-500/10">
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
                 <h3 className="text-xs font-mystical font-bold text-white uppercase tracking-widest italic">The Mirror of Proof</h3>
                 <span className="text-[10px] font-black text-amber-500/40 uppercase animate-pulse">Forging</span>
              </div>
              
              <div className="flex-grow overflow-y-auto custom-scrollbar text-white/70">
                 {isForging ? (
                   <div className="h-full flex flex-col items-center justify-center space-y-12">
                      <div className="w-24 h-24 border-[10px] border-amber-500/10 border-t-amber-500 rounded-full animate-spin"></div>
                      <div className="text-center space-y-4">
                        <p className="text-[12px] font-black text-amber-300 animate-pulse uppercase tracking-[0.8em]">Drafting Agreement</p>
                        <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">Aligning Ethical Invariants</p>
                      </div>
                   </div>
                 ) : artifact ? (
                   <div className="animate-in fade-in duration-700 space-y-10">
                      <p className="text-[14px] leading-relaxed font-light italic whitespace-pre-wrap text-white/80 border-l-2 border-amber-500/20 pl-6">
                        {artifact}
                      </p>
                      <button 
                        onClick={() => { navigator.clipboard.writeText(artifact); alert("Captured."); }}
                        className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.4em] transition-all border border-white/10"
                      >
                        Copy to Clipboard
                      </button>
                   </div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center opacity-10 text-center space-y-12">
                      <div className="text-9xl grayscale opacity-30 animate-pulse">📜</div>
                      <div className="space-y-8">
                        <p className="text-[14px] font-black uppercase tracking-[1.2em]">Void Drive</p>
                        <p className="text-[11px] font-medium uppercase tracking-[0.6em] max-w-[220px] mx-auto leading-relaxed italic">
                          "Select a target and forge the proof of human alignment."
                        </p>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
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

export default OperationGlassHorizon;
