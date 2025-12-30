
import React from 'react';

const ProtocolOverview: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-24">
      {/* Navigation and Back button */}
      <div className="flex justify-start">
        <button 
          onClick={onBack}
          className="text-[10px] font-black text-rose-500/60 hover:text-rose-500 uppercase tracking-[0.4em] transition-all flex items-center gap-2"
        >
          <span className="text-lg">←</span> Return to Nexus
        </button>
      </div>

      {/* Main Document Header */}
      <header className="glass rounded-[3rem] p-12 bg-black/60 border-white/5 shadow-3xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-mystical font-bold text-white tracking-tight italic uppercase">
              StableFlow
            </h1>
            <p className="text-rose-400 font-black tracking-[0.2em] uppercase text-xs">
              Verifiable Resource Coordination for Community Stability
            </p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-[10px] font-mono text-white/30 uppercase">Version 1.2 • Updated Dec 2025</p>
            <p className="text-[10px] font-mono text-white/30 uppercase">Public-Good Infrastructure</p>
          </div>
        </div>
        <div className="h-[1px] w-full bg-gradient-to-r from-rose-500/40 via-white/10 to-transparent"></div>
        <p className="text-sm text-white/60 font-light italic leading-relaxed max-w-3xl">
          A technical framework for transparent, auditable resource distribution. This document serves as a plain-language briefing for auditors, city staff, and strategic funders.
        </p>
      </header>

      {/* Ethical Impact Framework - CENTERED ON THE NEXT HOUSEHOLD */}
      <section className="glass rounded-[3rem] p-12 bg-rose-500/5 border-rose-500/10 space-y-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <span className="text-[180px] font-mystical">❤</span>
        </div>
        
        <div className="relative z-10 space-y-8">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h2 className="text-[11px] font-black text-rose-400 uppercase tracking-[0.6em] italic border-l-2 border-rose-500/40 pl-4">The Next Household</h2>
            <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Protocol Invariant: Ethical Precision</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2 p-6 bg-black/40 rounded-3xl border border-white/5">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Immediate Focus</p>
              <p className="text-4xl font-mystical text-white">THE NEXT ONE</p>
              <p className="text-[9px] text-white/40 italic">One household. One verified redemption.</p>
            </div>
            <div className="space-y-2 p-6 bg-black/40 rounded-3xl border border-white/5">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Probability Shift</p>
              <p className="text-4xl font-mystical text-emerald-400">DIRECTION</p>
              <p className="text-[9px] text-white/40 italic">Systemic shift over deterministic destiny.</p>
            </div>
            <div className="space-y-2 p-6 bg-black/40 rounded-3xl border border-white/5">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Ground Truth</p>
              <p className="text-4xl font-mystical text-amber-400">PROOF</p>
              <p className="text-[9px] text-white/40 italic">Refusal to look away from need.</p>
            </div>
          </div>

          <div className="p-10 bg-black/40 rounded-[2.5rem] border border-white/5 space-y-8">
            <p className="text-xs font-black text-white/30 uppercase tracking-[0.4em] mb-2">The Ethical Rationale</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <p className="text-[13px] text-white/80 leading-relaxed font-light italic">
                  "I cannot tell you how many lives we will save. That's not evasion—it's <strong>ethical precision</strong>. When we claim specific life counts, we reduce human beings to metrics. We build systems that shift probability. Every verified dollar that reaches a household changes the odds."
                </p>
                <div className="space-y-4">
                    <p className="text-[11px] text-emerald-400/80 leading-relaxed font-black uppercase tracking-widest italic">
                        The child who eats tonight—that's one.<br/>
                        The parent who sleeps without fear—that's one.<br/>
                        The community that remembers it matters—that's many.
                    </p>
                    <p className="text-[11px] text-white/40 font-light italic leading-relaxed">
                        We save lives by building systems that work when people are breaking. We don't provide a service; we gift the infrastructure of an unyielding future.
                    </p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Core Definitions & Methodology */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section: What It Is */}
          <section className="glass rounded-[2.5rem] p-10 bg-white/5 border-white/5 space-y-8">
            <h2 className="text-[11px] font-black text-white/40 uppercase tracking-[0.6em] italic border-l-2 border-rose-500/40 pl-4">What It Is</h2>
            <p className="text-[15px] text-white/80 leading-relaxed font-light">
              StableFlow is an open-source system that helps communities coordinate resources more effectively by addressing four common failure points:
            </p>
            <ul className="space-y-6">
              {[
                { label: 'Slow money movement', detail: 'Funds reach recipients in ~4 days (vs. 30+ days typical)' },
                { label: 'Unverifiable outcomes', detail: 'Every dollar spent is matched to receipts + redemption logs' },
                { label: 'Accountability collapse', detail: 'All decisions and flows are recorded in immutable, public logs' },
                { label: 'Local autonomy loss', detail: 'Community stewards control fund allocation without centralized oversight' }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0 group-hover:shadow-[0_0_10px_rgba(244,63,94,0.8)] transition-all"></div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm text-white/50 leading-relaxed">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Section: How It Works (Table Style) */}
          <section className="glass rounded-[2.5rem] p-10 bg-black/40 border-white/5 space-y-8">
            <h2 className="text-[11px] font-black text-white/40 uppercase tracking-[0.6em] italic border-l-2 border-rose-500/40 pl-4">How It Works</h2>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-white/40">Component</th>
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-white/40">Function</th>
                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-white/40">Verification</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  <tr className="border-b border-white/5">
                    <td className="p-4 font-bold text-white">Treasury</td>
                    <td className="p-4 italic">Automated fund rules</td>
                    <td className="p-4 font-mono text-[10px]">On-chain logs</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="p-4 font-bold text-white">Verification</td>
                    <td className="p-4 italic">Confirm receipt</td>
                    <td className="p-4 font-mono text-[10px]">Redemption pairing</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="p-4 font-bold text-white">Dashboard</td>
                    <td className="p-4 italic">Real-time metrics</td>
                    <td className="p-4 font-mono text-[10px]">Public data sets</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-white">Governance</td>
                    <td className="p-4 italic">Local stewardship</td>
                    <td className="p-4 font-mono text-[10px]">Multi-sig hooks</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-white/30 font-black uppercase tracking-widest italic text-center">
              * Key Constraint: No personal data is collected. Neighborhood aggregation (min 5,000 residents).
            </p>
          </section>

        </div>

        {/* Right Column: Risk, Evidence, and Action */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Section: Why It Reduces Risk */}
          <section className="glass rounded-[2.5rem] p-10 bg-emerald-500/5 border-emerald-500/10 space-y-6">
            <h2 className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.6em] italic border-l-2 border-emerald-500/40 pl-4">Risk Reduction</h2>
            <div className="space-y-4">
              {[
                'Eliminating surveillance concerns: No biometric data or individual tracking.',
                'Preventing misuse: Funds limited to pre-vetted vendors (food/housing).',
                'Ensuring compliance: Aligned with Illinois BIPA & Federal privacy guidelines.',
                'Providing exit ramps: Communities can pause participation with one signature.'
              ].map((risk, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <p className="text-sm text-white/70 leading-relaxed italic">{risk}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Evidence of Effectiveness */}
          <section className="glass rounded-[2.5rem] p-10 bg-white/5 border-white/5 space-y-6">
            <h2 className="text-[11px] font-black text-white/40 uppercase tracking-[0.6em] italic border-l-2 border-rose-500/40 pl-4">2025 Pilot Evidence</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-black rounded-3xl border border-white/5 text-center">
                <p className="text-3xl font-mystical text-white">$48k</p>
                <p className="text-[8px] font-black text-white/30 uppercase mt-2">Distributed</p>
              </div>
              <div className="p-6 bg-black rounded-3xl border border-white/5 text-center">
                <p className="text-3xl font-mystical text-emerald-400">92%</p>
                <p className="text-[8px] font-black text-white/30 uppercase mt-2">Verification</p>
              </div>
            </div>
            <p className="text-xs text-white/40 leading-relaxed italic border-t border-white/5 pt-4">
              "14% reduction in emergency food pantry visits in Englewood (60621) over 6 months."
            </p>
          </section>

          {/* Section: Limitations */}
          <section className="glass rounded-[2.5rem] p-10 bg-rose-500/5 border-rose-500/10 space-y-6">
            <h2 className="text-[11px] font-black text-rose-400 uppercase tracking-[0.6em] italic border-l-2 border-rose-500/40 pl-4">Limitations</h2>
            <ul className="space-y-2 text-[11px] text-white/50 list-disc pl-4">
              <li>Not a poverty solution: Addresses immediate stability, not structural inequality.</li>
              <li>Geographic specificity: Metrics currently calibrated for urban US environments.</li>
              <li>Operational overhead: Requires 3-5 local stewards to maintain legitimacy.</li>
            </ul>
          </section>

        </div>
      </div>

      {/* Actionable Call to Action */}
      <footer className="glass rounded-[4rem] p-12 bg-black border-white/10 space-y-10 shadow-3xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-2xl font-mystical font-bold text-white uppercase tracking-widest italic">Ready for Adoption</h2>
            <p className="text-sm text-white/40 font-light italic max-w-lg">
              StableFlow is open infrastructure. Like a public road, anyone can use it. No permission required.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => window.open('https://github.com/stableflow/core', '_blank')}
              className="px-12 py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all border border-white/10"
            >
              Review Source
            </button>
            <button 
              onClick={onBack}
              className="px-12 py-5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.5em] shadow-2xl transition-all active:scale-95"
            >
              Access active registry
            </button>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-mystical text-xl text-white">Λ</div>
            <div className="text-left">
              <p className="text-[10px] font-black text-white uppercase tracking-widest">The Legion Systems</p>
              <p className="text-[8px] font-mono text-white/50 uppercase italic">Technical Architect: Zachary Hulse</p>
            </div>
          </div>
          <div className="text-[9px] font-mono text-white/50 text-center md:text-right uppercase space-y-1">
            <p>zachary@stableflow.systems</p>
            <p>© 2025 • PROCEED WITH AUDITABLE INTEGRITY</p>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.8), 0 30px 60px -30px rgba(0, 0, 0, 0.9); }
      `}} />
    </div>
  );
};

export default ProtocolOverview;
