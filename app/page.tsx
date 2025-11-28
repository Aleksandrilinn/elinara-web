'use client';
import React, { useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
// Icons
import { Github, Linkedin, Mail, ArrowRight, Database, Zap, Code2, Sparkles, Brain, Globe, Scale, DollarSign, Rocket, TrendingDown } from 'lucide-react';
import { SiPython, SiStreamlit } from "react-icons/si";
import { DiJava, DiJavascript } from 'react-icons/di';

export default function Home() {
  // Impressum visibility state
  const [showImpressum, setShowImpressum] = useState(false);

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* --- ULTRA MINIMALIST NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tighter hover:text-blue-400 transition-colors cursor-pointer">ELINARA LABS</span>
          <div className="flex gap-6 text-sm font-mono text-gray-500">
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#about" className="hover:text-white transition-colors">Concept</a>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4 md:px-8 border-b border-white/5">
        
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* LEFT SIDE: Pure Identity */}
            <div className="space-y-6 z-10">
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500">
                    Elinara Labs
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 font-light max-w-lg leading-relaxed">
                    Transforming economic theory into practical solutions.
                </p>
                
                <div className="pt-8 flex flex-wrap gap-4">
                    <a href="#projects" className="px-6 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-all flex items-center gap-2 group">
                        View Lab <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                    </a>
                </div>
            </div>

            {/* RIGHT SIDE: Optimized Simulation */}
            <div className="relative z-10">
                {/* Fixed height of 480px to ensure total stability */}
                <div className="w-full h-[480px] bg-[#0F0F0F] rounded-lg border border-white/10 shadow-2xl overflow-hidden font-mono text-xs md:text-sm relative group flex flex-col">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none"></div>
                    
                    {/* Terminal Header */}
                    <div className="bg-[#1a1a1a] px-4 py-2 flex items-center gap-2 border-b border-white/5 shrink-0">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                        </div>
                        <span className="ml-3 text-gray-500 flex items-center gap-2">
                           <Code2 size={12}/> logic.py
                        </span>
                    </div>
                    <div className="p-6 flex flex-col h-full">
                        {/* TEXT AREA */}
                        <div className="text-gray-300 leading-normal h-[200px] mb-2">
                            <span className="text-purple-400">import</span> Theory<br/>
                            <span className="text-purple-400">import</span> Code<br/>
                            <br/>
                            <TypeAnimation
                                sequence={[
                                    1000,
                                    '# Our algorithm:',
                                    800,
                                    '# Our algorithm:\ndef solve_problem(data):',
                                    500,
                                    '# Our algorithm:\ndef solve_problem(data):\n    # 1. Academic Rigor',
                                    500,
                                    '# Our algorithm:\ndef solve_problem(data):\n    # 1. Academic Rigor\n    model = Theory.analyze(data)',
                                    500,
                                    '# Our algorithm:\ndef solve_problem(data):\n    # 1. Academic Rigor\n    model = Theory.analyze(data)\n    \n    # 2. Practical Solution',
                                    1000,
                                    '# Our algorithm:\ndef solve_problem(data):\n    # 1. Academic Rigor\n    model = Theory.analyze(data)\n    \n    # 2. Practical Solution\n    return Code.optimize(model)',
                                    5000,
                                ]}
                                wrapper="span"
                                speed={80}
                                style={{ whiteSpace: 'pre-line', display: 'inline-block' }}
                                repeat={Infinity}
                                cursor={true}
                                className="text-blue-300"
                            />
                        </div>
                        {/* GRAPH AREA: Fixed at base */}
                        <div className="mt-auto pt-4 border-t border-dashed border-white/10">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-gray-500">&gt; Output:</p>
                                <span className="text-green-500 text-[10px] animate-pulse">● Live</span>
                            </div>
                            <div className="relative h-28 w-full bg-gradient-to-r from-blue-900/10 to-transparent rounded border border-blue-500/10 p-2 flex items-end overflow-hidden">
                                <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-10">
                                    {[...Array(24)].map((_, i) => <div key={i} className="border border-white/20"></div>)}
                                </div>
                                <svg className="w-full h-full absolute inset-0 text-blue-500" preserveAspectRatio="none">
                                    {/* Dashed Line (Status Quo) */}
                                    <path d="M0,100 L600,80" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" fill="none" />
                                    
                                    {/* Elinara Line (Growth) */}
                                    <motion.path
                                        d="M0,100 C150,100 200,60 300,50 C400,40 500,10 600,0"
                                        fill="none" stroke="currentColor" strokeWidth="3"
                                        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeOut" }}
                                    />
                                    <motion.path
                                        d="M0,100 C150,100 200,60 300,50 C400,40 500,10 600,0 V120 H0 Z"
                                        fill="url(#gradient)" opacity="0.2"
                                        initial={{ opacity: 0 }} animate={{ opacity: 0.25 }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                                    />
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="currentColor" />
                                            <stop offset="100%" stopColor="transparent" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/10 rounded-full blur-[100px] -z-10 opacity-40"></div>
            </div>
        </div>
      </section>

      {/* --- MANIFESTO: THE REACTOR CORE --- */}
      <section id="about" className="relative py-32 px-4 border-y border-white/5 overflow-hidden">
        
        {/* Background Technical Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
            
            {/* Manifesto Header */}
            <div className="text-center max-w-3xl mx-auto mb-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/60 text-[10px] font-mono uppercase tracking-widest mb-6 backdrop-blur-md">
                    <Sparkles size={10} /> The Elinara Concept
                </div>
                
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-8 leading-tight">
                    We don&apos;t guess. <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-white">We calculate.</span>
                </h2>
                
                <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed">
                    The world is made of opinions. <strong className="text-white">Elinara Labs</strong> is the sanctuary of precision.
                    We are the link between the mathematical equation and the strategic decision in the boardroom.
                </p>
            </div>

            {/* The Process Grid (The Flow) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                
                {/* Connection Line (Desktop Only) */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent -translate-y-1/2 z-0"></div>

                {/* PILLAR 1: THEORY */}
                <div className="group relative z-10 bg-[#0A0A0A] border border-white/10 p-8 rounded-2xl hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                    <div className="w-12 h-12 bg-[#111] border border-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                        <Brain size={24} className="text-blue-400"/>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        1. Academic Rigor
                        <span className="text-[10px] font-mono text-blue-500 border border-blue-500/30 px-1.5 rounded">INPUT</span>
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        We ignore the noise. We go directly to the source: Scopus papers, World Bank databases, and validated economic theorems.
                    </p>
                </div>

                {/* PILLAR 2: CODE */}
                <div className="group relative z-10 bg-[#0A0A0A] border border-white/10 p-8 rounded-2xl hover:border-green-500/50 transition-all duration-500 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                    <div className="w-12 h-12 bg-[#111] border border-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                        <Code2 size={24} className="text-green-400"/>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        2. Engineering
                        <span className="text-[10px] font-mono text-green-500 border border-green-500/30 px-1.5 rounded">PROCESS</span>
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        We translate academic abstraction into Python and TypeScript. Building data pipelines that turn statics into dynamics.
                    </p>
                </div>

                {/* PILLAR 3: IMPACT */}
                <div className="group relative z-10 bg-[#0A0A0A] border border-white/10 p-8 rounded-2xl hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                    <div className="w-12 h-12 bg-[#111] border border-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                        <Globe size={24} className="text-purple-400"/>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        3. Real Solution
                        <span className="text-[10px] font-mono text-purple-500 border border-purple-500/30 px-1.5 rounded">OUTPUT</span>
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        We deliver clarity. Tools that allow companies and individuals to navigate economic complexity with mathematical confidence.
                    </p>
                </div>

            </div>
        </div>
      </section>

      {/* --- PROJECTS (Bento Grid) --- */}
      <section id="projects" className="py-32 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 border-l-4 border-blue-500 pl-4 flex items-center gap-4">
            Projects & Protocols
            <span className="text-xs font-mono font-normal text-gray-500 px-2 py-1 bg-white/5 rounded border border-white/5">v1.1.0</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
          
          {/* 1. Elastic */}
<a href="/app_elastic" className="group relative md:col-span-2 row-span-1 rounded-2xl bg-[#0F0F0F] border border-white/10 p-8 hover:border-blue-500/50 transition-all overflow-hidden cursor-pointer block">
  <div className="absolute top-4 right-4">
    <span className="px-3 py-1 text-xs font-mono rounded bg-green-900/30 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]">
      PROTOTYPE
    </span>
  </div>

  <div className="h-full flex flex-col justify-between relative z-10">
    <div>
      <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
        Elastic
      </h3>
      <p className="text-gray-400 text-sm max-w-lg">
        Dynamic pricing via OCR. Functional prototype in development for future integration with real-time retail databases.
      </p>
    </div>

    <div className="mt-4 text-xs font-mono text-gray-600 flex items-center gap-1">
      <span className="animate-pulse">●</span> In Development
    </div>

    <div className="flex gap-3 mt-6">
      <SiPython className="text-gray-500 hover:text-white transition-colors" size={20}/>
      <SiStreamlit className="text-gray-500 hover:text-white transition-colors" size={20}/>
      <DiJavascript className="text-gray-500 hover:text-white transition-colors" size={20}/>
    </div>
  </div>

  <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] group-hover:bg-blue-600/20 transition-all"></div>
</a>


         {/* 2. DCF Engine */}
          <a href="/dcf" className="group relative md:col-span-1 row-span-1 rounded-2xl bg-[#0F0F0F] border border-white/10 p-8 hover:border-blue-500/50 transition-all cursor-pointer block">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 text-xs font-mono rounded bg-blue-900/30 text-blue-400 border border-blue-500/20">
                TOOL
              </span>
            </div>
            <div className="flex flex-col h-full justify-between">
              <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-blue-500 group-hover:text-white transition-colors">
                        <DollarSign size={28}/>
                    </div>
                    <h3 className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">DCF Engine</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Intrinsic value calculator. Connects to Yahoo Finance to evaluate companies in real-time.
                  </p>
              </div>
              <div className="mt-4 text-xs font-mono text-blue-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Open Tool <ArrowRight size={12}/>
              </div>
            </div>
          </a>

          {/* 3. VC Simulator */}
          <a href="/vc" className="group relative md:col-span-1 row-span-1 rounded-2xl bg-[#0F0F0F] border border-white/10 p-8 hover:border-purple-500/50 transition-all cursor-pointer block">
             <div className="absolute top-4 right-4">
               <span className="px-3 py-1 text-xs font-mono rounded bg-purple-900/30 text-purple-400 border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]">
                 NEW
               </span>
             </div>
             <div className="flex flex-col h-full justify-between">
              <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-purple-500 group-hover:text-white transition-colors">
                        <Rocket size={28}/>
                    </div>
                    <h3 className="text-3xl font-bold text-white group-hover:text-purple-400 transition-colors">VC Simulator</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    &quot;Top-Down&quot; valuation for startups and pre-revenue companies.
                  </p>
              </div>
              <div className="mt-4 text-xs font-mono text-purple-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Open Tool <ArrowRight size={12}/>
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-600/10 rounded-full blur-[60px] group-hover:bg-purple-600/20 transition-all"></div>
          </a>

          {/* 4. SanctionDelta - AGORA CLICÁVEL */}
          <a href="/sanction_scanner" className="group relative md:col-span-2 row-span-1 rounded-2xl bg-[#0F0F0F] border border-white/10 p-8 hover:border-red-500/50 transition-all cursor-pointer overflow-hidden block">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 text-xs font-mono rounded bg-gray-800 text-gray-400 border border-gray-700">
                CONCEPT
              </span>
            </div>
            <div className="h-full flex flex-col justify-between relative z-10">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="text-red-500 group-hover:text-white transition-colors">
                            <Globe size={28}/>
                        </div>
                        <h3 className="text-3xl font-bold text-white group-hover:text-red-500 transition-colors">Sanction Scanner</h3>
                    </div>
                    <p className="text-gray-400 text-sm max-w-xl">
                        Tracking the impact of sanctions on the Russian economy. 
                        Applies the Synthetic Control Method (SCM) to measure the differential (Δ) between Russia&apos;s real indicators and a non-sanctioned &apos;Synthetic Russia&apos;.
                    </p>
                </div>
                <div className="mt-4 text-xs font-mono text-red-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Open Tool <ArrowRight size={12}/>
                </div>
                <div className="flex gap-3 mt-6">
                 <SiPython className="text-gray-500 hover:text-white transition-colors" size={20}/>
                 <SiStreamlit className="text-gray-500 hover:text-white transition-colors" size={20}/>
                 <DiJavascript className="text-gray-500 hover:text-white transition-colors" size={20}/>
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-red-900/10 rounded-full blur-[80px] group-hover:bg-red-900/20 transition-all"></div>
          </a>

        </div>
      </section>

      {/* --- FOOTER WITH LEGAL IMPRESSUM --- */}
      <footer className="py-20 text-center border-t border-white/5 bg-[#050505] relative z-10 mt-20">
        <div className="max-w-2xl mx-auto px-4 relative z-10">
            <h3 className="text-2xl font-bold tracking-tighter text-white mb-6">Ready to challenge the theory?</h3>
            <p className="text-gray-500 text-sm mb-8 max-w-lg mx-auto">We are always looking for challenging problems to solve.</p>
            
            <div className="flex justify-center gap-8 mb-12">
                <a href="https://github.com/Aleksandrilinn" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-mono hover:underline decoration-blue-500 underline-offset-4"><Github size={16} /> GitHub</a>
                <a href="https://www.linkedin.com/in/aleksandr-ilin-70112831a/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-mono hover:underline decoration-blue-500 underline-offset-4"><Linkedin size={16} /> LinkedIn</a>
                <a href="mailto:aleksandr0799@hotmail.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-mono hover:underline decoration-blue-500 underline-offset-4"><Mail size={16} /> Contact</a>
            </div>
            
            <div className="border-t border-white/5 pt-8">
                <p className="text-gray-700 text-[10px] uppercase tracking-widest mb-4">
                    Elinara Labs © 2025 • Operating from Germany & Portugal
                </p>
                
                <button 
                    onClick={() => setShowImpressum(!showImpressum)}
                    className="flex items-center gap-1 mx-auto text-xs text-gray-600 hover:text-gray-400 transition-colors mb-4"
                >
                    <Scale size={12} /> Impressum / Legal Notice {showImpressum ? '▴' : '▾'}
                </button>
                {showImpressum && (
                    <div className="text-left text-xs text-gray-400 max-w-lg mx-auto bg-[#0a0a0a] p-8 rounded-xl border border-white/5 animate-fade-in shadow-2xl space-y-4 font-sans">
                        
                        {/* SECTION 1: Mandatory Identification */}
                        <div>
                            <h4 className="text-white mb-2 font-bold border-b border-white/10 pb-1">Angaben gemäß § 5 TMG</h4>
                            <p className="font-bold text-white">Aleksandr Ilin</p>
                            <p className="text-gray-500 italic mb-1">Einzelunternehmer</p>
                            <p>Lingstrasse, 8</p>
                            <p>90443 Nuremberg</p>
                            <p>Germany</p>
                        </div>

                        {/* SECTION 2: Mandatory Contact */}
                        <div>
                            <h4 className="text-white mb-2 font-bold border-b border-white/10 pb-1 mt-4">Kontakt / Contact</h4>
                            <p>Telefon: <span className="text-gray-300">+49 174 16 29 207</span></p>
                            <p>E-Mail: <span className="text-gray-300">aleksandr0799@hotmail.com</span></p>
                        </div>

                        {/* SECTION 4: Editorial Responsibility */}
                        <div>
                            <h4 className="text-white mb-2 font-bold border-b border-white/10 pb-1 mt-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h4>
                            <p>Aleksandr Ilin</p>
                            <p>Lingstrasse 8, 90443 Nuremberg</p>
                        </div>

                        {/* SECTION 5: EU Dispute Resolution */}
                        <div className="text-[10px] text-gray-600 mt-6 pt-4 border-t border-white/5">
                            <p className="mb-2">
                                <strong className="text-gray-500">EU Dispute Resolution:</strong><br/>
                                The European Commission provides a platform for online dispute resolution (ODR): <a href="https://ec.europa.eu/consumers/odr/" target="_blank" className="underline hover:text-blue-400">https://ec.europa.eu/consumers/odr/</a>.<br/>
                                We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.
                            </p>
                            <p>
                                <strong className="text-gray-500">Haftung für Inhalte (Liability):</strong><br/>
                                As a service provider, we are responsible for our own content on these pages in accordance with Sec. 7, paragraph 1 TMG under general laws.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </footer>
    </main>
  );
}