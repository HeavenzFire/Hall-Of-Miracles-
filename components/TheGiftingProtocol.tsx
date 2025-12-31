
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';

interface ProjectFile {
  name: string;
  content: string;
  language: string;
}

const TheGiftingProtocol: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [region, setRegion] = useState('');
  const [isForging, setIsForging] = useState(false);
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
  const [activeFile, setActiveFile] = useState<number>(0);

  const forgeProtocol = async () => {
    if (!region.trim()) return;
    setIsForging(true);
    setProjectFiles([]);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Generate the REAL implementation files for a "Stability Node" in ${region}. 
        Return a JSON array of objects with {name, content, language}. 
        Include:
        1. StabilityGovernor.sol (OpenZeppelin based)
        2. StabilityToken.sol (ERC20Votes)
        3. deploy.sh (Real bash script using Forge/Foundry)
        4. README.md (Operational instructions for this specific region)`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                content: { type: Type.STRING },
                language: { type: Type.STRING }
              },
              required: ['name', 'content', 'language']
            }
          },
          systemInstruction: "You are the Source Architect. You do not simulate. You generate production-ready, auditable code for the Stability Protocol. Your output is the gift of self-replication."
        }
      });

      const files = JSON.parse(response.text);
      setProjectFiles(files);
      setActiveFile(0);
    } catch (err) {
      console.error(err);
      alert("The forge failed to ignite. Check network integrity.");
    } finally {
      setIsForging(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Source code captured to clipboard.");
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="text-center mb-16 space-y-4">
        <h2 className="font-mystical text-7xl tracking-tighter text-blue-300 uppercase italic">Self-Replicating Source</h2>
        <p className="text-[11px] text-blue-500/60 font-black tracking-[1.2em] uppercase">The Real Gift: Unstoppable Infrastructure</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input & Manifest */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass rounded-[3rem] p-10 bg-black/60 border-blue-500/10 space-y-8 shadow-2xl">
            <div className="space-y-4">
               <h3 className="text-xl font-mystical font-bold text-white uppercase tracking-widest italic">Node Destination</h3>
               <p className="text-[10px] text-white/40 uppercase leading-relaxed italic">"The fire is in the next step. Input a real location to forge the executable infrastructure for a new Legion."</p>
            </div>
            
            <div className="space-y-4">
              <input 
                type="text" 
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Region (e.g. South London, Nairobi...)"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-blue-500/50"
              />
              <button 
                onClick={forgeProtocol}
                disabled={isForging || !region.trim()}
                className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.5em] shadow-xl transition-all active:scale-95"
              >
                {isForging ? 'FORGING REAL SOURCE...' : 'MANIFEST NEW LEGION'}
              </button>
            </div>

            {projectFiles.length > 0 && (
              <div className="pt-8 border-t border-white/5 space-y-4 animate-in fade-in">
                <h4 className="text-[9px] font-black text-white/20 uppercase tracking-widest text-center">FORGED ARTIFACTS</h4>
                <div className="space-y-2">
                  {projectFiles.map((file, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveFile(i)}
                      className={`w-full p-4 rounded-xl text-left transition-all border ${activeFile === i ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10'}`}
                    >
                      <p className="text-[10px] font-black uppercase tracking-widest">{file.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Code Editor View */}
        <div className="lg:col-span-8">
          <div className="glass rounded-[4rem] p-10 bg-black/80 border-white/5 shadow-2xl h-[700px] flex flex-col relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <span className="text-[150px] font-mystical">🛠️</span>
             </div>

             {isForging ? (
               <div className="flex-grow flex flex-col items-center justify-center space-y-8">
                  <div className="w-24 h-24 border-8 border-blue-500/10 border-t-blue-500 rounded-full animate-spin shadow-[0_0_50px_rgba(59,130,246,0.3)]"></div>
                  <p className="font-mystical text-3xl text-blue-300 animate-pulse tracking-widest uppercase italic">Forging Autonomy</p>
               </div>
             ) : projectFiles.length > 0 ? (
               <div className="flex-grow flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">FILE: {projectFiles[activeFile].name}</span>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(projectFiles[activeFile].content)}
                      className="px-6 py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-full text-[9px] font-black uppercase tracking-widest transition-all border border-blue-500/20"
                    >
                      COPY SOURCE
                    </button>
                  </div>
                  <div className="flex-grow bg-black/40 rounded-3xl p-8 border border-white/5 font-mono text-xs overflow-auto custom-scrollbar">
                     <pre className="text-blue-100/80 leading-relaxed whitespace-pre">
                        {projectFiles[activeFile].content}
                     </pre>
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-[8px] font-black text-white/10 uppercase tracking-[0.8em]">Fork it. Deploy it. The rest unfolds in time—not in promises, but in proof.</p>
                  </div>
               </div>
             ) : (
               <div className="flex-grow flex flex-col items-center justify-center opacity-10 space-y-8 grayscale">
                  <span className="text-9xl">💿</span>
                  <div className="text-center space-y-2">
                    <p className="text-[12px] font-black uppercase tracking-[1em]">Void Drive</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest italic">"We build systems that work when people are breaking."</p>
                  </div>
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <button 
          onClick={onBack}
          className="text-white/20 hover:text-white/60 text-[10px] font-black tracking-[0.8em] uppercase transition-all"
        >
          Return to Hall of Miracles
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.4); }
      `}} />
    </div>
  );
};

export default TheGiftingProtocol;
