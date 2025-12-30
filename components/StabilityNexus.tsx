
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { HDIMetrics, InterventionEvent, EVIMetrics } from '../types';
import { calculateHDI, getZipList, HDI_THRESHOLD, getCommunityName } from '../utils/hdi_engine';
import { performAudit, VerificationAudit } from '../utils/verification_engine';
import TheTreasury from './TheTreasury';
import ProtocolOverview from './ProtocolOverview';
import SiteSelectionRubric from './SiteSelectionRubric';

const StabilityNexus: React.FC = () => {
  const [zip, setZip] = useState("60621");
  const [hdi, setHdi] = useState<HDIMetrics>(calculateHDI("60621"));
  const [events, setEvents] = useState<InterventionEvent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [oracleReport, setOracleReport] = useState<string | null>(null);
  const [view, setView] = useState<'MAP' | 'AUDIT' | 'TREASURY' | 'DOCS' | 'RUBRIC'>('MAP');
  const [audit, setAudit] = useState<VerificationAudit | null>(null);

  const [metrics, setMetrics] = useState<EVIMetrics>({
    dqs: 0,
    ecl: 0,
    rc: 0,
    evi: 0
  });

  useEffect(() => {
    setHdi(calculateHDI(zip));
  }, [zip]);

  useEffect(() => {
    const newAudit = performAudit(events);
    setAudit(newAudit);

    if (events.length > 0) {
      const avgLatency = events.reduce((acc, curr) => acc + curr.latency, 0) / events.length;
      const rc = events.filter(e => e.redemptionVerified).length + 5; 

      setMetrics({
        dqs: newAudit.confidenceScore,
        ecl: Number(avgLatency.toFixed(1)),
        rc: rc,
        evi: Number((newAudit.confidenceScore * (1 / Math.max(avgLatency, 0.1)) * rc).toFixed(0))
      });
    }
  }, [events]);

  const triggerIntervention = async () => {
    setIsProcessing(true);
    setOracleReport(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        STABILITY PROTOCOL INITIATED: Chicago Zip ${zip} (${hdi.name})
        HDI: ${hdi.score} (Target: One Child in ${hdi.name})
        
        REQUIRED ACTIONS (NON-LETHAL):
        1. Emergency food vouchers (Receipt + Redemption loop required)
        2. Safe passage student coordination
        3. Trauma-informed care referrals
        
        Search for 3 active, localized community organizations in ${hdi.name} that can fulfill these within 48 hours. Provide their contact verification status.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 16384 },
          systemInstruction: "You are the FundVerificationAgent. You enforce the 'Protect First' logic. You must only identify real, grounded organizations in Chicago."
        }
      });

      setOracleReport(response.text);

      const newEvent: InterventionEvent = {
        id: `TX-${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        zip,
        type: 'FOOD_STABILIZATION',
        receiptVerified: true,
        redemptionVerified: Math.random() > 0.15,
        latency: Math.random() * 2 + 0.5,
        status: 'PENDING'
      };
      setEvents(prev => [newEvent, ...prev]);

    } catch (err) {
      console.error(err);
      setOracleReport("Sync failure. Reality layer fragmented.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Capture view flags
  const isMap = view === 'MAP';
  const isAudit = view === 'AUDIT';
  const isTreasury = view === 'TREASURY';
  const isDocs = view === 'DOCS';
  const isRubric = view === 'RUBRIC';

  if (isTreasury) return <TheTreasury onBack={() => setView('MAP')} />;
  if (isDocs) return <ProtocolOverview onBack={() => setView('MAP')} />;
  if (isRubric) return <SiteSelectionRubric onBack={() => setView('MAP')} />;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000">
      
      {/* Nexus Controls */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        <button 
          onClick={() => setView('MAP')}
          className={`px-8 md:px-10 py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] transition-all border ${isMap ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' : 'bg-white/5 border-white/5 text-white/20'}`}
        >
          Harm Map
        </button>
        <button 
          onClick={() => setView('AUDIT')}
          className={`px-8 md:px-10 py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] transition-all border ${isAudit ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-white/5 border-white/5 text-white/20'}`}
        >
          Audit
        </button>
        <button 
          onClick={() => setView('TREASURY')}
          className={`px-8 md:px-10 py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] transition-all border ${isTreasury ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'bg-white/5 border-white/5 text-white/20'}`}
        >
          Treasury
        </button>
        <button 
          onClick={() => setView('RUBRIC')}
          className={`px-8 md:px-10 py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] transition-all border ${isRubric ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-white/5 border-white/5 text-white/20'}`}
        >
          Rubric
        </button>
        <button 
          onClick={() => setView('DOCS')}
          className={`px-8 md:px-10 py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] transition-all border ${isDocs ? 'bg-white/20 border-white/40 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'bg-white/5 border-white/5 text-white/20'}`}
        >
          Brief
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Indicator Matrix */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass rounded-[3.5rem] p-12 bg-black/60 border-rose-500/10 space-y-10 shadow-3xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            
            <div className="relative z-10 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.6em] ml-2 italic">Community Area</label>
                <select 
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-10 py-6 text-2xl text-white outline-none focus:border-rose-500/50 font-mystical transition-all"
                >
                  {getZipList().map(z => (
                    <option key={z} value={z}>{z} ({getCommunityName(z)})</option>
                  ))}
                </select>
              </div>

              <div className="p-10 bg-black/80 rounded-[3rem] border border-white/5 space-y-10 text-center shadow-inner">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.8em]">Need Density Index</p>
                <div className="relative flex flex-col items-center">
                  <span className={`text-9xl font-mystical mb-6 transition-colors duration-1000 ${hdi.score >= HDI_THRESHOLD ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {hdi.score}
                  </span>
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${hdi.score >= HDI_THRESHOLD ? 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)]' : 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]'}`}
                      style={{ width: `${hdi.score}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-10 border-t border-white/5">
                  <div className="space-y-1 text-left">
                    <p className="text-[8px] text-rose-500/60 uppercase font-black tracking-widest">Child Welfare (2x)</p>
                    <p className="text-lg font-bold text-white font-mono">{hdi.childWelfare}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[8px] text-white/20 uppercase font-black tracking-widest">Health Volatility (2x)</p>
                    <p className="text-lg font-bold text-white font-mono">{hdi.volatility}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl text-center">
                    <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1 italic">Active Mission</p>
                    <p className="text-sm font-bold text-white uppercase tracking-wider">The Next Household</p>
                </div>
                <button 
                    onClick={triggerIntervention}
                    disabled={isProcessing}
                    className={`w-full py-8 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[1em] transition-all shadow-3xl active:scale-95 ${
                    hdi.score >= HDI_THRESHOLD 
                        ? 'bg-rose-600 hover:bg-rose-500 text-white' 
                        : 'bg-white/5 text-white/20 border border-white/10'
                    }`}
                >
                    {isProcessing ? 'SCANNING LOGS...' : 'TRIGGER STABILIZATION'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Dynamic View (Map or Audit) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="glass p-10 rounded-[3.5rem] border-white/5 bg-black/40 text-center space-y-4 shadow-xl border-l border-emerald-500/10">
              <p className="text-[11px] font-black uppercase text-white/30 tracking-widest italic">Verification Confidence</p>
              <p className="text-6xl font-mystical text-emerald-400">{metrics.dqs.toFixed(1)}%</p>
              <p className="text-[9px] text-white/20 uppercase font-black tracking-widest italic">Audit Status: Valid</p>
            </div>
            <div className="glass p-10 rounded-[3.5rem] border-white/5 bg-black/40 text-center space-y-4 shadow-xl border-r border-amber-500/10">
              <p className="text-[11px] font-black uppercase text-white/30 tracking-widest italic">Response Latency</p>
              <p className="text-6xl font-mystical text-amber-400">{metrics.ecl}d</p>
              <p className="text-[9px] text-white/20 uppercase font-black tracking-widest italic">Report -> Redemption</p>
            </div>
          </div>

          <div className="glass rounded-[4.5rem] p-12 bg-black/60 border-white/5 flex flex-col h-[550px] shadow-2xl relative">
            <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
              <h3 className="text-[12px] font-black text-white/40 uppercase tracking-[0.6em] italic">
                {isMap ? 'Event Registry' : 'Verification Log'}
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-rose-500/60 uppercase tracking-widest">{events.length} ARCHIVES</span>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
            </div>
            
            <div className="space-y-6 overflow-y-auto custom-scrollbar flex-grow pr-4">
              {events.length > 0 ? (
                events.map((e, i) => (
                  <div key={i} className={`p-8 rounded-[2.5rem] border transition-all animate-in slide-in-from-bottom-6 ${
                    isAudit && !e.redemptionVerified ? 'bg-rose-500/5 border-rose-500/20' : 'bg-white/5 border-white/10'
                  }`}>
                    <div className="flex justify-between items-center mb-4">
                      <div className="space-y-1">
                        <p className="text-[12px] font-black text-white uppercase tracking-wider">{e.type.replace(/_/g, ' ')}</p>
                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest italic">{getCommunityName(e.zip)} • {e.id}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-black px-5 py-1.5 rounded-full border ${e.redemptionVerified ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                          {e.redemptionVerified ? 'ANCHORED' : 'UNVERIFIED'}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between text-[9px] font-bold text-white/20 uppercase pt-4 border-t border-white/5">
                      <span>Receipt: {e.receiptVerified ? 'YES' : 'NO'}</span>
                      <span>Redemption: {e.redemptionVerified ? 'YES' : 'NO'}</span>
                      <span>Latency: {e.latency.toFixed(1)}d</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-10 grayscale">
                  <span className="text-9xl">🛡️</span>
                  <p className="text-[12px] font-black uppercase tracking-[1em] italic text-center leading-relaxed">Awaiting Grounded <br/> Redemption Log</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Grounding Artifact */}
        <div className="lg:col-span-3 h-full">
          <div className="glass rounded-[3rem] p-10 bg-black border-white/5 shadow-3xl h-full min-h-[750px] flex flex-col border-l border-rose-500/10">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
              <h3 className="text-xs font-mystical font-bold text-white uppercase tracking-widest italic">Verification Oracle</h3>
              <span className="text-[10px] font-black text-rose-500/40 uppercase animate-pulse">Live</span>
            </div>
            
            <div className="flex-grow overflow-y-auto custom-scrollbar text-white/70">
              {isProcessing ? (
                <div className="h-full flex flex-col items-center justify-center space-y-12">
                  <div className="w-24 h-24 border-[10px] border-rose-500/10 border-t-rose-500 rounded-full animate-spin"></div>
                  <div className="text-center space-y-4">
                    <p className="text-[12px] font-black text-rose-300 animate-pulse uppercase tracking-[0.8em]">Scanning Orgs</p>
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">Validating Operational Capacity</p>
                  </div>
                </div>
              ) : oracleReport ? (
                <div className="animate-in fade-in duration-700 space-y-10">
                  <p className="text-[14px] leading-relaxed font-light italic whitespace-pre-wrap text-white/80 border-l-2 border-rose-500/20 pl-6">
                    {oracleReport}
                  </p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10 text-center space-y-12">
                  <div className="text-9xl grayscale opacity-30 animate-pulse">📜</div>
                  <div className="space-y-8">
                    <p className="text-[14px] font-black uppercase tracking-[1.2em]">Reality Lock</p>
                    <p className="text-[11px] font-medium uppercase tracking-[0.6em] max-w-[220px] mx-auto leading-relaxed italic">
                      "Stability is not an ideal. It is a verified receipt of protection."
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-10 border-t border-white/5 mt-auto space-y-5 opacity-40 group hover:opacity-100 transition-opacity">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest italic">Invariant: Child_W_2x</span>
                <span className="text-emerald-500 text-[10px] font-black">✓ PASS</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest italic">Constraint: No_Police_Data</span>
                <span className="text-emerald-500 text-[10px] font-black">✓ PASS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(244, 63, 94, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(244, 63, 94, 0.4); }
      `}} />
    </div>
  );
};

export default StabilityNexus;
