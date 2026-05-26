"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { Upload, CheckCircle, BookOpen, Loader2, ArrowLeft, Zap } from 'lucide-react';

// --- NEW TYPESCRIPT INTERFACES FOR THE LINKS ---
interface TaskLink {
  youtube: string;
  course: string;
  reading: string;
}

interface DetailedTask {
  skill_name: string;
  links: TaskLink;
}

interface RoadmapItem {
  phase: string;
  tasks: string[];
  resources: string;
  detailed_tasks?: DetailedTask[]; // <-- The frontend now knows about this!
}

interface AnalysisResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  roadmap: RoadmapItem[];
}

export default function ResumeMatcher() {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [view, setView] = useState<'upload' | 'results'>('upload');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleProcess = async () => {
    setErrorMessage(null); // Clear old ghosts
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
        'https://h74hd64z-5000.inc1.devtunnels.ms/api/analyze', 
        formData
      );
      
      setResult(response.data);
      setView('results'); // Switch to results view after success
    } catch (error) {
      console.error("Error:", error);
      
      if (axios.isAxiosError(error) && error.response?.data?.error === "UNREADABLE_PDF") {
        setErrorMessage(error.response.data.message || "This PDF is basically a picture. Our AI needs actual text to work its magic!");
      } else {
        setErrorMessage("The backend is taking a nap or the tunnel is broken. Make sure your friend's server is actually running!");
      }
      setView('upload'); // Keep them on upload to try again, or create an error view
    } finally {
      setLoading(false);
    }
  };

  // --- QUIRKY LOADING SCREEN ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDE047] flex flex-col items-center justify-center p-8 overflow-hidden">
        <div className="relative">
          <Loader2 size={120} className="animate-spin text-black mb-8 relative z-10" />
          <Zap size={60} className="absolute -top-4 -right-4 text-purple-600 animate-bounce" />
        </div>
        <h2 className="text-5xl font-black uppercase italic tracking-tighter text-black text-center">
          Crunching the <span className="bg-white px-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Numbers</span>
        </h2>
        <p className="mt-6 text-xl font-bold uppercase animate-pulse">Wait a sec, the AI is thinking really hard...</p>
        <div className="mt-12 flex gap-4">
          <div className="w-8 h-8 bg-purple-500 border-4 border-black animate-bounce delay-75"></div>
          <div className="w-8 h-8 bg-red-500 border-4 border-black animate-bounce delay-150"></div>
          <div className="w-8 h-8 bg-blue-500 border-4 border-black animate-bounce delay-300"></div>
        </div>
      </div>
    );
  }

  // --- QUIRKY ERROR OVERLAY ---
  if (errorMessage) {
    return (
      <div className="min-h-screen bg-[#FF5F5F] flex flex-col items-center justify-center p-8 font-mono">
        <div className="bg-white border-8 border-black p-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-xl w-full text-center transform rotate-1">
          <div className="text-8xl mb-6">😵‍💫</div>
          <h2 className="text-4xl font-black uppercase mb-4 tracking-tighter border-b-4 border-black pb-2 inline-block">
            OOPS! WE HIT A SNAG
          </h2>
          
          <div className="bg-yellow-200 border-4 border-black p-4 my-6 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-black text-lg leading-tight uppercase">
              {errorMessage}
            </p>
          </div>

        

          <button 
            onClick={() => setErrorMessage(null)}
            className="px-10 py-4 bg-black text-white font-black text-xl uppercase hover:bg-zinc-800 transition-all shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            TRY AGAIN 🔄
          </button>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 border-4 border-black -z-10 animate-spin-slow"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500 rounded-full border-4 border-black -z-10 animate-bounce"></div>
      </div>
    );
  }

  // --- VIEW 1: UPLOAD PAGE ---
  if (view === 'upload') {
    return (
      <div className="min-h-screen bg-[#F3E8FF] p-8 font-mono">
        <div className="max-w-3xl mx-auto">
          <header className="mb-16 text-center transform -rotate-2">
            <h1 className="text-6xl font-black text-black mb-2 bg-[#FDE047] inline-block px-4 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              RESUME MATCHER
            </h1>
            <p className="text-xl font-bold text-black mt-6 italic">The fun way to land your dream job.</p>
          </header>

          <div className="space-y-10">
            <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <label className="block text-2xl font-black mb-6 uppercase tracking-tighter italic">1. Drop that resume!</label>
              <div className={`border-4 border-dashed border-black p-12 text-center cursor-pointer relative transition-all ${resume ? 'bg-[#4ADE80]' : 'bg-white hover:bg-yellow-50'}`}>
                <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setResume(e.target.files?.[0] || null)} />
                {resume ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle className="text-black mb-2" size={48} />
                    <p className="font-black uppercase">{resume.name}</p>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto text-black mb-4" size={40}/>
                    <p className="font-black uppercase text-sm italic">Click to browse or drop PDF</p>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <label className="block text-2xl font-black mb-6 uppercase tracking-tighter italic">2. What&apos;s the job?</label>
              <textarea 
                className="w-full h-48 p-4 border-4 border-black focus:bg-yellow-50 outline-none font-bold text-black text-lg"
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
      </div>
    );
  }

  // --- VIEW 2: RESULTS PAGE ---
  return (
    <div className="min-h-screen bg-[#F3E8FF] p-8 font-mono">
      <div className="max-w-4xl mx-auto"> 
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => setView('upload')}
          className="mb-8 px-6 py-2 bg-white border-4 border-black font-black uppercase flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
        >
          <ArrowLeft size={20} /> Back to Start
        </button>

        {/* TOP SECTION: Score and Skills side-by-side */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* Score Bubble */}
          <div className="bg-[#A855F7] p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center relative flex flex-col justify-center min-h-62.5">
            <div className="text-7xl sm:text-8xl font-black text-white drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] wrap-break-words">
              {result?.score}%
            </div>
            <p className="text-white font-black uppercase text-xl mt-4 tracking-tighter">Overall Match Score</p>
            <div className="absolute top-0 right-0 bg-yellow-400 border-l-4 border-b-4 border-black px-4 py-1 font-black text-sm">
              AI VERIFIED
            </div>
          </div>

          {/* Skills Analysis Card */}
