'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, TrendingUp, RefreshCcw, Activity, BarChart3, AlertCircle, BookOpen, Minus, Divide, Equal, Plus, X, Wallet, Landmark, Users, ArrowRight, AlertTriangle, Terminal, Scale, Github, Linkedin, Mail, PieChart, Target, Clock, Layers } from 'lucide-react';

export default function DCFPage() {
  // --- STATES ---
  const [ticker, setTicker] = useState('');
  
  // Smart Search States
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
  
  // Impressum State
  const [showImpressum, setShowImpressum] = useState(false);

  // --- SEARCH LOGIC ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (ticker.length > 1 && showSuggestions) {
        setIsSearching(true);
        try {
            const res = await fetch(`/api/search?q=${ticker}`);
            const list = await res.json();
            setSearchResults(list);
        } catch (e) {
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
      } else {
          setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [ticker, showSuggestions]);

  const selectTicker = (symbol: string) => {
      setTicker(symbol);
      setShowSuggestions(false);
  };

  // --- CALCULATION ---
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
      const text = await res.text();

      if (!res.ok) {
          try {
             const jsonError = JSON.parse(text);
             throw new Error(jsonError.detail || 'API Error');
          } catch {
             throw new Error(`Server Error (${res.status})`);
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
      setError(err.message || 'Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (Math.abs(num) >= 1.0e9) return (num / 1.0e9).toFixed(2) + "B";
    if (Math.abs(num) >= 1.0e6) return (num / 1.0e6).toFixed(2) + "M";
    return num.toLocaleString(undefined, {maximumFractionDigits: 0});
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 flex flex-col">
      
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
        
        {/* HEADER */}
        <div className="text-center mb-10 w-full">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono uppercase tracking-widest mb-6">
                <Terminal size={10} /> DCF Module v1.0
            </div>
            
            <h1 className="text-5xl md:text-7xl font-sans font-black tracking-tighter uppercase leading-none text-white mb-6 flex items-center justify-center gap-4">
                DCF <span className="text-blue-600">ENGINE</span>
                <span className="w-4 h-4 bg-blue-500 animate-pulse rounded-sm mt-4"></span>
            </h1>
            
            <div className="space-y-4 text-gray-400 text-sm md:text-base font-light leading-relaxed max-w-3xl mx-auto">
                <p>
                    A central model of financial theory demonstrates our purpose: converting theoretical models into practical solutions. This tool collects data directly from Yahoo Finance and allows estimating the intrinsic value of a company to support real investment decisions.
                </p>
            </div>

            <div className="mt-8 w-full flex justify-center">
                <div className="w-full border-y border-white/5 bg-[#111]/50 py-3 flex items-center justify-center gap-3 text-center px-4">
                    <AlertTriangle className="text-yellow-600 shrink-0" size={14} />
                    <p className="text-[10px] md:text-xs text-gray-500 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                        <strong className="text-gray-400">Legal Disclaimer:</strong> Educational tool. Does not constitute financial advice.
                    </p>
                </div>
            </div>
        </div>

        {/* THEORETICAL BLUEPRINT */}
        <div className="mb-12 flex justify-center">
            <div className="w-fit mx-auto relative rounded-2xl bg-[#080808] border border-white/10 overflow-hidden hidden md:block shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
                
                {/* BLUEPRINT HEADER WITH SOURCES */}
                <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between relative z-10 bg-black/20 backdrop-blur-sm gap-12">
                    <div className="flex items-center gap-2">
                        <BookOpen size={14} className="text-blue-500"/>
                        <span className="text-xs font-mono uppercase tracking-wider text-gray-300">Model Architecture (FCFF)</span>
                    </div>

                    {/* --- SOURCE BUTTONS --- */}
                    <div className="flex items-center gap-2">
                        
                        {/* LINK 1: */}
                        <a 
                            href="/dcf_source.pdf" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
                            title="View Manual PDF"
                        >
                            <span className="text-[9px] font-mono text-gray-500 group-hover:text-blue-400 uppercase tracking-widest">Source 1</span>
                            <ArrowRight size={10} className="text-gray-600 group-hover:text-blue-400 -rotate-45 transition-colors"/>
                        </a>

                        {/* LINK 2: */}
                        <a 
                            href="https://www.sciencedirect.com/science/article/pii/S0167668715303279" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
                            title="Read ScienceDirect Paper"
                        >
                            <span className="text-[9px] font-mono text-gray-500 group-hover:text-green-400 uppercase tracking-widest">Source 2</span>
                            <ArrowRight size={10} className="text-gray-600 group-hover:text-green-400 -rotate-45 transition-colors"/>
                        </a>

                    </div>
                </div>

                <div className="p-8 overflow-x-auto scrollbar-hide relative z-10">
                    <div className="flex items-center justify-center min-w-max gap-2">
                        <GlowBlock label="EBIT" sub="Operating" color="white" />
                        <ColoredOperator icon={<X size={12}/>} color="text-gray-600" />
                        <GlowBlock label="(1-Tax)" sub="Fiscal" color="gray" />
                        <ColoredOperator icon={<Equal size={12}/>} color="text-gray-600" />
                        <GlowBlock label="NOPAT" sub="Net Profit" color="blue" />
                        <ColoredOperator icon={<Plus size={12}/>} color="text-green-600" />
                        <GlowBlock label="D&A" sub="Add Back" color="green" />
                        <ColoredOperator icon={<Minus size={12}/>} color="text-red-600" />
                        <GlowBlock label="CapEx" sub="Investment" color="red" />
                        <ColoredOperator icon={<Minus size={12}/>} color="text-red-600" />
                        <GlowBlock label="Δ NWC" sub="Working Cap" color="white" />
                        <div className="flex items-center px-2 text-gray-700"><ArrowRight size={16}/></div>
                        <div className="relative px-6 py-3 bg-[#050505] border border-blue-500/50 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                            <span className="block text-xl font-bold text-white tracking-tight font-mono">FCFF</span>
                            <span className="block text-[9px] text-blue-400 uppercase tracking-widest mt-0.5 text-center">OUTPUT</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto pb-20">
            
            {/* --- LEFT: INPUTS --- */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#0F0F0F] border border-white/10 p-6 rounded-2xl shadow-xl relative z-30">
                    <label className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2 block">1. Analysis Target</label>
                    
                    {/* SMART SEARCH FIELD */}
                    <div className="relative group mb-6">
                        <input 
                            type="text" 
                            value={ticker}
                            onChange={(e) => {
                                setTicker(e.target.value.toUpperCase());
                                setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            placeholder="Search (ex: Apple, BMW)" 
                            className="w-full bg-[#050505] border border-white/10 text-white p-4 rounded-xl focus:outline-none focus:border-blue-500 transition-all font-mono text-xl uppercase placeholder:text-gray-700 placeholder:normal-case" 
                        />
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={20}/>

                        {/* SUGGESTIONS DROPDOWN */}
                        {showSuggestions && ticker.length > 1 && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-[#111] border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                                {isSearching ? (
                                    <div className="p-4 text-center text-xs text-gray-500">Searching...</div>
                                ) : searchResults.length > 0 ? (
                                    searchResults.map((item) => (
                                        <div 
                                            key={item.symbol}
                                            onClick={() => selectTicker(item.symbol)}
                                            className="px-4 py-3 hover:bg-blue-900/20 cursor-pointer border-b border-white/5 last:border-0 flex justify-between items-center"
                                        >
                                            <div>
                                                <span className="block font-bold text-white text-sm">{item.symbol}</span>
                                                <span className="block text-[10px] text-gray-400">{item.name}</span>
                                            </div>
                                            <span className="text-[9px] text-gray-600 border border-white/10 px-1.5 rounded">{item.exchange}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-xs text-gray-500">No results</div>
                                )}
                            </div>
                        )}
                    </div>

                    <button onClick={() => handleCalculate(false)} disabled={loading || !ticker} className="w-full bg-white text-black hover:bg-gray-200 font-bold py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? <span className="animate-pulse">Loading...</span> : <>Import Data <TrendingUp size={18}/></>}
                    </button>
                    {error && <div className="mt-4 text-xs text-red-400 flex items-center gap-2"><AlertCircle size={12}/> {error}</div>}
                </div>

                <AnimatePresence>
                {hasLoaded && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0F0F0F] border border-white/10 p-5 rounded-2xl shadow-xl relative z-20">
                        <h3 className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-4 border-b border-white/5 pb-2">2. Operational (Editable)</h3>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <FancyInput label="EBIT" value={inputs.ebit} onChange={(v: any) => setInputs({...inputs, ebit: v})} />
                            <FancyInput label="D&A" value={inputs.d_and_a} onChange={(v: any) => setInputs({...inputs, d_and_a: v})} />
                            <FancyInput label="CapEx (-)" value={inputs.capex} onChange={(v: any) => setInputs({...inputs, capex: v})} />
                            <FancyInput label="Δ NWC" value={inputs.change_nwc} onChange={(v: any) => setInputs({...inputs, change_nwc: v})} />
                            <FancyInput label="Tax Rate" value={inputs.tax_rate} onChange={(v: any) => setInputs({...inputs, tax_rate: v})} step={0.01} format={(v: number) => (v*100).toFixed(1) + '%'}/>
                        </div>
                        <h3 className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-4 pt-2 border-b border-white/5 pb-2">3. Capital Structure</h3>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <FancyInput label="Total Cash" value={inputs.total_cash} onChange={(v: any) => setInputs({...inputs, total_cash: v})} />
                            <FancyInput label="Total Debt" value={inputs.total_debt} onChange={(v: any) => setInputs({...inputs, total_debt: v})} />
                            <FancyInput label="Shares" value={inputs.shares} onChange={(v: any) => setInputs({...inputs, shares: v})} className="col-span-2" />
                        </div>
                        <div className="pt-2 space-y-5">
                            <ControlSlider label="Growth (5 Years)" value={g1} setValue={setG1} min={-5} max={30} step={0.5} />
                            <ControlSlider label="WACC (Risk)" value={wacc} setValue={setWacc} min={5} max={20} step={0.1} />
                            <ControlSlider label="Perpetual (g2)" value={g2} setValue={setG2} min={0} max={5} step={0.1} />
                        </div>
                        <button onClick={() => handleCalculate(true)} disabled={loading} className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                            <RefreshCcw size={14}/> Recalculate Model
                        </button>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>

            {/* --- RIGHT: RESULTS --- */}
            <div className="lg:col-span-8 min-h-[500px]">
                {!data && !loading && (
                    <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02] text-gray-500 space-y-6 p-8">
                        <div className="p-4 bg-white/5 rounded-full mb-2">
                            <Activity size={32} className="text-gray-600" />
                        </div>
                        <p className="text-sm font-mono">Waiting for server data...</p>
                    </div>
                )}

                {data && !loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-[#0F0F0F] border border-white/10 p-8 rounded-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
                                <p className="text-xs font-mono text-blue-400 uppercase mb-2">Intrinsic Value</p>
                                <p className="text-6xl font-bold text-white tracking-tight">${data.intrinsic_value.toFixed(2)}</p>
                                <div className="mt-4 flex items-center gap-4">
                                    <div><p className="text-[10px] text-gray-500 uppercase">Market Price</p><p className="text-lg font-mono text-gray-300">${data.price.toFixed(2)}</p></div>
                                    <div className={`px-3 py-1 rounded text-sm font-bold ${data.margin > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {data.margin > 0 ? 'UNDERVALUED' : 'OVERVALUED'} {(data.margin * 100).toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#0F0F0F] border border-white/10 p-6 rounded-2xl flex flex-col justify-end h-full min-h-[200px]">
                                <p className="text-xs font-mono text-gray-500 uppercase mb-4">FCFF Projection (5 Years)</p>
                                <div className="flex items-end justify-between h-full gap-2">
                                    {data.breakdown.slice(0, 5).map((row: any, i: number) => {
                                        const maxVal = Math.max(...data.breakdown.slice(0, 5).map((r:any) => r.fcf));
                                        const heightPerc = Math.max((row.fcf / maxVal) * 100, 10); 
                                        return (
                                            <div key={i} className="w-full bg-white/5 rounded-t-sm relative group h-full flex items-end">
                                                <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm transition-all duration-500" style={{ height: `${heightPerc}%` }}></div>
                                                <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white bg-black px-1 rounded border border-white/10 z-10 whitespace-nowrap">{formatNumber(row.fcf)}</div>
                                                <div className="absolute -bottom-6 w-full text-center text-[9px] text-gray-500">Y{i+1}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="border border-white/10 rounded-2xl bg-[#0F0F0F] overflow-hidden">
                            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                                <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2"><Activity size={14}/> Value Audit (Waterfall)</h3>
                            </div>
                            <div className="p-8 flex flex-col items-center space-y-2">
                                <div className="flex flex-col md:flex-row gap-4 w-full md:w-2/3 mb-4">
                                    <div className="flex-1 p-4 rounded-xl border border-blue-500/20 bg-blue-900/10 text-center">
                                        <p className="text-[10px] font-mono text-blue-400 uppercase mb-1">Sum PV (5 Years)</p>
                                        <p className="text-xl font-bold text-white">${formatNumber(data.valuation_flow.pv_projections)}</p>
                                    </div>
                                    <div className="flex items-center justify-center text-gray-500"><Plus size={16}/></div>
                                    <div className="flex-1 p-4 rounded-xl border border-purple-500/20 bg-purple-900/10 text-center">
                                        <p className="text-[10px] font-mono text-purple-400 uppercase mb-1">PV (Terminal)</p>
                                        <p className="text-xl font-bold text-white">${formatNumber(data.valuation_flow.pv_terminal)}</p>
                                    </div>
                                </div>
                                <div className="h-8 w-px bg-gray-700"></div>
                                <div className="relative z-10 bg-[#050505] p-2 rounded-full border border-white/10 text-white"><Equal size={16} /></div>
                                <div className="h-8 w-px bg-gray-700"></div>
                                <WaterfallStep step="1" label="Enterprise Value (TEV)" sub="Total Operational Value" value={data.valuation_flow.enterprise_value} />
                                <div className="h-8 w-px bg-gray-700"></div>
                                <div className="relative z-10 bg-[#050505] p-2 rounded-full border border-white/10 text-green-400"><Plus size={16} /></div>
                                <div className="h-8 w-px bg-gray-700"></div>
                                <WaterfallStep step="2" label="Cash & Equivalents" sub="Cash in Bank (Asset)" value={data.valuation_flow.total_cash} color="text-green-400" bg="bg-green-900/10" border="border-green-500/20" icon={<Wallet size={16}/>} />
                                <div className="h-8 w-px bg-gray-700"></div>
                                <div className="relative z-10 bg-[#050505] p-2 rounded-full border border-white/10 text-red-400"><Minus size={16} /></div>
                                <div className="h-8 w-px bg-gray-700"></div>
                                <WaterfallStep step="3" label="Total Debt" sub="Obligations to creditors (Liability)" value={data.valuation_flow.total_debt} color="text-red-400" bg="bg-red-900/10" border="border-red-500/20" icon={<Landmark size={16}/>} />
                                <div className="h-8 w-px bg-gray-700"></div>
                                <div className="relative z-10 bg-[#050505] p-2 rounded-full border border-white/10 text-white"><Equal size={16} /></div>
                                <div className="h-8 w-px bg-gray-700"></div>
                                <WaterfallStep step="4" label="Equity Value" sub="Value for Shareholders" value={data.valuation_flow.equity_value} color="text-blue-400" bg="bg-blue-900/10" border="border-blue-500/20" />
                                <div className="h-8 w-px bg-gray-700"></div>
                                <div className="relative z-10 bg-[#050505] p-2 rounded-full border border-white/10 text-blue-400"><Divide size={16} /></div>
                                <div className="h-8 w-px bg-gray-700"></div>
                                <div className="w-full md:w-2/3 p-3 rounded-xl border border-white/5 bg-white/[0.02] flex justify-between items-center">
                                    <div className="flex items-center gap-3"><Users size={16} className="text-gray-500"/><div><p className="text-xs font-mono text-gray-300 uppercase">Shares Outstanding</p></div></div>
                                    <p className="text-lg font-mono text-gray-400">{formatNumber(data.valuation_flow.shares)}</p>
                                </div>
                                <div className="h-12 w-px bg-gradient-to-b from-gray-700 to-blue-500"></div>
                                <div className="w-full md:w-2/3 p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 shadow-[0_0_40px_rgba(37,99,235,0.3)] flex justify-between items-center transform hover:scale-105 transition-all">
                                    <div><p className="text-xs font-mono text-white/70 uppercase mb-1">Final Result</p><p className="text-2xl font-bold text-white">Value Per Share</p></div>
                                    <p className="text-5xl font-serif font-bold text-white">${data.intrinsic_value.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
      </div>

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

// --- VISUAL COMPONENTS ---
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
                <div className="flex items-center gap-2 mb-1"><span className={`text-[10px] font-mono ${color} uppercase border border-${color}/20 px-1.5 rounded`}>Step {step}</span>{icon}</div>
                <p className="font-bold text-white text-lg">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
            </div>
            <p className={`text-2xl font-mono ${color}`}>{format(value)}</p>
        </div>
    )
}
function FancyInput({ label, value, onChange, step=1, format, className="" }: any) {
    return (
        <div className={`relative group ${className}`}>
            <label className="absolute -top-2 left-3 text-[9px] font-mono bg-[#0F0F0F] px-1 text-gray-500 uppercase z-10 group-focus-within:text-blue-500 transition-colors">{label}</label>
            <div className="relative">
                <input type="number" value={value} step={step} onChange={(e) => onChange(Number(e.target.value))} className="w-full bg-[#111] border border-white/10 text-white py-3 px-3 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-[#151515] transition-all font-mono text-sm text-right shadow-inner" />
            </div>
        </div>
    )
}
function ControlSlider({ label, value, setValue, min, max, step }: any) {
    return (
        <div>
            <div className="flex justify-between mb-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase">{label}</label>
                <span className="text-xs font-mono text-blue-400">{value}%</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
        </div>
    );
}