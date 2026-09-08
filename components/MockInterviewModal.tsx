"use client";

import React, { useState } from 'react';
import { generateMockInterview } from '../lib/api';
import { X, ChevronDown, ChevronUp, Loader2, Zap } from 'lucide-react';

interface Question {
  question: string;
  suggested_answer: string;
}

interface MockInterviewModalProps {
  analysisId: string;
  onClose: () => void;
}

export default function MockInterviewModal({ analysisId, onClose }: MockInterviewModalProps) {
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Hard">("Intermediate");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateMockInterview(analysisId, difficulty);
      const qArray = data.questions || [];
      const aArray = data.suggested_answers || [];
      const zipped = qArray.map((q: string, i: number) => ({
        question: q,
        suggested_answer: aArray[i] || ""
      }));
      setQuestions(zipped);
    } catch (err: any) {
      setError(err.message || "Failed to generate interview questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-mono">
      {/* Modal Container */}
      <div className="bg-[#FFFBEB] border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-3xl w-full max-h-[90vh] overflow-y-auto relative flex flex-col transform -rotate-1">
        
        {/* Header */}
        <div className="bg-[#A855F7] border-b-8 border-black p-6 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            AI Mock Interview
          </h2>
          <button 
            onClick={onClose}
            className="bg-white p-2 border-4 border-black hover:bg-yellow-400 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <X size={24} className="text-black font-black" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 transform rotate-1">
          
          {questions.length === 0 && !loading && (
            <div className="space-y-6">
              <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <label className="block text-xl font-black text-black mb-4 uppercase tracking-tighter italic">
                  Select Difficulty:
                </label>
                <div className="flex flex-wrap gap-4">
                  {(["Beginner", "Intermediate", "Hard"] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`px-6 py-3 border-4 border-black font-black text-lg uppercase transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 ${
                        difficulty === level 
                          ? "bg-[#4ADE80] text-black" 
                          : "bg-white text-zinc-600 hover:bg-yellow-50"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-[#FF5F5F] border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="font-black uppercase text-white">{error}</p>
                </div>
              )}

              <button 
                onClick={handleGenerate}
                className="w-full py-6 bg-yellow-400 text-black border-4 border-black font-black text-2xl uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex justify-center items-center gap-3"
              >
                <Zap className="fill-black" /> GENERATE QUESTIONS
              </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              <Loader2 size={80} className="animate-spin text-black" />
              <p className="text-2xl font-black uppercase text-black animate-pulse bg-yellow-400 px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                Brewing hard questions...
              </p>
            </div>
          )}

          {questions.length > 0 && !loading && (
            <div className="space-y-6">
              <div className="bg-white border-4 border-black p-4 mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] inline-block">
                <p className="font-black text-black uppercase text-lg">
                  Difficulty: <span className="bg-yellow-400 px-2 border-2 border-black">{difficulty}</span>
                </p>
              </div>

              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <div key={idx} className="border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <button
                      onClick={() => toggleAccordion(idx)}
                      className="w-full p-6 flex justify-between items-center text-left hover:bg-yellow-50 transition-colors"
                    >
                      <div className="flex gap-4 items-start">
                        <span className="bg-black text-white font-black px-3 py-1 text-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                          Q{idx + 1}
                        </span>
                        <h3 className="text-xl font-black text-black pr-4 leading-tight">{q.question}</h3>
                      </div>
                      <div className="shrink-0 bg-yellow-400 p-1 border-2 border-black">
                        {expandedIndex === idx ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                      </div>
                    </button>
                    
                    {expandedIndex === idx && (
                      <div className="p-6 pt-0 border-t-4 border-black bg-zinc-50">
                        <div className="mt-4 p-4 border-4 border-black bg-[#4ADE80] shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                          <p className="text-xs font-black uppercase text-black mb-2 opacity-70">Suggested Answer Direction</p>
                          <p className="font-bold text-black text-lg leading-snug">{q.suggested_answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setQuestions([])}
                className="mt-8 px-6 py-3 bg-black text-white border-4 border-black font-black uppercase shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:bg-zinc-800 hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                Reset / Change Difficulty
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
