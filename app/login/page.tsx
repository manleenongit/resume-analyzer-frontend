"use client";

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Sparkles, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSignUpSuccess(false);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/analyzer'); // Re-routed to new protected route
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
            }
          }
        });
        if (error) throw error;
        
        setSignUpSuccess(true);
        setIsLogin(true);
        setPassword('');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSignUpSuccess(false);
  };

  return (
    <div className="min-h-screen p-8 font-mono relative overflow-hidden bg-[#FFFBEB] flex flex-col items-center justify-center">
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

      <div className="w-full max-w-6xl z-10 relative">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 mb-8 px-6 py-2 bg-white text-black border-4 border-black font-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all"
        >
          <ArrowLeft size={20} className="text-black" /> Back Home
        </Link>

        <div className="bg-white border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row w-full min-h-[600px]">
          {/* LEFT SIDE: QUIRKY TEXT */}
          <div className="md:w-1/2 bg-[#FF5F5F] border-b-8 md:border-b-0 md:border-r-8 border-black p-12 flex flex-col justify-center items-center text-center">
            <Sparkles size={80} className="text-yellow-400 mb-8 animate-pulse" />
            <h1 className="text-5xl lg:text-7xl font-black uppercase text-black leading-tight tracking-tighter drop-shadow-[4px_4px_0px_rgba(255,255,255,1)]">
              UNLOCK YOUR ARSENAL
            </h1>
            <p className="mt-8 bg-yellow-400 border-4 border-black px-6 py-3 text-xl font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
              Level up your career game
            </p>
          </div>
          
          {/* RIGHT SIDE: THE FORM */}
          <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white relative">
            
            <h2 className="text-4xl font-black uppercase text-black mb-8 bg-[#4ADE80] inline-block px-4 py-2 border-4 border-black transform rotate-1 self-start">
              {isLogin ? 'ENTER THE PORTAL' : 'JOIN THE RANKS'}
            </h2>

            {signUpSuccess && (
              <div className="mb-6 bg-[#4ADE80] border-4 border-black p-4 text-black font-black uppercase text-lg transform rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                Account created! Ready for battle—log in below.
              </div>
            )}
            
            <form onSubmit={handleAuth} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-xl font-black uppercase mb-2">Username</label>
                  <input 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required={!isLogin}
                    className="w-full border-4 border-black p-4 text-xl font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none focus:bg-yellow-100 transition-all placeholder-zinc-400"
                    placeholder="SUPERSTAR99"
                  />
                </div>
              )}

              <div>
                <label className="block text-xl font-black uppercase mb-2">Email</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border-4 border-black p-4 text-xl font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none focus:bg-yellow-100 transition-all placeholder-zinc-400"
                  placeholder="YOU@EXAMPLE.COM"
                />
              </div>

              <div className="relative">
                <label className="block text-xl font-black uppercase mb-2">Password</label>
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border-4 border-black p-4 text-xl font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none focus:bg-yellow-100 transition-all placeholder-zinc-400 pr-14"
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[50px] text-black hover:scale-110 transition-transform"
                >
                  {showPassword ? <EyeOff size={28} /> : <Eye size={28} />}
                </button>
              </div>

              {error && (
                <div className="bg-[#FF5F5F] border-4 border-black p-4 text-white font-black uppercase text-lg transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#A855F7] text-white border-4 border-black py-5 text-3xl font-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {loading && <Loader2 size={28} className="animate-spin" />}
                {isLogin ? 'Login' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-10 text-center border-t-8 border-black pt-8">
              <p className="font-bold text-xl uppercase mb-4">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <button 
                onClick={toggleAuthMode}
                className="text-[#00E5FF] font-black text-2xl uppercase bg-black px-6 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                {isLogin ? 'Create one now' : 'Log in instead'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
