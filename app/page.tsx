'use client';
import React, { useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
// Ícones
import { Github, Linkedin, Mail, ArrowRight, Database, Zap, Code2, Sparkles, Brain, Globe, Scale, DollarSign } from 'lucide-react';
import { SiPython, SiStreamlit } from "react-icons/si";

export default function Home() {
  // Estado para controlar se o Impressum está visível ou não
  const [showImpressum, setShowImpressum] = useState(false);

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* --- NAVBAR ULTRA MINIMALISTA --- */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tighter hover:text-blue-400 transition-colors cursor-pointer">ELINARA LABS</span>
          <div className="flex gap-6 text-sm font-mono text-gray-500">
            <a href="#projects" className="hover:text-white transition-colors">Projetos</a>
            <a href="#about" className="hover:text-white transition-colors">Conceito</a>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4 md:px-8 border-b border-white/5">
        
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* LADO ESQUERDO: Identidade Pura */}
            <div className="space-y-6 z-10">
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500">
                    Elinara Labs
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 font-light max-w-lg leading-relaxed">
                    Transformamos teoria económica em soluções práticas.
                </p>
                
                <div className="pt-8 flex flex-wrap gap-4">
                    <a href="#projects" className="px-6 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-all flex items-center gap-2 group">
                        Ver Laboratório <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                    </a>
                </div>
            </div>

            {/* LADO DIREITO: A Simulação Otimizada */}
            <div className="relative z-10">
                {/* Altura fixa de 480px para garantir estabilidade total */}
                <div className="w-full h-[480px] bg-[#0F0F0F] rounded-lg border border-white/10 shadow-2xl overflow-hidden font-mono text-xs md:text-sm relative group flex flex-col">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none"></div>
                    
                    {/* Header do Terminal */}
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
                        {/* ÁREA DE TEXTO: Altura fixa e espaçamento normal para não invadir o gráfico */}
                        <div className="text-gray-300 leading-normal h-[200px] mb-2">
                            <span className="text-purple-400">import</span> Theory<br/>
                            <span className="text-purple-400">import</span> Code<br/>
                            <br/>
                            <TypeAnimation
                                sequence={[
                                    1000,
                                    '# O nosso algoritmo:',
                                    800,
                                    '# O nosso algoritmo:\ndef resolve_problema(dados):',
                                    500,
                                    '# O nosso algoritmo:\ndef resolve_problema(dados):\n    # 1. Rigor Académico',
                                    500,
                                    '# O nosso algoritmo:\ndef resolve_problema(dados):\n    # 1. Rigor Académico\n    modelo = Theory.analisar(dados)',
                                    500,
                                    '# O nosso algoritmo:\ndef resolve_problema(dados):\n    # 1. Rigor Académico\n    modelo = Theory.analisar(dados)\n    \n    # 2. Solução Prática',
                                    1000,
                                    '# O nosso algoritmo:\ndef resolve_problema(dados):\n    # 1. Rigor Académico\n    modelo = Theory.analisar(dados)\n    \n    # 2. Solução Prática\n    return Code.otimizar(modelo)',
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
                        {/* ÁREA DO GRÁFICO: Fixada na base */}
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
                                    {/* Linha Tracejada (Status Quo) */}
                                    <path d="M0,100 L600,80" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" fill="none" />
                                    
                                    {/* Linha Elinara (Crescimento) */}
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

      {/* --- MANIFESTO RENOVADO --- */}
      <section id="about" className="py-32 px-4 bg-[#0A0A0A] border-y border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono uppercase tracking-wider mb-4">
                    <Sparkles size={12} /> O Nosso Manifesto
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white italic leading-tight">
                    Economia + Investigação + <br/>
                    <span className="text-blue-500 italic">Programação + </span>
                </h2>
                <div className="space-y-3 text-gray-400 text-lg leading-relaxed font-light">
                    <p>
                        Somos curiosos, observamos o mundo, identificamos problemas, juntamos a teoria a pratica e desenvolvemos soluções reais para os problemas da humanidade. 
                    </p>

                        Na <strong>Elinara Labs</strong>, traduzimos equações em linhas de código que empresas, familias e governos utilizam para melhorar a sua vida.
                    
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-[#111] p-6 rounded-2xl border border-white/5 flex items-start gap-5 hover:border-blue-500/30 transition-all group">
                    <div className="p-4 bg-blue-900/20 rounded-xl text-blue-400 group-hover:text-blue-300 transition-colors">
                        <Brain size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Rigor Académico</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">Soluções derivadas de teoria económica validada e comprovada</p>
                    </div>
                </div>
                <div className="bg-[#111] p-6 rounded-2xl border border-white/5 flex items-start gap-5 hover:border-green-500/30 transition-all group">
                     <div className="p-4 bg-green-900/20 rounded-xl text-green-400 group-hover:text-green-300 transition-colors">
                        <Zap size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Engenharia Rápida</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">Python & AI para prototipar em dias, com foco nos resultados</p>
                    </div>
                </div>
                <div className="bg-[#111] p-6 rounded-2xl border border-white/5 flex items-start gap-5 hover:border-purple-500/30 transition-all group">
                     <div className="p-4 bg-purple-900/20 rounded-xl text-purple-400 group-hover:text-purple-300 transition-colors">
                        <Globe size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Impacto Real</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">Resolvemos problemas reais</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- PROJETOS (Bento Grid) --- */}
      <section id="projects" className="py-32 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 border-l-4 border-blue-500 pl-4 flex items-center gap-4">
            Projetos & Protocolos
            <span className="text-xs font-mono font-normal text-gray-500 px-2 py-1 bg-white/5 rounded border border-white/5">v1.0.6</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
          {/* Elastic */}
          <div className="group relative md:col-span-2 row-span-1 rounded-2xl bg-[#0F0F0F] border border-white/10 p-8 hover:border-blue-500/50 transition-all overflow-hidden cursor-default">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 text-xs font-mono rounded bg-green-900/30 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]">MVP LIVE</span>
            </div>
            <div className="h-full flex flex-col justify-between relative z-10">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Elastic</h3>
                <p className="text-gray-400 text-sm max-w-md">Pricing dinâmico via OCR. A IA lê o menu, analisa a procura e define o preço ótimo.</p>
              </div>
              <div className="flex gap-3 mt-6">
                 <SiPython className="text-gray-500 hover:text-white transition-colors" size={20}/>
                 <SiStreamlit className="text-gray-500 hover:text-white transition-colors" size={20}/>
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] group-hover:bg-blue-600/20 transition-all"></div>
          </div>

         {/* CARTÃO DO MEIO - AGORA É O LINK PARA O DCF */}
          <a href="/dcf" className="group relative md:col-span-1 row-span-1 rounded-2xl bg-[#0F0F0F] border border-white/10 p-8 hover:border-blue-500/50 transition-all cursor-pointer block">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 text-xs font-mono rounded bg-blue-900/30 text-blue-400 border border-blue-500/20">
                TOOL
              </span>
            </div>
            <div className="flex flex-col h-full justify-between">
              <div>
                  <div className="mb-4 text-blue-500 group-hover:text-white transition-colors">
                    <DollarSign size={32}/>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">DCF Engine</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Calculadora de valor intrínseco. Liga-se à Yahoo Finance para avaliar empresas em tempo real.
                  </p>
              </div>
              <div className="mt-4 text-xs font-mono text-blue-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Abrir Ferramenta <ArrowRight size={12}/>
              </div>
            </div>
          </a>

          {/* Scraper */}
          <div className="group relative md:col-span-1 row-span-1 rounded-2xl bg-[#0F0F0F] border border-white/10 p-8 hover:border-pink-500/50 transition-all cursor-default">
             <div className="flex flex-col h-full justify-end">
              <Database className="text-gray-600 group-hover:text-pink-500 transition-colors mb-4" size={24}/>
              <h3 className="text-xl font-bold text-white mb-1">Data Scraper</h3>
              <p className="text-gray-400 text-xs">Automator INE & Scopus.</p>
            </div>
          </div>

          {/* Chronos */}
          <div className="group relative md:col-span-2 row-span-1 rounded-2xl bg-gradient-to-r from-gray-900 to-black border border-white/10 p-8 flex items-center justify-center cursor-not-allowed">
            <div className="text-center">
              <p className="text-2xl font-serif italic text-gray-600 group-hover:text-white transition-colors duration-700">"Projeto Chronos"</p>
            </div>
          </div>
        </div>
      </section>

{/* --- FOOTER COM IMPRESSUM LEGAL --- */}
      <footer className="py-20 text-center border-t border-white/5 bg-[#050505] relative z-10 mt-20">
        <div className="max-w-2xl mx-auto px-4 relative z-10">
            <h3 className="text-2xl font-serif font-medium text-white mb-6">Pronto para desafiar a teoria?</h3>
            <p className="text-gray-500 text-sm mb-8 max-w-lg mx-auto">Estamos sempre à procura de problemas desafiantes para resolver.</p>
            
            <div className="flex justify-center gap-8 mb-12">
                <a href="#" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-mono hover:underline decoration-blue-500 underline-offset-4"><Github size={16} /> GitHub</a>
                <a href="#" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-mono hover:underline decoration-blue-500 underline-offset-4"><Linkedin size={16} /> LinkedIn</a>
                <a href="mailto:aleksandr0799@hotmail.com" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-mono hover:underline decoration-blue-500 underline-offset-4"><Mail size={16} /> Contacto</a>
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
                        
                        {/* SECÇÃO 1: Identificação Obrigatória */}
                        <div>
                            <h4 className="text-white mb-2 font-bold border-b border-white/10 pb-1">Angaben gemäß § 5 TMG</h4>
                            <p className="font-bold text-white">Aleksandr Ilin</p>
                            <p className="text-gray-500 italic mb-1">Einzelunternehmer</p>
                            <p>Lingstrasse, 8</p>
                            <p>90443 Nuremberg</p>
                            <p>Germany</p>
                        </div>

                        {/* SECÇÃO 2: Contacto Obrigatório */}
                        <div>
                            <h4 className="text-white mb-2 font-bold border-b border-white/10 pb-1 mt-4">Kontakt / Contact</h4>
                            <p>Telefon: <span className="text-gray-300">+49 174 16 29 207</span></p>
                            <p>E-Mail: <span className="text-gray-300">aleksandr0799@hotmail.com</span></p>
                        </div>

                        {/* SECÇÃO 3: IVA (Só preenches se tiveres, senão apaga este bloco) */}
                        {/* <div>
                            <h4 className="text-white mb-2 font-bold border-b border-white/10 pb-1 mt-4">Umsatzsteuer-ID</h4>
                            <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</p>
                            <p className="text-white font-mono">[DE 123 456 789]</p>
                        </div>
                        */}

                        {/* SECÇÃO 4: Responsabilidade Editorial */}
                        <div>
                            <h4 className="text-white mb-2 font-bold border-b border-white/10 pb-1 mt-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h4>
                            <p>Aleksandr Ilin</p>
                            <p>Lingstrasse 8, 90443 Nuremberg</p>
                        </div>

                        {/* SECÇÃO 5: Resolução de Disputas (Obrigatório na UE) */}
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