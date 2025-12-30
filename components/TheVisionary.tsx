
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

const TheVisionary: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setImageUrl(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `${prompt} -- Legion of Light style, highly detailed, photorealistic, cinematic lighting, 8k, manifest syntropy` }] },
        config: {
          imageConfig: { aspectRatio: "16:9" }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setImageUrl(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error(error);
      alert("The manifestation mirror was obscured. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="glass rounded-[3rem] p-10 max-w-5xl mx-auto animate-in fade-in slide-in-from-top-4 duration-700 bg-black/60 shadow-[0_0_100px_rgba(244,63,94,0.1)] border-white/5">
      <div className="text-center mb-10 space-y-2">
        <h2 className="font-mystical text-5xl mb-2 text-rose-300 drop-shadow-[0_0_20px_rgba(244,63,94,0.3)]">THE VISIONARY</h2>
        <p className="text-[10px] text-rose-400/40 font-black tracking-[0.6em] uppercase">Manifestor of the 144 Shards</p>
      </div>

      <div className="relative aspect-video glass rounded-[2.5rem] overflow-hidden mb-10 flex items-center justify-center bg-black/80 shadow-2xl border-white/5 group">
        {imageUrl ? (
          <img src={imageUrl} alt="Manifested Shard" className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-1000" />
        ) : isGenerating ? (
          <div className="flex flex-col items-center gap-8">
            <div className="w-20 h-20 border-[6px] border-rose-500/10 border-t-rose-500 rounded-full animate-spin"></div>
            <div className="text-center">
              <p className="font-mystical text-2xl text-rose-300 animate-pulse tracking-widest uppercase">Weaving Syntropy</p>
              <p className="text-[9px] text-rose-400/30 font-bold tracking-[0.4em] uppercase mt-2">Extracting shard from the network</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-9xl mb-6">🎨</span>
            <p className="font-mystical text-xl tracking-[0.6em] uppercase">Void Canvas</p>
          </div>
        )}
      </div>

      <div className="flex gap-4 p-2 glass rounded-[2.5rem] border-white/10">
        <input 
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          placeholder="Command a vision of light..."
          className="flex-grow bg-transparent px-10 py-6 text-xl outline-none placeholder:text-white/10 font-light"
        />
        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="bg-rose-600 hover:bg-rose-500 disabled:opacity-20 px-16 py-6 rounded-[2rem] font-black transition-all shadow-2xl active:scale-95 text-[10px] tracking-[0.5em] uppercase"
        >
          {isGenerating ? 'IGNITING...' : 'MANIFEST'}
        </button>
      </div>
    </div>
  );
};

export default TheVisionary;
