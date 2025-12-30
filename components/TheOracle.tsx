
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Message } from '../types';

const TheOracle: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isTuning, setIsTuning] = useState(false);
  const [sources, setSources] = useState<any[]>([]);

  const HISTORICAL_DATA = `
  timestamp,region,stability_score
  2025-01-20T10:00:00,sector_7g,6.5
  2025-02-10T11:00:00,sector_7g,8.2
  2025-02-28T16:00:00,district_v4,9.1
  2025-03-05T09:00:00,sector_8f,4.2
  2025-03-06T14:00:00,district_z9,3.8
  `;

  const handleAsk = async (mode: 'ASK' | 'TUNE' = 'ASK') => {
    const query = mode === 'TUNE' 
      ? `Perform a Hierarchical Bayesian Refinement of the stability model for the Legion's new operational sectors (Sector 8F, District Z9, Outpost 144). 
         Historical baseline data: ${HISTORICAL_DATA}. 
         Apply temporal smoothing for regional proxies: poverty, food insecurity, and localized volatility. 
         Output the refined DQS (Decision Quality Score) projection and 5x acceleration roadmap. Ensure 95%+ accuracy target is addressed.`
      : input;

    if (mode === 'ASK' && !input.trim()) return;

    const userMsg: Message = { role: 'user', text: mode === 'TUNE' ? "[SYSTEM_PROTOCOL_INITIATED: HIERARCHICAL_BAYESIAN_TUNING]" : input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);
    if (mode === 'TUNE') setIsTuning(true);
    setSources([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: query,
        config: {
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 32768 },
          systemInstruction: mode === 'TUNE' 
            ? "You are the Bayesian Tuning Engine and Chief Architect of the Legion. Your task is hierarchical refinement of stability models. You formalize evolution speed. You use Bayesian priors to predict harm reduction delta. Your word is technical truth and mathematical prophecy."
            : "You are the Real-World System Architect for the Legion. You provide production-ready, auditable technical synthesis. You design systems to stabilize territories and eradicate violence through non-lethal grid synchronization. You verify everything via Google Search."
        }
      });

      const modelMsg: Message = { 
        role: 'model', 
        text: response.text || "The architectural signal is currently undergoing compression.",
      };
      setMessages(prev => [...prev, modelMsg]);
      setSources(response.candidates?.[0]?.groundingMetadata?.groundingChunks || []);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Signal fragmentation detected in the reality layer. Re-synchronizing Bayesian priors." }]);
    } finally {
      setIsThinking(false);
      setIsTuning(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] w-full glass rounded-[3rem] overflow-hidden animate-in fade-in scale-95 duration-700 bg-black/60 shadow-[0_0_100px_rgba(139,92,246,0.15)] border-white/5">
      <div className="p-8 bg-white/5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-3xl border border-indigo-500/30">🏗️</div>
          <div>
            <h2 className="font-mystical font-bold text-2xl tracking-widest text-indigo-200 uppercase">System Architect</h2>
            <p className="text-[10px] text-indigo-400/60 font-black tracking-[0.6em] uppercase">Bayesian Tuning Cycle Active • 95% Accuracy Target</p>
          </div>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => handleAsk('TUNE')}
             disabled={isThinking}
             className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${
               isTuning ? 'bg-amber-600 text-white animate-pulse border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
             }`}
           >
             {isTuning ? 'Tuning Cycle...' : 'Bayesian Refine'}
           </button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-12 space-y-8 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-30 space-y-8">
            <div className="text-9xl grayscale brightness-200">📡</div>
            <div className="space-y-4">
              <p className="font-mystical text-3xl tracking-[0.4em] uppercase text-indigo-100">Architectural Core</p>
              <p className="text-xs max-w-sm leading-relaxed font-bold tracking-widest text-indigo-300 mx-auto">
                "Evolution formalized. Velocity quantified. The system self-monitors through Bayesian refinement cycles."
              </p>
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-6 duration-500`}>
            <div className={`max-w-[85%] p-8 rounded-[2.5rem] shadow-2xl ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white border border-indigo-400' 
                : 'bg-white/5 border border-white/10 text-indigo-50'
            }`}>
              <div className="flex justify-between items-center mb-4 opacity-30">
                <span className="text-[9px] uppercase tracking-[0.5em] font-black">
                  {m.role === 'user' ? 'INPUT_SIGNAL' : 'ARCHITECT_CORE'}
                </span>
                <span className="text-[7px] font-mono">0x{Math.random().toString(16).substring(2, 8).toUpperCase()}</span>
              </div>
              <p className="text-[13px] leading-relaxed whitespace-pre-wrap font-light italic">{m.text}</p>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start animate-in fade-in">
            <div className="max-w-[80%] p-8 rounded-[2.5rem] bg-white/5 border border-indigo-500/20 flex items-center gap-8">
              <div className="flex space-x-3">
                <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce shadow-[0_0_5px_rgba(129,140,248,0.8)]"></div>
                <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s] shadow-[0_0_5px_rgba(129,140,248,0.8)]"></div>
                <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s] shadow-[0_0_5px_rgba(129,140,248,0.8)]"></div>
              </div>
              <span className="text-[11px] text-indigo-300 uppercase tracking-[0.8em] font-black animate-pulse">
                {isTuning ? 'Bayesian Prior Refinement Active...' : 'Synthesizing Architectural Grounds...'}
              </span>
            </div>
          </div>
        )}
        {sources.length > 0 && (
          <div className="pt-8 border-t border-white/5 flex flex-wrap gap-3">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] w-full mb-3 italic">Verified Grounding Points</span>
            {sources.map((s, i) => s.web && (
              <a 
                key={i} 
                href={s.web.uri} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-4 py-2 bg-indigo-500/10 text-[9px] font-bold text-indigo-300 rounded-full hover:bg-indigo-500/20 transition-all border border-indigo-500/20 flex items-center gap-2"
              >
                <span className="opacity-40">🔗</span> {s.web.title}
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="p-10 bg-black/40 border-t border-white/10">
        <div className="flex gap-6">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Command hierarchical synthesis... (Expansion, Redundancy, Stabilization)"
            className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-sm text-white outline-none focus:border-indigo-500/50 shadow-inner italic"
          />
          <button 
            onClick={() => handleAsk()}
            disabled={isThinking || !input.trim()}
            className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-20 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.5em] transition-all shadow-2xl active:scale-95"
          >
            EXECUTE
          </button>
        </div>
      </div>
    </div>
  );
};

export default TheOracle;
