import React, { useState } from 'react';
import {
  INITIAL_USER_PROFILE,
  SAMPLE_FOOD_ITEMS,
  INITIAL_BOOKINGS,
  WORKOUT_ROUTINES,
  INBODY_RECORDS,
  REWARDS_CATALOG,
  CALENDAR_EVENTS,
  ROADMAP_WEEKS
} from './data/initialData';
import {
  UserProfile,
  FoodItem,
  Booking,
  WorkoutRoutine,
  InBodyRecord,
  RewardItem,
  CalendarEvent,
  RoadmapWeek,
  SubscriptionTier
} from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { AiCalorieTracker } from './components/AiCalorieTracker';
import { TrainerMarketplace } from './components/TrainerMarketplace';
import { ProgramBuilder } from './components/ProgramBuilder';
import { OnlineTraining } from './components/OnlineTraining';
import { DeviceSyncInBody } from './components/DeviceSyncInBody';
import { CalendarView } from './components/CalendarView';
import { RewardsMarketplace } from './components/RewardsMarketplace';
import { BusinessCanvasDrawer } from './components/BusinessCanvasDrawer';
import {
  Share2,
  Sparkles,
  Check,
  X,
  Copy,
  Info,
  Layers,
  HeartHandshake
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playBeep } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Application State
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [foodItems, setFoodItems] = useState<FoodItem[]>(SAMPLE_FOOD_ITEMS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [inbodyRecords, setInbodyRecords] = useState<InBodyRecord[]>(INBODY_RECORDS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(CALENDAR_EVENTS);
  const [roadmapWeeks, setRoadmapWeeks] = useState<RoadmapWeek[]>(ROADMAP_WEEKS);
  const [rewards, setRewards] = useState<RewardItem[]>(REWARDS_CATALOG);

  // Modals
  const [showReferralModal, setShowReferralModal] = useState<boolean>(false);
  const [showTierModal, setShowTierModal] = useState<boolean>(false);
  const [showCanvasDrawer, setShowCanvasDrawer] = useState<boolean>(false);
  const [copiedReferral, setCopiedReferral] = useState<boolean>(false);

  // Food handlers
  const handleAddFoodItem = (item: FoodItem) => {
    setFoodItems((prev) => [item, ...prev]);
  };

  const handleDeleteFoodItem = (id: string) => {
    setFoodItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Points handler
  const handleUpdatePoints = (newPoints: number) => {
    setUser((prev) => ({ ...prev, fitPoints: newPoints }));
  };

  // Booking handlers
  const handleAddBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    // Also auto-add to calendar
    const calEvent: CalendarEvent = {
      id: 'cal-bk-' + Date.now(),
      title: `${newBooking.sessionType} - ${newBooking.trainerName}`,
      date: '2026-10-20',
      time: newBooking.timeSlot,
      type: 'consultation',
      description: `${newBooking.trainerRole} (${newBooking.trainerName})`,
      locationOrUrl: newBooking.meetingLink || 'Online Video'
    };
    setCalendarEvents((prev) => [calEvent, ...prev]);
  };

  // Roadmap task check
  const handleToggleTask = (weekNum: number, taskId: string) => {
    setRoadmapWeeks((prev) =>
      prev.map((w) => {
        if (w.weekNumber === weekNum) {
          return {
            ...w,
            tasks: w.tasks.map((t) =>
              t.id === taskId ? { ...t, completed: !t.completed } : t
            )
          };
        }
        return w;
      })
    );
    // Award 25 pts
    setUser((prev) => ({ ...prev, fitPoints: prev.fitPoints + 25 }));
  };

  // Book all roadmap activities to calendar
  const handleBookAllActivities = (newEvents: CalendarEvent[]) => {
    setCalendarEvents((prev) => [...newEvents, ...prev]);
  };

  // InBody handler
  const handleAddInBodyRecord = (record: InBodyRecord) => {
    setInbodyRecords((prev) => [...prev, record]);
    setUser((prev) => ({
      ...prev,
      currentWeightKg: record.weightKg,
      fitPoints: prev.fitPoints + 100
    }));
  };

  // Calendar event handler
  const handleAddCalendarEvent = (event: CalendarEvent) => {
    setCalendarEvents((prev) => [event, ...prev]);
  };

  // Workout completed
  const handleWorkoutCompleted = (routine: WorkoutRoutine) => {
    setUser((prev) => ({
      ...prev,
      fitPoints: prev.fitPoints + 60,
      streakDays: prev.streakDays + 1
    }));
  };

  // Reward redeemed
  const handleRedeemReward = (reward: RewardItem) => {
    setUser((prev) => ({
      ...prev,
      fitPoints: Math.max(0, prev.fitPoints - reward.pointsRequired)
    }));
  };

  // Tier update
  const handleUpdateTier = (tier: SubscriptionTier) => {
    setUser((prev) => ({ ...prev, subscriptionTier: tier }));
    setShowTierModal(false);
    playBeep('reward');
  };

  // Corporate / Clinic Promo Code
  const handleApplyPromoCode = (code: string): boolean => {
    if (code.includes('AIA') || code.includes('SGH') || code.includes('CLINIC') || code.includes('HEALTH')) {
      setUser((prev) => ({
        ...prev,
        subscriptionTier: 'premium',
        insuranceCorporateProvider: `${code} Approved Subsidy (100% Covered)`
      }));
      return true;
    } else {
      setUser((prev) => ({ ...prev, fitPoints: prev.fitPoints + 300 }));
      return false;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`https://vitalpact.app/join/${user.referralCode}`);
    setCopiedReferral(true);
    playBeep('start');
    setTimeout(() => setCopiedReferral(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* Header */}
      <Header
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReferralModal={() => setShowReferralModal(true)}
        onOpenTierModal={() => setShowTierModal(true)}
      />

      {/* Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            user={user}
            foodItems={foodItems}
            bookings={bookings}
            inbodyRecords={inbodyRecords}
            onNavigate={setActiveTab}
            onQuickScan={() => setActiveTab('ai-scanner')}
          />
        )}

        {activeTab === 'ai-scanner' && (
          <AiCalorieTracker
            user={user}
            foodItems={foodItems}
            onAddFoodItem={handleAddFoodItem}
            onDeleteFoodItem={handleDeleteFoodItem}
            onUpdatePoints={handleUpdatePoints}
          />
        )}

        {activeTab === 'trainers' && (
          <TrainerMarketplace
            user={user}
            bookings={bookings}
            onAddBooking={handleAddBooking}
            onNavigateToCalendar={() => setActiveTab('calendar')}
          />
        )}

        {activeTab === 'roadmap' && (
          <ProgramBuilder
            user={user}
            roadmapWeeks={roadmapWeeks}
            onToggleTask={handleToggleTask}
            onBookAllActivities={handleBookAllActivities}
            onNavigateToCalendar={() => setActiveTab('calendar')}
          />
        )}

        {activeTab === 'workouts' && (
          <OnlineTraining
            user={user}
            onWorkoutCompleted={handleWorkoutCompleted}
          />
        )}

        {activeTab === 'inbody' && (
          <DeviceSyncInBody
            user={user}
            inbodyRecords={inbodyRecords}
            onAddInBodyRecord={handleAddInBodyRecord}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            events={calendarEvents}
            bookings={bookings}
            onAddEvent={handleAddCalendarEvent}
            onNavigateToTrainers={() => setActiveTab('trainers')}
          />
        )}

        {(activeTab === 'rewards' || activeTab === 'pricing') && (
          <RewardsMarketplace
            user={user}
            rewards={rewards}
            onRedeemReward={handleRedeemReward}
            onUpdateTier={handleUpdateTier}
            onApplyPromoCode={handleApplyPromoCode}
          />
        )}
      </main>

      {/* Bottom Sticky Utility Bar */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-slate-900">VitalPact</span>
            <span>·</span>
            <span>Built based on the Business Model Canvas specifications</span>
            <span>·</span>
            <button
              onClick={() => setShowCanvasDrawer(true)}
              className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer underline"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Canvas Requirement Matrix</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Partners: ActiveSG · Health365 · InBody · Hyrox · SaladStop!</span>
          </div>
        </div>
      </footer>

      {/* Referral Share Modal */}
      {showReferralModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-end">
              <button
                onClick={() => setShowReferralModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Share2 className="w-8 h-8 stroke-[2.2]" />
            </div>

            <h3 className="text-xl font-black text-slate-900">Refer a Friend & Earn 500 FitPoints</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Give your friends 1 month of Basic Tier free! When they scan their first meal, you receive 500 FitPoints and $15 toward SaladStop! or ActiveSG gym passes.
            </p>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-900">{user.referralCode}</span>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
              >
                {copiedReferral ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedReferral ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <button
              onClick={() => setShowReferralModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Subscription Tier Modal */}
      {showTierModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Select Subscription Tier (Canvas Page 8)</h3>
              <button onClick={() => setShowTierModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'freemium' as SubscriptionTier,
                  title: 'Freemium Tier',
                  price: '$0',
                  desc: 'Standard calorie logging, public workouts and roadshow access.'
                },
                {
                  id: 'basic' as SubscriptionTier,
                  title: 'Basic Tier',
                  price: '$10 / month',
                  desc: 'AI food photo scanner, streak freeze protection, wearable & InBody sync.'
                },
                {
                  id: 'premium' as SubscriptionTier,
                  title: 'Premium Concierge Tier',
                  price: '$100 / month',
                  desc: 'Dedicated 1-on-1 Clinical Dietitian & Hyrox Coach, unlimited clinic InBody scans.'
                }
              ].map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => handleUpdateTier(tier.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    user.subscriptionTier === tier.id
                      ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{tier.title}</span>
                      {user.subscriptionTier === tier.id && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{tier.desc}</p>
                  </div>
                  <span className="text-sm font-black text-slate-900 shrink-0 ml-3">{tier.price}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setShowTierModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Business Canvas Matrix Drawer */}
      <BusinessCanvasDrawer
        isOpen={showCanvasDrawer}
        onClose={() => setShowCanvasDrawer(false)}
        onNavigate={setActiveTab}
      />

    </div>
  );
}
