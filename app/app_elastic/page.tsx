'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCcw, Activity, ShoppingCart, TrendingUp, TrendingDown, Tag, Filter, X, BarChart2, Calculator, FileText, Thermometer, Fuel, Coins, Microscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function ElasticPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/elastic?category_filter=${filter}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filter]);

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-green-500/30 flex relative overflow-hidden">
      
      <div className={`flex-1 flex flex-col transition-all duration-500 ${selectedProduct ? 'mr-[500px]' : ''}`}>
          <nav className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <a href="/" className="text-gray-400 hover:text-white transition-colors"><ArrowLeft size={20}/></a>
                    <div className="h-6 w-px bg-white/10"></div>
                    <span className="font-bold text-lg tracking-tight text-white flex items-center gap-2">
                        ELASTIC <span className="text-xs font-mono bg-green-900/30 text-green-400 px-2 py-0.5 rounded border border-green-500/20">ENTERPRISE v2.2</span>
                    </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded border border-white/10 text-gray-300">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> LIVE ESTIMATION
                    </div>
                </div>
            </div>
          </nav>

          <div className="p-6 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <KpiCard label="SKUs Modeled" value={data.length.toString()} sub="Multivariate Regressions" icon={<ShoppingCart size={18} className="text-blue-400"/>} />
                <KpiCard label="High Sensitivity" value={data.filter(i => i.elasticity < -1.5).length.toString()} sub="ε < -1.5 (Elastic)" icon={<Activity size={18} className="text-red-400"/>} />
                <KpiCard label="Price Opportunities" value={data.filter(i => i.action !== "Maintain").length.toString()} sub="Revenue Actions" icon={<TrendingUp size={18} className="text-green-400"/>} />
                <KpiCard label="Model Fit (R² Avg)" value={data.length > 0 ? (data.reduce((a,b)=>a+b.r2,0)/data.length).toFixed(2) : "-"} sub="Variance Explained" icon={<Tag size={18} className="text-purple-400"/>} />
            </div>

            <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-2">
                        {["All", "Dairy", "Grocery", "Drinks", "Cleaning"].map(cat => (
                            <button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === cat ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{cat}</button>
                        ))}
                    </div>
                    <button onClick={fetchData} className="p-2 rounded-lg bg-green-600 hover:bg-green-500 text-white transition-all"><RefreshCcw size={16}/></button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-[10px] font-mono text-gray-400 uppercase tracking-wider border-b border-white/5">
                                <th className="p-4 font-normal">Product / SKU</th>
                                <th className="p-4 font-normal text-right">Avg Price</th>
                                <th className="p-4 font-normal text-right">Elasticity (ε)</th>
                                <th className="p-4 font-normal">Classification</th>
                                <th className="p-4 font-normal">AI Recommendation</th>
                                <th className="p-4 font-normal text-right">R²</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr><td colSpan={6} className="p-12 text-center text-gray-500 animate-pulse font-mono">Running OLS Matrix Algebra...</td></tr>
                            ) : data.map((item, i) => (
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
                                            {item.tag}
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

      <AnimatePresence>
        {selectedProduct && (
            <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 h-full w-[500px] bg-[#080808] border-l border-white/10 z-50 shadow-[-50px_0_100px_rgba(0,0,0,0.5)] overflow-y-auto"
            >
                <div className="p-6">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white leading-tight">{selectedProduct.product}</h2>
                            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">{selectedProduct.category} • OLS Regression</span>
                        </div>
                        <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20}/></button>
                    </div>

                    {/* CHART */}
                    <div className="bg-[#0F0F0F] border border-white/10 p-4 rounded-xl mb-6">
                        <h3 className="text-xs font-bold text-gray-300 mb-4 flex items-center gap-2"><BarChart2 size={14}/> Demand Curve (Ceteris Paribus)</h3>
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
                         <div className="flex justify-between text-[10px] text-gray-500 px-2">
                            <span>Elasticity (ε): {selectedProduct.elasticity}</span>
                            <span>R² = {selectedProduct.r2}</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* ROBUSTNESS CARD (NEW) */}
                        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                            <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2"><Microscope size={14} className="text-purple-400"/> Model Robustness</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <StatBox label="Std. Error" value={selectedProduct.std_err} color="text-gray-300" />
                                <StatBox label="P-Value" value={selectedProduct.p_value < 0.001 ? "< 0.001" : selectedProduct.p_value} color={selectedProduct.p_value < 0.05 ? "text-green-400" : "text-red-400"} />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2 italic">
                                {selectedProduct.p_value < 0.05 ? "Statistically significant at 95% confidence level." : "Warning: Results may not be statistically significant."}
                            </p>
                        </div>

                        {/* COEFFICIENTS CARD (UPDATED WITH FUEL/INFLATION) */}
                        <div>
                            <h4 className="text-xs font-bold text-white mb-3">Multivariate Coefficients</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <StatBox label="Fuel Sens." value={selectedProduct.coefficients["Gas Sens."]} color="text-gray-300" icon={<Fuel size={12}/>} />
                                <StatBox label="Inflation Sens." value={selectedProduct.coefficients["Inflation Sens."]} color="text-gray-300" icon={<Coins size={12}/>} />
                                <StatBox label="Promo Lift" value={selectedProduct.coefficients["Promo Lift"]} color="text-green-400" icon={<Tag size={12}/>} />
                            </div>
                        </div>

                         <div className="p-4 rounded-xl bg-blue-900/10 border border-blue-500/20">
                            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><Calculator size={14}/> Economic Logic</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                {selectedProduct.elasticity > -1 
                                ? `INELASTIC DEMAND (ε = ${selectedProduct.elasticity}). Quantity demanded is insensitive to price changes. A price increase is recommended to maximize margins, as volume loss will be minimal.`
                                : `ELASTIC DEMAND (ε = ${selectedProduct.elasticity}). Quantity demanded is highly sensitive. A price increase would cause a disproportionate drop in volume. Consider maintaining or lowering price to capture market share.`}
                            </p>
                        </div>

                        <button className="w-full py-3 bg-white text-black font-bold text-xs rounded-lg uppercase tracking-wider hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                            <FileText size={14}/> Export Technical Report
                        </button>
                    </div>

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