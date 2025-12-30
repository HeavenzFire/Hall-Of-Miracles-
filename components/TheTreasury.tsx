
import React, { useState, useEffect } from 'react';
import { TreasuryProposal } from '../types';
import { GoogleGenAI, Type } from '@google/genai';

const TheTreasury: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [proposals, setProposals] = useState<TreasuryProposal[]>([]);
  const [isProposing, setIsProposing] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [quickInput, setQuickInput] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    recipient: '',
    amount: 0,
    asset: 'ETH' as 'ETH' | 'LEGION'
  });

  const [balances, setBalances] = useState({
    eth: 0.45,
    legion: 500000
  });

  useEffect(() => {
    if (proposals.length === 0) {
      setProposals([{
        id: 0,
        recipient: '0xLegion_Genesis_Node',
        amount: 0.05,
        executed: true,
        title: 'Genesis Stability Bootstrap',
        description: 'Seeding the first operational node of the Legion Network.',
        projectedImpact: 'Network anchor verified.'
      }]);
    }
  }, []);

  const handleQuickCommand = async () => {
    if (!quickInput.trim()) return;
    setIsAIProcessing(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Parse this proposal request into a JSON object: "${quickInput}". 
        The object must have: title, description, recipient, amount (number), asset (ETH or LEGION).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              recipient: { type: Type.STRING },
              amount: { type: Type.NUMBER },
              asset: { type: Type.STRING, enum: ['ETH', 'LEGION'] }
            },
            required: ['title', 'description', 'recipient', 'amount', 'asset']
          },
          systemInstruction: "You are the Treasury Oracle. Parse user natural language into structured proposal data."
        }
      });

      const data = JSON.parse(response.text);
      setFormData(data);
      setIsProposing(true);
      setQuickInput('');
    } catch (err) {
      console.error(err);
      // Fallback: just open the empty form
      setIsProposing(true);
    } finally {
      setIsAIProcessing(false);
    }
  };

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    const newProposal: TreasuryProposal = {
      id: proposals.length,
      recipient: formData.recipient,
      amount: formData.amount,
      executed: false,
      title: formData.title,
      description: `[${formData.asset}] ${formData.description}`,
      projectedImpact: `Estimated stability for ${formData.asset === 'ETH' ? Math.floor(formData.amount * 100) : Math.floor(formData.amount / 10)} nodes.`
    };
    setProposals([...proposals, newProposal]);
    setIsProposing(false);
    setFormData({ title: '', description: '', recipient: '', amount: 0, asset: 'ETH' });
  };

  const executeProposal = (id: number) => {
    setProposals(prev => prev.map(p => 
      p.id === id ? { ...p, executed: true } : p
    ));
    const p = proposals.find(prop => prop.id === id);
    if (p) {
      const asset = p.description.includes('[LEGION]') ? 'legion' : 'eth';
      setBalances(prev => ({
        ...prev,
        [asset]: Math.max(0, prev[asset as keyof typeof prev] - p.amount)
      }));
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-10 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h2 className="font-mystical text-7xl tracking-tighter text-slate-300 uppercase italic">Public-Goods Treasury</h2>
        <p className="text-[11px] text-slate-500 font-black tracking-[1.2em] uppercase">Multi-Asset Resource Layer • Base L2</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-grow">
        {/* Treasury Sidebar */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
          <div className="glass rounded-[3rem] p-10 bg-black/60 border-white/5 space-y-8 shadow-2xl">
            <div className="space-y-6">
              <div className="text-center space-y-1">
                 <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Vault ETH</p>
                 <p className="text-5xl font-mystical text-white">{balances.eth.toFixed(2)} <span className="text-xs opacity-30">ETH</span></p>
              </div>
              <div className="text-center space-y-1">
                 <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Vault LEGION</p>
                 <p className="text-5xl font-mystical text-purple-400">{balances.legion.toLocaleString()} <span className="text-xs opacity-30">LT</span></p>
              </div>
            </div>
            
            <div className="w-full h-[1px] bg-white/5"></div>
            
            <button 
              onClick={() => setIsProposing(true)}
              className="w-full py-6 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 rounded-2xl font-black text-[11px] uppercase tracking-[0.5em] transition-all shadow-xl"
            >
              Draft Stability Grant
            </button>

            <div className="space-y-3 pt-4">
               <div className="flex justify-between items-center text-[10px] font-bold">
                 <span className="text-white/20 uppercase tracking-widest">Registry Sync</span>
                 <span className="text-emerald-500">ACTIVE ✓</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-bold">
                 <span className="text-white/20 uppercase tracking-widest">Pending</span>
                 <span className="text-white/60">{proposals.filter(p => !p.executed).length} Proposals</span>
               </div>
            </div>
          </div>
        </div>

        {/* Main Content: Proposals & Command Bar */}
        <div className="lg:col-span-8 space-y-6 flex flex-col min-h-[700px]">
          {isProposing ? (
            <div className="glass rounded-[3.5rem] p-12 bg-black border-emerald-500/10 animate-in slide-in-from-right-8 shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-mystical font-bold text-white uppercase tracking-wider italic">Execute Grant Proposal</h3>
                <button onClick={() => setIsProposing(false)} className="text-white/20 hover:text-white/60 text-xs font-black uppercase tracking-widest">Abort</button>
              </div>
              
              <form onSubmit={handleSubmitProposal} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Proposal Title</label>
                    <input 
                      required
                      type="text" 
                      value={formData.title}
                      placeholder="e.g. Expand Aegis Grid to Sector 9"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-emerald-500/50"
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Operational Description</label>
                    <textarea 
                      required
                      value={formData.description}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-emerald-500/50 min-h-[120px] resize-none"
                      placeholder="Define the harm-reduction impact..."
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Asset Type</label>
                    <select 
                      value={formData.asset}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-emerald-500/50 text-white appearance-none"
                      onChange={e => setFormData({...formData, asset: e.target.value as any})}
                    >
                      <option value="ETH">ETH</option>
                      <option value="LEGION">LEGION (LT)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Grant Amount</label>
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      value={formData.amount}
                      placeholder="0.00"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-emerald-500/50 font-mono"
                      onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Recipient Address (0x...)</label>
                    <input 
                      required
                      type="text" 
                      value={formData.recipient}
                      placeholder="0x8453..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-emerald-500/50 font-mono"
                      onChange={e => setFormData({...formData, recipient: e.target.value})}
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl font-black text-[12px] uppercase tracking-[0.8em] shadow-2xl transition-all active:scale-95">
                  Submit to Governor
                </button>
              </form>
            </div>
          ) : (
            <>
              <div className="flex-grow space-y-4 overflow-y-auto max-h-[600px] custom-scrollbar pr-2">
                {proposals.slice().reverse().map(p => (
                  <div key={p.id} className={`glass p-10 rounded-[2.5rem] border-white/5 transition-all group ${p.executed ? 'opacity-40 grayscale-[0.5]' : 'hover:border-emerald-500/20 shadow-2xl bg-black/40'}`}>
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="text-[8px] font-black bg-white/5 px-2 py-0.5 rounded uppercase text-white/40">GRANT_{p.id.toString().padStart(3, '0')}</span>
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${p.executed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400 animate-pulse'}`}>
                            {p.executed ? 'ARCHIVED' : 'VOTING'}
                          </span>
                        </div>
                        <h4 className="text-2xl font-mystical font-bold text-white uppercase tracking-widest italic">{p.title}</h4>
                      </div>
                      <div className="text-right">
                        <p className={`text-3xl font-mystical ${p.description.includes('[LEGION]') ? 'text-purple-400' : 'text-white'}`}>
                          {p.amount.toLocaleString()} <span className="text-xs opacity-40">{p.description.includes('[LEGION]') ? 'LT' : 'ETH'}</span>
                        </p>
                        <p className="text-[9px] font-mono text-white/30 truncate max-w-[120px] ml-auto">{p.recipient}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-white/60 leading-relaxed mb-8 font-light italic">"{p.description.replace(/\[.*?\] /, '')}"</p>
                    
                    <div className="flex justify-between items-center border-t border-white/5 pt-6">
                       <div className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest italic">
                          {p.projectedImpact}
                       </div>
                       {!p.executed && (
                         <button 
                           onClick={() => executeProposal(p.id)}
                           className="px-8 py-3 bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white rounded-full text-[9px] font-black uppercase tracking-widest transition-all border border-purple-500/20"
                         >
                           Execute Consensus
                         </button>
                       )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Command Bar: Similar to TheOracle */}
              <div className="p-8 glass rounded-[3rem] bg-black/40 border border-white/10 mt-auto">
                <div className="flex gap-6">
                  <input 
                    type="text" 
                    value={quickInput}
                    onChange={(e) => setQuickInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleQuickCommand()}
                    placeholder="Command a proposal... (e.g. 'Draft a grant for 0.05 ETH to 0x123... for food bank expansion')"
                    className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-sm text-white outline-none focus:border-emerald-500/50 shadow-inner italic"
                    disabled={isAIProcessing}
                  />
                  <button 
                    onClick={handleQuickCommand}
                    disabled={isAIProcessing || !quickInput.trim()}
                    className="px-12 py-5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.5em] transition-all shadow-2xl active:scale-95"
                  >
                    {isAIProcessing ? 'PARSING...' : 'DRAFT'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-8 text-center pb-10">
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
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}} />
    </div>
  );
};

export default TheTreasury;
