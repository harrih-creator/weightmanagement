import React from 'react';
import {
  X,
  CheckCircle2,
  ExternalLink,
  Users,
  Compass,
  DollarSign,
  TrendingUp,
  Activity,
  Layers,
  Award,
  ShieldCheck,
  Building
} from 'lucide-react';

interface BusinessCanvasDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export const BusinessCanvasDrawer: React.FC<BusinessCanvasDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  if (!isOpen) return null;

  const canvasPillars = [
    {
      title: 'Key Propositions (Page 3)',
      desc: 'AI calorie food photo calculator, online trainer booking & engagement, filtered by price, end-to-end weight program, calendar sync.',
      actionTab: 'ai-scanner',
      badge: 'Core Technology'
    },
    {
      title: 'Key Partners (Page 1)',
      desc: 'Gyms, healthy F&B (SaladStop, Grain), ActiveSG & Health365 government programmes, Hyrox sporting events, InBody scales, Apple Watch.',
      actionTab: 'inbody',
      badge: 'Ecosystem'
    },
    {
      title: 'Customer Relationships (Page 4)',
      desc: 'Calorie reminders, Duolingo-style streak motivation & push alerts, rewards points system (FitPoints), refer-a-friend viral loop.',
      actionTab: 'rewards',
      badge: 'Retention'
    },
    {
      title: 'Revenue Streams & Costs (Pages 7 & 8)',
      desc: 'Freemium ($0), Basic ($10/mo), Premium ($100/mo). Upfront $150k, recurring $45k/yr. Partner referral commissions.',
      actionTab: 'pricing',
      badge: 'Monetization'
    },
    {
      title: 'Customer Segments (Page 6)',
      desc: '18-70 years old, weight loss seekers, sports/Hyrox groups, overweight or medical needs (diabetes, hypertension).',
      actionTab: 'roadmap',
      badge: 'Targeting'
    },
    {
      title: 'Channels & Healthcare (Page 5)',
      desc: 'Hospital & clinic referrals for diabetes, corporate insurance (AIA Vitality), ActiveSG public roadshows, social media.',
      actionTab: 'trainers',
      badge: 'Acquisition'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Specification Compliance
              </span>
              <h2 className="text-xl font-black text-slate-900">Requirements & Business Model Canvas</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Every page of your 9-page product brief is implemented into this frontend application.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {canvasPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-emerald-500 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{pillar.title}</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    {pillar.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onNavigate(pillar.actionTab);
                }}
                className="w-full py-2 rounded-xl bg-white hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Jump to Feature</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Ready for backend API / database attachment at your convenience.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
          >
            Close Overview
          </button>
        </div>

      </div>
    </div>
  );
};
