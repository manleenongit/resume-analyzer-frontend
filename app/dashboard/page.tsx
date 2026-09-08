"use client";

import React, { useEffect, useState } from 'react';
import { fetchUserHistory, getStoredUserId } from '../../lib/api';
import { Loader2, ArrowLeft, TrendingUp, TrendingDown, History } from 'lucide-react';
import Link from 'next/link';

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

  useEffect(() => {
    async function loadHistory() {
      try {
        const userId = getStoredUserId();
        // Even if no user ID, fetchUserHistory will mock an empty array or throw an error.
        const data = await fetchUserHistory(userId || undefined);
        setHistory(data.history || []);
      } catch (err: any) {
        setError(err.message || "Failed to load history.");
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDE047] flex flex-col items-center justify-center p-8 overflow-hidden font-mono">
        <Loader2 size={100} className="animate-spin text-black mb-8" />
        <h2 className="text-4xl font-black uppercase text-black">Fetching Your Past Triumphs...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBEB] p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 mb-8 px-6 py-2 bg-white text-black border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
        >
          <ArrowLeft size={20} className="text-black" /> Back to Analyzer
        </Link>

        <header className="mb-12 border-b-8 border-black pb-6 flex items-center gap-4">
          <div className="bg-[#A855F7] p-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <History size={48} className="text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-black text-black uppercase tracking-tighter">Your Journey</h1>
            <p className="text-xl font-bold text-black italic bg-yellow-400 inline-block px-2 border-2 border-black mt-2">Track your resume optimizations</p>
          </div>
        </header>

        {error ? (
          <div className="bg-[#FF5F5F] border-8 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center transform rotate-1">
            <h2 className="text-3xl font-black uppercase text-white mb-4">Houston, We Have a Problem</h2>
            <p className="font-bold text-xl text-black bg-white border-4 border-black p-4 inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">{error}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white border-8 border-black p-12 text-center shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
            <h2 className="text-4xl font-black uppercase text-black mb-6">It&apos;s quiet in here...</h2>
            <p className="text-xl font-bold text-zinc-600 mb-8">You haven&apos;t analyzed any resumes yet. Time to get to work!</p>
            <Link 
              href="/"
              className="px-8 py-4 bg-[#4ADE80] text-black border-4 border-black font-black text-2xl uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all inline-block"
            >
              Start Analyzing
            </Link>
          </div>
        ) : (
          <div className="space-y-8 relative">
            {/* Vertical timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-2 bg-black hidden md:block"></div>
            
            {history.map((record, index) => (
              <div key={record.id || index} className="relative flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center">
                
                {/* Timeline Dot */}
                <div className="hidden md:flex absolute left-8 -ml-3 w-8 h-8 bg-yellow-400 border-4 border-black rounded-full z-10 items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
                
                <div className="w-full md:pl-24">
                  <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row justify-between items-center hover:bg-yellow-50 transition-colors">
                    
                    <div className="flex flex-col mb-4 sm:mb-0 text-center sm:text-left">
                      <p className="text-sm font-black uppercase text-gray-500 mb-1">{new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                      <h3 className="text-2xl font-black text-black uppercase">{record.job_title || "Unknown Position"}</h3>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-black uppercase text-gray-500">Score</span>
                        <span className="text-4xl font-black text-[#A855F7] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">{record.overall_score}%</span>
                      </div>
                      
                      {record.trend_delta !== null && record.trend_delta !== undefined && (
                        <div className={`px-4 py-2 border-4 border-black font-black flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                          record.trend_delta > 0 ? "bg-[#4ADE80] text-black" : 
                          record.trend_delta < 0 ? "bg-[#FF5F5F] text-white" : "bg-zinc-200 text-black"
                        }`}>
                          {record.trend_delta > 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                          <span className="text-lg">
                            {record.trend_delta > 0 ? '+' : ''}{record.trend_delta}%
                          </span>
                        </div>
                      )}
                    </div>

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
