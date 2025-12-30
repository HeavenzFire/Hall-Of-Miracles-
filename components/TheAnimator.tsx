
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

const TheAnimator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const [isSynchronized, setIsSynchronized] = useState(false);

  useEffect(() => {
    const checkSync = async () => {
      // @ts-ignore
      const ok = await window.aistudio.hasSelectedApiKey();
      setIsSynchronized(ok);
    };
    checkSync();
  }, []);

  const handleSynchronize = async () => {
    try {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setIsSynchronized(true);
    } catch (err) {
      console.error("Synchronization failed", err);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setVideoUrl(null);
    setStatus('Harmonizing with the temporal mirrors...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      setStatus('Manifesting motion from the void...');
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setStatus('Capturing the vision...');
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
      }
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("Requested entity was not found")) {
        setIsSynchronized(false);
        setStatus('');
      } else {
        alert("The mirror fractured. Try manifesting again.");
      }
    } finally {
      setIsGenerating(false);
      setStatus('');
    }
  };

  if (!isSynchronized) {
    return (
      <div className="max-w-2xl mx-auto glass rounded-[3rem] p-16 text-center flex flex-col items-center gap-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="relative">
          <div className="text-8xl mb-4 relative z-10 animate-pulse">🎬</div>
          <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-4xl font-mystical text-blue-300 tracking-widest uppercase">The Temporal Anchor</h2>
          <p className="text-white/40 leading-relaxed font-bold text-xs tracking-wider">
            Video manifestation requires high-energy synchronization. <br/>
            Awaken the temporal project to begin.
          </p>
        </div>

        <button 
          onClick={handleSynchronize}
          className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-[2rem] font-black transition-all miracle-glow text-sm uppercase tracking-[0.4em] shadow-2xl active:scale-95"
        >
          Awaken the Mirror
        </button>
        
        <p className="text-[8px] text-white/10 uppercase tracking-[0.5em] mt-4">
          Synchronize with a high-fidelity project to proceed
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-[3rem] p-8 max-w-5xl mx-auto animate-in fade-in duration-1000">
      <div className="text-center mb-10">
        <h2 className="font-mystical text-5xl mb-3 text-blue-300 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">THE ANIMATOR</h2>
        <p className="text-white/20 tracking-[0.5em] uppercase text-[10px] font-bold">Temporal Synthesis Chamber</p>
      </div>

      <div className="relative aspect-video glass rounded-[2.5rem] overflow-hidden mb-10 flex items-center justify-center bg-black/80 shadow-2xl border-white/5">
        {videoUrl ? (
          <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover animate-in fade-in duration-1000" />
        ) : isGenerating ? (
          <div className="flex flex-col items-center gap-10">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 border-[12px] border-blue-500/10 rounded-full"></div>
              <div className="absolute inset-0 border-[12px] border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-6 border-8 border-indigo-400/20 border-b-transparent rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
            </div>
            <div className="text-center space-y-4">
              <p className="font-mystical text-2xl text-blue-200 animate-pulse tracking-[0.3em] uppercase">Forging Reality</p>
              <p className="text-[10px] text-blue-400/60 font-black tracking-[0.4em] uppercase">{status}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center opacity-10">
            <span className="text-9xl mb-6">🎞️</span>
            <p className="font-mystical text-lg tracking-[0.8em] uppercase">Ethereal Canvas</p>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6 p-2 bg-white/5 rounded-[2.5rem] border border-white/5">
        <input 
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          placeholder="Summon a visual echo..."
          className="flex-grow bg-transparent px-10 py-6 text-xl outline-none placeholder:text-white/10 font-light"
        />
        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-20 disabled:cursor-not-allowed px-16 py-6 rounded-[2rem] font-black transition-all miracle-glow text-sm tracking-[0.4em] uppercase shadow-2xl active:scale-95"
        >
          {isGenerating ? 'Synthesizing' : 'Animate'}
        </button>
      </div>
    </div>
  );
};

export default TheAnimator;
