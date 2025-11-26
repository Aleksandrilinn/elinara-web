'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCcw, Activity, AlertCircle, BookOpen, Equal, X, Percent, Target, Rocket, AlertTriangle, Terminal, PieChart, Layers, Clock, ArrowRight, Divide, Github, Linkedin, Mail, Scale } from 'lucide-react';

export default function VCPage() {
  // --- ESTADOS (Cenários) ---
  const [scenario, setScenario] = useState('base');
  
  // Estado do Impressum
  const [showImpressum, setShowImpressum] = useState(false);
  
  // Inputs (Valores iniciais do Caso Base)
  const [inputs, setInputs] = useState({
    tam: 100000000000,
    quota: 10.0,
    margem: 20.0,
    multiplo: 15.0,
    desconto: 30.0,
    diluicao: 7.0,
    target_year: 2035,
    acoes_atuais: 10000000,
    caixa_atual: 5000000,
    burn_anual: 2000000
  });

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  // Lógica dos Cenários (Predefinições)
  const scenarios: any = {
    base: { label: "Caso Base (Neutro)", tam: 100000000000, quota: 10.0, margem: 20.0, multiplo: 15.0, desconto: 30.0, diluicao: 7.0 },
    bear: { label: "Pessimista (Bear)", tam: 50000000000, quota: 5.0, margem: 10.0, multiplo: 10.0, desconto: 40.0, diluicao: 10.0 },
    bull: { label: "Otimista (Bull)", tam: 250000000000, quota: 25.0, margem: 30.0, multiplo: 25.0, desconto: 25.0, diluicao: 3.0 }
  };

  const applyScenario = (key: string) => {
      setScenario(key);
      const s = scenarios[key];
      setInputs(prev => ({
          ...prev,
          tam: s.tam, quota: s.quota, margem: s.margem, 
          multiplo: s.multiplo, desconto: s.desconto, diluicao: s.diluicao
      }));
      // Auto-calcular ao mudar cenário
      setTimeout(() => handleCalculate(s), 100);
  };

  const handleCalculate = async (currentInputs = inputs) => {
    setLoading(true);
    setError('');
    try {
      // Constrói a URL com os inputs
      const params = new URLSearchParams({
          tam: currentInputs.tam.toString(),
          quota: currentInputs.quota.toString(),
          margem: currentInputs.margem.toString(),
          multiplo: currentInputs.multiplo.toString(),
          desconto: currentInputs.desconto.toString(),
          diluicao: currentInputs.diluicao.toString(),
          target_year: currentInputs.target_year.toString(),
          acoes_atuais: currentInputs.acoes_atuais.toString(),
          caixa_atual: currentInputs.caixa_atual.toString(),
          burn_anual: currentInputs.burn_anual.toString(),
      });

      const res = await fetch(`/api/vc?${params}`);
      const text = await res.text();
      
      if (!res.ok) throw new Error("Erro no cálculo");
      
      setData(JSON.parse(text));
    } catch (err) {
      setError("Falha ao calcular.");
    } finally {
      setLoading(false);
    }
  };

  // Calcular na primeira carga
  useEffect(() => { handleCalculate(); }, []);

  const formatMoney = (num: number) => {
    if (Math.abs(num) >= 1.0e9) return "$" + (num / 1.0e9).toFixed(1) + "B";
    if (Math.abs(num) >= 1.0e6) return "$" + (num / 1.0e6).toFixed(1) + "M";
    return "$" + num.toLocaleString();
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 flex flex-col">
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:40px_100%]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:100%_40px]"></div>
          <div className="absolute inset-0 bg-[#050505] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_0%,#050505_100%)]"></div>
      </div>

      <nav className="fixed top-0 w-full z-50 px-6 h-20 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
        <a href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={18} /> <span className="text-sm font-mono">LAB HOME</span>
        </a>
        <span className="font-bold text-lg tracking-tight font-sans text-white">ELINARA LABS</span>
        <div className="w-8"></div>
      </nav>

      <div className="relative z-10 pt-28 px-4 max-w-[1400px] mx-auto flex-grow w-full">
        
        {/* CABEÇALHO */}
        <div className="text-center mb-10 w-full">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-mono uppercase tracking-widest mb-6">
                <Terminal size={10} /> VC Module v1.0
            </div>
            
            <h1 className="text-5xl md:text-7xl font-sans font-black tracking-tighter uppercase leading-none text-white mb-6 flex items-center justify-center gap-4">
                VC <span className="text-purple-600">SIMULATOR</span>
            </h1>
            
            <div className="space-y-4 text-gray-400 text-sm md:text-base font-light leading-relaxed max-w-3xl mx-auto">
                <p>
                    O método Venture Capital é a resposta da teoria financeira à incerteza extrema. 
                    Ao contrário dos modelos tradicionais que exigem histórico, esta abordagem &quot;Top-Down&quot; começa no futuro (TAM) e desconta o risco de execução e a diluição para determinar o valor racional de uma startup hoje.
                </p>
            </div>

            {/* AVISO LEGAL */}
            <div className="mt-8 w-full flex justify-center">
                <div className="w-full border-y border-white/5 bg-[#111]/50 py-3 flex items-center justify-center gap-3 text-center px-4">
                    <AlertTriangle className="text-yellow-600 shrink-0" size={14} />
                    <p className="text-[10px] md:text-xs text-gray-500 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                        <strong className="text-gray-400">Aviso Legal:</strong> Ferramenta educativa. Não constitui aconselhamento financeiro.
                    </p>
                </div>
            </div>
        </div>

        {/* BLUEPRINT TEÓRICO */}
        <div className="mb-12 flex justify-center">
            <div className="w-fit mx-auto relative rounded-2xl bg-[#080808] border border-white/10 overflow-hidden hidden md:block shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
                
                {/* CABEÇALHO DO BLUEPRINT COM OS TEUS 2 LINKS */}
                <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between relative z-10 bg-black/20 backdrop-blur-sm gap-12">
                    <div className="flex items-center gap-2">
                        <BookOpen size={14} className="text-purple-500"/>
                        <span className="text-xs font-mono uppercase tracking-wider text-gray-300">Lógica VC Method</span>
                    </div>

                    {/* --- BOTÕES DE FONTES --- */}
                    <div className="flex items-center gap-2">
                        
                        {/* LINK 1 */}
                        <a 
                            href="https://growthequityinterviewguide.com/venture-capital/venture-capital-term-sheets/venture-capital-valuation" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
                            title="Ver Guia Prático"
                        >
                            <span className="text-[9px] font-mono text-gray-500 group-hover:text-purple-400 uppercase tracking-widest">Manual</span>
                            <ArrowRight size={10} className="text-gray-600 group-hover:text-purple-400 -rotate-45 transition-colors"/>
                        </a>

                        {/* LINK 2 */}
                        <a 
                            href="https://link.springer.com/rwe/10.1007/978-3-031-81653-6_10" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
                            title="Ler Artigo Académico"
                        >
                            <span className="text-[9px] font-mono text-gray-500 group-hover:text-green-400 uppercase tracking-widest">Paper</span>
                            <ArrowRight size={10} className="text-gray-600 group-hover:text-green-400 -rotate-45 transition-colors"/>
                        </a>

                    </div>
                </div>

                <div className="p-8 overflow-x-auto scrollbar-hide relative z-10">
                    <div className="flex items-center justify-center min-w-max gap-2">
                        <GlowBlock label="TAM" sub="Mercado Total" color="white" />
                        <ColoredOperator icon={<X size={12}/>} color="text-gray-600" />
                        <GlowBlock label="Quota" sub="Market Share" color="gray" />
                        <ColoredOperator icon={<Equal size={12}/>} color="text-gray-600" />
                        <GlowBlock label="Receita" sub="Vendas Futuras" color="blue" />
                        <ColoredOperator icon={<X size={12}/>} color="text-gray-600" />
                        <GlowBlock label="Margem" sub="Lucratividade" color="gray" />
                        <ColoredOperator icon={<Equal size={12}/>} color="text-gray-600" />
                        <GlowBlock label="Exit Val" sub="Valor Saída" color="green" />
                        <ColoredOperator icon={<Divide size={12}/>} color="text-red-600" />
                        <GlowBlock label="Risco" sub="Desconto VC" color="red" />
                        <div className="flex items-center px-2 text-gray-700"><ArrowRight size={16}/></div>
                        <div className="relative px-6 py-3 bg-[#050505] border border-purple-500/50 rounded-xl">
                            <span className="block text-xl font-bold text-white tracking-tight font-mono">PV</span>
                            <span className="block text-[9px] text-purple-400 uppercase tracking-widest mt-0.5 text-center">VALUE</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto pb-20">
            
            {/* --- ESQUERDA: INPUTS --- */}
            <div className="lg:col-span-4 space-y-6">
                
                {/* 1. SELETOR DE CENÁRIOS */}
                <div className="bg-[#0F0F0F] border border-white/10 p-6 rounded-2xl shadow-xl relative z-30">
                    <label className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4 block">1. Cenário Base</label>
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        {Object.keys(scenarios).map(key => (
                            <button 
                                key={key}
                                onClick={() => applyScenario(key)}
                                className={`py-2 px-1 text-[10px] uppercase font-bold rounded border transition-all ${scenario === key ? 'bg-purple-900/30 border-purple-500 text-purple-400' : 'bg-black border-white/10 text-gray-500 hover:border-white/30'}`}
                            >
                                {key}
                            </button>
                        ))}
                    </div>

                    {/* Inputs Principais */}
                    <div className="space-y-4">
                        <FancyInput label="TAM (Mercado Total $)" value={inputs.tam} onChange={(v:any) => setInputs({...inputs, tam: v})} step={1000000000} />
                        <ControlSlider label="Quota de Mercado (%)" value={inputs.quota} setValue={(v:any) => setInputs({...inputs, quota: v})} min={0} max={100} step={0.5} />
                        <ControlSlider label="Margem Operacional (%)" value={inputs.margem} setValue={(v:any) => setInputs({...inputs, margem: v})} min={0} max={80} step={1} />
                        <div className="grid grid-cols-2 gap-4">
                             <FancyInput label="Múltiplo Saída (x)" value={inputs.multiplo} onChange={(v:any) => setInputs({...inputs, multiplo: v})} step={1} />
                             <FancyInput label="Ano Alvo (Exit)" value={inputs.target_year} onChange={(v:any) => setInputs({...inputs, target_year: v})} step={1} />
                        </div>
                    </div>

                    <button onClick={() => handleCalculate()} disabled={loading} className="w-full mt-6 bg-white text-black hover:bg-gray-200 font-bold py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? <span className="animate-pulse">A Calcular...</span> : <>Calcular Valor <Rocket size={18}/></>}
                    </button>
                </div>

                {/* 2. RISCO E DILUIÇÃO */}
                <div className="bg-[#0F0F0F] border border-white/10 p-5 rounded-2xl shadow-xl relative z-20">
                    <h3 className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-4 border-b border-white/5 pb-2">2. Risco & Diluição</h3>
                    <div className="space-y-5">
                        <ControlSlider label="Desconto VC (Risco %)" value={inputs.desconto} setValue={(v:any) => setInputs({...inputs, desconto: v})} min={10} max={60} step={1} />
                        <ControlSlider label="Diluição Anual (%)" value={inputs.diluicao} setValue={(v:any) => setInputs({...inputs, diluicao: v})} min={0} max={30} step={0.5} />
                        <div className="grid grid-cols-1 gap-4 pt-2">
                             <FancyInput label="Ações Atuais (Qtd)" value={inputs.acoes_atuais} onChange={(v:any) => setInputs({...inputs, acoes_atuais: v})} />
                        </div>
                    </div>
                </div>

                {/* 3. SOBREVIVÊNCIA */}
                <div className="bg-[#0F0F0F] border border-white/10 p-5 rounded-2xl shadow-xl relative z-20">
                    <h3 className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-4 border-b border-white/5 pb-2">3. Sobrevivência (Runway)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <FancyInput label="Caixa Atual ($)" value={inputs.caixa_atual} onChange={(v:any) => setInputs({...inputs, caixa_atual: v})} />
                        <FancyInput label="Burn Anual ($)" value={inputs.burn_anual} onChange={(v:any) => setInputs({...inputs, burn_anual: v})} />
                    </div>
                </div>
            </div>

            {/* --- DIREITA: RESULTADOS --- */}
            <div className="lg:col-span-8 space-y-6">
                
                {data && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        
                        {/* ALERTAS DE RUNWAY */}
                        <div className={`p-4 rounded-xl border flex items-center gap-4 ${data.survival.status === 'danger' ? 'bg-red-900/10 border-red-500/30 text-red-400' : data.survival.status === 'warning' ? 'bg-yellow-900/10 border-yellow-500/30 text-yellow-400' : 'bg-green-900/10 border-green-500/30 text-green-400'}`}>
                            {data.survival.status === 'danger' ? <AlertCircle size={24}/> : data.survival.status === 'warning' ? <AlertTriangle size={24}/> : <Activity size={24}/>}
                            <div>
                                <p className="font-bold text-sm">Runway Estimada: {data.survival.runway.toFixed(1)} Anos</p>
                                <p className="text-xs opacity-80">
                                    {data.survival.status === 'danger' ? "CRÍTICO: Necessidade de capital iminente." : data.survival.status === 'warning' ? "ATENÇÃO: Foco total em fundraising brevemente." : "SAUDÁVEL: Tempo para executar."}
                                </p>
                            </div>
                        </div>

                        {/* VALOR FINAL */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-[#0F0F0F] border border-white/10 p-8 rounded-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
                                <p className="text-xs font-mono text-purple-400 uppercase mb-2">Preço Alvo (Diluído)</p>
                                <p className="text-6xl font-bold text-white tracking-tight">${data.metrics.target_price.toFixed(2)}</p>
                                <p className="text-[10px] text-gray-500 mt-2 uppercase">Valor por ação hoje (ajustado ao risco)</p>
                            </div>

                            <div className="bg-[#0F0F0F] border border-white/10 p-8 rounded-2xl flex flex-col justify-center relative overflow-hidden">
                                <p className="text-xs font-mono text-gray-500 uppercase mb-4">Métricas Futuras ({inputs.target_year})</p>
                                <div className="space-y-3">
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-sm text-gray-400">Receita Alvo</span>
                                        <span className="font-mono text-white">{formatMoney(data.metrics.receita_alvo)}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-sm text-gray-400">NOPAT (Lucro)</span>
                                        <span className="font-mono text-white">{formatMoney(data.metrics.nopat_alvo)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-400">Exit Value</span>
                                        <span className="font-mono text-purple-400 font-bold">{formatMoney(data.metrics.exit_value)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* WATERFALL DE VALORIZAÇÃO */}
                        <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-6">
                            <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2 mb-6"><Layers size={14}/> Decomposição do Valor</h3>
                            
                            <div className="space-y-2">
                                <WaterfallStep step="1" label="Valor Futuro (Exit)" sub={`Em ${inputs.target_year} com múltiplo ${inputs.multiplo}x`} value={data.metrics.exit_value} icon={<Target size={16}/>} />
                                <div className="flex justify-center py-2"><ArrowRight className="rotate-90 text-gray-700" size={16}/></div>
                                
                                <WaterfallStep step="2" label="Valor Presente (PV)" sub={`Descontado a ${inputs.desconto}% (Risco VC)`} value={data.metrics.pv_equity} color="text-blue-400" bg="bg-blue-900/10" border="border-blue-500/20" icon={<Clock size={16}/>} />
                                <div className="flex justify-center py-2"><ArrowRight className="rotate-90 text-gray-700" size={16}/></div>
                                
                                <div className="w-full md:w-2/3 mx-auto p-4 rounded-xl border border-red-500/20 bg-red-900/10 flex justify-between items-center relative">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-mono text-red-400 uppercase border border-red-400/20 px-1.5 rounded">Passo 3</span><PieChart size={16} className="text-red-400"/></div>
                                        <p className="font-bold text-white text-lg">Efeito Diluição</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Novas ações emitidas para financiar cash burn</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 strike-through line-through opacity-50">Sem Diluição: ${data.metrics.price_no_dilution.toFixed(2)}</p>
                                        <p className="text-2xl font-mono text-red-400">${data.metrics.target_price.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                )}
            </div>
        </div>
      </div>
      {/* --- FOOTER COM IMPRESSUM LEGAL --- */}
      <footer className="py-20 text-center border-t border-white/5 bg-[#050505] relative z-10 mt-20">
        <div className="max-w-2xl mx-auto px-4 relative z-10">
            <h3 className="text-2xl font-bold tracking-tighter text-white mb-6">Pronto para desafiar a teoria?</h3>
            <p className="text-gray-500 text-sm mb-8 max-w-lg mx-auto">Estamos sempre à procura de problemas complexos que o mercado ignora.</p>
            
            <div className="flex justify-center gap-8 mb-12">
                <a href="https://github.com/Aleksandrilinn" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-mono hover:underline decoration-blue-500 underline-offset-4"><Github size={16} /> GitHub</a>
                <a href="https://www.linkedin.com/in/aleksandr-ilin-70112831a/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-mono hover:underline decoration-blue-500 underline-offset-4"><Linkedin size={16} /> LinkedIn</a>
                <a href="mailto:aleksandr0799@hotmail.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-mono hover:underline decoration-blue-500 underline-offset-4"><Mail size={16} /> Contacto</a>
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
                            <p>Lingstrasse 8</p>
                            <p>90443 Nuremberg</p>
                            <p>Germany</p>
                        </div>

                        {/* SECÇÃO 2: Contacto Obrigatório */}
                        <div>
                            <h4 className="text-white mb-2 font-bold border-b border-white/10 pb-1 mt-4">Kontakt / Contact</h4>
                            <p>Telefon: <span className="text-gray-300">+49 174 16 29 207</span></p>
                            <p>E-Mail: <span className="text-gray-300">aleksandr0799@hotmail.com</span></p>
                        </div>

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

// --- COMPONENTES VISUAIS ---
function GlowBlock({ label, sub, color }: any) {
    const colors: any = {
        white: { border: "border-white/20", shadow: "shadow-[0_0_15px_rgba(255,255,255,0.1)]", text: "text-white" },
        blue: { border: "border-blue-500/50", shadow: "shadow-[0_0_20px_rgba(37,99,235,0.3)]", text: "text-blue-400" },
        green: { border: "border-green-500/50", shadow: "shadow-[0_0_20px_rgba(74,222,128,0.2)]", text: "text-green-400" },
        red: { border: "border-red-500/50", shadow: "shadow-[0_0_20px_rgba(248,113,113,0.2)]", text: "text-red-400" },
        gray: { border: "border-gray-700", shadow: "shadow-none", text: "text-gray-400" }
    };
    const style = colors[color] || colors.white;
    return (
        <div className={`relative bg-[#050505] border ${style.border} rounded-xl flex flex-col justify-center items-center ${style.shadow} min-w-[90px] py-3 px-3`}>
            <span className={`block font-bold font-mono tracking-tight text-lg ${style.text}`}>{label}</span>
            <span className={`block uppercase tracking-widest text-gray-600 text-[8px] mt-1 whitespace-nowrap`}>{sub}</span>
        </div>
    )
}
function ColoredOperator({ icon, color }: any) { return <div className={`flex items-center justify-center p-1 rounded-full bg-white/5 border border-white/5 ${color}`}>{icon}</div> }
function WaterfallStep({ step, label, sub, value, color="text-white", bg="bg-white/5", border="border-white/10", icon }: any) {
    const format = (num: number) => {
        if (Math.abs(num) >= 1.0e9) return "$" + (num / 1.0e9).toFixed(1) + "B";
        if (Math.abs(num) >= 1.0e6) return "$" + (num / 1.0e6).toFixed(1) + "M";
        return "$" + num.toLocaleString();
    };
    return (
        <div className={`w-full md:w-2/3 mx-auto p-4 rounded-xl border ${border} ${bg} flex justify-between items-center relative`}>
            <div>
                <div className="flex items-center gap-2 mb-1"><span className={`text-[10px] font-mono ${color} uppercase border border-${color}/20 px-1.5 rounded`}>Passo {step}</span>{icon}</div>
                <p className="font-bold text-white text-lg">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
            </div>
            <p className={`text-2xl font-mono ${color}`}>{format(value)}</p>
        </div>
    )
}
function FancyInput({ label, value, onChange, step=1 }: any) {
    return (
        <div className={`relative group`}>
            <label className="absolute -top-2 left-3 text-[9px] font-mono bg-[#0F0F0F] px-1 text-gray-500 uppercase z-10 group-focus-within:text-purple-500 transition-colors">{label}</label>
            <div className="relative">
                <input type="number" value={value} step={step} onChange={(e) => onChange(Number(e.target.value))} className="w-full bg-[#111] border border-white/10 text-white py-3 px-3 rounded-lg focus:outline-none focus:border-purple-500 focus:bg-[#151515] transition-all font-mono text-sm text-right shadow-inner" />
            </div>
        </div>
    )
}
function ControlSlider({ label, value, setValue, min, max, step }: any) {
    return (
        <div>
            <div className="flex justify-between mb-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase">{label}</label>
                <span className="text-xs font-mono text-purple-400">{value}%</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500" />
        </div>
    );
}