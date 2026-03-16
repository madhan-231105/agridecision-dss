import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Sprout, AlertCircle, CheckCircle2, Info, TrendingUp, Droplets } from 'lucide-react';
import { getCropRecommendation } from '../services/geminiService';
import { handleFirestoreError, OperationType } from '../utils/firestoreError';

export default function Dashboard({ user }: { user: User }) {
  const [latestAnalysis, setLatestAnalysis] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'soil_analyses'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setLatestAnalysis(data);
        fetchRecommendations(data);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'soil_analyses');
    });

    return () => unsubscribe();
  }, [user.uid]);

  const fetchRecommendations = async (soilData: any) => {
    setLoading(true);
    setError(null);
    try {
      // Mock weather for now
      const weather = { temp: 28, humidity: 65, rainfall: 'Moderate' };
      const res = await getCropRecommendation(soilData, weather);
      setRecommendations(res.recommendations);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-serif font-medium text-stone-900">Welcome back, {user.displayName?.split(' ')[0]}</h2>
        <p className="text-stone-500 mt-1 text-lg">Here's your farm's health overview.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <Droplets className="w-5 h-5" />
            </div>
            <span className="text-stone-500 font-medium">Soil pH</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-serif font-medium text-stone-900">{latestAnalysis?.ph || '--'}</span>
            <span className={`text-sm mb-1 font-medium ${latestAnalysis?.ph >= 6 && latestAnalysis?.ph <= 7.5 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {latestAnalysis?.ph ? (latestAnalysis.ph >= 6 && latestAnalysis.ph <= 7.5 ? 'Optimal' : 'Needs Adjustment') : 'No Data'}
            </span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="text-stone-500 font-medium">Nutrients (NPK)</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-xs text-stone-400 uppercase tracking-wider font-bold">N</p>
              <p className="text-xl font-medium text-stone-900">{latestAnalysis?.nitrogen || '0'}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-stone-400 uppercase tracking-wider font-bold">P</p>
              <p className="text-xl font-medium text-stone-900">{latestAnalysis?.phosphorus || '0'}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-stone-400 uppercase tracking-wider font-bold">K</p>
              <p className="text-xl font-medium text-stone-900">{latestAnalysis?.potassium || '0'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-stone-500 font-medium">Market Status</span>
          </div>
          <div className="text-emerald-600 font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Prices Up 12%
          </div>
          <p className="text-xs text-stone-400 mt-2 italic">Based on local market index</p>
        </div>
      </div>

      <section className="bg-emerald-900 rounded-[40px] p-12 text-white overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-2xl font-serif font-medium mb-6">AI Crop Recommendations</h3>
          
          {loading ? (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              <span className="text-emerald-300">Analyzing soil patterns...</span>
            </div>
          ) : error ? (
            <div className="bg-red-500/20 border border-red-500/30 p-6 rounded-3xl flex items-center gap-4 text-red-200">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <p>{error}</p>
            </div>
          ) : recommendations ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recommendations.map((rec: any, i: number) => (
                <div key={i} className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-medium">{rec.cropName}</h4>
                    <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-1 rounded-full border border-emerald-500/30">
                      {rec.expectedYield}
                    </span>
                  </div>
                  <p className="text-emerald-100/70 text-sm mb-4 leading-relaxed">{rec.reason}</p>
                  <div className="flex items-center gap-2 text-amber-300 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    {rec.riskFactors}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-emerald-300 italic">Enter soil analysis data to get personalized recommendations.</p>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-800 rounded-full blur-3xl opacity-50" />
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-emerald-700 rounded-full blur-3xl opacity-30" />
      </section>
    </div>
  );
}
