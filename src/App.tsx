/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Sprout, 
  TrendingUp, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronRight,
  Droplets,
  Thermometer,
  Wind,
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { collection, addDoc, query, where, onSnapshot, orderBy, limit, getDocFromServer, doc } from 'firebase/firestore';
import { getCropRecommendation, getMarketAnalysis } from './services/geminiService';

// Components
import Dashboard from './components/Dashboard';
import SoilInput from './components/SoilInput';
import MarketTrends from './components/MarketTrends';
import Documentation from './components/Documentation';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    
    // Test connection
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();

    return () => unsubscribe();
  }, []);

  const [authError, setAuthError] = useState<string | null>(null);

  const handleLogin = async () => {
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login failed", error);
      if (error.code === 'auth/unauthorized-domain') {
        setAuthError("Firebase is still authorizing this domain. This usually takes 2-5 minutes after setup. Please try again in a moment.");
      } else if (error.code === 'auth/popup-blocked') {
        setAuthError("Popup was blocked. Please allow popups for this site.");
      } else {
        setAuthError("Login failed. Please try again.");
      }
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sprout className="w-12 h-12 text-emerald-600" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center">
              <Sprout className="w-10 h-10 text-emerald-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-serif font-medium text-stone-900 tracking-tight">AgriDecision DSS</h1>
            <p className="text-stone-500 italic">Empowering farmers with data-driven insights for a sustainable future.</p>
          </div>
          
          {authError && (
            <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-sm flex items-center gap-3 border border-red-100">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {authError}
            </div>
          )}

          <button
            onClick={handleLogin}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-medium shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'soil', label: 'Soil Analysis', icon: Droplets },
    { id: 'market', label: 'Market Trends', icon: TrendingUp },
    { id: 'docs', label: 'Documentation', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-stone-200 flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
            <Sprout className="w-6 h-6" />
          </div>
          <span className="font-serif text-xl font-medium text-stone-900">AgriDecision</span>
        </div>

        <nav className="flex-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-emerald-50 text-emerald-700 font-medium' 
                  : 'text-stone-500 hover:bg-stone-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-stone-200">
          <div className="flex items-center gap-3 px-2 mb-6">
            <img 
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
              className="w-10 h-10 rounded-full border border-stone-200"
              alt="Profile"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-900 truncate">{user.displayName}</p>
              <p className="text-xs text-stone-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 max-w-6xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <Dashboard user={user} />}
            {activeTab === 'soil' && <SoilInput user={user} />}
            {activeTab === 'market' && <MarketTrends />}
            {activeTab === 'docs' && <Documentation />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
