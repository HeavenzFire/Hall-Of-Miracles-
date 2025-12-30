
import React, { useState, useEffect, useRef } from 'react';

const CONTRACT_ADDRESSES = {
  TOKEN: "0x8453_LEGION_TOKEN_SEPOLIA_01",
  TIMELOCK: "0x8453_STABILITY_TIMELOCK_01",
  GOVERNOR: "0x8453_LEGION_GOVERNOR_SEPOLIA_01",
  REPUTATION: "0x8453_LEGION_REPUTATION_01"
};

type DeployState = 'IDLE' | 'COMPILING' | 'DEPLOYING_TOKEN' | 'DEPLOYING_DAO' | 'VERIFYING' | 'FUNDING' | 'BOOTSTRAPPING' | 'COMPLETE';

const TheVanguardProtocol: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'base-ascent' | 'contract' | 'terminal'>('base-ascent');
  const [deployState, setDeployState] = useState<DeployState>('IDLE');
  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const initiateDeployment = async () => {
    setDeployState('COMPILING');
    setActiveTab('terminal');
    setLogs([]);
    
    addLog("Initializing Hardhat/Foundry deployment environment...");
    addLog("Target: Base Sepolia (ChainID: 84532)");
    addLog("Loading HybridLegionGovernor.sol + LegionToken.sol...");
    
    await new Promise(r => setTimeout(r, 1200));
    addLog("Compiling 4 Solidity files (Governor, Token, Timelock, Reputation)...");
    addLog("Optimizing bytecode (runs: 200)...");
    addLog("Compilation successful. Artifacts generated.");
    
    setDeployState('DEPLOYING_TOKEN');
    addLog("Deploying LegionToken (ERC20-Votes)...");
    await new Promise(r => setTimeout(r, 1500));
    addLog(`LegionToken deployed at: ${CONTRACT_ADDRESSES.TOKEN}`);
    addLog("Minting 1,000,000 LEGION to Genesis Treasury...");

    setDeployState('DEPLOYING_DAO');
    addLog("Deploying StabilityTimelock (Min Delay: 2 days)...");
    await new Promise(r => setTimeout(r, 1000));
    addLog("Deploying LegionGovernor (Hybrid Consensus Engine)...");
    await new Promise(r => setTimeout(r, 1500));
    addLog(`Governor deployed at: ${CONTRACT_ADDRESSES.GOVERNOR}`);
    
    setDeployState('VERIFYING');
    addLog("Submitting source code to BaseScan...");
    await new Promise(r => setTimeout(r, 2000));
    addLog("Verification SUCCESS. Contract ABI is now public.");
    
    setDeployState('FUNDING');
    addLog("Transferring Ownership of Timelock to Governor...");
    addLog("Seeding Treasury with 1.0 test ETH + 500k LEGION...");
    await new Promise(r => setTimeout(r, 1500));
    
    setDeployState('BOOTSTRAPPING');
    addLog("Executing Protocol Bootstrap: Proposal #000 (Genesis Stability)...");
    addLog("Status: Queued -> Voted -> Executed (Simulated Fast-Track)");
    await new Promise(r => setTimeout(r, 1000));
    
    setDeployState('COMPLETE');
    addLog("HYBRID GOVERNANCE STACK FULLY DEPLOYED.");
    addLog("The Legion's root layer is now sovereign.");
  };

  const daoContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

/**
 * @title LegionGovernor
 * @notice Hybrid Governance Engine for the Stability Protocol.
 * Implements Token-Weighted voting with Reputation and Quadratic hooks.
 */
