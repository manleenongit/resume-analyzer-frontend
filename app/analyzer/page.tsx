"use client";
import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, BookOpen, Loader2, ArrowLeft, Zap, Trophy, PartyPopper, BrainCircuit } from 'lucide-react';
import { analyzeResume } from '../../lib/api';
import MockInterviewModal from '../../components/MockInterviewModal';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  overall_score: number;
  skills_found: string[];
  skills_missing: string[];
  is_perfect_match: boolean;
  roadmap: {
    [phaseName: string]: GamePlanPhase[];
  };
}

export default function AnalyzerPage() {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [view, setView] = useState<'upload' | 'results'>('upload');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    });
    
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

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
      const data = await analyzeResume(resume, jobDescription);
      
      setResult(data);
      setAnalysisId(data.analysis_id || null);
      setView('results'); 
    } catch (error: any) {
      console.error("Error:", error);
      if (error.message.includes("5MB") || error.message.includes("PDF") || error.message.includes("limit")) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("The backend is taking a nap or the tunnel is broken. Make sure your friend's server is actually running! Error: " + error.message);
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
      {/* HEADER NAV */}
      <nav className="sticky top-0 z-50 flex justify-between items-center mb-8 bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-2xl font-black uppercase tracking-tighter">RESUME MATCHER</div>
        <div className="flex gap-4">
          <Link href="/dashboard" className="px-6 py-2 bg-yellow-400 text-black border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">YOUR DASHBOARD</Link>
          <button onClick={handleLogout} className="px-6 py-2 bg-[#FF5F5F] text-white border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">LOGOUT</button>
        </div>
      </nav>

      {/* VIBRANT NEO-BRUTALIST LIQUID CANVAS */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40 mix-blend-multiply">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="neo-gooey-ink" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="25" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 40 -15" result="goo" />
              
              <feMorphology in="goo" operator="dilate" radius="5" result="outline-base" />
              <feColorMatrix in="outline-base" mode="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="black-outline" />
              
              <feMerge>
                <feMergeNode in="black-outline" />
                <feMergeNode in="goo" />
              </feMerge>
            </filter>
          </defs>
          
          <g filter="url(#neo-gooey-ink)">
            <circle cx="20%" cy="20%" r="240" fill="#FF007F" className="animate-blob-one" />
            <circle cx="80%" cy="40%" r="290" fill="#00FF66" className="animate-blob-two" />
            <circle cx="40%" cy="80%" r="260" fill="#FF6B00" className="animate-blob-three" />
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

          {/* STICKY NAV */}
          <div className="sticky top-4 z-40 mb-12 bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-wrap gap-4 justify-center">
            <button onClick={() => document.getElementById('section-score')?.scrollIntoView({behavior: 'smooth'})} className="px-4 py-2 bg-yellow-400 text-black border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">Score</button>
            <button onClick={() => document.getElementById('section-skills')?.scrollIntoView({behavior: 'smooth'})} className="px-4 py-2 bg-[#A855F7] text-white border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">Skills</button>
            {analysisId && <button onClick={() => document.getElementById('section-interview')?.scrollIntoView({behavior: 'smooth'})} className="px-4 py-2 bg-[#FF5F5F] text-black border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">Interview</button>}
            <button onClick={() => document.getElementById('section-roadmap')?.scrollIntoView({behavior: 'smooth'})} className="px-4 py-2 bg-[#4ADE80] text-black border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">Game Plan</button>
          </div>

          {/* TOP SECTION */}
          <div className="flex flex-col gap-12 mb-12">
            {/* Score Bubble */}
            <div id="section-score" className="scroll-mt-24 bg-[#A855F7] p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center relative flex flex-col justify-center items-center min-h-[250px] w-full">
              <div className="text-7xl sm:text-8xl font-black text-white drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] whitespace-nowrap">
                {result?.overall_score}%
              </div>
              <p className="text-white font-black uppercase text-xl mt-4 tracking-tighter">Overall Match Score</p>
              <div className="absolute top-0 right-0 bg-yellow-400 text-black border-l-4 border-b-4 border-black px-4 py-1 font-black text-sm">
                AI VERIFIED
              </div>
            </div>

            {/* Skills Analysis Card */}
            <div id="section-skills" className="scroll-mt-24 bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col w-full">
              <h3 className="text-3xl font-black text-black mb-6 uppercase border-b-4 border-black pb-2 inline-block self-start">
                Skill Breakdown
              </h3>
              {(!result?.skills_found.length && !result?.skills_missing.length) ? (
                <div className="bg-yellow-200 border-4 border-black p-4 my-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-base font-black uppercase text-black leading-tight">
                    🕵️‍♂️ Job description does not contain recognizable skills.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-black uppercase text-gray-500 mb-3">✅ Nailed It</p>
                    <div className="flex flex-wrap gap-4">
                      {result?.skills_found.map((s) => (
                        <span key={s} className="px-4 py-2 bg-[#4ADE80] text-black border-2 border-black font-black text-sm uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                          {s}
                        </span>
                      ))}
                      {result?.skills_found.length === 0 && (
                        <p className="text-sm font-bold italic text-zinc-500">None matched.</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase text-gray-500 mb-3">🚩 Needs Work</p>
                    <div className="flex flex-wrap gap-4">
                      {result?.skills_missing.map((s) => (
                        <span key={s} className="px-4 py-2 bg-[#FF5F5F] text-white border-2 border-black font-black text-sm uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                          {s}
                        </span>
                      ))}
                      {result?.skills_missing.length === 0 && (
                        <p className="text-sm font-bold italic text-green-600">No missing skills! You are a beast!</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MOCK INTERVIEW BANNER */}
          {analysisId && (
            <div id="section-interview" className="scroll-mt-24 bg-[#FF5F5F] border-4 border-black p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center w-full mb-12 flex flex-col md:flex-row items-center justify-between gap-8 transform rotate-1">
              <div className="text-left">
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">Prepare for Battle</h3>
                <p className="text-xl font-bold text-black mt-2 bg-yellow-400 inline-block px-2 border-2 border-black">Face our AI interviewer</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-white text-black border-4 border-black font-black text-2xl uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex items-center gap-3 whitespace-nowrap"
              >
                <BrainCircuit size={28} /> Start AI Mock Interview
              </button>
            </div>
          )}

          {/* PERFECT MATCH CHECK OR ROADMAP */}
          {result?.is_perfect_match ? (
            <div id="section-roadmap" className="scroll-mt-24 bg-[#4ADE80] border-8 border-black p-12 text-center shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 relative overflow-hidden w-full">
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
            /* FIXED: Completely hides empty black boxes if the backend sends 0 usable recommendations */
            result?.roadmap && Object.values(result.roadmap).some(tasks => tasks && tasks.length > 0) ? (
              <div id="section-roadmap" className="scroll-mt-24 bg-black p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full">
                <h3 className="text-4xl font-black mb-12 flex items-center gap-4 text-white uppercase italic tracking-tighter relative inline-flex">
                  <BookOpen className="text-yellow-400" size={40} /> The Game Plan
                  <div className="group relative ml-4 flex items-center justify-center cursor-pointer">
                    <span className="text-yellow-400 text-5xl hover:scale-110 transition-transform drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">★</span>
                    <div className="hidden group-hover:block absolute left-1/2 top-full mt-4 -translate-x-1/2 w-80 bg-[#FF5F5F] text-white border-4 border-black p-4 font-black uppercase text-base shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] z-50 tracking-normal not-italic text-center">
                      🔥 CURATED BY AI: We scoured 5,400+ active resources so you don&apos;t have to.
                    </div>
                  </div>
                </h3>
                <div className="space-y-12">
                  {Object.entries(result.roadmap)
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
            ) : null
          )}
        </div>
      )}

      {/* MODAL MOUNTING POINT */}
      {isModalOpen && analysisId && (
        <MockInterviewModal 
          analysisId={analysisId} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}
