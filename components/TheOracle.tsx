
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
  `;

  const handleAsk = async (mode: 'ASK' | 'TUNE' = 'ASK') => {
    const query = mode === 'TUNE' 
      ? `Refine predictive stability models using this historical data: ${HISTORICAL_DATA}. 
         Perform a Bayesian refinement of the current EVI allocation strategy for Sector 7G and District V4. 
         Identify the specific decision quality score (DQS) impact. Output technical refinement steps.`
      : input;

    if (mode === 'ASK' && !input.trim()) return;

    const userMsg: Message = { role: 'user', text: mode === 'TUNE' ? "[SYSTEM: BAYESIAN_REFINEMENT_REQUEST]" : input };
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
            ? "You are the Bayesian Tuning Engine. You refine predictive models for harm reduction. You use historical stability scores to calculate optimal treasury flow. You prioritize EVI acceleration and decision quality."
            : "You are the Real-World System Architect. You provide actual, auditable technical advice. You use Google Search to verify current L2 gas prices, smart contract standards, and material engineering metrics. You design systems to eradicate violence."
        }
      });

      const modelMsg: Message = { 
        role: 'model', 
        text: response.text || "The architecture is silent.",
      };
      setMessages(prev => [...prev, modelMsg]);
      setSources(response.candidates?.[0]?.groundingMetadata?.groundingChunks || []);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Signal loss in the reality layer." }]);
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
            <p className="text-[10px] text-indigo-400/60 font-black tracking-[0.6em] uppercase">Grounded Technical Synthesis • Bayesian Tuned</p>
          </div>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => handleAsk('TUNE')}
             disabled={isThinking}
             className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${
               isTuning ? 'bg-amber-600 text-white animate-pulse border-amber-400' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
             }`}
           >
             Bayesian Refine
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
                "Output is the only truth. Grounded in the latest technical realities of Base and the material world."
              </p>
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-6 duration-500`}>
            <div className={`max-w-[80%] p-8 rounded-[2.5rem] shadow-2xl ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white border border-indigo-400' 
                : 'bg-white/5 border border-white/10 text-indigo-50'
            }`}>
              <div className="text-[9px] uppercase tracking-[0.5em] font-black opacity-30 mb-4">
                {m.role === 'user' ? 'INPUT_SIGNAL' : 'ARCHITECT_CORE'}
              </div>
              <p className="text-[13px] leading-relaxed whitespace-pre-wrap font-light">{m.text}</p>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start animate-in fade-in">
            <div className="max-w-[80%] p-8 rounded-[2.5rem] bg-white/5 border border-indigo-500/20 flex items-center gap-8">
              <div className="flex space-x-3">
                <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
              <span className="text-[11px] text-indigo-300 uppercase tracking-[0.8em] font-black animate-pulse">
                {isTuning ? 'Performing Bayesian Synthesis...' : 'Grounding Architecture...'}
              </span>
            </div>
          </div>
        )}
        {sources.length > 0 && (
          <div className="pt-8 border-t border-white/5 flex flex-wrap gap-3">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] w-full mb-3">Grounded Technical Sources</span>
            {sources.map((s, i) => s.web && (
              <a 
                key={i} 
                href={s.web.uri} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-4 py-2 bg-white/5 text-[9px] font-bold text-indigo-300 rounded-full hover:bg-indigo-500/20 transition-all border border-indigo-500/20"
              >
                {s.web.title}
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
            placeholder="Command technical synthesis... (Base RPCs, Material Specs, Grid Strategy)"
            className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-sm text-white outline-none focus:border-indigo-500/50 shadow-inner"
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