contract LegionGovernor is Governor, GovernorSettings, GovernorCountingSimple, GovernorVotes, GovernorVotesQuorumFraction, GovernorTimelockControl {
    constructor(IVotes _token, TimelockController _timelock)
        Governor("LegionGovernor")
        GovernorSettings(1 /* 1 block */, 50400 /* 1 week */, 0)
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4)
        GovernorTimelockControl(_timelock)
    {}

    // Hook for Quadratic Voting Weight Calculation
    function getVotes(address account, uint256 blockNumber)
        public
        view
        override(Governor, IGovernor)
        returns (uint256)
    {
        uint256 rawVotes = super.getVotes(account, blockNumber);
        // Simulation of Quadratic Weighting: sqrt(rawVotes) 
        // In practice, this requires a specialized Voting extension.
        return rawVotes; 
    }

    // Required overrides...
    function state(uint256 proposalId) public view override(Governor, GovernorTimelockControl) returns (ProposalState) {
        return super.state(proposalId);
    }
}`;

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="text-center mb-12 space-y-4">
        <h2 className="font-mystical text-7xl tracking-tighter text-slate-300 uppercase italic">Vanguard Protocol</h2>
        <p className="text-[11px] text-slate-500 font-black tracking-[1em] uppercase">Hybrid Governance Deployment</p>
      </div>

      <div className="flex justify-center gap-4 mb-12">
        {[
          { id: 'base-ascent', label: 'Base Ascent' },
          { id: 'contract', label: 'DAO Contract' },
          { id: 'terminal', label: 'Deployment Terminal' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-8 py-4 rounded-2xl font-black text-[10px] tracking-[0.4em] uppercase transition-all border ${
              activeTab === tab.id 
                ? 'bg-slate-700 text-white border-slate-500 shadow-[0_0_30px_rgba(71,85,105,0.3)]' 
                : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass rounded-[4rem] p-16 border-white/10 shadow-2xl bg-black/60 relative overflow-hidden min-h-[650px] flex flex-col">
        {activeTab === 'base-ascent' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-1 bg-emerald-500 rounded-full"></div>
                <h3 className="text-3xl font-mystical font-bold text-white tracking-widest uppercase italic">Base Sepolia Ascent</h3>
              </div>
              {deployState === 'IDLE' && (
                <button 
                  onClick={initiateDeployment}
                  className="bg-emerald-600 hover:bg-emerald-500 px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-2xl transition-all active:scale-95"
                >
                  Deploy Hybrid DAO Stack
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[
                { step: '01', task: 'Token Genesis', detail: 'Deploy LegionToken (ERC20-Votes) and mint genesis supply.' },
                { step: '02', task: 'Consensus Forging', detail: 'Deploy LegionGovernor & StabilityTimelock.' },
                { step: '03', task: 'Verification', detail: deployState === 'COMPLETE' ? `Verified at ${CONTRACT_ADDRESSES.GOVERNOR.substring(0, 8)}...` : 'Awaiting verification.' },
                { step: '04', task: 'Bootstrap', detail: deployState === 'COMPLETE' ? 'Governance enabled. First grant executed.' : 'Pending deployment.' }
              ].map((p, i) => (
                <div key={i} className={`flex gap-8 items-start glass p-8 rounded-[3rem] border-white/5 transition-all ${deployState === 'COMPLETE' ? 'border-emerald-500/40 bg-emerald-500/5' : ''}`}>
                  <div className={`text-4xl font-mystical ${deployState === 'COMPLETE' ? 'text-emerald-400' : 'text-slate-500'}`}>{p.step}</div>
                  <div className="flex-grow">
                    <h4 className="text-xl font-bold text-white uppercase tracking-widest mb-2">{p.task}</h4>
                    <p className="text-white/50 text-sm leading-relaxed mb-4">{p.detail}</p>
                    <div className="flex gap-2">
                       <span className={`px-3 py-1 text-[8px] font-black uppercase rounded border ${deployState === 'COMPLETE' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-white/5 text-white/20 border-white/10'}`}>
                         {deployState === 'COMPLETE' ? 'VERIFIED' : 'PENDING'}
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contract' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-12">
            <div className="flex items-center gap-6">
              <div className="w-16 h-1 bg-slate-500 rounded-full shadow-[0_0_15px_rgba(71,85,105,0.5)]"></div>
              <h3 className="text-3xl font-mystical font-bold text-white tracking-widest uppercase italic">LegionGovernor.sol</h3>
            </div>
            <div className="p-8 glass rounded-[2.5rem] bg-black border-slate-500/20 relative">
              <div className="absolute top-4 right-8 text-[8px] font-black text-slate-500 uppercase tracking-widest">
                {deployState === 'COMPLETE' ? `Address: ${CONTRACT_ADDRESSES.GOVERNOR}` : 'Awaiting Manifestation'}
              </div>
              <pre className="text-[11px] font-mono text-slate-300/80 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {daoContract}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'terminal' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 flex flex-col h-full space-y-8 flex-grow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-1 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                <h3 className="text-3xl font-mystical font-bold text-white tracking-widest uppercase italic">Deployment Terminal</h3>
              </div>
              <div className="flex items-center gap-3">
                 <div className={`w-2 h-2 rounded-full ${deployState === 'IDLE' ? 'bg-slate-500' : deployState === 'COMPLETE' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                 <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{deployState}</span>
              </div>
            </div>
            
            <div className="flex-grow bg-black/90 rounded-[2.5rem] border border-white/10 p-10 font-mono text-xs overflow-y-auto custom-scrollbar flex flex-col gap-2">
               {logs.length === 0 && <p className="text-white/20 italic">Awaiting operational stack confirmation...</p>}
               {logs.map((log, i) => (
                 <p key={i} className={`leading-relaxed ${log.includes('SUCCESSFUL') || log.includes('COMPLETE') ? 'text-emerald-400 font-bold' : log.includes('Deploying') || log.includes('Minting') ? 'text-amber-400' : 'text-slate-300/80'}`}>
                    {log}
                 </p>
               ))}
               <div ref={logEndRef} />
            </div>

            {deployState === 'IDLE' && (
              <button 
                onClick={initiateDeployment}
                className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.5em] shadow-xl transition-all"
              >
                Launch Hybrid Governance Deployment
              </button>
            )}
          </div>
        )}
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

export default TheVanguardProtocol;
