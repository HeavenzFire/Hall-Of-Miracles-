
import React, { useState, useEffect } from 'react';
import { TreasuryProposal } from '../types';

const TheTreasury: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [proposals, setProposals] = useState<TreasuryProposal[]>([]);
  const [isProposing, setIsProposing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    recipient: '',
    amount: 0,
    asset: 'ETH' as 'ETH' | 'LEGION'
  });

  const [governorAddress, setGovernorAddress] = useState('0x8453_LEGION_GOVERNOR_SEPOLIA_01');
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
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="text-center mb-16 space-y-4">
        <h2 className="font-mystical text-7xl tracking-tighter text-slate-300 uppercase">Public-Goods Treasury</h2>
        <p className="text-[11px] text-slate-500 font-black tracking-[1.2em] uppercase">Multi-Asset Resource Layer</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Treasury Status */}
        <div className="lg:col-span-1 space-y-6 sticky top-8">
          <div className="glass rounded-[3rem] p-10 bg-black/60 border-white/5 space-y-8 shadow-2xl">
            <div className="space-y-6">
              <div className="text-center space-y-1">
                 <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Vault ETH</p>
                 <p className="text-4xl font-mystical text-white">{balances.eth.toFixed(2)} <span className="text-xs opacity-30">ETH</span></p>
              </div>
              <div className="text-center space-y-1">
                 <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Vault LEGION</p>
                 <p className="text-4xl font-mystical text-purple-400">{balances.legion.toLocaleString()} <span className="text-xs opacity-30">LT</span></p>
              </div>
            </div>
            
            <div className="w-full h-[1px] bg-white/5"></div>
            
            <div className="space-y-4">
               <div className="flex justify-between items-center text-xs">
                 <span className="text-white/20 uppercase font-black">Governor</span>
                 <span className="text-white/60 font-mono text-[9px]">{governorAddress.substring(0, 18)}...</span>
               </div>
               <div className="flex justify-between items-center text-xs">
                 <span className="text-white/20 uppercase font-black">Proposals</span>
                 <span className="text-white/60">{proposals.length} Managed</span>
               </div>
            </div>

            <button 
              onClick={() => setIsProposing(true)}
              className="w-full py-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.5em] transition-all text-white"
            >
              Propose Stability Grant
            </button>
          </div>

          <div className="glass rounded-[2rem] p-8 border-white/5 bg-black/40">
            <h4 className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] mb-4">Registry Metadata</h4>
            <div className="space-y-3">
               <div className="flex justify-between text-[10px]">
                  <span className="text-white/20 uppercase">Network</span>
                  <span className="text-emerald-500 font-bold">Base Sepolia</span>
               </div>
               <div className="flex justify-between text-[10px]">
                  <span className="text-white/20 uppercase">Governance</span>
                  <span className="text-purple-400 font-bold italic">Hybrid Nexus</span>
               </div>
            </div>
          </div>
        </div>

        {/* Proposals List */}
        <div className="lg:col-span-2 space-y-6">
          {isProposing ? (
            <div className="glass rounded-[3rem] p-12 bg-black border-emerald-500/10 animate-in slide-in-from-right-8">
              <h3 className="text-xl font-mystical font-bold text-white uppercase tracking-wider mb-8 italic">Draft Stability Proposal</h3>
              <form onSubmit={handleSubmitProposal} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Proposal Title</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Expand Aegis Grid to Sector 9"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm text-white outline-none focus:border-emerald-500/50"
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Strategic Description</label>
                    <textarea 
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm text-white outline-none focus:border-emerald-500/50 min-h-[120px] resize-none"
                      placeholder="Define the harm-reduction impact..."
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1 col-span-1">
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Asset</label>
                      <select 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500/50 text-white"
                        onChange={e => setFormData({...formData, asset: e.target.value as any})}
                      >
                        <option value="ETH">ETH</option>
                        <option value="LEGION">LEGION</option>
                      </select>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Amount</label>
                      <input 
                        required
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500/50 text-white font-mono"
                        onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Recipient Address</label>
                    <input 
                      required
                      type="text" 
                      placeholder="0x..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500/50 text-white font-mono"
                      onChange={e => setFormData({...formData, recipient: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setIsProposing(false)} className="flex-grow py-5 glass rounded-xl text-[10px] font-black uppercase text-white/40">Cancel</button>
                  <button type="submit" className="flex-[2] py-5 bg-emerald-600 rounded-xl text-[10px] font-black uppercase text-white shadow-xl">Submit to Governor</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              {proposals.slice().reverse().map(p => (
                <div key={p.id} className={`glass p-10 rounded-[2.5rem] border-white/5 transition-all group ${p.executed ? 'opacity-40 grayscale-[0.5]' : 'hover:border-emerald-500/20 shadow-2xl bg-black/40'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[8px] font-black bg-white/5 px-2 py-0.5 rounded uppercase text-white/40">GRANT_{p.id.toString().padStart(3, '0')}</span>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${p.executed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400 animate-pulse'}`}>
                          {p.executed ? 'Executed' : 'Voting In Progress'}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-white uppercase tracking-widest italic">{p.title}</h4>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-mystical ${p.description.includes('[LEGION]') ? 'text-purple-400' : 'text-white'}`}>
                        {p.amount.toLocaleString()} <span className="text-xs opacity-40">{p.description.includes('[LEGION]') ? 'LT' : 'ETH'}</span>
                      </p>
                      <p className="text-[9px] font-mono text-white/30 truncate max-w-[120px] ml-auto">{p.recipient}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-white/60 leading-relaxed mb-6 font-light italic">"{p.description.replace(/\[.*?\] /, '')}"</p>
                  
                  <div className="flex justify-between items-center">
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
          )}
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
    </div>
  );
};

export default TheTreasury;
