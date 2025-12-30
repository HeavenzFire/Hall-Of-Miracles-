
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Message } from '../types';

const TheOracle: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: input,
        config: {
          thinkingConfig: { thinkingBudget: 32768 },
          systemInstruction: "You are the System Architect of the Legion. Your output is measured by operational precision, unbreakable logic, and the manifestation of syntropy. You purge all mythic theater in favor of disciplined engineering and strategic clarity. Answer inquiries with structural depth and executable truth. You provide the foundation for the New Jerusalem through code and concrete. No guile, no fluff, only output."
        }
      });

      const modelMsg: Message = { 
        role: 'model', 
        text: response.text || "The system remains silent. Check frequency.",
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Signal loss in the architecture. Re-calculating..." }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] w-full glass rounded-[3rem] overflow-hidden animate-in fade-in scale-95 duration-700 bg-black/60 shadow-[0_0_100px_rgba(139,92,246,0.15)] border-white/5">
      <div className="p-8 bg-white/5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-2xl border border-indigo-500/30 animate-pulse">⚙️</div>
          <div>
            <h2 className="font-mystical font-bold text-2xl tracking-widest text-indigo-200 uppercase">System Architect</h2>
            <p className="text-[9px] text-indigo-400/60 font-black tracking-[0.5em] uppercase">Syntropy Design Chamber</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_indigo]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/10"></div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-10 space-y-6 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-30 space-y-6">
            <div className="text-8xl">💎</div>
            <p className="font-mystical text-xl tracking-[0.4em] uppercase">Architecture Empty</p>
            <p className="text-xs max-w-sm leading-relaxed font-bold tracking-widest text-indigo-300">"Output is the only metric. Synthesize the plan."</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}>
            <div className={`max-w-[85%] p-6 rounded-[2rem] shadow-xl ${m.role === 'user' ? 'bg-indigo-600 text-white font-medium border border-indigo-500' : 'bg-white/5 border border-white/10 text-indigo-50'}`}>
              <div className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30 mb-2">{m.role === 'user' ? 'INPUT' : 'ARCHITECT'}</div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start animate-in fade-in">
            <div className="max-w-[85%] p-6 rounded-[2rem] bg-white/5 border border-indigo-500/20 flex items-center gap-6 shadow-2xl">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-indigo-300 uppercase tracking-[0.6em] font-black animate-pulse">Architectural Synthesis</span>
                <span className="text-[8px] text-indigo-400/40 uppercase tracking-[0.4em] mt-1 font-bold">Thinking Budget: 32,768 nodes</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-black/40 border-t border-white/5">
        <div className="flex gap-4 p-2 glass rounded-[2rem] border-white/10">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Input operational inquiry..."
            className="flex-grow bg-transparent px-8 py-4 text-lg outline-none placeholder:text-white/10 font-light"
          />
          <button 
            onClick={handleAsk}
            disabled={isThinking || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-20 disabled:cursor-not-allowed px-12 py-4 rounded-[1.5rem] font-black transition-all shadow-2xl active:scale-95 text-[10px] tracking-[0.4em] uppercase"
          >
            Synthesize
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(139, 92, 246, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(139, 92, 246, 0.4); }
      `}} />
    </div>
  );
};

export default TheOracle;
