import React, { useState, useEffect } from 'react';
import {
  X,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Activity,
  Sparkles,
  Utensils,
  Dumbbell,
  ShieldCheck,
  Award,
  ChevronRight,
  Code
} from 'lucide-react';
import { playBeep } from '../utils/audio';

interface LiveDataConnectorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveDataConnectorsModal: React.FC<LiveDataConnectorsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'health' | 'openfoodfacts' | 'meals' | 'exercises' | 'medlineplus' | 'sports'>('health');
  const [loading, setLoading] = useState<boolean>(false);
  const [endpointData, setEndpointData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (isOpen && !endpointData[activeTab]) {
      fetchEndpoint(activeTab);
    }
  }, [isOpen, activeTab]);

  const fetchEndpoint = async (tab: typeof activeTab) => {
    setLoading(true);
    playBeep('short');
    try {
      let url = '/api/health';
      if (tab === 'openfoodfacts') url = '/api/openfoodfacts?barcode=3017624010701';
      else if (tab === 'meals') url = '/api/meals?i=chicken_breast';
      else if (tab === 'exercises') url = '/api/exercises?language=2&limit=5';
      else if (tab === 'medlineplus') url = '/api/medlineplus?code=E11&lang=es';
      else if (tab === 'sports') url = '/api/sports?team=Arsenal';

      const res = await fetch(url);
      const data = await res.json();
      setEndpointData((prev) => ({ ...prev, [tab]: data }));
      playBeep('start');
    } catch (err: any) {
      setEndpointData((prev) => ({ ...prev, [tab]: { error: err?.message || 'Network error' } }));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'health', label: 'API Health', icon: Activity },
    { id: 'openfoodfacts', label: 'OpenFoodFacts (Barcode)', icon: Sparkles },
    { id: 'meals', label: 'TheMealDB (Recipes)', icon: Utensils },
    { id: 'exercises', label: 'Wger (Exercises)', icon: Dumbbell },
    { id: 'medlineplus', label: 'MedlinePlus (Diabetes)', icon: ShieldCheck },
    { id: 'sports', label: 'TheSportsDB (Athletics)', icon: Award }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Serverless Connectors Hub
              </span>
              <h2 className="text-lg font-black text-slate-900">Live External APIs Reflected in VitalPact</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Verify real-time live data flowing through your <code className="text-emerald-700 font-mono">/api/*</code> serverless handlers into the UI.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto no-scrollbar">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Preview */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-mono text-slate-800 font-bold">
                Endpoint: /api/{activeTab}
              </span>
              <span>·</span>
              <span className="text-emerald-600 font-medium">Status: Live Response</span>
            </div>

            <button
              onClick={() => fetchEndpoint(activeTab)}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Refreshing...' : 'Refetch Live Data'}</span>
            </button>
          </div>

          {/* Rendered Live Preview Card */}
          {activeTab === 'openfoodfacts' && endpointData.openfoodfacts?.product && (
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex items-center gap-4">
              {endpointData.openfoodfacts.product.image_url && (
                <img
                  src={endpointData.openfoodfacts.product.image_url}
                  alt="Product"
                  className="w-16 h-16 object-contain rounded-lg bg-white p-1 border border-emerald-200"
                />
              )}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-800">
                  Nutri-Score Grade {endpointData.openfoodfacts.product.nutriscore_grade?.toUpperCase() || 'E'}
                </span>
                <h4 className="text-sm font-bold text-slate-900">{endpointData.openfoodfacts.product.product_name}</h4>
                <p className="text-xs text-slate-600">
                  Brand: {endpointData.openfoodfacts.product.brands} · Energy: {endpointData.openfoodfacts.product.nutriments?.['energy-kcal_100g']} kcal/100g
                </p>
              </div>
            </div>
          )}

          {activeTab === 'meals' && endpointData.meals?.meals && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {endpointData.meals.meals.slice(0, 4).map((m: any) => (
                <div key={m.idMeal} className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
                  <img src={m.strMealThumb} alt={m.strMeal} className="w-full h-20 object-cover rounded-lg" />
                  <p className="text-[11px] font-bold text-slate-800 line-clamp-1 mt-1">{m.strMeal}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'exercises' && endpointData.exercises?.results && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {endpointData.exercises.results.slice(0, 3).map((ex: any) => (
                <div key={ex.id} className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                    {ex.categoryName || 'Strength'}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{ex.name}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{ex.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'sports' && endpointData.sports?.teams?.[0] && (
            <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center gap-4">
              <img src={endpointData.sports.teams[0].strBadge} alt="Club" className="w-16 h-16 object-contain" />
              <div>
                <h4 className="text-sm font-bold text-white">{endpointData.sports.teams[0].strTeam}</h4>
                <p className="text-xs text-slate-300">{endpointData.sports.teams[0].strLeague} · {endpointData.sports.teams[0].strStadium}</p>
              </div>
            </div>
          )}

          {/* Raw JSON viewer */}
          <div className="bg-slate-950 text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-72 border border-slate-800">
            <pre>{JSON.stringify(endpointData[activeTab] || { loading: true }, null, 2)}</pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>All 5 external data sources connected via serverless routes in <code className="font-mono">/api</code>.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
