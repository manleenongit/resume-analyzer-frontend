"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { Upload, CheckCircle, BookOpen, Loader2, ArrowLeft, Zap, Trophy, PartyPopper } from 'lucide-react';

// --- TYPESCRIPT INTERFACES ---
interface TaskLink {
  youtube: string;
  course: string;
  reading: string;
}

interface GamePlanPhase {
  skill_name: string;
  links: TaskLink;
}

interface AnalysisResult {
  match_score: number;
  nailed_skills: string[];
  needs_work: string[];
  is_perfect_match: boolean;
  game_plan: {
    [phaseName: string]: GamePlanPhase[];
  };
}

export default function ResumeMatcher() {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [view, setView] = useState<'upload' | 'results'>('upload');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleProcess = async () => {
    setErrorMessage(null); 
    if (!resume && !jobDescription) {
      setErrorMessage("Double trouble! You forgot BOTH the resume and the job description. The robot is hungry, feed it!");
      return;
    }
  
    if (!resume) {
      setErrorMessage("Where's the paper? You forgot to upload your resume! The AI can't read your mind (yet).");
      return;
    }

    if (!jobDescription) {
      setErrorMessage("Missing the target! You didn't paste a job description. What exactly are we matching against?");
      return;
    }
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("resume", resume); 
      formData.append("jobDescription", jobDescription);

      const response = await axios.post(
        'https://resume-analyzer-backend-api-cmzw.onrender.com/api/analyze', 
        formData
      );
      
      setResult(response.data);
      setView('results'); 
    } catch (error) {
      console.error("Error:", error);
      if (axios.isAxiosError(error) && error.response?.data?.error === "UNREADABLE_PDF") {
        setErrorMessage(error.response.data.message || "This PDF is basically a picture. Our AI needs actual text to work its magic!");
      } else {
        setErrorMessage("The backend is taking a nap or the tunnel is broken. Make sure your friend's server is actually running!");
      }
      setView('upload'); 
    } finally {
      setLoading(false);
    }
  };

  // --- QUIRKY LOADING SCREEN ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDE047] flex flex-col items-center justify-center p-8 overflow-hidden relative">
        <div className="relative">
          <Loader2 size={120} className="animate-spin text-black mb-8 relative z-10" />
          <Zap size={60} className="absolute -top-4 -right-4 text-purple-600 animate-bounce" />
        </div>
        <h2 className="text-5xl font-black uppercase italic tracking-tighter text-black text-center">
          Crunching the <span className="bg-white text-black px-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Numbers</span>
        </h2>
        <p className="mt-6 text-xl font-bold uppercase text-black animate-pulse">Wait a sec, the AI is thinking really hard...</p>
      </div>
    );
  }

  // --- QUIRKY ERROR OVERLAY ---
  if (errorMessage) {
    return (
      <div className="min-h-screen bg-[#FF5F5F] flex flex-col items-center justify-center p-8 font-mono">
        <div className="bg-white border-8 border-black p-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-xl w-full text-center transform rotate-1">
          <div className="text-8xl mb-6">😵‍💫</div>
          <h2 className="text-4xl font-black uppercase mb-4 tracking-tighter text-black border-b-4 border-black pb-2 inline-block">
            OOPS! WE HIT A SNAG
          </h2>
          <div className="bg-yellow-200 border-4 border-black p-4 my-6 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-black text-lg text-black leading-tight uppercase">{errorMessage}</p>
          </div>
          <button 
            onClick={() => setErrorMessage(null)}
            className="px-10 py-4 bg-black text-white font-black text-xl uppercase hover:bg-zinc-800 transition-all shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            TRY AGAIN 🔄
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 font-mono relative overflow-hidden bg-[#FFFBEB]">
      {/* VIBRANT NEO-BRUTALIST LIQUID CANVAS */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40 mix-blend-multiply">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Tuned filter matrix: retains maximum vibrant color profiles while gluing vector outlines */}
            <filter id="neo-gooey-ink" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="25" result="blur" />
              {/* Maintains color integrity (1s down the diagonal) while strictly sharpening the alphas */}
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 40 -15" result="goo" />
              
              {/* Creates a thick, crisp outer vector wrapper */}
              <feMorphology in="goo" operator="dilate" radius="5" result="outline-base" />
              <feColorMatrix in="outline-base" mode="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="black-outline" />
              
              <feMerge>
                <feMergeNode in="black-outline" />
                <feMergeNode in="goo" />
              </feMerge>
            </filter>
          </defs>
          
          <g filter="url(#neo-gooey-ink)">
            {/* Neo Neon Hot Pink (#FF007F) */}
            <circle cx="20%" cy="20%" r="240" fill="#FF007F" className="animate-blob-one" />
            {/* Neo Acid/Cyber Green (#00FF66) */}
            <circle cx="80%" cy="40%" r="290" fill="#00FF66" className="animate-blob-two" />
            {/* Neo Bright Orange (#FF6B00) */}
            <circle cx="40%" cy="80%" r="260" fill="#FF6B00" className="animate-blob-three" />
            {/* Neo Vivid Cyan (#00E5FF) */}
            <circle cx="75%" cy="85%" r="220" fill="#00E5FF" className="animate-blob-four" />
          </g>
        </svg>
      </div>

      {/* RAW KEYFRAME MOTION SYSTEM */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes diagonalCrawlingOne {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(140px, 100px) scale(1.15); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes diagonalCrawlingTwo {
          0% { transform: translate(0px, 0px) scale(1.1); }
          50% { transform: translate(-120px, 150px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1.1); }
        }
        @keyframes diagonalCrawlingThree {
          0% { transform: translate(0px, 0px) scale(0.95); }
          50% { transform: translate(160px, -120px) scale(1.2); }
          100% { transform: translate(0px, 0px) scale(0.95); }
        }
        @keyframes diagonalCrawlingFour {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-100px, -140px) scale(1.1); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob-one { transform-origin: 20% 20%; animation: diagonalCrawlingOne 28s ease-in-out infinite; }
        .animate-blob-two { transform-origin: 80% 40%; animation: diagonalCrawlingTwo 34s ease-in-out infinite; }
        .animate-blob-three { transform-origin: 40% 80%; animation: diagonalCrawlingThree 30s ease-in-out infinite; }
        .animate-blob-four { transform-origin: 75% 85%; animation: diagonalCrawlingFour 26s ease-in-out infinite; }
      `}}/>

      {/* --- VIEW 1: UPLOAD PAGE --- */}
      {view === 'upload' ? (
        <div className="max-w-3xl mx-auto relative z-10">
          <header className="mb-16 text-center transform -rotate-2">
            <h1 className="text-6xl font-black text-black mb-2 bg-[#FDE047] inline-block px-4 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              RESUME MATCHER
            </h1>
            <p className="text-xl font-bold text-black mt-6 italic">The fun way to land your dream job.</p>
          </header>

          <div className="space-y-10">
            <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <label className="block text-2xl font-black text-black mb-6 uppercase tracking-tighter italic">1. Drop that resume!</label>
              <div className={`border-4 border-dashed border-black p-12 text-center cursor-pointer relative transition-all ${resume ? 'bg-[#4ADE80]' : 'bg-white hover:bg-yellow-50'}`}>
                <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setResume(e.target.files?.[0] || null)} />
                {resume ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle className="text-black mb-2" size={48} />
                    <p className="font-black uppercase text-black">{resume.name}</p>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto text-black mb-4" size={40}/>
                    <p className="font-black uppercase text-sm text-black italic">Click to browse or drop PDF</p>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <label className="block text-2xl font-black text-black mb-6 uppercase tracking-tighter italic">2. What&apos;s the job?</label>
              <textarea 
                className="w-full h-48 p-4 border-4 border-black bg-white focus:bg-yellow-50 outline-none font-bold text-black text-lg placeholder-zinc-500"
                placeholder="Paste the requirements here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <button 
              onClick={handleProcess}
              className="w-full py-8 bg-[#FF5F5F] text-black border-4 border-black font-black text-3xl uppercase shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex justify-center items-center gap-4"
            >
              ANALYZE MY FIT! ⚡
            </button>
          </div>
        </div>
      ) : (
        
        /* --- VIEW 2: RESULTS PAGE --- */
        <div className="max-w-4xl mx-auto relative z-10">
          {/* BACK BUTTON */}
          <button 
            onClick={() => setView('upload')}
            className="mb-8 px-6 py-2 bg-white text-black border-4 border-black font-black uppercase flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            <ArrowLeft size={20} className="text-black" /> Back to Start
          </button>

          {/* TOP SECTION */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Score Bubble */}
            <div className="bg-[#A855F7] p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center relative flex flex-col justify-center min-h-62.5">
              <div className="text-7xl sm:text-8xl font-black text-white drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] wrap-break-words">
                {result?.match_score}%
              </div>
              <p className="text-white font-black uppercase text-xl mt-4 tracking-tighter">Overall Match Score</p>
              <div className="absolute top-0 right-0 bg-yellow-400 text-black border-l-4 border-b-4 border-black px-4 py-1 font-black text-sm">
                AI VERIFIED
              </div>
            </div>

            {/* Skills Analysis Card */}
            <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col">
              <h3 className="text-2xl font-black text-black mb-6 uppercase border-b-4 border-black pb-2 inline-block self-start">
                Skill Breakdown
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-black uppercase text-gray-500 mb-2">✅ Nailed It</p>
                  <div className="flex flex-wrap gap-3">
                    {result?.nailed_skills.map((s) => (
                      <span key={s} className="px-3 py-1 bg-[#4ADE80] text-black border-2 border-black font-black text-[10px] uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-gray-500 mb-2">🚩 Needs Work</p>
                  <div className="flex flex-wrap gap-3">
                    {result?.needs_work.map((s) => (
                      <span key={s} className="px-3 py-1 bg-[#FF5F5F] text-white border-2 border-black font-black text-[10px] uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        {s}
                      </span>
                    ))}
                    {result?.needs_work.length === 0 && (
                      <p className="text-sm font-bold italic text-green-600">No missing skills! You are a beast!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PERFECT MATCH CHECK OR ROADMAP */}
          {result?.is_perfect_match ? (
            <div className="bg-[#4ADE80] border-8 border-black p-12 text-center shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 relative overflow-hidden">
              <div className="absolute -top-6 -left-6 bg-yellow-400 border-4 border-black p-4 rounded-full animate-bounce">
                <PartyPopper size={40} className="text-black" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-purple-500 border-4 border-black p-4 rounded-full animate-bounce">
                <Trophy size={40} className="text-white" />
              </div>
              <h3 className="text-5xl font-black text-black uppercase tracking-tightest mb-4">PERFECT MATCH!</h3>
              <h4 className="text-2xl font-extrabold text-zinc-900 uppercase italic mb-6">Mission Accomplished</h4>
              <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-2xl mx-auto">
                <p className="text-lg font-bold uppercase text-black leading-snug">
                  Your resume completely aligns with the job profile specifications. No structural optimization gap anomalies found. Skip the textbooks and send that application over immediately!
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-black p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-4xl font-black mb-12 flex items-center gap-4 text-white uppercase italic tracking-tighter">
                <BookOpen className="text-yellow-400" size={40} /> The Game Plan
              </h3>
              <div className="space-y-12">
                {result?.game_plan && Object.entries(result.game_plan)
                  .filter(([_, tasks]) => tasks && tasks.length > 0)
                  .map(([phaseName, tasks], idx, array) => (
                    <div key={phaseName} className="flex gap-8 relative group">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-white bg-yellow-400 text-black flex items-center justify-center text-3xl font-black shrink-0 z-10 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                          {idx + 1}
                        </div>
                        {idx !== array.length - 1 && (
                          <div className="w-1.5 h-full bg-white mt-4"></div>
                        )}
                      </div>
                      <div className="pb-10 w-full">
                        <h4 className="text-3xl font-black text-yellow-400 uppercase tracking-tighter mb-4">{phaseName}</h4>
                        <div className="flex flex-col gap-4">
                          {tasks.map((task, tIdx) => (
                            <div key={tIdx} className="bg-zinc-900 border-2 border-zinc-700 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                              <p className="text-[#4ADE80] font-black uppercase text-lg mb-3">{task.skill_name}</p>
                              <div className="flex flex-wrap gap-3">
                                <a href={task.links.youtube} target="_blank" rel="noreferrer" className="bg-red-500 text-white px-3 py-1 text-xs font-black uppercase border-2 border-black hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">📺 YouTube</a>
                                <a href={task.links.course} target="_blank" rel="noreferrer" className="bg-blue-500 text-white px-3 py-1 text-xs font-black uppercase border-2 border-black hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">🎓 Course</a>
                                <a href={task.links.reading} target="_blank" rel="noreferrer" className="bg-white text-black px-3 py-1 text-xs font-black uppercase border-2 border-black hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">📖 Read</a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}