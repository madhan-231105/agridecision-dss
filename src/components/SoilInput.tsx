import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Save, Droplets, FlaskConical, Thermometer, Info } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../utils/firestoreError';

export default function SoilInput({ user }: { user: User }) {
  const [formData, setFormData] = useState({
    ph: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    moisture: ''
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addDoc(collection(db, 'soil_analyses'), {
        userId: user.uid,
        ph: parseFloat(formData.ph),
        nitrogen: parseFloat(formData.nitrogen),
        phosphorus: parseFloat(formData.phosphorus),
        potassium: parseFloat(formData.potassium),
        moisture: parseFloat(formData.moisture),
        timestamp: serverTimestamp()
      });
      setSuccess(true);
      setFormData({ ph: '', nitrogen: '', phosphorus: '', potassium: '', moisture: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'soil_analyses');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <header className="mb-10">
        <h2 className="text-3xl font-serif font-medium text-stone-900">Soil Analysis</h2>
        <p className="text-stone-500 mt-1">Record your latest soil test results for accurate recommendations.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-emerald-600" />
              Soil pH Level
            </label>
            <input
              type="number"
              step="0.1"
              required
              value={formData.ph}
              onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
              placeholder="e.g. 6.5"
              className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-emerald-600" />
              Moisture Content (%)
            </label>
            <input
              type="number"
              required
              value={formData.moisture}
              onChange={(e) => setFormData({ ...formData, moisture: e.target.value })}
              placeholder="e.g. 45"
              className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Nitrogen (N) ppm</label>
            <input
              type="number"
              value={formData.nitrogen}
              onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
              placeholder="e.g. 20"
              className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Phosphorus (P) ppm</label>
            <input
              type="number"
              value={formData.phosphorus}
              onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
              placeholder="e.g. 15"
              className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Potassium (K) ppm</label>
            <input
              type="number"
              value={formData.potassium}
              onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
              placeholder="e.g. 120"
              className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-3xl flex gap-4 items-start">
          <Info className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
          <p className="text-sm text-blue-800 leading-relaxed">
            Accurate soil data is the foundation of our DSS. We recommend testing your soil at least once per season or before planting a new crop.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full py-4 rounded-2xl font-medium transition-all flex items-center justify-center gap-2 ${
            success 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100'
          }`}
        >
          {saving ? (
            'Saving...'
          ) : success ? (
            <>
              <Save className="w-5 h-5" />
              Saved Successfully
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Analysis
            </>
          )}
        </button>
      </form>
    </div>
  );
}
