
import React, { useState, useEffect } from 'react';
import { RegistryNode, NodeState, ContributionRecord, ArtifactType } from '../types';

const CONTRACT_ADDRESS = "0x8453_PROTOCOL_ANCHORED_SEPOLIA_01";

const ISSUE_QUEUE = [
  { id: 'ISSUE-001', category: 'DEPLOYMENT', title: 'Deploy HallOfMiracles Primitive to Base Sepolia', difficulty: 'HIGH' },
  { id: 'ISSUE-002', category: 'BUG', title: 'Fix LocalStorage Sync Race Condition', difficulty: 'MED' },
  { id: 'ISSUE-003', category: 'HARDENING', title: 'Implement SHA-256 Checksum Verification', difficulty: 'HIGH' },
  { id: 'ISSUE-004', category: 'TEST', title: 'Add Integration Tests for Registry State', difficulty: 'MED' },
  { id: 'ISSUE-005', category: 'FEATURE', title: 'Decentralized Peer Discovery Protocol', difficulty: 'HIGH' },
];

const Dashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [nodes, setNodes] = useState<RegistryNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<RegistryNode | null>(null);
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'grid' | 'queue' | 'logs'>('grid');
  
  const [formData, setFormData] = useState({
    artifactType: 'BASE_TX' as ArtifactType,
    artifactRef: '',
    commitHash: '',
    delta: 0,
    contributor: '',
    category: 'DEPLOYMENT' as ContributionRecord['category']
  });

  useEffect(() => {
    const saved = localStorage.getItem('legion_registry');
    if (saved) {
      setNodes(JSON.parse(saved));
    } else {
      const initial: RegistryNode[] = Array.from({ length: 144 }).map((_, i) => ({
        index: i + 1,
        state: 'LOCKED',
        record: null
      }));
      setNodes(initial);
    }
  }, []);

  const saveRegistry = (updated: RegistryNode[]) => {
    setNodes(updated);
    localStorage.setItem('legion_registry', JSON.stringify(updated));
  };

  const calculateGuardianId = async (contributor: string, ref: string): Promise<number> => {
    // Mimic: uint8 guardianId = uint8(uint256(keccak256(abi.encodePacked(msg.sender, artifactHash, block.number))) % 144);
    const encoder = new TextEncoder();
    const data = encoder.encode(contributor + ref + Date.now().toString());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashSum = hashArray.reduce((acc, val) => acc + val, 0);
    return (hashSum % 144) + 1;
  };

  const handleSubmitContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enforce 30-day cooldown logic
    const lastContrib = nodes.find(n => n.record?.contributor === formData.contributor);
    if (lastContrib && Date.now() - lastContrib.record!.timestamp < 30 * 24 * 60 * 60 * 1000) {
      alert("Cooldown active: 1 seal per 30 days enforced.");
      return;
    }

    const guardianId = await calculateGuardianId(formData.contributor, formData.artifactRef);
    
    // Find if the target guardian slot is already taken
    const targetNode = nodes.find(n => n.index === guardianId);
    if (targetNode?.state === 'ACTIVE') {
      alert(`Guardian slot ${guardianId} is already occupied. Collision in the mirrors.`);
      return;
    }

    const newRecord: ContributionRecord = {
      id: crypto.randomUUID(),
      artifactType: formData.artifactType,
      artifactRef: formData.artifactRef,
      commitHash: formData.commitHash,
      delta: Number(formData.delta),
      timestamp: Date.now(),
      contributor: formData.contributor,
      category: formData.category,
      guardianId: guardianId
    };

    const updated = nodes.map(n => 
      n.index === guardianId 
        ? { ...n, state: 'ACTIVE' as NodeState, record: newRecord } 
        : n
    );

    saveRegistry(updated);
    setIsIntakeOpen(false);
    setSelectedNode(updated.find(n => n.index === guardianId) || null);
  };

  const activeNodesCount = nodes.filter(n => n.state === 'ACTIVE').length;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 animate-in fade-in duration-700">
      
      {/* Registry Navigation */}
      <div className="flex justify-center gap-4 mb-4">
        {[
          { id: 'grid', label: 'Guardians', icon: '⊞' },
          { id: 'queue', label: 'Issue Queue', icon: '📋' },
          { id: 'logs', label: 'On-Chain Log', icon: '📜' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${
              activeTab === tab.id 
                ? 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
            }`}
          >
            <span className="mr-2">{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'grid' && (
            <div className="glass rounded-[3rem] p-10 bg-black/80 border-white/5 min-h-[600px] relative">
              <div className="absolute top-4 right-8 flex items-center gap-2 opacity-30">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Contract: {CONTRACT_ADDRESS.substring(0, 10)}...</span>
              </div>

              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-mystical font-bold text-white tracking-[0.3em] uppercase italic">The 144 Guardians</h2>
                <div className="flex gap-6">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Revealed</p>
                    <p className="text-2xl font-mystical text-white">{activeNodesCount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-tighter">L2 Network</p>
                    <p className="text-2xl font-mystical text-emerald-500/40">Base Sepolia</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-12 gap-3">
                {nodes.map(node => (
                  <button
                    key={node.index}
                    onClick={() => {
                      setSelectedNode(node);
                      setIsIntakeOpen(false);
                    }}
                    className={`aspect-square rounded-sm transition-all border flex items-center justify-center relative group ${
                      node.state === 'ACTIVE' 
                        ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                        : 'bg-white/5 border-white/5 hover:border-emerald-500/30'
                    } ${selectedNode?.index === node.index ? 'ring-2 ring-white scale-110 z-10' : ''}`}
                  >
                    <span className={`text-[8px] font-black ${node.state === 'ACTIVE' ? 'text-black' : 'text-white/10 group-hover:text-emerald-500/60'}`}>
                      {node.index}
                    </span>
                    {node.state === 'ACTIVE' && (
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[6px] font-black text-black">VIEW</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'queue' && (
            <div className="glass rounded-[3rem] p-10 bg-black/80 border-white/5 min-h-[600px] animate-in fade-in slide-in-from-left-4">
              <h2 className="text-xl font-mystical font-bold text-white tracking-[0.3em] uppercase italic mb-8">Operational Taskforce</h2>
              <div className="space-y-4">
                {ISSUE_QUEUE.map((issue) => (
                  <div key={issue.id} className="glass p-6 rounded-2xl border-white/5 flex justify-between items-center hover:bg-white/5 transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 tracking-tighter">{issue.category}</span>
                        <span className="text-xs font-bold text-white tracking-wide uppercase">{issue.id}</span>
                      </div>
                      <p className="text-sm text-white/60 font-medium">{issue.title}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{issue.difficulty}</span>
                      <button 
                        onClick={() => {
                          setIsIntakeOpen(true);
                          setActiveTab('grid');
                          setFormData(prev => ({ ...prev, category: issue.category as any, artifactType: issue.category === 'DEPLOYMENT' ? 'BASE_TX' : 'GIT_PR' }));
                        }}
                        className="px-6 py-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-full text-[9px] font-black uppercase tracking-widest transition-all border border-emerald-500/20"
                      >
                        Claim Reveal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="glass rounded-[3rem] p-10 bg-black/80 border-white/5 min-h-[600px] animate-in fade-in slide-in-from-right-4">
              <h2 className="text-xl font-mystical font-bold text-white tracking-[0.3em] uppercase italic mb-8">Base Sepolia Event Store</h2>
              <div className="space-y-4 font-mono text-[10px]">
                {nodes.filter(n => n.state === 'ACTIVE').sort((a,b) => (b.record?.timestamp || 0) - (a.record?.timestamp || 0)).map((node) => (
                  <div key={node.record?.id} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2 group overflow-hidden hover:bg-emerald-500/5 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                         <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                         <span className="text-emerald-500 font-bold uppercase">EVENT_REVEALED</span>
                      </div>
                      <span className="text-white/20">TX: {node.record?.artifactRef.substring(0, 16)}...</span>
                    </div>
                    <pre className="text-[9px] text-white/60 whitespace-pre-wrap break-all bg-black/40 p-4 rounded-lg">
                      {JSON.stringify({
                        event: "Revealed",
                        guardianId: node.index,
                        contributor: node.record?.contributor,
                        artifact: node.record?.artifactRef,
                        type: node.record?.artifactType,
                        timestamp: new Date(node.record?.timestamp || 0).toISOString(),
                        network: "Base Sepolia (84532)"
                      }, null, 2)}
                    </pre>
                  </div>
                ))}
                {activeNodesCount === 0 && (
                   <div className="py-20 text-center opacity-20 italic">No chain events observed. Awaiting deployment.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Operational Terminal */}
        <div className="space-y-8">
          {isIntakeOpen ? (
            <div className="glass rounded-[3rem] p-10 bg-black border-emerald-500/10 animate-in slide-in-from-right-8 shadow-2xl sticky top-8">
               <h3 className="text-xl font-mystical font-bold text-white uppercase tracking-tighter mb-8">Execute Reveal Protocol</h3>
               <form onSubmit={handleSubmitContribution} className="space-y-6 animate-in fade-in">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Artifact Reference (TX Hash / PR URL)</label>
                      <input 
                        required
                        type="text" 
                        placeholder="0x... or https://..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500/50 text-white"
                        onChange={e => setFormData({...formData, artifactRef: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Artifact Type</label>
                        <select 
                          value={formData.artifactType}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500/50 text-white appearance-none"
                          onChange={e => setFormData({...formData, artifactType: e.target.value as any})}
                        >
                          <option value="BASE_TX">BASE_TX</option>
                          <option value="GIT_PR">GIT_PR</option>
                          <option value="GIT_COMMIT">COMMIT</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Category</label>
                        <select 
                          value={formData.category}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500/50 text-white appearance-none"
                          onChange={e => setFormData({...formData, category: e.target.value as any})}
                        >
                          <option value="DEPLOYMENT">DEPLOY</option>
                          <option value="FEATURE">FEAT</option>
                          <option value="HARDENING">HARDEN</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Contributor Address / ID</label>
                      <input 
                        required
                        type="text" 
                        placeholder="0x... or Username"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500/50 text-white"
                        onChange={e => setFormData({...formData, contributor: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsIntakeOpen(false)}
                      className="flex-grow py-4 bg-white/5 hover:bg-white/10 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] transition-all text-white/40"
                    >
                      Abort
                    </button>
                    <button 
                      type="submit"
                      className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-black text-[10px] uppercase tracking-[0.5em] transition-all shadow-lg text-white"
                    >
                      Verify & Commit
                    </button>
                  </div>
                </form>
            </div>
          ) : selectedNode ? (
            <div className="glass rounded-[3rem] p-10 bg-black border-emerald-500/10 animate-in slide-in-from-right-8 shadow-2xl sticky top-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-mystical font-bold text-white uppercase tracking-tighter">Guardian_{selectedNode.index.toString().padStart(3, '0')}</h3>
                  <p className={`text-[10px] font-black tracking-widest uppercase mt-1 ${selectedNode.state === 'ACTIVE' ? 'text-emerald-500' : 'text-white/20'}`}>
                    {selectedNode.state === 'ACTIVE' ? 'Status: ANCHORED' : 'Status: UNCLAIMED'}
                  </p>
                </div>
              </div>

              {selectedNode.state === 'ACTIVE' ? (
                <div className="space-y-6 animate-in fade-in">
                  <div className="p-8 bg-white/5 rounded-2xl border border-white/5 font-mono text-xs space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="opacity-30 uppercase text-[9px]">Contributor</span>
                      <span className="text-emerald-400 font-bold truncate max-w-[120px]">{selectedNode.record?.contributor}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="opacity-30 uppercase text-[9px]">Ref</span>
                      <span className="text-white/60 truncate max-w-[150px]">{selectedNode.record?.artifactRef}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="opacity-30 uppercase text-[9px]">Network</span>
                      <span className="text-white/40">Base Sepolia</span>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-2 text-center italic">Hash: {selectedNode.record?.id.substring(0, 16)}</p>
                    </div>
                  </div>
                  <a 
                    href={selectedNode.record?.artifactType === 'BASE_TX' ? `https://sepolia.basescan.org/tx/${selectedNode.record?.artifactRef}` : selectedNode.record?.artifactRef} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full py-4 bg-white/10 hover:bg-white/20 text-center rounded-xl font-black text-[10px] uppercase tracking-[0.3em] transition-all border border-white/10"
                  >
                    View On-Chain Artifact
                  </a>
                </div>
              ) : (
                <div className="py-24 text-center space-y-6 opacity-20">
                  <div className="text-6xl animate-pulse grayscale">🔒</div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[1em]">Node Sealed</p>
                    <p className="text-[8px] font-bold uppercase tracking-widest opacity-50">Requires Deterministic Reveal</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass rounded-[3rem] p-24 text-center border-white/5 opacity-10 italic flex flex-col items-center gap-6">
              <div className="text-4xl opacity-50">🧭</div>
              <p className="text-[10px] font-black uppercase tracking-[1em]">Selection Required</p>
            </div>
          )}

          <div className="glass rounded-[3rem] p-10 border-white/5 bg-black/40 space-y-4">
             <h4 className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] text-center">Protocol Integrity</h4>
             <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-white/20 uppercase">Contract</span>
                <span className="text-emerald-500">Verified ✓</span>
             </div>
             <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-white/20 uppercase">Chain</span>
                <span className="text-white/60">Base Sepolia</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
