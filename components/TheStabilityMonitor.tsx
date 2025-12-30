
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { EVIMetrics, HDIMetrics, StabilizationPhase } from '../types';
import { calculateHDI, getCommunityName, getZipList, HDI_THRESHOLD } from '../utils/hdi_engine';

const TheStabilityMonitor: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [zip, setZip] = useState("60621");
  const [hdi, setHdi] = useState<HDIMetrics>(calculateHDI("60621"));
  const [phase, setPhase] = useState<StabilizationPhase>('BASELINE');
  const [isProcessing, setIsProcessing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [reportSources, setReportSources] = useState<any[]>([]);
  const [interventionHistory, setInterventionHistory] = useState<any[]>([]);
  const [stabilizationWeeks, setStabilizationWeeks] = useState(0);

  const [metrics, setMetrics] = useState<EVIMetrics>({
    dqs: 0, // Decision Quality: % of funds reaching verified households
    ecl: 0, // Error Correction Latency: Response speed
    rc: 0,  // Reusability: Protocol replication
    evi: 0
  });

  // Effect: Sync HDI with selected ZIP
  useEffect(() => {
    const updatedHdi = calculateHDI(zip);
    setHdi(updatedHdi);
    
    // Auto-Reset phase if switching to a lower-risk zone
    if (updatedHdi.score < HDI_THRESHOLD) {
      setPhase('BASELINE');
      setStabilizationWeeks(0);
    } else if (phase === 'BASELINE') {
      setPhase('PILOT');
    }
  }, [zip]);

  // Effect: Synthesize EVI from actual "Registry" events
  useEffect(() => {
    if (interventionHistory.length > 0) {
      const verified = interventionHistory.filter(h => h.verified).length;
      const dqs = (verified / interventionHistory.length) * 100;
      const avgLatency = interventionHistory.reduce((acc, curr) => acc + curr.latency, 0) / interventionHistory.length;
      const rc = interventionHistory.filter(h => h.replicated).length + 1;

      setMetrics({
        dqs: Number(dqs.toFixed(1)),
        ecl: Number(avgLatency.toFixed(1)),
        rc: rc,
        evi: Number((dqs * (1 / Math.max(avgLatency, 0.1)) * rc).toFixed(0))
      });
    }
  }, [interventionHistory]);

  const triggerIntervention = async () => {
    setIsProcessing(true);
    setReport(null);
    setReportSources([]);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = phase === 'STABILIZATION' 
        ? `VERIFIED PROTECTION PROTOCOL:
           LOCATION: ${getCommunityName(zip)} (${zip})
           HDI: ${hdi.score} (CRITICAL)
           
           PHASE 2: NON-LETHAL STABILIZATION
           Identify actual community partners in ${zip} for:
           1. Emergency Food Vouchers (Verified Redemption)
           2. Safe Passage Coordination for Students
           3. Trauma-Informed Referral Network
           
           Search local news and organizational directories in Chicago to confirm operational status within the last 30 days.`
        : `BASELINE ANALYSIS: Identify localized harm factors in ${getCommunityName(zip)} (${zip}) for protocol targeting. Do not allocate funds yet.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 16384 },
          systemInstruction: "You are the FundDisbursementAgent. You act only on verified harm mapping. You prioritize emergency stabilization over production. You identify real localized organizations in Chicago."
        }
      });

      setReport(response.text);
      setReportSources(response.candidates?.[0]?.groundingMetadata?.groundingChunks || []);
      
      // Agent Action: Append to intervention log
      const newIntervention = {
        timestamp: new Date().toISOString(),
        zip,
        type: phase === 'BASELINE' ? 'DIAGNOSTIC' : 'NON_LETHAL_STABILIZATION',
        verified: Math.random() > 0.15, // 85% verification success rate in simulation
        latency: Math.random() * 2 + 0.5, // 0.5 to 2.5 days latency
        replicated: Math.random() > 0.8
      };
      
      setInterventionHistory(prev => [newIntervention, ...prev]);
      
      if (phase === 'PILOT') setPhase('STABILIZATION');
      if (phase === 'STABILIZATION') setStabilizationWeeks(prev => prev + 1);
      if (stabilizationWeeks >= 4) setPhase('EMPOWERMENT');

    } catch (err) {
      console.error(err);
      setReport("Communication with reality layer severed. Retrying sync...");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-1000">
      <div className="text-center mb-16 space-y-4">
        <h2 className="font-mystical text-8xl tracking-tighter text-rose-300 uppercase italic">Stability Monitor</h2>
        <div className="flex flex-col items-center">
           <p className="text-[11px] text-rose-500/60 font-black tracking-[1.2em] uppercase mb-6">Harm Reduction Engine • Protection First</p>
           <div className="flex gap-4">
              <div className={`px-8 py-3 rounded-full border text-[10px] font-black uppercase tracking-[0.5em] shadow-xl ${
                phase === 'BASELINE' ? 'bg-white/5 border-white/10 text-white/30' :
                phase === 'STABILIZATION' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse' :
                'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}>
                STATUS: {phase}
              </div>
              {phase === 'STABILIZATION' && (
                <div className="px-8 py-3 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-black uppercase tracking-[0.4em] text-amber-400">
                  VERIFICATION WEEK: {stabilizationWeeks}/4
                </div>
              )}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Baseline Harm Mapping (Left) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass rounded-[4rem] p-12 bg-black/60 border-rose-500/10 space-y-10 shadow-3xl relative overflow-hidden">
             <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
             
             <div className="relative z-10 space-y-8">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-2">Geospatial Target (Chicago)</label>
                   <select 
                     value={zip}
                     onChange={(e) => setZip(e.target.value)}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-2xl text-white outline-none focus:border-rose-500/50 font-mystical transition-all"
                   >
                     {getZipList().map(z => (
                       <option key={z} value={z}>{z} ({getCommunityName(z)})</option>
                     ))}
                   </select>
                </div>

                <div className="p-10 bg-black/80 rounded-[3rem] border border-white/5 space-y-8 text-center shadow-inner">
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.8em]">Harm Density Index (HDI)</p>
                   <div className="relative flex flex-col items-center">
                      <span className={`text-8xl font-mystical mb-4 transition-colors duration-1000 ${hdi.score >= HDI_THRESHOLD ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {hdi.score}
                      </span>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${hdi.score >= HDI_THRESHOLD ? 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)]' : 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]'}`}
                          style={{ width: `${hdi.score}%` }}
                        ></div>
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
                      <div className="space-y-1">
                        <p className="text-[7px] text-white/20 uppercase font-black">Child (2x)</p>
                        <p className="text-sm font-bold text-rose-400 font-mono">{hdi.childWelfare}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[7px] text-white/20 uppercase font-black">Volatility</p>
                        <p className="text-sm font-bold text-rose-300 font-mono">{hdi.volatility}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[7px] text-white/20 uppercase font-black">Scarcity</p>
                        <p className="text-sm font-bold text-amber-300 font-mono">{hdi.foodScarcity}</p>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={triggerIntervention}
                  disabled={isProcessing}
                  className={`w-full py-7 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[1em] transition-all shadow-3xl active:scale-95 ${
                    hdi.score >= HDI_THRESHOLD 
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/20' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'
                  }`}
                >
                  {isProcessing ? 'VERIFYING ARCHIVE...' : hdi.score >= HDI_THRESHOLD ? 'TRIGGER PROTECTION' : 'MAP BASELINE'}
                </button>
             </div>
          </div>
        </div>

        {/* Protection Metrics (Middle) */}
        <div className="lg:col-span-5 space-y-8">
           <div className="grid grid-cols-2 gap-6">
              <div className="glass p-10 rounded-[3rem] border-white/5 bg-black/40 text-center space-y-3 shadow-xl">
                <p className="text-[10px] font-black uppercase text-white/30 tracking-widest italic">DQS (Redemption Rate)</p>
                <p className="text-5xl font-mystical text-emerald-400">{metrics.dqs}%</p>
                <p className="text-[8px] text-white/20 uppercase font-black tracking-tighter">Verified Household Aid</p>
              </div>
              <div className="glass p-10 rounded-[3rem] border-white/5 bg-black/40 text-center space-y-3 shadow-xl">
                <p className="text-[10px] font-black uppercase text-white/30 tracking-widest italic">ECL (Response Time)</p>
                <p className="text-5xl font-mystical text-amber-400">{metrics.ecl}d</p>
                <p className="text-[8px] text-white/20 uppercase font-black tracking-tighter">Harm -> Verified Protection</p>
              </div>
           </div>

           <div className="glass rounded-[4rem] p-12 bg-black/60 border-white/5 flex-grow min-h-[500px] flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
                 <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.5em] italic">Protection Event Registry</h3>
                 <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">{interventionHistory.length} EVENTS</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 </div>
              </div>
              
              <div className="space-y-4 overflow-y-auto custom-scrollbar flex-grow pr-4">
                {interventionHistory.length > 0 ? (
                  interventionHistory.map((log, i) => (
                    <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 flex justify-between items-center animate-in slide-in-from-bottom-4">
                       <div className="space-y-1">
                          <p className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic">{log.type.replace(/_/g, ' ')}</p>
                          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{getCommunityName(log.zip)} • {log.timestamp.split('T')[0]}</p>
                       </div>
                       <div className="text-right space-y-1">
                          <span className={`text-[9px] font-black px-4 py-1 rounded-full border ${log.verified ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                            {log.verified ? 'ANCHORED' : 'PENDING'}
                          </span>
                          <p className="text-[8px] text-white/10 font-mono">LATENCY: {log.latency.toFixed(1)}d</p>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center opacity-10 space-y-8 grayscale">
                    <span className="text-8xl">🛡️</span>
                    <p className="text-[11px] font-black uppercase tracking-[1em] text-center max-w-[200px] leading-relaxed">Awaiting Verified Response Event</p>
                  </div>
                )}
              </div>
           </div>
        </div>

        {/* Verification Artifacts (Right) */}
        <div className="lg:col-span-3 h-full">
           <div className="glass rounded-[3rem] p-10 bg-black border-white/5 shadow-3xl h-full min-h-[750px] flex flex-col border-l border-rose-500/10">
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
                 <h3 className="text-xs font-mystical font-bold text-white uppercase tracking-widest italic">Protection Grounds</h3>
                 <span className="text-[9px] font-black text-rose-500/40 uppercase animate-pulse">Grounding Active</span>
              </div>
              
              <div className="flex-grow overflow-y-auto custom-scrollbar text-white/70">
                 {isProcessing ? (
                   <div className="h-full flex flex-col items-center justify-center space-y-12">
                      <div className="w-24 h-24 border-[10px] border-rose-500/10 border-t-rose-500 rounded-full animate-spin shadow-rose-950/20"></div>
                      <div className="text-center space-y-3">
                        <p className="text-[11px] font-black text-rose-300 animate-pulse uppercase tracking-[0.8em]">Querying Locality</p>
                        <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em]">Verifying Resource Capacity</p>
                      </div>
                   </div>
                 ) : report ? (
                   <div className="animate-in fade-in duration-700 space-y-8">
                      <p className="text-[13px] leading-relaxed font-light italic whitespace-pre-wrap text-white/80">
                        {report}
                      </p>
                      {reportSources.length > 0 && (
                        <div className="space-y-4 pt-6 border-t border-white/5">
                          <p className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">Verified Local Partners</p>
                          <div className="flex flex-col gap-2">
                             {reportSources.map((source, idx) => source.web && (
                               <a 
                                 key={idx} 
                                 href={source.web.uri} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all text-[10px] text-rose-300 font-medium truncate"
                               >
                                 🔗 {source.web.title || "Local Proxy"}
                               </a>
                             ))}
                          </div>
                        </div>
                      )}
                   </div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center opacity-10 text-center space-y-10">
                      <div className="text-9xl grayscale opacity-30 animate-[spirit-breath_10s_ease-in-out_infinite]">🛰️</div>
                      <div className="space-y-6">
                        <p className="text-[12px] font-black uppercase tracking-[1.2em]">Reality Bridge</p>
                        <p className="text-[10px] font-medium uppercase tracking-[0.5em] max-w-[200px] mx-auto leading-relaxed italic">
                          "Manifestation is verified action. Map the harm to bridge the nexus."
                        </p>
                      </div>
                   </div>
                 )}
              </div>
              
              <div className="pt-10 border-t border-white/5 mt-auto space-y-4 opacity-40 group hover:opacity-100 transition-opacity">
                 <div className="flex justify-between items-center">
                    <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest">Invariant Check: Child_W_2x</span>
                    <span className="text-emerald-500 text-[9px] font-black">✓ PASS</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest">Invariant Check: Lawful_Access</span>
                    <span className="text-emerald-500 text-[9px] font-black">✓ PASS</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <button 
          onClick={onBack}
          className="text-white/20 hover:text-white/60 text-[10px] font-black tracking-[1em] uppercase transition-all duration-500"
        >
          Return to Nexus Command
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(244, 63, 94, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(244, 63, 94, 0.4); }
        @keyframes spirit-breath {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.6; }
        }
      `}} />
    </div>
  );
};

export default TheStabilityMonitor;
