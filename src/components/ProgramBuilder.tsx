import React, { useState } from 'react';
import {
  Compass,
  Target,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Dumbbell,
  Scale,
  Utensils,
  Award,
  ChevronRight,
  Clock,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, RoadmapWeek, CalendarEvent } from '../types';
import { ROADMAP_WEEKS } from '../data/initialData';
import { playBeep } from '../utils/audio';

interface ProgramBuilderProps {
  user: UserProfile;
  roadmapWeeks: RoadmapWeek[];
  onToggleTask: (weekNum: number, taskId: string) => void;
  onBookAllActivities: (newEvents: CalendarEvent[]) => void;
  onNavigateToCalendar: () => void;
}

export const ProgramBuilder: React.FC<ProgramBuilderProps> = ({
  user,
  roadmapWeeks,
  onToggleTask,
  onBookAllActivities,
  onNavigateToCalendar
}) => {
  // Wizard customization state
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  const [age, setAge] = useState<number>(user.age);
  const [targetWeight, setTargetWeight] = useState<number>(user.targetWeightKg);
  const [condition, setCondition] = useState<string>('Pre-diabetes');
  const [focusGoal, setFocusGoal] = useState<string>('sustainable_fat_loss');
  const [bookedStatus, setBookedStatus] = useState<boolean>(false);

  const handleTaskClick = (weekNum: number, taskId: string) => {
    onToggleTask(weekNum, taskId);
    playBeep('reward');
  };

  const handleBookAllToCalendar = () => {
    const upcomingEvents: CalendarEvent[] = [
      {
        id: 'auto-ev-1',
        title: 'Roadmap Milestone: Week 3 InBody Body Fat Scan',
        date: '2026-10-21',
        time: '09:30 AM',
        type: 'inbody_scan',
        description: 'Track visceral fat & lean muscle mass retention',
        locationOrUrl: 'ActiveSG Bishan Diagnostic Hub'
      },
      {
        id: 'auto-ev-2',
        title: 'Roadmap Session: Hyrox Engine & Sled Workout',
        date: '2026-10-23',
        time: '06:30 PM',
        type: 'workout',
        description: 'Guided functional conditioning circuit with Marcus',
        locationOrUrl: 'ActiveSG Stadium Gym'
      },
      {
        id: 'auto-ev-3',
        title: 'Dietitian Review: Glycemic Response & Carb Swaps',
        date: '2026-10-26',
        time: '02:00 PM',
        type: 'consultation',
        description: 'Online dietary consultation with Cheryl Lim (RD)',
        locationOrUrl: 'https://vitalpact.meet/session/cheryl-alex'
      }
    ];

    onBookAllActivities(upcomingEvents);
    setBookedStatus(true);
    playBeep('complete');

    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">End-to-End Weight Management Roadmap</h1>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              Personalized 12-Week Protocol
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Designed according to your metabolic requirements, age (18-70), and athletic goals. Book all corresponding workouts, dietician consults, and InBody scans straight to your schedule.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isCustomizing ? 'Close Customizer' : 'Recalibrate Goals'}</span>
          </button>

          <button
            onClick={handleBookAllToCalendar}
            disabled={bookedStatus}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              bookedStatus
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 hover:scale-[1.01] cursor-pointer'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{bookedStatus ? '✓ All Activities Booked' : 'Book All Necessary Activities'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Recalibrate Wizard (Canvas: 18-70 y/o, diabetes/medical needs, weight loss) */}
      {isCustomizing && (
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 space-y-4 animate-in fade-in duration-200">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              Adjust Diagnostic Parameters (Segments: 18-70 yrs, Medical needs, Fitness)
            </h3>
            <span className="text-xs text-slate-400">Updates nutritional deficit & workout intensity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Age (18-70 years):</label>
              <input
                type="number"
                min="18"
                max="70"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 30)}
                className="w-full px-3 py-2 bg-slate-800 rounded-lg border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Target Weight (kg):</label>
              <input
                type="number"
                step="0.5"
                value={targetWeight}
                onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 70)}
                className="w-full px-3 py-2 bg-slate-800 rounded-lg border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Medical Condition:</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 rounded-lg border border-slate-700 text-xs text-white"
              >
                <option value="None">None (General Fitness)</option>
                <option value="Pre-diabetes">Pre-diabetes / Insulin Resistant</option>
                <option value="Type 2 Diabetes">Type 2 Diabetes (Glycemic Focused)</option>
                <option value="Hypertension">Mild Hypertension</option>
                <option value="Joint Sensitivity">Knee / Joint Sensitivity</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Primary Discipline:</label>
              <select
                value={focusGoal}
                onChange={(e) => setFocusGoal(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 rounded-lg border border-slate-700 text-xs text-white"
              >
                <option value="sustainable_fat_loss">Sustainable Fat Loss (ActiveSG)</option>
                <option value="hyrox_prep">Hyrox Conditioning & Strength</option>
                <option value="metabolic_health">Metabolic Health & Glucose Stabilization</option>
                <option value="rapid_weight_loss">Calorie Deficit Push</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                setIsCustomizing(false);
                playBeep('start');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
            >
              Apply Diagnostic Algorithm
            </button>
          </div>
        </div>
      )}

      {/* Program Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
            <Scale className="w-4 h-4 text-emerald-600" />
            <span>Target Weight Loss</span>
          </div>
          <p className="text-xl font-extrabold text-slate-900 mt-1">
            -{(user.startingWeightKg - targetWeight).toFixed(1)} kg
          </p>
          <p className="text-[11px] text-slate-400">Current: {user.currentWeightKg}kg · Target: {targetWeight}kg</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
            <Utensils className="w-4 h-4 text-blue-600" />
            <span>Daily Intake Budget</span>
          </div>
          <p className="text-xl font-extrabold text-slate-900 mt-1">1,800 kcal</p>
          <p className="text-[11px] text-slate-400">Low-GI carb cap: 180g / day</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
            <Dumbbell className="w-4 h-4 text-amber-600" />
            <span>Weekly Workouts</span>
          </div>
          <p className="text-xl font-extrabold text-slate-900 mt-1">3 Sessions / Wk</p>
          <p className="text-[11px] text-slate-400">Hyrox strength & low-impact cardio</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Ecosystem Partners</span>
          </div>
          <p className="text-xl font-extrabold text-slate-900 mt-1">ActiveSG · InBody</p>
          <p className="text-[11px] text-slate-400">Health365 + SaladStop! subsidies</p>
        </div>
      </div>

      {/* 12-Week Interactive Roadmap Phases */}
      <div className="space-y-4">
        {roadmapWeeks.map((week) => (
          <div
            key={week.weekNumber}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Week {week.weekNumber} of 12
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{week.phaseTitle}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{week.focus}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-500">Phase Deficit</p>
                  <p className="text-xs font-bold text-slate-900">{week.dailyCalorieTarget} kcal / day</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-500">Target Loss</p>
                  <p className="text-xs font-bold text-emerald-600">-{week.targetLossKg} kg</p>
                </div>
              </div>
            </div>

            {/* Task Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {week.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(week.weekNumber, task.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    task.completed
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-900'
                      : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                      task.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}>
                      {task.completed && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {task.title}
                      </p>
                      <span className="text-[10px] text-slate-400 uppercase font-medium">{task.category}</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-600">
                    {task.completed ? 'Done' : '+25 pts'}
                  </span>
                </div>
              ))}
            </div>

            {/* Bookable Activities Strip */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Includes: 1x InBody scan, 1x Clinical Dietitian review, 2x Hyrox conditioning sessions
              </span>
              <button
                onClick={onNavigateToCalendar}
                className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
              >
                <span>View Booked Schedule</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
