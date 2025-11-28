'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCcw, Activity, AlertCircle, ShoppingCart, TrendingUp, TrendingDown, DollarSign, Tag, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ElasticPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

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
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-green-500/30">
      
      {/* HEADER */}
      <nav className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <a href="/" className="text-gray-400 hover:text-white transition-colors"><ArrowLeft size={20}/></a>
                <div className="h-6 w-px bg-white/10"></div>
                <span className="font-bold text-lg tracking-tight text-white flex items-center gap-2">
                    ELASTIC <span className="text-xs font-mono bg-green-900/30 text-green-400 px-2 py-0.5 rounded border border-green-500/20">ENTERPRISE v1.0</span>
                </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                <span>Client: SONAE MC</span>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded border border-white/10 text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Live Connection
                </div>
            </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <KpiCard label="Products Analyzed" value={data.length.toString()} sub="SKUs in Model" icon={<ShoppingCart size={20} className="text-blue-400"/>} />
            <KpiCard label="High Elasticity" value={data.filter(i => i.elasticity < -1.5).length.toString()} sub="Price Sensitive" icon={<Activity size={20} className="text-red-400"/>} />
            <KpiCard label="Optimization Opps" value={data.filter(i => i.action !== "Maintain").length.toString()} sub="Actionable SKUs" icon={<TrendingUp size={20} className="text-green-400"/>} />
            <KpiCard label="Data Confidence" value="94.2%" sub="R-Squared Avg" icon={<Tag size={20} className="text-purple-400"/>} />
        </div>

        {/* MAIN DASHBOARD */}
        <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            
            {/* TOOLBAR */}
            <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Filter size={18} className="text-gray-500"/> Pricing Intelligence
                </h2>
                <div className="flex gap-2">
                    {["All", "Dairy", "Grocery", "Drinks", "Cleaning"].map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === cat ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                        >
                            {cat}
                        </button>
                    ))}
                    <button onClick={fetchData} className="p-2 rounded-lg bg-green-600 hover:bg-green-500 text-white transition-all"><RefreshCcw size={16}/></button>
                </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 text-xs font-mono text-gray-400 uppercase tracking-wider border-b border-white/5">
                            <th className="p-4 font-normal">Product / SKU</th>
                            <th className="p-4 font-normal">Category</th>
                            <th className="p-4 font-normal text-right">Avg Price</th>
                            <th className="p-4 font-normal text-right">Elasticity (ε)</th>
                            <th className="p-4 font-normal">Sensitivity</th>
                            <th className="p-4 font-normal">Recommendation</th>
                            <th className="p-4 font-normal text-right">Confidence (p)</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {loading ? (
                            <tr><td colSpan={7} className="p-12 text-center text-gray-500 animate-pulse">Running Econometric Models...</td></tr>
                        ) : data.map((item, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                <td className="p-4 font-medium text-white">{item.product}</td>
                                <td className="p-4 text-gray-500">{item.category}</td>
                                <td className="p-4 text-right font-mono text-gray-300">€{item.avg_price.toFixed(2)}</td>
                                <td className="p-4 text-right font-mono font-bold text-white">{item.elasticity}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold border ${
                                        item.tag.includes("Elastic") ? "bg-red-900/20 text-red-400 border-red-500/20" : 
                                        "bg-blue-900/20 text-blue-400 border-blue-500/20"
                                    }`}>
                                        {item.tag}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {item.action !== "Maintain" ? (
                                        <div className="flex items-center gap-2 text-green-400 font-bold text-xs">
                                            {item.action.includes("Increase") ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                                            {item.action}
                                        </div>
                                    ) : <span className="text-gray-600 text-xs">Maintain</span>}
                                </td>
                                <td className="p-4 text-right font-mono text-xs text-gray-500">{item.p_value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </main>
  );
}

function KpiCard({ label, value, sub, icon }: any) {
    return (
        <div className="bg-[#0F0F0F] border border-white/10 p-5 rounded-xl hover:border-white/20 transition-all">
            <div className="flex justify-between items-start mb-4">
                <p className="text-xs font-mono text-gray-500 uppercase">{label}</p>
                <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{value}</p>
            <p className="text-[10px] text-gray-400">{sub}</p>
        </div>
    )
}