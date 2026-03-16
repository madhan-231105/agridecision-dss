import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, ArrowRight, Info } from 'lucide-react';

const data = [
  { name: 'Jan', rice: 45, wheat: 32, corn: 28 },
  { name: 'Feb', rice: 48, wheat: 34, corn: 30 },
  { name: 'Mar', rice: 46, wheat: 38, corn: 35 },
  { name: 'Apr', rice: 52, wheat: 40, corn: 32 },
  { name: 'May', rice: 55, wheat: 42, corn: 38 },
  { name: 'Jun', rice: 58, wheat: 45, corn: 40 },
];

export default function MarketTrends() {
  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-serif font-medium text-stone-900">Market Trends</h2>
        <p className="text-stone-500 mt-1">Real-time price analysis and demand forecasting.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-stone-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-serif font-medium">Price Index (Per Kg)</h3>
            <div className="flex gap-4 text-xs font-medium">
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-full" /> Rice</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-full" /> Wheat</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-500 rounded-full" /> Corn</div>
            </div>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a8a29e', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#a8a29e', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="rice" stroke="#10b981" fillOpacity={1} fill="url(#colorRice)" strokeWidth={3} />
                <Area type="monotone" dataKey="wheat" stroke="#3b82f6" fillOpacity={0} strokeWidth={3} />
                <Area type="monotone" dataKey="corn" stroke="#f59e0b" fillOpacity={0} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-emerald-50 p-8 rounded-[40px] border border-emerald-100">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              <h3 className="font-serif font-medium text-emerald-900">High Demand Alert</h3>
            </div>
            <p className="text-emerald-800 text-sm leading-relaxed mb-6">
              Rice demand is projected to increase by 15% in the next quarter due to export policy changes.
            </p>
            <button className="flex items-center gap-2 text-emerald-700 font-medium text-sm hover:gap-3 transition-all">
              View Analysis <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-stone-100 shadow-sm">
            <h3 className="font-serif font-medium text-stone-900 mb-6">Regional Insights</h3>
            <div className="space-y-4">
              {[
                { crop: 'Cotton', trend: 'down', price: '$1.2/kg' },
                { crop: 'Sugarcane', trend: 'up', price: '$0.8/kg' },
                { crop: 'Soybean', trend: 'up', price: '$2.1/kg' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-stone-50 last:border-0">
                  <span className="text-stone-700 font-medium">{item.crop}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-stone-500 text-sm">{item.price}</span>
                    {item.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
