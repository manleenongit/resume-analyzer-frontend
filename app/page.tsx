"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import { FileSearch, BrainCircuit, BookOpen, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });
    
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen p-8 font-mono relative overflow-hidden bg-[#FFFBEB]">
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

      <div className="max-w-6xl mx-auto relative z-10">
        {/* HEADER NAV */}
        <nav className="sticky top-0 z-50 flex justify-between items-center mb-8 md:mb-16 bg-white border-4 border-black p-3 md:p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-xl md:text-3xl font-black uppercase tracking-tighter truncate mr-2">RESUME MATCHER</div>
          <div className="flex gap-2 md:gap-4 shrink-0">
            {user ? (
              <Link href="/analyzer" className="px-4 py-2 md:px-8 md:py-3 bg-[#4ADE80] text-black border-4 border-black font-black text-sm md:text-lg uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-1 md:gap-2">
                GO TO APP <ArrowRight size={20} className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
            ) : (
              <Link href="/login" className="px-4 py-2 md:px-8 md:py-3 bg-[#A855F7] text-white border-4 border-black font-black text-sm md:text-lg uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                LOGIN <span className="hidden sm:inline">/ SIGN UP</span>
              </Link>
            )}
          </div>
        </nav>

        {/* HERO SECTION */}
        <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl mx-auto gap-12 relative z-10 mb-16 md:mb-24">
          <div className="flex flex-col items-start lg:w-1/2 space-y-6 transform -rotate-1">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-black uppercase tracking-tighter leading-none drop-shadow-[6px_6px_0px_rgba(255,255,255,1)]">
              CRACK THE<br/>
              <span className="bg-[#FDE047] px-3 md:px-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block mt-2 md:mt-4 transform rotate-2">CODE</span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-black bg-white p-4 md:p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-lg leading-snug">
              Stop guessing. Let AI analyze your resume against any job description, find the missing skills, and build a custom battle plan.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end lg:w-1/2">
            <Link href={user ? "/analyzer" : "/login"} className="px-6 py-4 md:px-10 md:py-5 bg-[#FF5F5F] text-black border-4 border-black font-black text-2xl md:text-3xl lg:text-4xl uppercase shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all inline-block transform rotate-1 text-center w-full sm:w-auto">
              START MATCHING ⚡
            </Link>
          </div>
        </div>

        {/* FEATURES / USP SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Feature 1 */}
          <div className="bg-white border-8 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform transform rotate-1">
            <div className="bg-[#A855F7] w-16 h-16 flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
              <FileSearch size={32} className="text-white" />
            </div>
            <h3 className="text-3xl font-black uppercase mb-4">AI Scored</h3>
            <p className="font-bold text-lg text-zinc-700">Get a hard percentage score on your resume&apos;s match to the job description. Instantly identify exactly what recruiters are looking for.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#4ADE80] border-8 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform transform -rotate-1">
            <div className="bg-white w-16 h-16 flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
              <BrainCircuit size={32} className="text-black" />
            </div>
            <h3 className="text-3xl font-black uppercase mb-4 text-black">Mock Interviews</h3>
            <p className="font-bold text-lg text-black">Face our brutal AI interviewer. Answer real questions generated from your specific skill gaps and get immediate feedback.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-black border-8 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform transform rotate-1">
            <div className="bg-[#FDE047] w-16 h-16 flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
              <BookOpen size={32} className="text-black" />
            </div>
            <h3 className="text-3xl font-black uppercase mb-4 text-white">Curated by AI</h3>
            <p className="font-bold text-lg text-zinc-300">We scoured 5,400+ resources to build you a custom game plan. YouTube links, courses, and readings tailored to fix your missing skills.</p>
          </div>
        </div>
        
      </div>
    </div>
  );
}