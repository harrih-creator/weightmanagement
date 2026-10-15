import React from 'react';
import {
  LayoutDashboard,
  Camera,
  Users,
  Compass,
  Dumbbell,
  Scale,
  Calendar,
  Gift,
  CreditCard
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'ai-scanner', label: 'AI Calorie Scanner', icon: Camera, badge: 'AI' },
    { id: 'trainers', label: 'Find Trainers', icon: Users },
    { id: 'roadmap', label: '12-Wk Program', icon: Compass },
    { id: 'workouts', label: 'Online Training', icon: Dumbbell },
    { id: 'inbody', label: 'InBody & Trackers', icon: Scale },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'rewards', label: 'Rewards & Referrals', icon: Gift },
    { id: 'pricing', label: 'Plans & Partners', icon: CreditCard }
  ];

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                    isActive ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
