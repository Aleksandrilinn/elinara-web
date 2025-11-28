'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, RefreshCcw, Activity, ShoppingCart, TrendingUp, TrendingDown, Tag, Filter, X, BarChart2, Calculator, FileText, Thermometer, Fuel, Coins, Microscope, Play, ArrowRight, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function ElasticPage() {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Drill-down States
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  // AGORA TEMOS 3 ABAS: Strategy, Econometrics, Simulator
  const [activeTab, setActiveTab] = useState<'strategy' | 'econometrics' | 'simulator'>('strategy');
  
  // Simulator State
  const [simPriceChange, setSimPriceChange] = useState(0); // % change

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/elastic?category_filter=${filter}`);
      const json = await res.json();
      setData(json);
      setFilteredData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filter]);

  useEffect(() => {
      if (!searchQuery) {
          setFilteredData(data);
      } else {
          const lower = searchQuery.toLowerCase();
          setFilteredData(data.filter(item => 
              item.product.toLowerCase().includes(lower) || 
              item.category.toLowerCase().includes(lower)
          ));
      }
  }, [searchQuery, data]);

  // Reset simulator when product changes
  useEffect(() => { 
      setSimPriceChange(0); 
      setActiveTab('strategy'); // Reset to first tab on new selection
  }, [selectedProduct]);

  // Simulation Logic (Memoized for performance)
  const simulation = useMemo(() => {
      if (!selectedProduct) return null;
      
      const currentP = selectedProduct.avg_price;
      // Estimativa de volume baseada na amostra para efeitos de simulação
      const currentQ = selectedProduct.current_volume || 1000; 
      const currentRev = currentP * currentQ;

      // Formula: Nova Qtd = Qtd Atual * (1 + (Elasticidade * % Mudança Preço))
      const pctChangeDecimal = simPriceChange / 100;
      const newP = currentP * (1 + pctChangeDecimal);
      
      const deltaQ_pct = selectedProduct.elasticity * pctChangeDecimal;
      const newQ = Math.max(0, currentQ * (1 + deltaQ_pct)); // Não permitir qtd negativa
      
      const newRev = newP * newQ;
      
      const revDiff = newRev - currentRev;
      const revDiffPct = currentRev > 0 ? (revDiff / currentRev) * 100 : 0;

      return { 
          currentP, currentQ, currentRev,
          newP, newQ, newRev, 
          revDiff, revDiffPct 
      };
  }, [selectedProduct, simPriceChange]);

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-green-500/30 flex relative overflow-hidden">
      
      <div className={`flex-1 flex flex-col transition-all duration-500 ${selectedProduct ? 'mr-[600px]' : ''}`}>
          {/* NAVBAR */}
          <nav className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <a href="/" className="text-gray-400 hover:text-white transition-colors"><ArrowLeft size={20}/></a>
                    <div className="h-6 w-px bg-white/10"></div>
                    <span className="font-bold text-lg tracking-tight text-white flex items-center gap-2">
                        ELASTIC <span className="text-xs font-mono bg-green-900/30 text-green-400 px-2 py-0.5 rounded border border-green-500/20">ENTERPRISE v3.1</span>
                    </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded border border-white/10 text-gray-300">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> LIVE OLS ENGINE
                    </div>
                </div>
            </div>
          </nav>

          <div className="p-6 max-w-7xl mx-auto w-full">
            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <KpiCard label="SKUs Modeled" value={data.length.toString()} sub="Multivariate Regressions" icon={<ShoppingCart size={18} className="text-blue-400"/>} />
                <KpiCard label="High Sensitivity" value={data.filter(i => i.elasticity < -1.5).length.toString()} sub="ε < -1.5 (Elastic)" icon={<Activity size={18} className="text-red-400"/>} />
                <KpiCard label="Opportunities" value={data.filter(i => i.action !== "Maintain").length.toString()} sub="Revenue Actions" icon={<TrendingUp size={18} className="text-green-400"/>} />
                <KpiCard label="Model Fit (R² Avg)" value={data.length > 0 ? (data.reduce((a,b)=>a+b.r2,0)/data.length).toFixed(2) : "-"} sub="Explained Variance" icon={<Tag size={18} className="text-purple-400"/>} />
            </div>

            {/* DASHBOARD PANEL */}
            <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                {/* TOOLBAR */}
                <div className="p-4 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-2">
                        {["All", "Dairy", "Grocery", "Drinks", "Cleaning"].map(cat => (
                            <button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === cat ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{cat}</button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative group">
                            <input 
                                type="text" 
                                placeholder="Search SKU..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-[#050505] border border-white/20 rounded-lg py-1.5 pl-3 pr-4 text-xs text-white focus:outline-none focus:border-green-500 w-full md:w-48 transition-all"
                            />
                        </div>
                        <button onClick={fetchData} className="p-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white transition-all"><RefreshCcw size={16}/></button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-[10px] font-mono text-gray-400 uppercase tracking-wider border-b border-white/5">
                                <th className="p-4 font-normal">Product / SKU</th>
                                <th className="p-4 font-normal text-right">Avg Price</th>
                                <th className="p-4 font-normal text-right">Elasticity (ε)</th>
                                <th className="p-4 font-normal">Sensitivity</th>
                                <th className="p-4 font-normal">AI Recommendation</th>
                                <th className="p-4 font-normal text-right">R²</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr><td colSpan={6} className="p-12 text-center text-gray-500 animate-pulse font-mono">Running OLS Matrix Algebra...</td></tr>
                            ) : filteredData.map((item, i) => (
                                <tr 
                                    key={i} 
                                    onClick={() => setSelectedProduct(item)}
                                    className={`border-b border-white/5 cursor-pointer transition-colors group ${selectedProduct?.product === item.product ? 'bg-green-900/10 border-green-500/30' : 'hover:bg-white/[0.02]'}`}
                                >
                                    <td className="p-4 font-medium text-white flex items-center gap-2">
                                        <div className={`w-1 h-8 rounded-full ${selectedProduct?.product === item.product ? 'bg-green-500' : 'bg-transparent group-hover:bg-gray-700'}`}></div>
                                        <div>
                                            {item.product}
                                            <span className="block text-[10px] text-gray-500 font-normal">{item.category}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right font-mono text-gray-300">€{item.avg_price.toFixed(2)}</td>
                                    <td className="p-4 text-right font-mono font-bold text-white">{item.elasticity.toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold border ${item.tag.includes("Elastic") ? "bg-red-900/20 text-red-400 border-red-500/20" : "bg-blue-900/20 text-blue-400 border-blue-500/20"}`}>
                                            {item.tag.split(' ')[0]}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {item.action !== "Maintain" ? (
                                            <div className="flex items-center gap-2 text-green-400 font-bold text-xs">
                                                {item.action.includes("Increase") ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                                                {item.action.split('(')[0]}
                                            </div>
                                        ) : <span className="text-gray-600 text-xs">Maintain</span>}
                                    </td>
                                    <td className="p-4 text-right font-mono text-xs text-gray-500">{item.r2.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
      </div>

      {/* SIDE PANEL (Drill-Down) */}
      <AnimatePresence>
        {selectedProduct && (
            <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 h-full w-[600px] bg-[#080808] border-l border-white/10 z-50 shadow-[-50px_0_100px_rgba(0,0,0,0.5)] overflow-y-auto flex flex-col"
            >
                <div className="p-6 border-b border-white/10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white leading-tight">{selectedProduct.product}</h2>
                            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">{selectedProduct.category} • SKU #83921</span>
                        </div>
                        <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20}/></button>
                    </div>
                    
                    {/* TABS - AGORA SÃO 3 */}
                    <div className="flex gap-4 mt-2 border-b border-white/5">
                        <button onClick={() => setActiveTab('strategy')} className={`pb-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'strategy' ? 'text-white border-green-500' : 'text-gray-500 border-transparent hover:text-white'}`}>1. Strategy</button>
                        <button onClick={() => setActiveTab('econometrics')} className={`pb-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'econometrics' ? 'text-white border-green-500' : 'text-gray-500 border-transparent hover:text-white'}`}>2. Model Specs</button>
                        <button onClick={() => setActiveTab('simulator')} className={`pb-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'simulator' ? 'text-white border-green-500' : 'text-gray-500 border-transparent hover:text-white'}`}>3. Simulator</button>
                    </div>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    
                    {/* VIEW 1: STRATEGY (O Gráfico e a Recomendação) */}
                    {activeTab === 'strategy' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-[#0F0F0F] border border-white/10 p-4 rounded-xl">
                                <h3 className="text-xs font-bold text-gray-300 mb-4 flex items-center gap-2"><BarChart2 size={14}/> Demand Curve (Log-Log)</h3>
                                <div className="h-60 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart margin={{top: 5, right: 5, bottom: 5, left: -20}}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false}/>
                                            <XAxis dataKey="p" type="number" name="Price" unit="€" stroke="#666" fontSize={10} domain={['dataMin', 'dataMax']}/>
                                            <YAxis dataKey="q" type="number" name="Qty" stroke="#666" fontSize={10}/>
                                            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#000', borderColor: '#333', fontSize: '12px' }} />
                                            <Scatter name="Observations" data={selectedProduct.plot_points} fill="#333" line={false} shape="circle" />
                                            <Line data={selectedProduct.curve_data} dataKey="q" type="monotone" stroke="#22c55e" strokeWidth={2} dot={false} activeDot={false} />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-blue-900/10 border border-blue-500/20">
                                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><Calculator size={14}/> Strategic Implication</h4>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    {selectedProduct.elasticity > -1 
                                    ? `INELASTIC DEMAND (ε = ${selectedProduct.elasticity}). Customers are insensitive to price. A price increase is recommended to maximize margins.`
                                    : `ELASTIC DEMAND (ε = ${selectedProduct.elasticity}). Quantity demanded is highly sensitive. A price increase would cause a disproportionate drop in volume. Consider maintaining or lowering price.`}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* VIEW 2: ECONOMETRICS (A Tabela Científica) */}
                    {activeTab === 'econometrics' && (
                        <div className="space-y-6 animate-fade-in">
                             <div className="p-4 rounded-xl bg-[#0F0F0F] border border-white/10 font-mono">
                                <p className="text-[10px] text-gray-500 uppercase mb-2">Estimated Equation</p>
                                <div className="text-xs text-green-400 bg-black p-3 rounded border border-white/5 overflow-x-auto whitespace-nowrap">
                                    {selectedProduct.equation}
                                </div>
                            </div>

                            <div className="border border-white/10 rounded-xl overflow-hidden">
                                <table className="w-full text-left text-xs font-mono">
                                    <thead className="bg-white/5 text-gray-400 border-b border-white/10">
                                        <tr>
                                            <th className="p-3 font-normal">Variable</th>
                                            <th className="p-3 font-normal text-right">Coeff.</th>
                                            <th className="p-3 font-normal text-right">Std.Err</th>
                                            <th className="p-3 font-normal text-right">P&gt;|t|</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedProduct.regression_table?.map((row: any, i:number) => (
                                            <tr key={i} className="border-b border-white/5 last:border-0">
                                                <td className="p-3 text-gray-300">{row.variable}</td>
                                                <td className="p-3 text-right text-white font-bold">{row.coef}</td>
                                                <td className="p-3 text-right text-gray-500">{row.std_err}</td>
                                                <td className={`p-3 text-right ${row.p_value < 0.05 ? 'text-green-400' : 'text-red-400'}`}>{row.p_value.toFixed(3)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* SAFE GUARD: Verificar se existem coeficientes antes de mostrar */}
                            {selectedProduct.coefficients && (
                                <div>
                                    <h4 className="text-xs font-bold text-white mb-3">Multivariate Factors</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <StatBox label="Fuel Sens." value={selectedProduct.coefficients["Gas Sens."] || selectedProduct.coefficients["Gas Sens"] || "N/A"} color="text-gray-300" icon={<Fuel size={12}/>} />
                                        <StatBox label="Inflation Sens." value={selectedProduct.coefficients["Inflation Sens."] || selectedProduct.coefficients["Inflation Sens"] || "N/A"} color="text-gray-300" icon={<Coins size={12}/>} />
                                        <StatBox label="Promo Lift" value={selectedProduct.coefficients["Promo Lift"] || "N/A"} color="text-green-400" icon={<Tag size={12}/>} />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-xs text-gray-500 px-2">
                                <span>R-Squared: <strong className="text-white">{selectedProduct.r2}</strong></span>
                                <span>Obs: <strong className="text-white">730 Days</strong></span>
                            </div>
                        </div>
                    )}

                    {/* VIEW 3: SIMULATOR (Onde a magia acontece) */}
                    {activeTab === 'simulator' && simulation && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="p-5 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-white/10">
                                <h3 className="text-xs font-bold text-white mb-4 flex items-center gap-2"><Calculator size={14} className="text-green-400"/> What-If Simulator</h3>
                                
                                <div className="mb-6">
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-gray-400">Price Change Scenario</span>
                                        <span className={`font-mono font-bold ${simPriceChange > 0 ? 'text-blue-400' : simPriceChange < 0 ? 'text-red-400' : 'text-white'}`}>{simPriceChange > 0 ? '+' : ''}{simPriceChange}%</span>
                                    </div>
                                    <input 
                                        type="range" min="-20" max="20" step="1" value={simPriceChange} 
                                        onChange={(e) => setSimPriceChange(Number(e.target.value))}
                                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                                    />
                                    <div className="flex justify-between text-[9px] text-gray-600 mt-1 font-mono">
                                        <span>-20%</span>
                                        <span>Current</span>
                                        <span>+20%</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                                        <div className="text-left">
                                            <p className="text-[9px] text-gray-500 uppercase">New Price</p>
                                            <p className="text-sm font-mono text-white">€{simulation.newP.toFixed(2)}</p>
                                        </div>
                                        <ArrowRight size={14} className="text-gray-600"/>
                                        <div className="text-right">
                                            <p className="text-[9px] text-gray-500 uppercase">Proj. Volume</p>
                                            <p className="text-sm font-mono text-white">{Math.round(simulation.newQ)} units</p>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-lg border flex justify-between items-center ${simulation.revDiff >= 0 ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                                        <div>
                                            <p className={`text-[10px] uppercase font-bold ${simulation.revDiff >= 0 ? 'text-green-400' : 'text-red-400'}`}>Revenue Impact</p>
                                            <p className="text-xs text-gray-400">Annual Projection</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-xl font-mono font-bold ${simulation.revDiff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {simulation.revDiff > 0 ? '+' : ''}{simulation.revDiffPct.toFixed(1)}%
                                            </p>
                                            <p className="text-[10px] text-gray-400">€{Math.abs(simulation.revDiff).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-[10px] text-gray-500 mt-4 italic leading-relaxed">
                                    *Based on calculated elasticity of {selectedProduct.elasticity.toFixed(2)}. Assumes ceteris paribus (competitors do not react).
                                </p>
                            </div>
                        </div>
                    )}

                    <button className="w-full mt-8 py-3 bg-white text-black font-bold text-xs rounded-lg uppercase tracking-wider hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                        <FileText size={14}/> Export Full Report
                    </button>

                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function KpiCard({ label, value, sub, icon }: any) {
    return (
        <div className="bg-[#0F0F0F] border border-white/10 p-5 rounded-xl">
            <div className="flex justify-between items-start mb-4">
                <p className="text-xs font-mono text-gray-500 uppercase">{label}</p>
                <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{value}</p>
            <p className="text-[10px] text-gray-400">{sub}</p>
        </div>
    )
}

function StatBox({ label, value, color, icon }: any) {
    return (
        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg flex justify-between items-center">
            <div>
                <p className="text-[9px] text-gray-500 uppercase mb-1 flex items-center gap-1">{icon} {label}</p>
                <p className={`text-sm font-bold font-mono ${color}`}>{value}</p>
            </div>
        </div>
    )
}