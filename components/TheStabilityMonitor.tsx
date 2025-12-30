
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

const IMPACT_CONSTANTS = {
  VIOLENCE_REDUCTION_MIN: 7,
  VIOLENCE_REDUCTION_MAX: 18,
  IPV_REDUCTION_MIN: 20,
  IPV_REDUCTION_MAX: 54,
  ECONOMIC_MULTIPLIER_MIN: 1.5,
  ECONOMIC_MULTIPLIER_MAX: 2.5
};

const TheStabilityMonitor: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [scale, setScale] = useState(50000); // Annual flow in USD equivalent
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [stressScenario, setStressScenario] = useState("Cost of living increase by 15% in sector G-9");
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const householdsStabilized = Math.floor(scale / 750); 
  const projectedIncidentsPrevented = Math.floor(householdsStabilized * 0.05);

  const synthesizeReport = async () => {
    setIsSynthesizing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze the stability impact of a DAO treasury flowing $${scale} annually on Base. 
        Current metrics: 
        - Households Stabilized: ${householdsStabilized}
        - Projected Incidents Prevented: ${projectedIncidentsPrevented}
        - Violence Reduction Range: ${IMPACT_CONSTANTS.VIOLENCE_REDUCTION_MIN}% - ${IMPACT_CONSTANTS.VIOLENCE_REDUCTION_MAX}%
        - Economic Multiplier: ${IMPACT_CONSTANTS.ECONOMIC_MULTIPLIER_MIN}x - ${IMPACT_CONSTANTS.ECONOMIC_MULTIPLIER_MAX}x
        
        Synthesize a report that is technical, authoritative, and focused on harm reduction through material stability. Use the Legion persona: disciplined, quantified, and unyielding.`,
        config: {
          thinkingConfig: { thinkingBudget: 16384 },
          systemInstruction: "You are the Architect of Stability. You quantify revelation through data. Your mission is the statistical reduction of harm. No fluff, no mythic escalation. Only auditable flow and stability metrics."
        }
      });
      setReport(response.text);
    } catch (err) {
      console.error(err);
      setReport("Signal failure in the impact layer. Recalculating...");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const runPrediction = async () => {
    setIsPredicting(true);
    setPrediction(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `STRESS SCENARIO: "${stressScenario}". 
        TREASURY SCALE: $${scale} annual flow.
        Predict the delta in harm incidents with and without Aegis Grid deployment. 
        Quantify the "Syntropy Delta". Be precise, authoritative, and data-driven.`,
        config: {
          thinkingConfig: { thinkingBudget: 16384 },
          systemInstruction: "You are the Predictive Oracle of the Legion. You forecast harm probability and the effectiveness of stability protocols. Your word is data. Your logic is unbreakable."
        }
      });
      setPrediction(response.text);
    } catch (err) {
      console.error(err);
      setPrediction("Prediction engine offline. Re-centering on Base Sepolia.");
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="text-center mb-16 space-y-4">
        <h2 className="font-mystical text-7xl tracking-tighter text-emerald-300 uppercase italic">Stability Monitor</h2>
        <p className="text-[11px] text-emerald-500/60 font-black tracking-[1.2em] uppercase">Quantified Impact & Predictive Modeling</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Metric Controls */}
        <div className="space-y-8">
          <div className="glass rounded-[4rem] p-12 bg-black/60 border-emerald-500/10 space-y-12 shadow-2xl">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-mystical font-bold text-white uppercase tracking-widest italic">Treasury Scaling</h3>
                <span className="text-emerald-400 font-mono text-xl font-bold">${scale.toLocaleString()} <span className="text-[10px] opacity-30 font-sans">ANNUAL FLOW</span></span>
              </div>
              <input 
                type="range" 
                min="10000" 
                max="1000000" 
                step="10000" 
                value={scale} 
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full h-2 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">
                <span>Seed Hub</span>
                <span>City Scale</span>
                <span>Network Nexus</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-2">
                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Households Stabilized</p>
                <p className="text-4xl font-mystical text-white">{householdsStabilized.toLocaleString()}</p>
              </div>
              <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-2">
                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Incidents Prevented</p>
                <p className="text-4xl font-mystical text-emerald-400">{projectedIncidentsPrevented.toLocaleString()}</p>
              </div>
            </div>

            <button 
              onClick={synthesizeReport}
              disabled={isSynthesizing}
              className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.5em] shadow-xl transition-all active:scale-95"
            >
              {isSynthesizing ? 'Calculating Syntropy...' : 'Synthesize Impact Report'}
            </button>
          </div>

          {/* Predictive Section */}
          <div className="glass rounded-[4rem] p-12 bg-black/60 border-indigo-500/10 space-y-8 shadow-2xl">
             <div className="flex justify-between items-center">
                <h3 className="text-xl font-mystical font-bold text-indigo-300 uppercase tracking-widest italic">Predictive Oracle</h3>
                <span className="text-[8px] font-black text-indigo-500/40 uppercase tracking-[0.4em]">Harm Probability Engine</span>
             </div>
             <div className="space-y-4">
                <textarea 
                  value={stressScenario}
                  onChange={(e) => setStressScenario(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white/80 outline-none focus:border-indigo-500/50 min-h-[100px] resize-none"
                  placeholder="Input stress scenario..."
                />
                <button 
                  onClick={runPrediction}
                  disabled={isPredicting}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl transition-all"
                >
                  {isPredicting ? 'Simulating Delta...' : 'Run Stress Simulation'}
                </button>
             </div>
          </div>
        </div>

        {/* Projection View */}
        <div className="space-y-8">
           {prediction ? (
             <div className="glass rounded-[4rem] p-12 bg-indigo-950/20 border-indigo-500/30 shadow-2xl animate-in zoom-in-95 duration-500 min-h-[400px] flex flex-col">
                <div className="flex justify-between items-center mb-10">
                   <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[1em]">Predictive Delta Report</span>
                   <button onClick={() => setPrediction(null)} className="text-white/10 hover:text-white/40 text-[10px] font-black uppercase">Close</button>
                </div>
                <div className="flex-grow overflow-y-auto custom-scrollbar pr-6">
                   <p className="text-sm text-white/80 leading-relaxed font-light italic whitespace-pre-wrap">
                     {prediction}
                   </p>
                </div>
             </div>
           ) : null}

           {report ? (
             <div className="glass rounded-[4rem] p-12 bg-black/80 border-emerald-500/20 shadow-2xl animate-in zoom-in-95 duration-500 min-h-[500px] flex flex-col">
                <div className="flex justify-between items-center mb-10">
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[1em]">Stability Report V1.0</span>
                   <button onClick={() => setReport(null)} className="text-white/10 hover:text-white/40 text-[10px] font-black uppercase">Reset</button>
                </div>
                <div className="flex-grow overflow-y-auto custom-scrollbar pr-6">
                   <p className="text-sm text-white/80 leading-relaxed font-light italic whitespace-pre-wrap">
                     {report}
                   </p>
                </div>
             </div>
           ) : !prediction && (
             <div className="glass rounded-[4rem] p-24 text-center border-white/5 opacity-20 italic flex flex-col items-center gap-10 min-h-[600px] justify-center">
                <div className="text-9xl grayscale brightness-150">📈</div>
                <div className="space-y-4">
                  <p className="text-[12px] font-black uppercase tracking-[1em]">Awaiting Simulation Command</p>
                  <p className="text-[10px] font-medium uppercase tracking-[0.4em] max-w-sm mx-auto">"Output is the only metric. Synthesize reports to reveal the probability of peace."</p>
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
