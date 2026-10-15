import React from 'react';
import {
  Flame,
  TrendingDown,
  Activity,
  Calendar,
  Camera,
  Dumbbell,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Apple
} from 'lucide-react';
import { UserProfile, FoodItem, Booking, InBodyRecord } from '../types';

interface DashboardViewProps {
  user: UserProfile;
  foodItems: FoodItem[];
  bookings: Booking[];
  inbodyRecords: InBodyRecord[];
  onNavigate: (tab: string) => void;
  onQuickScan: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  foodItems,
  bookings,
  inbodyRecords,
  onNavigate,
  onQuickScan
}) => {
  // Calculate today's totals
  const totalCaloriesConsumed = foodItems.reduce((acc, item) => acc + item.calories, 0);
  const totalProtein = foodItems.reduce((acc, item) => acc + item.proteinG, 0);
  const totalCarbs = foodItems.reduce((acc, item) => acc + item.carbsG, 0);
  const totalFat = foodItems.reduce((acc, item) => acc + item.fatG, 0);
  const totalFiber = foodItems.reduce((acc, item) => acc + item.fiberG, 0);

  // Synced from Apple Watch
  const activeCaloriesBurned = 540;
  const netCalories = totalCaloriesConsumed - activeCaloriesBurned;
  const remainingCalories = user.dailyCalorieBudget - totalCaloriesConsumed;

  // Weight progress
  const weightLost = (user.startingWeightKg - user.currentWeightKg).toFixed(1);
  const weightToGo = (user.currentWeightKg - user.targetWeightKg).toFixed(1);
  const progressPercent = Math.min(
    100,
    Math.round(
      ((user.startingWeightKg - user.currentWeightKg) /
        (user.startingWeightKg - user.targetWeightKg)) *
        100
    )
  );

  const nextBooking = bookings.find((b) => b.status === 'confirmed');
  const latestInbody = inbodyRecords[inbodyRecords.length - 1];

  return (
    <div className="space-y-6">
      
      {/* Welcome & Motivational Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Active Weight Management Plan · Week 2 of 12</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good morning, {user.name} 👋
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              You are <span className="font-bold text-emerald-300">{weightLost} kg</span> down towards your {user.targetWeightKg} kg goal. Your glycemic control is stable and your 19-day food logging streak is active!
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs text-slate-300 flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Medical Track: {user.medicalConditions.join(', ')}
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg border border-white/10">
                <Activity className="w-3.5 h-3.5 text-teal-400" />
                {user.insuranceCorporateProvider}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onQuickScan}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Scan Meal Photo</span>
            </button>
            <button
              onClick={() => onNavigate('roadmap')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/15 transition-all"
            >
              <span>View 12-Wk Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Calories Deficit + Streak Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calorie Deficit Gauge */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Today's Calorie Balance</h2>
              <p className="text-xs text-slate-500">Target calculated from BMR (1,765 kcal) and mild deficit</p>
            </div>
            <button
              onClick={() => onNavigate('ai-scanner')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Food Diary</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 border-y border-slate-100">
            <div>
              <p className="text-xs text-slate-500 font-medium">Daily Budget</p>
              <p className="text-xl font-extrabold text-slate-900 mt-0.5">{user.dailyCalorieBudget}</p>
              <p className="text-[11px] text-slate-400">kcal target</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Food Consumed</p>
              <p className="text-xl font-extrabold text-amber-600 mt-0.5">{totalCaloriesConsumed}</p>
              <p className="text-[11px] text-slate-400">{foodItems.length} meals logged</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Wearable Burned</p>
              <p className="text-xl font-extrabold text-emerald-600 mt-0.5">-{activeCaloriesBurned}</p>
              <p className="text-[11px] text-slate-400">Apple Watch synced</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Remaining</p>
              <p className={`text-xl font-extrabold mt-0.5 ${remainingCalories >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                {remainingCalories}
              </p>
              <p className="text-[11px] text-slate-400">kcal available</p>
            </div>
          </div>

          {/* Macro Progress Bars */}
          <div className="mt-5 space-y-3">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Macronutrient Targets</p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-600">Protein</span>
                  <span className="font-bold text-slate-900">{totalProtein}g / 130g</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (totalProtein / 130) * 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-600">Carbs (Low GI)</span>
                  <span className="font-bold text-slate-900">{totalCarbs}g / 180g</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (totalCarbs / 180) * 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-600">Healthy Fats</span>
                  <span className="font-bold text-slate-900">{totalFat}g / 55g</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (totalFat / 55) * 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-600">Dietary Fiber</span>
                  <span className="font-bold text-slate-900">{totalFiber}g / 30g</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (totalFiber / 30) * 100)}%` }} />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Duolingo-style Streak & Gamification */}
        <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100/60 rounded-2xl border border-orange-200/80 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-900">Consistency Streak</span>
              <span className="text-xs bg-orange-200/80 text-orange-800 font-bold px-2 py-0.5 rounded-full">
                x1.5 Points Active
              </span>
            </div>

            <div className="flex items-center gap-3 my-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Flame className="w-8 h-8 fill-white" />
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900">{user.streakDays} Days</div>
                <p className="text-xs text-orange-900/80 font-medium">Personal Best: 24 Days</p>
              </div>
            </div>

            <p className="text-xs text-orange-950/80 leading-relaxed">
              Log your evening meal or complete your ActiveSG routine today to keep your streak blazing and unlock 100 bonus FitPoints!
            </p>

            <div className="mt-4 p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-orange-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="font-semibold text-slate-800">Streak Freeze Protection</span>
              </div>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Armed (1/1)
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('ai-scanner')}
            className="w-full mt-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-colors shadow-xs"
          >
            Snap Dinner to Secure Streak
          </button>
        </div>

      </div>

      {/* 3-Column Highlights: InBody Biometrics, Next Appointment, Online Training */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* InBody Scan Quick Stat */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">InBody Composition</h3>
                  <p className="text-[11px] text-slate-400">Scanned at {latestInbody?.scanLocation}</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('inbody')}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                Full Scan
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Body Fat %:</span>
                <span className="font-bold text-slate-900">{latestInbody?.bodyFatPercentage}% <span className="text-emerald-600 text-[11px]">(-4.6%)</span></span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Skeletal Muscle Mass:</span>
                <span className="font-bold text-slate-900">{latestInbody?.skeletalMuscleMassKg} kg <span className="text-emerald-600 text-[11px]">(+0.9kg)</span></span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Visceral Fat Level:</span>
                <span className="font-bold text-slate-900">Level {latestInbody?.visceralFatLevel} <span className="text-emerald-600 text-[11px]">(Safe &lt; 9)</span></span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Next InBody Scan:</span>
            <span className="font-semibold text-slate-800">Oct 25 (ActiveSG Orchard)</span>
          </div>
        </div>

        {/* Next Trainer / Dietitian Consult */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Next Consultation</h3>
                  <p className="text-[11px] text-slate-400">Online Dietitian Check-in</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('trainers')}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                Manage
              </button>
            </div>

            {nextBooking ? (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center gap-2.5">
                  <img
                    src={nextBooking.trainerAvatar}
                    alt={nextBooking.trainerName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{nextBooking.trainerName}</p>
                    <p className="text-[11px] text-slate-500">{nextBooking.trainerRole}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-1.5 pt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium">{nextBooking.date} · {nextBooking.timeSlot}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No active bookings. Book a certified dietitian or Hyrox coach!</p>
            )}
          </div>

          <button
            onClick={() => onNavigate('trainers')}
            className="w-full mt-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            Open Trainer Engagement Chat
          </button>
        </div>

        {/* Guided Workout Spotlight */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recommended Workout</h3>
                  <p className="text-[11px] text-slate-400">Hyrox Official Routine</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('workouts')}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                Browse All
              </button>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-bold text-slate-900">Hyrox Engine & Sled Push Conditioning</p>
              <p className="text-xs text-slate-500">35 mins · 380 kcal · Kettlebells & Cardio Lung Work</p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Earns +60 FitPoints upon finish</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('workouts')}
            className="w-full mt-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs"
          >
            Launch Interactive Timer
          </button>
        </div>

      </div>

    </div>
  );
};
