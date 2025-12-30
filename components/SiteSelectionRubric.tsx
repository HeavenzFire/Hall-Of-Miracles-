
import React, { useState } from 'react';

interface Criterion {
  id: string;
  label: string;
  description: string;
  weight: number;
  met: boolean;
}

const SiteSelectionRubric: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: 'data_h', label: 'High-Freq Health Data', description: 'Weekly/Monthly aggregate pediatric ER or health volatility logs available via public API or portal.', weight: 25, met: true },
    { id: 'data_f', label: 'Food Access Mapping', description: 'Existing neighborhood-level food desert or meal participation data (Census/USDA/Local).', weight: 20, met: true },
    { id: 'ven_d', label: 'Vendor Density (3+)', description: 'At least three independent local grocers or housing providers willing to accept digital redemption logs.', weight: 20, met: true },
    { id: 'steward', label: 'Verified Stewardship', description: '3-5 independent local residents/leads committed to multisig oversight (No conflict of interest).', weight: 20, met: true },
    { id: 'legal', label: 'Jurisdictional Clarity', description: 'Clear path for 501c3 or mutual aid pass-through without unique legislative exemptions.', weight: 15, met: true },
  ]);

  const toggleMet = (id: string) => {
    setCriteria(prev => prev.map(c => c.id === id ? { ...c, met: !c.met } : c));
  };

  const readinessScore = criteria.reduce((acc, curr) => curr.met ? acc + curr.weight : acc, 0);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-24">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-mystical font-bold text-white tracking-tight italic uppercase">Deployment Rubric</h2>
          <p className="text-rose-400 font-black tracking-[0.2em] uppercase text-[10px]">Objective Feasibility & Risk Controls v1.0</p>
        </div>
        <button 
          onClick={onBack}
          className="text-[10px] font-black text-white/30 hover:text-white uppercase tracking-[0.4em] transition-all"
        >
          Close Rubric
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Interactive Scorecard */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass rounded-[3rem] p-10 bg-black/60 border-white/5 space-y-8 shadow-2xl">
            <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.6em] italic border-l-2 border-rose-500/40 pl-4">Criteria Checklist</h3>
            <div className="space-y-4">
              {criteria.map((c) => (
                <button 
                  key={c.id}
                  onClick={() => toggleMet(c.id)}
                  className={`w-full p-6 rounded-2xl border transition-all text-left flex justify-between items-center group ${
                    c.met ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5 border-white/5 opacity-40'
                  }`}
                >
                  <div className="space-y-1 pr-4">
                    <p className={`text-sm font-bold uppercase tracking-wider ${c.met ? 'text-emerald-400' : 'text-white'}`}>{c.label}</p>
                    <p className="text-[11px] text-white/40 leading-relaxed font-light italic">{c.description}</p>
                  </div>
                  <div className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    c.met ? 'border-emerald-500 bg-emerald-500 text-black' : 'border-white/20'
                  }`}>
                    {c.met ? '✓' : ''}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Readiness Dial */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass rounded-[3rem] p-12 bg-black border-rose-500/10 text-center space-y-8 shadow-3xl sticky top-8">
            <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.8em]">Readiness Quotient</p>
            
            <div className="relative flex items-center justify-center h-64">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                <circle
                  cx="50%"
                  cy="50%"
                  r="40%"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray="251.2%"
                  style={{ strokeDashoffset: `${251.2 * (1 - readinessScore / 100)}%` }}
                  className={`transition-all duration-1000 ${readinessScore >= 80 ? 'text-emerald-500' : readinessScore >= 50 ? 'text-amber-500' : 'text-rose-500'}`}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-7xl font-mystical text-white">{readinessScore}</span>
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Index Points</span>
              </div>
            </div>

            <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3">Deployment Status</p>
              {readinessScore >= 85 ? (
                <p className="text-emerald-400 font-bold uppercase tracking-widest text-sm animate-pulse">PROTOCOL READY</p>
              ) : readinessScore >= 60 ? (
                <p className="text-amber-400 font-bold uppercase tracking-widest text-sm">AWAITING GROUNDING</p>
              ) : (
                <p className="text-rose-400 font-bold uppercase tracking-widest text-sm italic">UNFEASIBLE / HIGH-RISK</p>
              )}
            </div>

            <p className="text-[10px] text-white/30 leading-relaxed font-light italic">
              "Deployment is not a preference; it is a mathematical inevitability once the rubric is satisfied."
            </p>
          </div>
        </div>
      </div>

      {/* Rationale Section */}
      <section className="glass rounded-[3rem] p-12 bg-black border-white/5 space-y-10">
        <h3 className="text-xs font-black text-rose-500 uppercase tracking-widest italic border-l-2 border-rose-500/40 pl-4">The Principle of Site Selection</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-white/70">
          <div className="space-y-4">
             <h4 className="text-sm font-bold text-white uppercase tracking-wider">01. Eliminate Narrative Bias</h4>
             <p className="text-sm leading-relaxed font-light italic">
               We do not choose locations based on political "ripeness" or inspirational stories. We look for high data density. If the harm cannot be measured, the intervention cannot be audited.
             </p>
          </div>
          <div className="space-y-4">
             <h4 className="text-sm font-bold text-white uppercase tracking-wider">02. Control Failure Radius</h4>
             <p className="text-sm leading-relaxed font-light italic">
               Every site must have a "Kill-Switch" mechanism. If the redemption logs fall below 85% confidence for more than 14 days, fund flows are automatically throttled to prevent misuse.
             </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SiteSelectionRubric;
