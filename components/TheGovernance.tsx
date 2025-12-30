
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

interface DAOProposal {
  id: string;
  title: string;
  status: 'ACTIVE' | 'PASSED' | 'EXECUTED' | 'DEFEATED';
  votesFor: number;
  votesAgainst: number;
  deadline: number;
  type: 'TOKEN' | 'QUADRATIC' | 'REPUTATION';
}

const TheGovernance: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [proposals, setProposals] = useState<DAOProposal[]>([
    { id: 'PROP-001', title: 'Fund Urban Vertical Farm Hub (Sector 7)', status: 'ACTIVE', votesFor: 45200, votesAgainst: 1200, deadline: Date.now() + 86400000, type: 'QUADRATIC' },
    { id: 'PROP-002', title: 'Deploy 50 Aegis Grid Nodes to Base Sepolia', status: 'EXECUTED', votesFor: 89000, votesAgainst: 400, deadline: Date.now() - 86400000, type: 'TOKEN' }
  ]);
  
  const [userStats, setUserStats] = useState({
    tokens: 5000,
    reputation: 124,
    quadraticWeight: 70 // sqrt(5000) approx
  });

  const [simulationOutput, setSimulationOutput] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeProposalId, setActiveProposalId] = useState<string | null>(null);

  const castVote = (id: string, support: boolean) => {
    setProposals(prev => prev.map(p => {
      if (p.id === id && p.status === 'ACTIVE') {
        const weight = p.type === 'QUADRATIC' ? userStats.quadraticWeight : userStats.tokens;
        return {
          ...p,
          votesFor: support ? p.votesFor + weight : p.votesFor,
          votesAgainst: !support ? p.votesAgainst + weight : p.votesAgainst
        };
      }
      return p;
    }));
  };

  const analyzeProposal = async (proposal: DAOProposal) => {
    setIsSimulating(true);
    setActiveProposalId(proposal.id);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze this DAO proposal: "${proposal.title}". 
        Voting Mechanism: ${proposal.type}. 
        Current Votes: ${proposal.votesFor} For / ${proposal.votesAgainst} Against.
        Provide a strategic recommendation for a Sovereign Node. Focus on long-term stability impact and syntropy metrics.`,
        config: {
          thinkingConfig: { thinkingBudget: 16384 },
          systemInstruction: "You are the Architect of Governance. You provide deterministic analysis of DAO proposals. Your word is consensus."
        }
      });
      setSimulationOutput(response.text);
    } catch (err) {
      console.error(err);
      setSimulationOutput("Governance signal lost. Re-synchronizing nodes.");
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="text-center mb-16 space-y-4">
        <h2 className="font-mystical text-7xl tracking-tighter text-purple-300 drop-shadow-[0_0_40px_rgba(168,85,247,0.3)] uppercase italic">Consensus Nexus</h2>
        <p className="text-[10px] text-purple-400 font-black tracking-[1em] uppercase">Hybrid DAO Operations Engine</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* User Stats Column */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass rounded-[3rem] p-10 bg-black/60 border-purple-500/10 space-y-8 shadow-2xl">
             <div className="text-center space-y-2">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Node Sovereignty</p>
                <div className="w-20 h-20 bg-purple-600/20 rounded-full mx-auto flex items-center justify-center border border-purple-500/30">
                   <span className="text-3xl">🔱</span>
                </div>
             </div>
             
             <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                   <span className="text-white/20 uppercase font-black">LEGION Tokens</span>
                   <span className="text-white font-mono">{userStats.tokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                   <span className="text-white/20 uppercase font-black">Reputation</span>
                   <span className="text-emerald-400 font-mono">+{userStats.reputation}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                   <span className="text-white/20 uppercase font-black">QV Weight</span>
                   <span className="text-purple-400 font-mono">{userStats.quadraticWeight}</span>
                </div>
             </div>
             
             <div className="w-full h-[1px] bg-white/5"></div>
             
             <p className="text-[9px] text-white/40 leading-relaxed italic text-center">
                "Consensus is the final verification of a node's intent. Impact is the only metric."
             </p>
          </div>
        </div>

        {/* Proposals Column */}
        <div className="lg:col-span-9 space-y-8">
          <div className="grid grid-cols-1 gap-6">
            {proposals.map(p => (
              <div key={p.id} className={`glass p-10 rounded-[3rem] border-white/5 bg-black/40 transition-all ${p.status === 'ACTIVE' ? 'hover:border-purple-500/20' : 'opacity-60'}`}>
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[8px] font-black bg-white/5 px-2 py-0.5 rounded uppercase text-white/40">{p.id}</span>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${p.status === 'ACTIVE' ? 'bg-purple-500/20 text-purple-400 animate-pulse' : 'bg-white/10 text-white/40'}`}>
                        {p.status}
                      </span>
                      <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded uppercase border border-emerald-500/20">
                        {p.type} VOTING
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-white uppercase tracking-widest italic">{p.title}</h4>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="text-right">
                       <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">For</p>
                       <p className="text-xl font-mono text-emerald-400">{p.votesFor.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Against</p>
                       <p className="text-xl font-mono text-rose-400">{p.votesAgainst.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  {p.status === 'ACTIVE' && (
                    <>
                      <button 
                        onClick={() => castVote(p.id, true)}
                        className="px-10 py-3 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-full text-[9px] font-black uppercase tracking-widest transition-all border border-emerald-500/20"
                      >
                        Vote Support
                      </button>
                      <button 
                        onClick={() => castVote(p.id, false)}
                        className="px-10 py-3 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white rounded-full text-[9px] font-black uppercase tracking-widest transition-all border border-rose-500/20"
                      >
                        Vote Reject
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => analyzeProposal(p)}
                    disabled={isSimulating && activeProposalId === p.id}
                    className="px-10 py-3 bg-white/5 hover:bg-white/10 text-white/60 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border border-white/5"
                  >
                    {isSimulating && activeProposalId === p.id ? 'Analyzing...' : 'Oracle Opinion'}
                  </button>
                </div>

                {activeProposalId === p.id && simulationOutput && (
                   <div className="mt-8 p-8 bg-purple-950/20 border border-purple-500/20 rounded-[2.5rem] animate-in slide-in-from-top-4">
                      <div className="flex justify-between items-center mb-4">
                         <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Architectural Assessment</span>
                         <button onClick={() => setSimulationOutput(null)} className="text-white/20 hover:text-white/40 text-[9px] font-black uppercase">Clear</button>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed font-light italic whitespace-pre-wrap">
                        {simulationOutput}
                      </p>
                   </div>
                )}
              </div>
            ))}
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
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(168, 85, 247, 0.4); }
      `}} />
    </div>
  );
};

export default TheGovernance;
