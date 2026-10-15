import React, { useState } from 'react';
import {
  Scale,
  Watch,
  Activity,
  ShieldCheck,
  Smartphone,
  RefreshCw,
  Plus,
  CheckCircle2,
  TrendingDown,
  Info,
  Calendar,
  MapPin,
  Check
} from 'lucide-react';
import { InBodyRecord, DeviceConnection, UserProfile } from '../types';
import { CONNECTED_DEVICES } from '../data/initialData';
import { playBeep } from '../utils/audio';

interface DeviceSyncInBodyProps {
  user: UserProfile;
  inbodyRecords: InBodyRecord[];
  onAddInBodyRecord: (record: InBodyRecord) => void;
}

export const DeviceSyncInBody: React.FC<DeviceSyncInBodyProps> = ({
  user,
  inbodyRecords,
  onAddInBodyRecord
}) => {
  const [devices, setDevices] = useState<DeviceConnection[]>(CONNECTED_DEVICES);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [showAddScanModal, setShowAddScanModal] = useState<boolean>(false);

  // New InBody entry state
  const [newWeight, setNewWeight] = useState<string>('80.8');
  const [newFatPct, setNewFatPct] = useState<string>('22.8');
  const [newMuscle, setNewMuscle] = useState<string>('35.3');
  const [newVisceral, setNewVisceral] = useState<string>('8');
  const [newLocation, setNewLocation] = useState<string>('ActiveSG Bishan');

  const latest = inbodyRecords[inbodyRecords.length - 1];
  const baseline = inbodyRecords[0];

  const handleSimulateSync = () => {
    setIsSyncing(true);
    playBeep('start');
    setTimeout(() => {
      setIsSyncing(false);
      setDevices((prev) =>
        prev.map((d) =>
          d.connected ? { ...d, lastSynced: 'Just now' } : d
        )
      );
      playBeep('complete');
    }, 1200);
  };

  const handleToggleDevice = (id: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, connected: !d.connected } : d))
    );
    playBeep('short');
  };

  const handleSaveScan = () => {
    const record: InBodyRecord = {
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      weightKg: parseFloat(newWeight) || 81.0,
      bodyFatPercentage: parseFloat(newFatPct) || 23.0,
      skeletalMuscleMassKg: parseFloat(newMuscle) || 35.0,
      visceralFatLevel: parseInt(newVisceral) || 8,
      bmrKcal: 1770,
      scanLocation: newLocation
    };

    onAddInBodyRecord(record);
    setShowAddScanModal(false);
    playBeep('reward');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">InBody Body Composition & Wearable Sync</h1>
            <span className="text-xs font-bold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
              Multi-Device Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Cross-compatible ecosystem bridging Apple Watch, Health365, ActiveSG, and clinical InBody scales (770/270). Track fat loss vs lean muscle mass retention.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Wearables Now'}</span>
          </button>

          <button
            onClick={() => setShowAddScanModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log InBody Scan</span>
          </button>
        </div>
      </div>

      {/* Connected Devices Grid (Canvas: Cross-compatible smart watch, fitness tracker, ActiveSG, Health365) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {devices.map((device) => (
          <div
            key={device.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
              device.connected
                ? 'bg-white border-slate-200 shadow-xs'
                : 'bg-slate-50/70 border-slate-200/60 opacity-75'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{device.name}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    device.connected ? 'bg-emerald-500 ring-2 ring-emerald-100' : 'bg-slate-300'
                  }`}
                />
              </div>
              <p className="text-xs text-slate-600 leading-snug">{device.metrics}</p>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">{device.lastSynced}</span>
              <button
                onClick={() => handleToggleDevice(device.id)}
                className={`font-bold hover:underline ${
                  device.connected ? 'text-rose-600' : 'text-emerald-700'
                }`}
              >
                {device.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* InBody Primary Report Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Latest InBody Segmental Analysis</h2>
              <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                Medical Standard
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Scanned at {latest?.scanLocation} on {latest?.date}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400">Total Body Weight</span>
            <div className="text-2xl font-black text-slate-900">{latest?.weightKg} kg</div>
          </div>
        </div>

        {/* 4 Core InBody Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Body Fat % */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-600">Percent Body Fat (PBF)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{latest?.bodyFatPercentage}%</span>
              <span className="text-xs font-bold text-emerald-600">
                -{(baseline.bodyFatPercentage - latest.bodyFatPercentage).toFixed(1)}% total
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Normal male range: 10% - 20%</p>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-emerald-500 h-1.5 rounded-full"
                style={{ width: `${(latest?.bodyFatPercentage / 35) * 100}%` }}
              />
            </div>
          </div>

          {/* Skeletal Muscle Mass */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-600">Skeletal Muscle Mass (SMM)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{latest?.skeletalMuscleMassKg} kg</span>
              <span className="text-xs font-bold text-emerald-600">
                +{(latest.skeletalMuscleMassKg - baseline.skeletalMuscleMassKg).toFixed(1)}kg preserved
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Prevents metabolic slowdown</p>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-blue-500 h-1.5 rounded-full"
                style={{ width: `${(latest?.skeletalMuscleMassKg / 45) * 100}%` }}
              />
            </div>
          </div>

          {/* Visceral Fat Level */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-600">Visceral Fat Rating</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">Level {latest?.visceralFatLevel}</span>
              <span className="text-xs font-bold text-emerald-600">
                Down from {baseline.visceralFatLevel}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Target: Level &lt; 9 for low diabetes risk</p>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-teal-500 h-1.5 rounded-full"
                style={{ width: `${(latest?.visceralFatLevel / 15) * 100}%` }}
              />
            </div>
          </div>

          {/* Basal Metabolic Rate */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-600">Basal Metabolic Rate</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{latest?.bmrKcal}</span>
              <span className="text-xs text-slate-500">kcal/day</span>
            </div>
            <p className="text-[11px] text-slate-500">Resting calorie expenditure</p>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '85%' }} />
            </div>
          </div>

        </div>

        {/* Clinical Note for Diabetes / Weight Loss */}
        <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-start gap-3 text-xs text-emerald-950">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-emerald-900">Physician & Dietitian InBody Assessment:</span>
            <p className="text-emerald-900/90 leading-relaxed">
              Alex's visceral fat index has dropped below 9 into the non-atherogenic safety zone. SMM has increased by 0.9kg while total fat mass fell by 5.2kg. This confirms true body re-composition rather than dehydration or catabolic starvation.
            </p>
          </div>
        </div>

      </div>

      {/* Historical Scans Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Historical InBody Scans Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Location</th>
                <th className="pb-3 font-semibold">Weight</th>
                <th className="pb-3 font-semibold">Body Fat %</th>
                <th className="pb-3 font-semibold">Muscle (SMM)</th>
                <th className="pb-3 font-semibold">Visceral</th>
                <th className="pb-3 font-semibold">BMR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inbodyRecords.map((rec, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="py-3 font-bold text-slate-900">{rec.date}</td>
                  <td className="py-3 text-slate-600">{rec.scanLocation}</td>
                  <td className="py-3 font-bold text-slate-900">{rec.weightKg} kg</td>
                  <td className="py-3 text-emerald-700 font-bold">{rec.bodyFatPercentage}%</td>
                  <td className="py-3 text-slate-800 font-medium">{rec.skeletalMuscleMassKg} kg</td>
                  <td className="py-3 text-slate-800">Level {rec.visceralFatLevel}</td>
                  <td className="py-3 text-slate-600">{rec.bmrKcal} kcal</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual InBody Modal */}
      {showAddScanModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Record New InBody Scan</h3>
            <p className="text-xs text-slate-500">Enter numbers printed on your InBody result sheet.</p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Weight (kg):</label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Body Fat (%):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newFatPct}
                    onChange={(e) => setNewFatPct(e.target.value)}
                    className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Skeletal Muscle (kg):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMuscle}
                    onChange={(e) => setNewMuscle(e.target.value)}
                    className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Visceral Fat Level (1-20):</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={newVisceral}
                  onChange={(e) => setNewVisceral(e.target.value)}
                  className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Scan Location / Gym:</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddScanModal(false)}
                className="flex-1 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveScan}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Save Biometrics
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
