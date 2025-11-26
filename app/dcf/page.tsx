'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, TrendingUp, RefreshCcw, Activity, AlertCircle, BookOpen, Minus, Divide, Equal, Plus, X, Wallet, Landmark, Users, ArrowRight, AlertTriangle, Terminal, Scale, Github, Linkedin, Mail } from 'lucide-react';

export default function DCFPage() {
  const [ticker, setTicker] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [g1, setG1] = useState(7.5);
  const [wacc, setWacc] = useState(9.0);
  const [g2, setG2] = useState(2.5);
  const [inputs, setInputs] = useState({
    ebit: 0, tax_rate: 0.21, d_and_a: 0, capex: 0, change_nwc: 0,
    total_cash: 0, total_debt: 0, shares: 0
  });
  
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);
  const [showImpressum, setShowImpressum] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (ticker.length > 1 && showSuggestions) {
        setIsSearching(true);
        try {
            const res = await fetch(`/api/search?q=${ticker}`);
            if(res.ok) {
                const list = await res.json();
                setSearchResults(list);
            }
        } catch (e) { setSearchResults([]); } 
        finally { setIsSearching(false); }
      } else { setSearchResults([]); }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [ticker, showSuggestions]);

  const selectTicker = (symbol: string) => {
      setTicker(symbol);
      setShowSuggestions(false);
  };

  const handleCalculate = async (useCurrentInputs = false) => {
    if (!ticker) return;
    setLoading(true);
    setError('');
    setShowSuggestions(false);

    try {
      let url = `/api/dcf?ticker=${ticker}&g1=${g1/100}&wacc=${wacc/100}&g2=${g2/100}`;
      
      if (useCurrentInputs && hasLoaded) {
        url += `&manual_ebit=${inputs.ebit}&manual_tax_rate=${inputs.tax_rate}&manual_da=${inputs.d_and_a}&manual_capex=${inputs.capex}&manual_nwc=${inputs.change_nwc}`;
        url += `&manual_cash=${inputs.total_cash}&manual_debt=${inputs.total_debt}&manual_shares=${inputs.shares}`;
      }

      const res = await fetch(url);
      const text = await res.text(); // Ler como texto primeiro para ver erro
      
      if (!res.ok) {
          try {
             const jsonError = JSON.parse(text);
             throw new Error(jsonError.detail || 'Erro na API');
          } catch {
             throw new Error(`Erro Servidor (${res.status}): ${text.substring(0, 50)}...`);
          }
      }

      const resultData = JSON.parse(text);
      setData(resultData);
      
      if (!useCurrentInputs) {
          setInputs({
              ebit: resultData.inputs.ebit, tax_rate: resultData.inputs.tax_rate,
              d_and_a: resultData.inputs.d_and_a, capex: resultData.inputs.capex,
              change_nwc: resultData.inputs.change_nwc,
              total_cash: resultData.inputs.total_cash,
              total_debt: resultData.inputs.total_debt,
              shares: resultData.inputs.shares
          });
          setHasLoaded(true);
      }
    } catch (err: any) {
      setError(err.message || 'Falha ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (Math.abs(num) >= 1.0e9) return (num / 1.0e9).toFixed(2) + "B";
    if (Math.abs(num) >= 1.0e6) return (num / 1.0e6).toFixed(2) + "M";
    return num.toLocaleString(undefined, {maximumFractionDigits: 0});
  };

  // ... (RESTO DO CÓDIGO VISUAL MANTIDO IGUAL AO QUE ENVIASTE) ...
  // [AQUI COLA O RESTO DO COMPONENTE RETURN E AS FUNÇÕES VISUAIS QUE JÁ TENS]
  // Para poupar espaço aqui, assume-se que colas o resto do JSX do ficheiro "2" que mandaste
  // Apenas garante que fechas a função component e o ficheiro corretamente.
  
  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 flex flex-col">
       {/* --- COLA AQUI O CONTEÚDO VISUAL DO FICHEIRO 2 QUE ENVIASTE ANTES --- */}
       {/* Vou resumir as partes para saberes onde colar */}
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
         <div className="text-center mb-10 w-full">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono uppercase tracking-widest mb-6">
                <Terminal size={10} /> System v4.3 Online
            </div>
            <h1 className="text-5xl md:text-7xl font-sans font-black tracking-tighter uppercase leading-none text-white mb-6 flex items-center justify-center gap-4">
                DCF <span className="text-blue-600">ENGINE</span>
                <span className="w-4 h-4 bg-blue-500 animate-pulse rounded-sm mt-4"></span>
            </h1>
            <div className="space-y-4 text-gray-400 text-sm md:text-base font-light leading-relaxed max-w-3xl mx-auto">
                <p>Na <strong className="text-white">Elinara Labs</strong>, construimos soluções práticas.</p>
            </div>
        </div>

        {/* BLUEPRINT E RESTO DO DESIGN AQUI */}
        {/* ... (Cola o resto do design dos ficheiros anteriores) ... */}
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
            {/* ESQUERDA */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#0F0F0F] border border-white/10 p-6 rounded-2xl shadow-xl relative z-30">
                    <label className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2 block">1. Alvo da Análise</label>
                    <div className="relative group mb-6">
                        <input type="text" value={ticker} onChange={(e) => {setTicker(e.target.value.toUpperCase()); setShowSuggestions(true);}} onFocus={() => setShowSuggestions(true)} placeholder="Pesquisar (ex: AAPL)" className="w-full bg-[#050505] border border-white/10 text-white p-4 rounded-xl focus:outline-none focus:border-blue-500 transition-all font-mono text-xl uppercase" />
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={20}/>
                        {showSuggestions && ticker.length > 1 && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-[#111] border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                                {isSearching ? <div className="p-4 text-center text-xs text-gray-500">A pesquisar...</div> : searchResults.map((item) => (
                                    <div key={item.symbol} onClick={() => selectTicker(item.symbol)} className="px-4 py-3 hover:bg-blue-900/20 cursor-pointer border-b border-white/5 flex justify-between">
                                        <div><span className="block font-bold text-white text-sm">{item.symbol}</span><span className="block text-[10px] text-gray-400">{item.name}</span></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => handleCalculate(false)} disabled={loading || !ticker} className="w-full bg-white text-black hover:bg-gray-200 font-bold py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? <span className="animate-pulse">A Carregar...</span> : <>Importar Dados <TrendingUp size={18}/></>}
                    </button>
                    {error && <div className="mt-4 text-xs text-red-400 flex items-center gap-2"><AlertCircle size={12}/> {error}</div>}
                </div>
                {/* INPUTS MANUAIS */}
                <AnimatePresence>
                {hasLoaded && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0F0F0F] border border-white/10 p-5 rounded-2xl shadow-xl relative z-20">
                         {/* ... Inputs ... */}
                         <div className="grid grid-cols-2 gap-4 mb-6">
                            <FancyInput label="EBIT" value={inputs.ebit} onChange={(v:any) => setInputs({...inputs, ebit: v})} />
                            <FancyInput label="D&A" value={inputs.d_and_a} onChange={(v:any) => setInputs({...inputs, d_and_a: v})} />
                            <FancyInput label="CapEx" value={inputs.capex} onChange={(v:any) => setInputs({...inputs, capex: v})} />
                            <FancyInput label="NWC" value={inputs.change_nwc} onChange={(v:any) => setInputs({...inputs, change_nwc: v})} />
                         </div>
                         <button onClick={() => handleCalculate(true)} className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl"><RefreshCcw size={14}/> Recalcular</button>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
            
            {/* DIREITA - RESULTADOS */}
            <div className="lg:col-span-8 min-h-[500px]">
                {!data && !loading && <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02] text-gray-500"><Activity size={32}/><p className="mt-4 text-sm font-mono">A aguardar dados...</p></div>}
                
                {data && !loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                         <div className="bg-[#0F0F0F] border border-white/10 p-8 rounded-2xl">
                             <p className="text-xs font-mono text-blue-400 uppercase">Valor Justo</p>
                             <p className="text-6xl font-bold text-white">${data.intrinsic_value.toFixed(2)}</p>
                             <div className={`mt-4 px-3 py-1 rounded w-fit text-sm font-bold ${data.margin > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {data.margin > 0 ? 'UNDERVALUED' : 'OVERVALUED'} {(data.margin * 100).toFixed(1)}%
                             </div>
                         </div>
                         {/* ... Resto dos gráficos e waterfall ... */}
                    </motion.div>
                )}
            </div>
        </div>
      </div>
    </main>
  );
}

function FancyInput({ label, value, onChange }: any) {
    return <div className="relative"><label className="text-[9px] text-gray-500 uppercase">{label}</label><input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full bg-[#111] border border-white/10 text-white p-2 rounded text-right" /></div>
}
// Adiciona aqui os outros componentes (ControlSlider, etc) se precisares