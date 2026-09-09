"use client";

import React, { useEffect, useState } from 'react';
import { fetchUserHistory, getStoredUserId } from '../../lib/api';
import { Loader2, ArrowLeft, TrendingUp, TrendingDown, History, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

interface HistoryRecord {
  id: string;
  date: string;
  overall_score: number;
  trend_delta: number | null;
  job_title?: string;
}

export default function DashboardPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    async function loadHistory() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          router.push('/login');
          return;
        }

        const userMeta = data.session.user?.user_metadata || {};
        const email = data.session.user?.email || 'USER';
        setUsername(userMeta.username || email.split('@')[0]);

        const userId = await getStoredUserId();
        const historyData = await fetchUserHistory(userId || undefined);
        setHistory(historyData.history || []);
      } catch (err: any) {
        setError(err.message || "Failed to load history.");
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDE047] flex flex-col items-center justify-center p-8 overflow-hidden font-mono">
        <Loader2 size={100} className="animate-spin text-black mb-8" />
        <h2 className="text-5xl font-black uppercase text-black tracking-tighter">Summoning Data...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBEB] p-8 font-mono relative overflow-hidden">
      {/* Subtle Brutalist Grid Overlay */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20" 
        style={{ backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', backgroundSize: '40px 40px' }} 
      />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <Link 
          href="/analyzer"
          className="inline-flex items-center gap-2 mb-12 px-6 py-2 bg-white text-black border-4 border-black font-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all"
        >
          <ArrowLeft size={20} className="text-black" /> Back to Analyzer
        </Link>

        <header className="mb-16 border-b-8 border-black pb-8 flex flex-col items-start">
          <div className="bg-[#A855F7] px-6 py-2 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 mb-6 flex items-center gap-3">
            <Sparkles size={24} className="text-yellow-400" />
            <span className="text-2xl font-black uppercase text-white">WELCOME BACK,</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-black uppercase tracking-tighter drop-shadow-[6px_6px_0px_rgba(255,255,255,1)] truncate w-full">
            {username}
          </h1>
        </header>

        {error ? (
          <div className="bg-[#FF5F5F] border-8 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center transform rotate-1 mb-12">
            <h2 className="text-4xl font-black uppercase text-white mb-4">Houston, We Have a Problem</h2>
            <p className="font-bold text-2xl text-black bg-white border-4 border-black p-4 inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">{error}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white border-8 border-black p-12 text-center shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
            <h2 className="text-5xl font-black uppercase text-black mb-6 tracking-tighter">It&apos;s quiet in here...</h2>
            <p className="text-2xl font-bold text-zinc-600 mb-10">You haven&apos;t analyzed any resumes yet. Time to get to work!</p>
            <Link 
              href="/analyzer"
              className="px-10 py-5 bg-[#4ADE80] text-black border-4 border-black font-black text-3xl uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all inline-block"
            >
              START ANALYZING ⚡
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {history.map((record, index) => (
              <div key={record.id || index} className="bg-white border-8 border-black p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between min-h-[250px]">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <p className="text-sm font-black uppercase text-zinc-600 bg-zinc-200 px-3 py-1 border-2 border-black">
                      {new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    {record.trend_delta !== null && record.trend_delta !== undefined && (
                      <div className={`px-2 py-1 border-2 border-black font-black flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                        record.trend_delta > 0 ? "bg-[#4ADE80] text-black" : 
                        record.trend_delta < 0 ? "bg-[#FF5F5F] text-white" : "bg-zinc-200 text-black"
                      }`}>
                        {record.trend_delta > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        <span className="text-xs">
                          {record.trend_delta > 0 ? '+' : ''}{record.trend_delta}%
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-black text-black uppercase mb-6 line-clamp-3 leading-snug">
                    {record.job_title || "Unknown Position"}
                  </h3>
                </div>

                <div className="flex items-center justify-between border-t-4 border-black pt-6 mt-4">
                  <span className="text-xl font-black uppercase text-black">Score</span>
                  <div className="bg-[#FDE047] px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
                    <span className="text-4xl font-black text-black">{record.overall_score}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
