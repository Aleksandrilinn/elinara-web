'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Activity, AlertCircle, Terminal, TrendingDown, RefreshCcw, ChevronDown, Info, Scale } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart, Legend } from 'recharts';

export default function SanctionsPage() {
  const [indicator, setIndicator] = useState('GDP_CONST');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  // Lista completa dos 15 Indicadores
  const indicators = [
    { value: 'GDP_CONST', label: 'GDP (Constant US$)', category: 'Growth' },
    { value: 'GDP_CUR', label: 'GDP (Current US$)', category: 'Growth' },
    { value: 'GDP_GROWTH', label: 'GDP Growth (%)', category: 'Growth' },
    { value: 'GDP_PC', label: 'GDP Per Capita', category: 'Wealth' },
    { value: 'INFLATION', label: 'Inflation (CPI %)', category: 'Prices' },
    { value: 'UNEMPLOYMENT', label: 'Unemployment (%)', category: 'Labor' },
    { value: 'EXPORTS', label: 'Exports (Goods & Services)', category: 'Trade' },
    { value: 'IMPORTS', label: 'Imports (Goods & Services)', category: 'Trade' },
    { value: 'TRADE_GDP', label: 'Trade (% of GDP)', category: 'Trade' },
    { value: 'FDI_IN', label: 'FDI Inflows (% GDP)', category: 'Capital' },
    { value: 'RESERVES', label: 'Total Reserves ($)', category: 'Capital' },
    { value: 'EXCH_RATE', label: 'Exchange Rate (Official)', category: 'Forex' },
    { value: 'GNI', label: 'GNI (Gross National Income)', category: 'Wealth' },
    { value: 'IND_VAL', label: 'Industry Value Added', category: 'Sector' },
    { value: 'AGR_VAL', label: 'Agriculture Value Added', category: 'Sector' },
  ];

  const handleCalculate = async () => {
    setLoading(true);
    setError('');
    setData(null); // Limpar dados antigos enquanto carrega
    try {
      const res = await fetch(`/api/scm?indicator=${indicator}`);
      const text = await res.text();
      
      if (!res.ok) {
          try {
             const jsonError = JSON.parse(text);
             throw new Error(jsonError.detail || 'Data unavailable for this indicator.');
          } catch {
             throw new Error(`World Bank API Error (${res.status})`);
          }
      }
      setData(JSON.parse(text));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calcular sempre que muda o indicador
  useEffect(() => { handleCalculate(); }, [indicator]);

  const formatValue = (val: number) => {
    if (Math.abs(val) >= 1e12) return (val / 1e12).toFixed(1) + 'T';
    if (Math.abs(val) >= 1e9) return (val / 1e9).toFixed(1) + 'B';
    if (Math.abs(val) >= 1e6) return (val / 1e6).toFixed(1) + 'M';
    return val.toFixed(1);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-500/30 flex flex-col">
      {/* Background */}
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
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/10 border border-red-500/20 text-red-400 text-[10px] font-mono uppercase tracking-widest mb-6">
                <Terminal size={10} /> SanctionDelta v1.0
            </div>
            
            <h1 className="text-5xl md:text-7xl font-sans font-black tracking-tighter uppercase leading-none text-white mb-6 flex items-center justify-center gap-4">
                SANCTION <span className="text-red-600">DELTA</span>
            </h1>
            
            <div className="space-y-4 text-gray-400 text-sm md:text-base font-light leading-relaxed max-w-3xl mx-auto">
                <p>
                    Quantifying the economic war. We use the <strong>Synthetic Control Method (SCM)</strong> to construct a &quot;Synthetic Russia&quot; from a pool of 14 donor countries (like Brazil, Turkey, India) to visualize the causal impact of sanctions.
                </p>
            </div>
        </div>

        {/* CONTROLS AREA */}
        <div className="max-w-2xl mx-auto mb-12 bg-[#0F0F0F] border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xl">
            <div className="w-full">
                <label className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2 block">Select Indicator</label>
                <div className="relative">
                    <select 
                        value={indicator}
                        onChange={(e) => setIndicator(e.target.value)}
                        className="w-full appearance-none bg-[#050505] border border-white/20 text-white py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:border-red-500 transition-all cursor-pointer text-sm font-mono"
                        disabled={loading}
                    >
                        {indicators.map((ind) => (
                            <option key={ind.value} value={ind.value}>{ind.label}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16}/>
                </div>
            </div>
            
            {loading && <div className="flex items-center gap-2 text-red-400 text-xs animate-pulse whitespace-nowrap pt-6"><RefreshCcw size={14} className="animate-spin"/> Processing WB Data...</div>}
        </div>

        {/* MAIN DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto pb-20">
            
            {/* LEFT: DONOR WEIGHTS */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#0F0F0F] border border-white/10 p-6 rounded-2xl shadow-xl relative z-30 min-h-[300px]">
                    <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-6 block flex items-center gap-2"><Scale size={14}/> Synthetic Composition</h3>
                    
                    {data ? (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <p className="text-sm text-white font-bold">Top Donor Countries</p>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    The algorithm selected these countries to mathematically reconstruct Russia&apos;s pre-2022 trajectory:
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {data.contributors.length > 0 ? data.contributors.map((c: any) => (
                                        <span key={c.country} className="px-2 py-1 bg-white/5 rounded text-xs font-mono border border-white/10 flex items-center gap-2">
                                            <span className="text-gray-300">{c.country}</span>
                                            <span className="text-red-400 font-bold">{c.weight}%</span>
                                        </span>
                                    )) : <span className="text-xs text-gray-600">No specific match found (Uniform distribution).</span>}
                                </div>
                            </div>

                            <div className="p-4 bg-red-900/10 border border-red-500/20 rounded-xl">
                                <p className="text-xs text-red-400 font-mono uppercase mb-1">Impact Gap (2023)</p>
                                <p className="text-2xl font-bold text-white">{formatValue(data.metrics.gap_2023)}</p>
                                <p className="text-[10px] text-gray-400 mt-1">Differential (Real vs Synthetic)</p>
                            </div>
                        </div>
                    ) : !loading && !error && (
                        <div className="text-xs text-gray-500 text-center pt-10">Select an indicator to start analysis.</div>
                    )}
                    
                    {error && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-start gap-2">
                            <AlertCircle size={16} className="shrink-0 mt-0.5"/> 
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: CHART */}
            <div className="lg:col-span-8 min-h-[500px] bg-[#0F0F0F] border border-white/10 p-6 rounded-2xl relative">
                
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2"><Activity size={16} className="text-red-500"/> Causal Impact Analysis</h3>
                    {data && (
                        <div className="flex items-center gap-4 text-[10px] font-mono uppercase">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Real Russia</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-gray-500 rounded-full"></div> Synthetic (Counterfactual)</span>
                        </div>
                    )}
                </div>

                <div className="h-[400px] w-full">
                    {data ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={data.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="year" stroke="#666" fontSize={10} tickMargin={10} />
                                <YAxis stroke="#666" fontSize={10} tickFormatter={formatValue} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#000', borderColor: '#333', fontSize: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value: any) => [formatValue(value), '']}
                                    labelStyle={{ color: '#888' }}
                                />
                                <ReferenceLine x={2022} stroke="white" strokeDasharray="3 3" label={{ value: 'Sanctions (2022)', position: 'insideTopLeft', fill: 'white', fontSize: 10, opacity: 0.5 }} />
                                
                                <Line type="monotone" dataKey="Synthetic" stroke="#666" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={false} />
                                <Line type="monotone" dataKey="Real" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-700 text-sm font-mono">
                            {loading ? "Connecting to World Bank API..." : "Waiting for data..."}
                        </div>
                    )}
                </div>
                
                <div className="mt-4 flex items-start gap-2 text-[10px] text-gray-600 font-mono bg-black/20 p-3 rounded border border-white/5">
                    <Info size={12} className="mt-0.5"/>
                    <p>Data sourced live from World Bank API (2010-2023). The Synthetic Russia is constructed by minimizing the RMSPE between Real Russia and the donor pool in the pre-war period (2010-2021).</p>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}