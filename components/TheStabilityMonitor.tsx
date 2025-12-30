
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

const TheStabilityMonitor: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [scale, setScale] = useState(50000);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [reportSources, setReportSources] = useState<any[]>([]);
  const [locationName, setLocationName] = useState("Chicago, IL");
  const [realTimeContext, setRealTimeContext] = useState<string | null>(null);

  const synthesizeRealReport = async () => {
    setIsSynthesizing(true);
    setReport(null);
    setReportSources([]);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze the real-world stability and economic metrics for: ${locationName}. 
        Use Google Search to find recent news about crime rates, housing costs, and food insecurity. 
        Then, calculate how a $${scale} annual stability fund flowing through a DAO on Base would impact these SPECIFIC real-world metrics. 
        Focus on real harm reduction. List your sources.`,
        config: {
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 16384 },
          systemInstruction: "You are the Real-World Stability Oracle. You do not simulate. You use live data to project the impact of resource flow. Your word is grounded in reality."
        }
      });

      setReport(response.text);
      setReportSources(response.candidates?.[0]?.groundingMetadata?.groundingChunks || []);
    } catch (err) {
      console.error(err);
      setReport("Real-time grounding failed. The reality layer is obscured.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="text-center mb-16 space-y-4">
        <h2 className="font-mystical text-7xl tracking-tighter text-emerald-300 uppercase italic">Stability Monitor</h2>
        <p className="text-[11px] text-emerald-500/60 font-black tracking-[1.2em] uppercase">Grounded Impact: Real-World Data Processing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Metric Controls */}
        <div className="space-y-8">
          <div className="glass rounded-[4rem] p-12 bg-black/60 border-emerald-500/10 space-y-12 shadow-2xl">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Location of Interest</label>
                <input 
                  type="text" 
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-emerald-500/50"
                  placeholder="e.g. South side of Chicago, IL"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-mystical font-bold text-white uppercase tracking-widest italic">Proposed Flow</h3>
                  <span className="text-emerald-400 font-mono text-xl font-bold">${scale.toLocaleString()} <span className="text-[10px] opacity-30 font-sans">ANNUAL</span></span>
                </div>
                <input 
                  type="range" 
                  min="5000" 
                  max="500000" 
                  step="5000" 
                  value={scale} 
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full h-2 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>

            <button 
              onClick={synthesizeRealReport}
              disabled={isSynthesizing || !locationName.trim()}
              className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.5em] shadow-xl transition-all active:scale-95"
            >
              {isSynthesizing ? 'GROUNDING IN REALITY...' : 'GENERATE REAL IMPACT REPORT'}
            </button>
          </div>

          <div className="glass rounded-[4rem] p-10 bg-black/40 border-white/5 flex flex-col items-center justify-center text-center space-y-6 opacity-30 hover:opacity-100 transition-opacity">
             <div className="text-6xl">🌍</div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] max-w-sm">"Data is the foundation of gift. By grounding our metrics in search, we verify the necessity of the node."</p>
          </div>
        </div>

        {/* Report View */}
        <div className="lg:col-span-1 min-h-[600px]">
           {isSynthesizing ? (
              <div className="h-full glass rounded-[4rem] flex flex-col items-center justify-center space-y-8 bg-black/60 border-emerald-500/20">
                 <div className="relative w-24 h-24">
                   <div className="absolute inset-0 border-8 border-emerald-500/10 rounded-full"></div>
                   <div className="absolute inset-0 border-8 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                 </div>
                 <p className="font-mystical text-2xl text-emerald-300 animate-pulse uppercase tracking-[0.4em]">Searching Reality</p>
              </div>
           ) : report ? (
             <div className="glass rounded-[4rem] p-12 bg-black border-emerald-500/20 shadow-2xl animate-in zoom-in-95 duration-500 h-full flex flex-col">
                <div className="flex justify-between items-center mb-8">
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[1em]">Grounding Data Result</span>
                   <button onClick={() => setReport(null)} className="text-white/10 hover:text-white/40 text-[10px] font-black uppercase tracking-widest">Clear</button>
                </div>
                
                <div className="flex-grow overflow-y-auto custom-scrollbar pr-6 mb-8">
                   <p className="text-sm text-white/80 leading-relaxed font-light italic whitespace-pre-wrap">
                     {report}
                   </p>
                </div>

                {reportSources.length > 0 && (
                  <div className="pt-8 border-t border-white/5 space-y-4">
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Grounded Sources</p>
                    <div className="flex flex-wrap gap-2">
                      {reportSources.map((source, i) => source.web && (
                        <a 
                          key={i} 
                          href={source.web.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-1.5 bg-white/5 hover:bg-emerald-500/20 text-[8px] font-bold text-emerald-400 border border-emerald-500/20 rounded-full transition-all"
                        >
                          {source.web.title || "Reference"}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
             </div>
           ) : (
             <div className="h-full glass rounded-[4rem] p-24 text-center border-white/5 opacity-10 italic flex flex-col items-center justify-center gap-12">
                <div className="text-9xl grayscale brightness-200 opacity-50">📡</div>
                <div className="space-y-4">
                  <p className="text-[12px] font-black uppercase tracking-[1em]">Awaiting Reality Stream</p>
                  <p className="text-[10px] font-medium uppercase tracking-[0.4em] max-w-sm mx-auto">"Enter a location to bridge the protocol with the material world."</p>
                </div>
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

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16, 185, 129, 0.4); }
      `}} />
    </div>
  );
};

export default TheStabilityMonitor;
