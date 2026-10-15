import React, { useState } from 'react';
import {
  Flame,
  Coins,
  Shield,
  Bell,
  Sparkles,
  Share2,
  Watch,
  Activity,
  CheckCircle2,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { UserProfile, SubscriptionTier } from '../types';

interface HeaderProps {
  user: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReferralModal: () => void;
  onOpenTierModal: () => void;
  onOpenApisModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  setActiveTab,
  onOpenReferralModal,
  onOpenTierModal,
  onOpenApisModal
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    {
      id: 'notif-1',
      title: 'Calorie Reminder',
      text: 'Log your lunch by 2:00 PM to maintain your 19-day streak! 🥗',
      time: '15m ago',
      unread: true
    },
    {
      id: 'notif-2',
      title: 'Dietitian Cheryl Lim',
      text: 'Cheryl left a voice note feedback on your brown rice bowl.',
      time: '1h ago',
      unread: true
    },
    {
      id: 'notif-3',
      title: 'ActiveSG Sync Active',
      text: '+50 HealthPoints credited from your morning brisk walk.',
      time: '3h ago',
      unread: false
    }
  ]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Activity className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">Vital<span className="text-emerald-600">Pact</span></span>
              <span className="hidden sm:inline-flex text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Ecosystem
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium -mt-0.5 hidden sm:block">
              Weight Management · Health365 & ActiveSG Partner
            </p>
          </div>
        </div>

        {/* Center / Right Badges & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Duolingo-style Streak */}
          <div
            title="Maintain your daily food logging & activity streak to earn multiplier bonus points!"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200/80 text-orange-800 text-xs font-bold shadow-2xs hover:bg-orange-100 transition-colors cursor-pointer"
            onClick={() => setActiveTab('rewards')}
          >
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
            <span>{user.streakDays} Days</span>
            <span className="text-[10px] text-orange-600/80 font-normal hidden md:inline">· Streak Safe</span>
          </div>

          {/* FitPoints Balance */}
          <button
            onClick={() => setActiveTab('rewards')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors shadow-2xs cursor-pointer"
            title="Earn FitPoints to redeem SaladStop! bowls, ActiveSG gym passes, and Hyrox discounts"
          >
            <Coins className="w-4 h-4 text-emerald-600 fill-emerald-500/20" />
            <span>{user.fitPoints.toLocaleString()} <span className="font-normal text-[11px]">pts</span></span>
          </button>

          {/* Live APIs Trigger */}
          <button
            onClick={onOpenApisModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100/70 hover:bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 transition-colors cursor-pointer"
            title="Inspect live data from OpenFoodFacts, Wger, TheMealDB, MedlinePlus & TheSportsDB"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
            <span>Live APIs</span>
          </button>

          {/* Subscription Tier */}
          <button
            onClick={onOpenTierModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold border border-slate-200/80 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="capitalize">{user.subscriptionTier} Tier</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {/* Refer a Friend Button */}
          <button
            onClick={onOpenReferralModal}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-dashed border-slate-300"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Refer & Earn +500</span>
          </button>

          {/* Notification dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Health Notifications</span>
                  <span className="text-[11px] text-emerald-600 font-semibold cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {notifications.map((item) => (
                    <div key={item.id} className={`px-4 py-3 hover:bg-slate-50 transition-colors text-left ${item.unread ? 'bg-emerald-50/30' : ''}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{item.title}</span>
                        <span className="text-[10px] text-slate-400">{item.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-snug">{item.text}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1"><Watch className="w-3 h-3 text-emerald-600" /> InBody & Apple Watch synced</span>
                  <span onClick={() => { setShowNotifications(false); setActiveTab('inbody'); }} className="text-emerald-700 font-semibold cursor-pointer hover:underline">
                    Telemetry
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* User profile avatar */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 pl-1 cursor-pointer group"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30 group-hover:ring-emerald-500 transition-all"
            />
            <div className="hidden xl:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-none">{user.name}</p>
              <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{user.currentWeightKg} kg · Goal {user.targetWeightKg} kg</p>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
