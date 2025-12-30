
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

interface GridNode {
  id: string;
  status: 'ONLINE' | 'ACTIVE' | 'NEUTRALIZING' | 'OFFLINE';
  load: number;
  lastEvent: string;
  redundant?: boolean;
}

const SECTORS = [
  { id: 'sector-7g', name: 'Sector 7G', color: 'text-amber-400', baseline: 6.5, status: 'STABLE' },
  { id: 'sector-8f', name: 'Sector 8F', color: 'text-orange-400', baseline: 4.2, status: 'SYNCING' },
  { id: 'district-v4', name: 'District V4', color: 'text-blue-400', baseline: 9.1, status: 'STABLE' },
  { id: 'district-z9', name: 'District Z9', color: 'text-purple-400', baseline: 3.8, status: 'SYNCING' },
  { id: 'nexus-prime', name: 'Nexus Prime', color: 'text-emerald-400', baseline: 8.4, status: 'STABLE' },
  { id: 'outpost-144', name: 'Outpost 144', color: 'text-rose-400', baseline: 2.1, status: 'INITIALIZING' }
];

const TheAegisGrid: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeSector, setActiveSector] = useState(SECTORS[0]);
  const [nodes, setNodes] = useState<GridNode[]>([]);
  const [pulseLevel, setPulseLevel] = useState(12);
  const [incidentLogs, setIncidentLogs] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const initialNodes: GridNode[] = Array.from({ length: 36 }).map((_, i) => ({
      id: `${activeSector.id.substring(0, 3).toUpperCase()}-${(i + 1).toString().padStart(2, '0')}`,
      status: 'ONLINE',
      load: Math.floor(Math.random() * 25),
      lastEvent: 'Standby',
      redundant: i % 4 === 0 // Mark some nodes as redundant infrastructure
    }));
    setNodes(initialNodes);
  }, [activeSector]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseLevel(prev => {
        const delta = Math.random() > 0.6 ? 2 : -1;
        return Math.min(Math.max(prev + delta, 5), 65);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const pingGrid = async () => {
    setIsSyncing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a high-intensity technical log entry for a non-lethal neutralization event in ${activeSector.name}. 
        Territory status: ${activeSector.status}. 
        Trigger: Stability Score deviation detected below ${activeSector.baseline} threshold. 
        Focus on redundant mesh engagement and automated harm reduction. Keep it under 40 words.`,
        config: {
          systemInstruction: "You are the Aegis Grid Controller. You oversee a non-lethal stabilization mesh for the Legion. Your output is measured by absolute efficiency and measurable harm reduction across multiple sectors."
        }
      });

      setIncidentLogs(prev => [`[${activeSector.name}] ${response.text}`, ...prev].slice(0, 20));
      
      // Engage Redundancy Mesh
      setNodes(prev => prev.map(n => {
        if (Math.random() > 0.75) return { ...n, status: 'NEUTRALIZING', load: 90 };
        return n;
      }));

      setTimeout(() => {
        setNodes(prev => prev.map(n => ({ ...n, status: 'ONLINE', load: Math.floor(Math.random() * 15) })));
      }, 3500);

    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="text-center mb-16 space-y-4">
        <h2 className="font-mystical text-7xl tracking-tighter text-amber-300 uppercase italic">Aegis Grid</h2>
        <p className="text-[11px] text-amber-500/60 font-black tracking-[1.2em] uppercase">Multi-Sector Stabilization Mesh • Scale: 10k Nodes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Sector Selection & Stats */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass rounded-[3rem] p-8 bg-black/60 border-amber-500/10 space-y-8 shadow-2xl">
             <div className="space-y-4">
                <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em]">Operational Sectors</h3>
                <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                  {SECTORS.map(s => (
                    <button 
                      key={s.id}
                      onClick={() => setActiveSector(s)}
                      className={`w-full p-4 rounded-2xl border transition-all text-left flex flex-col gap-1 ${
                        activeSector.id === s.id ? 'bg-white/10 border-white/20 shadow-lg' : 'bg-white/5 border-white/5 opacity-50'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className={`text-[11px] font-black uppercase ${s.color}`}>{s.name}</span>
                        <span className="text-[8px] font-black opacity-30 tracking-tighter">{s.status}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-[9px] font-mono text-white/40">Threshold: {s.baseline}</span>
                         <div className={`w-1.5 h-1.5 rounded-full ${s.status === 'STABLE' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                      </div>
                    </button>
                  ))}
                </div>
             </div>

             <div className="pt-8 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-white/30 uppercase">Pulse Intensity</span>
                  <span className="text-xl font-mystical text-amber-400">{pulseLevel}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-white/30 uppercase">Local Baseline</span>
                  <span className={`text-xl font-mystical ${activeSector.color}`}>{activeSector.baseline}</span>
                </div>
             </div>

             <button 
              onClick={pingGrid}
              disabled={isSyncing}
              className="w-full py-6 bg-amber-600 hover:bg-amber-500 disabled:opacity-20 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.5em] transition-all shadow-xl active:scale-95"
             >
               {isSyncing ? 'SYCHRONIZING MESH...' : 'TRIGGER NEUTRALIZATION'}
             </button>
          </div>
          
          <div className="glass rounded-[2rem] p-6 bg-emerald-500/5 border-emerald-500/20">
             <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-2">Network Expansion</p>
             <div className="flex justify-between items-end">
                <span className="text-[12px] font-bold text-white uppercase italic">+3 Sectors Active</span>
                <span className="text-[10px] text-emerald-400 font-mono">+30% Stability Projection</span>
             </div>
          </div>
        </div>

        {/* Grid Visualization */}
        <div className="lg:col-span-6 glass rounded-[4rem] p-12 bg-black/60 border-amber-500/10 min-h-[600px] shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          
          <div className="flex justify-between items-center mb-10 relative z-10">
             <h3 className="text-lg font-mystical font-bold text-white uppercase tracking-widest italic">{activeSector.name} Topology</h3>
             <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500/30"></div>
                  <span className="text-[8px] font-black text-white/20 uppercase">Core</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 border border-amber-500/60 rounded-sm"></div>
                  <span className="text-[8px] font-black text-white/20 uppercase">Redundant</span>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-6 gap-4 relative z-10 flex-grow content-start">
            {nodes.map(node => (
              <div 
                key={node.id} 
                className={`aspect-square rounded-2xl border transition-all duration-700 flex flex-col items-center justify-center gap-1.5 ${
                  node.status === 'NEUTRALIZING' 
                    ? 'bg-amber-500/60 border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.8)] z-20 scale-110' 
                    : node.redundant 
                      ? 'bg-white/5 border-white/20 border-dashed hover:border-white/40' 
                      : 'bg-white/5 border-white/5 hover:border-white/10'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${node.status === 'NEUTRALIZING' ? 'bg-white animate-ping' : node.redundant ? 'bg-amber-500/20' : 'bg-amber-900/40'}`}></div>
                <span className="text-[7px] font-black text-white/30 uppercase">{node.id}</span>
                <div className="w-4/5 h-0.5 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${node.status === 'NEUTRALIZING' ? 'bg-white' : 'bg-amber-500/30'}`} style={{ width: `${node.load}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute bottom-8 left-12 right-12 flex justify-between items-center opacity-30">
             <span className="text-[8px] font-mono tracking-widest uppercase">Grid Latency: 4ms</span>
             <span className="text-[8px] font-mono tracking-widest uppercase">Encryption: AES-256-GCM</span>
          </div>
        </div>

        {/* Incident Logs */}
        <div className="lg:col-span-3">
           <div className="glass rounded-[3rem] p-10 bg-black/80 border-white/5 shadow-2xl h-[650px] flex flex-col">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xs font-mystical font-bold text-white uppercase tracking-widest italic">Grid Telemetry</h3>
                 <span className="text-[8px] font-black text-amber-500/40 uppercase tracking-[0.4em]">Real-Time Fix</span>
              </div>
              <div className="flex-grow overflow-y-auto custom-scrollbar pr-4 space-y-4">
                 {incidentLogs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-10 text-center space-y-4">
                       <span className="text-4xl grayscale opacity-30">📡</span>
                       <p className="text-[9px] font-black uppercase tracking-[0.5em]">Scanning New Sectors</p>
                    </div>
                 ) : (
                    incidentLogs.map((log, i) => (
                      <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-2 animate-in slide-in-from-right-4 transition-all hover:bg-white/10">
                        <div className="flex justify-between items-center">
                           <span className="text-[8px] font-black text-amber-500/60 uppercase italic">NEUTRALIZATION_EVENT</span>
                           <span className="text-[7px] text-white/20 font-mono italic">#{Math.floor(Math.random() * 99999).toString().padStart(5, '0')}</span>
                        </div>
                        <p className="text-[10px] text-white/70 leading-relaxed italic font-light">{log}</p>
                      </div>
                    ))
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

export default TheAegisGrid;