<div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col">
  <h3 className="text-2xl font-black mb-6 uppercase border-b-4 border-black pb-2 inline-block self-start">
    Skill Breakdown
  </h3>
  
  <div className="space-y-6">
    {/* MATCHED SECTION */}
    <div>
      <p className="text-xs font-black uppercase text-gray-500 mb-2">✅ Nailed It</p>
      <div className="flex flex-wrap gap-3">
        {result?.matchedSkills.map((s) => (
          <span key={s} className="px-3 py-1 bg-[#4ADE80] border-2 border-black font-black text-[10px] uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            {s}
          </span>
        ))}
      </div>
    </div>

    {/* MISSING SECTION */}
    <div>
      <p className="text-xs font-black uppercase text-gray-500 mb-2">🚩 Needs Work</p>
      <div className="flex flex-wrap gap-3">
        {result?.missingSkills.map((s) => (
          <span key={s} className="px-3 py-1 bg-[#FF5F5F] text-white border-2 border-black font-black text-[10px] uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            {s}
          </span>
        ))}
        {result?.missingSkills.length === 0 && (
          <p className="text-sm font-bold italic text-green-600">No missing skills! You are a beast!</p>
        )}
      </div>
    </div>
  </div>
</div>
        </div>

        {/* BOTTOM SECTION: Full-Width Roadmap */}
        <div className="bg-black p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-4xl font-black mb-12 flex items-center gap-4 text-white uppercase italic tracking-tighter">
            <BookOpen className="text-yellow-400" size={40} /> The Game Plan
          </h3>
          
          <div className="space-y-12">
            {result?.roadmap.map((item, idx) => (
              <div key={idx} className="flex gap-8 relative group">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-white bg-yellow-400 text-black flex items-center justify-center text-3xl font-black shrink-0 z-10 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    {idx + 1}
                  </div>
                  {idx !== result.roadmap.length - 1 && (
                    <div className="w-1.5 h-full bg-white mt-4"></div>
                  )}
                </div>
                
                <div className="pb-10 w-full">
                  <h4 className="text-3xl font-black text-yellow-400 uppercase tracking-tighter mb-4">
                    {item.phase}
                  </h4>
                  
                  {/* --- NEW DYNAMIC LINKS UI --- */}
                  {item.detailed_tasks && item.detailed_tasks.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {item.detailed_tasks.map((task, tIdx) => (
                        <div key={tIdx} className="bg-zinc-900 border-2 border-zinc-700 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          <p className="text-[#4ADE80] font-black uppercase text-lg mb-3">
                            {task.skill_name}
                          </p>
                          <div className="flex flex-wrap gap-3">
                            <a href={task.links.youtube} target="_blank" rel="noreferrer" className="bg-red-500 text-white px-3 py-1 text-xs font-black uppercase border-2 border-black hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                              📺 YouTube
                            </a>
                            <a href={task.links.course} target="_blank" rel="noreferrer" className="bg-blue-500 text-white px-3 py-1 text-xs font-black uppercase border-2 border-black hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                              🎓 Course
                            </a>
                            <a href={task.links.reading} target="_blank" rel="noreferrer" className="bg-white text-black px-3 py-1 text-xs font-black uppercase border-2 border-black hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                              📖 Read
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Fallback if the phase is completely empty */
                    <div className="bg-zinc-900 border-2 border-zinc-700 p-4 mb-4">
                      <p className="text-[#4ADE80] font-black uppercase text-md">
                        {item.tasks?.length > 0 ? item.tasks.join(' • ') : 'Master the Essentials'}
                      </p>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}