
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

interface GridNode {
  id: string;
  status: 'ONLINE' | 'ACTIVE' | 'NEUTRALIZING' | 'OFFLINE';
  load: number;
  lastEvent: string;
}

const TheAegisGrid: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [nodes, setNodes] = useState<GridNode[]>([]);
  const [pulseLevel, setPulseLevel] = useState(12);
  const [incidentLogs, setIncidentLogs] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const initialNodes: GridNode[] = Array.from({ length: 24 }).map((_, i) => ({
      id: `AEGIS-${i + 1}`,
      status: 'ONLINE',
      load: Math.floor(Math.random() * 20),
      lastEvent: 'Standby'
    }));
    setNodes(initialNodes);

    const interval = setInterval(() => {
      setPulseLevel(prev => {
        const delta = Math.random() > 0.6 ? 2 : -1;
        return Math.min(Math.max(prev + delta, 5), 45);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const pingNodes = async () => {
    setIsSyncing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: "Generate a technical log of 3 recent Aegis Grid neutralizations. Focus on non-lethal intervention, resource redirection, and desperation mitigation. Use high-intensity technical language.",
        config: {
          thinkingConfig: { thinkingBudget: 8192 },
          systemInstruction: "You are the Aegis Controller. You manage a mesh of stabilization nodes on Base. Your output is measured by neutralizations and incident suppression. You are technical, cold, and efficient."
        }
      });
      const newLogs = response.text.split('\n').filter(l => l.trim().length > 0);
      setIncidentLogs(prev => [...newLogs, ...prev].slice(0, 15));
      
      setNodes(prev => prev.map(n => ({
        ...n,
        status: Math.random() > 0.8 ? 'NEUTRALIZING' : 'ONLINE',
        load: Math.floor(Math.random() * 60) + 10
      })));

      setTimeout(() => {
        setNodes(prev => prev.map(n => ({ ...n, status: 'ONLINE', load: Math.floor(Math.random() * 20) })));
      }, 3000);

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
        <p className="text-[11px] text-amber-500/60 font-black tracking-[1.2em] uppercase">Non-Lethal Stabilization Mesh</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Grid Visualization */}
        <div className="lg:col-span-7 glass rounded-[4rem] p-12 bg-black/60 border-amber-500/10 space-y-10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          
          <div className="flex justify-between items-center relative z-10">
            <div className="space-y-1">
              <h3 className="text-xl font-mystical font-bold text-white uppercase tracking-widest italic">Operational Mesh</h3>
              <p className="text-[8px] font-black text-amber-500/40 uppercase tracking-[0.4em]">Base L2 Active Nodes: {nodes.length}</p>
            </div>
            <div className="flex items-center gap-6">
               <div className="text-right">
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Pulse Intensity</p>
                  <p className="text-2xl font-mystical text-amber-400">{pulseLevel}%</p>
               </div>
               <button 
                onClick={pingNodes}
                disabled={isSyncing}
                className="px-8 py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-20 text-white rounded-full text-[9px] font-black uppercase tracking-widest transition-all shadow-xl"
               >
                 {isSyncing ? 'Syncing...' : 'Ping Grid'}
               </button>
            </div>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-6 gap-4 relative z-10">
            {nodes.map(node => (
              <div 
                key={node.id} 
                className={`aspect-square rounded-2xl border transition-all duration-500 flex flex-col items-center justify-center gap-2 ${
                  node.status === 'NEUTRALIZING' 
                    ? 'bg-amber-500/40 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] animate-pulse' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${node.status === 'NEUTRALIZING' ? 'bg-amber-300' : 'bg-amber-900'}`}></div>
                <span className="text-[7px] font-black text-white/20 uppercase tracking-tighter">{node.id}</span>
                <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden mt-1 px-1">
                  <div className="h-full bg-amber-500/40" style={{ width: `${node.load}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-10 border-t border-white/5 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
             <span>Sovereignty Check: Validated</span>
             <span>Network Latency: 12ms</span>
             <span>Aegis Proto: 4.2.1</span>
          </div>
        </div>

        {/* Live Logs */}
        <div className="lg:col-span-5 space-y-6">
           <div className="glass rounded-[3rem] p-10 bg-black/80 border-white/5 shadow-2xl h-[650px] flex flex-col">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xs font-mystical font-bold text-white uppercase tracking-widest italic">Neutralization Log</h3>
                 <span className="text-[8px] font-black text-amber-500/40 uppercase tracking-[0.5em]">Real-time Feed</span>
              </div>
              <div className="flex-grow overflow-y-auto custom-scrollbar pr-4 space-y-4">
                 {incidentLogs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-10 italic text-[10px] tracking-[0.5em] text-center">
                       <p>Awaiting Grid Pulse</p>
                    </div>
                 ) : (
                    incidentLogs.map((log, i) => (
                      <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-2 animate-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-center">
                           <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">INCIDENT_REPORTS</span>
                           <span className="text-[7px] text-white/20 font-mono">HASH_{Math.random().toString(16).substring(2, 10).toUpperCase()}</span>
                        </div>
                        <p className="text-[11px] text-white/70 leading-relaxed font-light italic">{log}</p>
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
