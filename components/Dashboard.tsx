
import React, { useState, useEffect } from 'react';
import { RegistryNode, NodeState, ContributionRecord } from '../types';

const ISSUE_QUEUE = [
  { id: 'ISSUE-001', category: 'DOCS', title: 'Refine PCR Specification Documentation', difficulty: 'LOW' },
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
    prUrl: '',
    commitHash: '',
    delta: 0,
    contributor: '',
    category: 'DOCS' as ContributionRecord['category']
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

  const handleSubmitContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNode) return;

    // Enforce 30-day cooldown logic (simulated for MVP)
    const lastContrib = nodes.find(n => n.record?.contributor === formData.contributor);
    if (lastContrib && Date.now() - lastContrib.record!.timestamp < 30 * 24 * 60 * 60 * 1000) {
      alert("Cooldown active: 1 seal per 30 days enforced.");
      return;
    }

    const newRecord: ContributionRecord = {
      id: crypto.randomUUID(), // seal_id
      prUrl: formData.prUrl,
      commitHash: formData.commitHash,
      delta: Number(formData.delta),
      timestamp: Date.now(),
      contributor: formData.contributor,
      category: formData.category
    };

    const updated = nodes.map(n => 
      n.index === selectedNode.index 
        ? { ...n, state: 'ACTIVE' as NodeState, record: newRecord } 
        : n
    );

    saveRegistry(updated);
    setIsIntakeOpen(false);
    setSelectedNode(updated.find(n => n.index === selectedNode.index) || null);
  };

  const activeNodesCount = nodes.filter(n => n.state === 'ACTIVE').length;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 animate-in fade-in duration-700">
      
      {/* Registry Navigation */}
      <div className="flex justify-center gap-4 mb-4">
        {[
          { id: 'grid', label: 'Nodes', icon: '⊞' },
          { id: 'queue', label: 'Issue Queue', icon: '📋' },
          { id: 'logs', label: 'Seal Log', icon: '📜' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${
              activeTab === tab.id 
                ? 'bg-emerald-600 border-emerald-400 text-white' 
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
            <div className="glass rounded-[3rem] p-10 bg-black/80 border-white/5 min-h-[600px]">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-mystical font-bold text-white tracking-[0.3em] uppercase italic">Registry Grid</h2>
                <div className="flex gap-6">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Active Seals</p>
                    <p className="text-2xl font-mystical text-white">{activeNodesCount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-tighter">Capacity</p>
                    <p className="text-2xl font-mystical text-emerald-500/40">144</p>
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
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'queue' && (
            <div className="glass rounded-[3rem] p-10 bg-black/80 border-white/5 min-h-[600px] animate-in fade-in slide-in-from-left-4">
              <h2 className="text-xl font-mystical font-bold text-white tracking-[0.3em] uppercase italic mb-8">Open Issue Queue</h2>
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
                          const firstLocked = nodes.find(n => n.state === 'LOCKED');
                          if (firstLocked) {
                            setSelectedNode(firstLocked);
                            setIsIntakeOpen(true);
                            setActiveTab('grid');
                            setFormData(prev => ({ ...prev, category: issue.category as any }));
                          }
                        }}
                        className="px-6 py-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-full text-[9px] font-black uppercase tracking-widest transition-all border border-emerald-500/20"
                      >
                        Claim Task
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="glass rounded-[3rem] p-10 bg-black/80 border-white/5 min-h-[600px] animate-in fade-in slide-in-from-right-4">
              <h2 className="text-xl font-mystical font-bold text-white tracking-[0.3em] uppercase italic mb-8">System Seal Log (JSONL)</h2>
              <div className="space-y-4 font-mono text-[10px]">
                {nodes.filter(n => n.state === 'ACTIVE').sort((a,b) => (b.record?.timestamp || 0) - (a.record?.timestamp || 0)).map((node) => (
                  <div key={node.record?.id} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2 group overflow-hidden">
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-500 font-bold uppercase">SEAL_CONFIRMED</span>
                      <span className="text-white/20">{node.record?.id}</span>
                    </div>
                    <pre className="text-[9px] text-white/60 whitespace-pre-wrap break-all">
                      {JSON.stringify({
                        seal_id: node.record?.id,
                        event_type: "SEAL_CONFIRMED",
                        node_index: node.index,
                        artifact: { type: "git_pr", ref: node.record?.prUrl },
                        verifier: { type: "maintainer", id: "sys-01" },
                        contributor: { id: node.record?.contributor, namespace: "github" },
                        timestamp: new Date(node.record?.timestamp || 0).toISOString(),
                        checks: { automated: true, human_review: true }
                      }, null, 2)}
                    </pre>
                  </div>
                ))}
                {activeNodesCount === 0 && (
                   <div className="py-20 text-center opacity-20 italic">No seals confirmed. System awaiting output.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Operational Terminal */}
        <div className="space-y-8">
          {selectedNode ? (
            <div className="glass rounded-[3rem] p-10 bg-black border-emerald-500/10 animate-in slide-in-from-right-8 shadow-2xl sticky top-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-mystical font-bold text-white uppercase tracking-tighter">Node_{selectedNode.index.toString().padStart(3, '0')}</h3>
                  <p className={`text-[10px] font-black tracking-widest uppercase mt-1 ${selectedNode.state === 'ACTIVE' ? 'text-emerald-500' : 'text-white/20'}`}>
                    Status: {selectedNode.state}
                  </p>
                </div>
                {selectedNode.state === 'LOCKED' && !isIntakeOpen && (
                  <button 
                    onClick={() => setIsIntakeOpen(true)}
                    className="px-6 py-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20"
                  >
                    Initiate Seal
                  </button>
                )}
              </div>

              {isIntakeOpen ? (
                <form onSubmit={handleSubmitContribution} className="space-y-6 animate-in fade-in">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Artifact Reference (PR URL)</label>
                      <input 
                        required
                        type="text" 
                        placeholder="https://github.com/..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500/50 text-white"
                        onChange={e => setFormData({...formData, prUrl: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Commit Hash</label>
                      <input 
                        required
                        type="text" 
                        placeholder="SHA-256"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500/50 text-white"
                        onChange={e => setFormData({...formData, commitHash: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Impact (+/-)</label>
                        <input 
                          required
                          type="number" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500/50 text-white"
                          onChange={e => setFormData({...formData, delta: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Category</label>
                        <select 
                          value={formData.category}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500/50 text-white appearance-none"
                          onChange={e => setFormData({...formData, category: e.target.value as any})}
                        >
                          <option value="DOCS">DOCS</option>
                          <option value="BUG">BUG</option>
                          <option value="FEATURE">FEATURE</option>
                          <option value="TEST">TEST</option>
                          <option value="HARDENING">HARDENING</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Contributor ID</label>
                      <input 
                        required
                        type="text" 
                        placeholder="GitHub Username"
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
                      Confirm Seal
                    </button>
                  </div>
                </form>
              ) : selectedNode.state === 'ACTIVE' ? (
                <div className="space-y-6 animate-in fade-in">
                  <div className="p-8 bg-white/5 rounded-2xl border border-white/5 font-mono text-xs space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="opacity-30 uppercase text-[9px]">Seal Status</span>
                      <span className="text-emerald-400 font-bold">CONFIRMED</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="opacity-30 uppercase text-[9px]">Verified Ref</span>
                      <span className="text-white/60 truncate max-w-[150px]">{selectedNode.record?.commitHash}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="opacity-30 uppercase text-[9px]">Timestamp</span>
                      <span className="text-white/40">{new Date(selectedNode.record?.timestamp || 0).toLocaleTimeString()}</span>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-2 text-center italic">Immutable Record Locked</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-24 text-center space-y-6 opacity-20">
                  <div className="text-6xl animate-pulse grayscale">🔒</div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[1em]">Node Unclaimed</p>
                    <p className="text-[8px] font-bold uppercase tracking-widest opacity-50">Requires Artifact Validation</p>
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
