import React, { useState, useEffect } from 'react';
import {
  Dumbbell,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle,
  Flame,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  Award,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WorkoutRoutine, WorkoutExercise, UserProfile } from '../types';
import { WORKOUT_ROUTINES } from '../data/initialData';
import { playBeep } from '../utils/audio';

interface OnlineTrainingProps {
  user: UserProfile;
  onWorkoutCompleted: (routine: WorkoutRoutine) => void;
}

export const OnlineTraining: React.FC<OnlineTrainingProps> = ({
  user,
  onWorkoutCompleted
}) => {
  const [selectedRoutine, setSelectedRoutine] = useState<WorkoutRoutine>(WORKOUT_ROUTINES[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(45);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [completedWorkoutModal, setCompletedWorkoutModal] = useState<boolean>(false);

  // Timer interval effect
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 4 && prev > 1 && soundEnabled) {
            playBeep('short');
          } else if (prev === 1 && soundEnabled) {
            playBeep('start');
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerSeconds === 0 && isPlaying) {
      // Advance to next exercise or finish
      if (currentExerciseIdx < selectedRoutine.exercises.length - 1) {
        setCurrentExerciseIdx((prev) => prev + 1);
        setTimerSeconds(45);
        if (soundEnabled) playBeep('start');
      } else {
        // Complete routine
        setIsPlaying(false);
        setCompletedWorkoutModal(true);
        onWorkoutCompleted(selectedRoutine);
        if (soundEnabled) playBeep('complete');
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }

    return () => clearInterval(interval);
  }, [isPlaying, timerSeconds, currentExerciseIdx, selectedRoutine, soundEnabled]);

  const handleStartWorkout = (routine: WorkoutRoutine) => {
    setSelectedRoutine(routine);
    setCurrentExerciseIdx(0);
    setTimerSeconds(45);
    setIsPlaying(true);
    if (soundEnabled) playBeep('start');
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    if (soundEnabled) playBeep('short');
  };

  const handleResetTimer = () => {
    setIsPlaying(false);
    setTimerSeconds(45);
  };

  const handleNextExercise = () => {
    if (currentExerciseIdx < selectedRoutine.exercises.length - 1) {
      setCurrentExerciseIdx((prev) => prev + 1);
      setTimerSeconds(45);
      if (soundEnabled) playBeep('short');
    }
  };

  const currentExercise: WorkoutExercise = selectedRoutine.exercises[currentExerciseIdx] || selectedRoutine.exercises[0];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Online Training & Guided Workouts</h1>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
              Interactive Timer
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Conditioning protocols tailored for weight loss, Hyrox functional strength, and gentle glycemic control for pre-diabetes. Follow real-time interval timers with audio cues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span>{soundEnabled ? 'Audio Cues On' : 'Muted'}</span>
          </button>
        </div>
      </div>

      {/* Active Workout Player Widget */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* Left: Active Exercise Info */}
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <span>{selectedRoutine.title}</span>
              <span>·</span>
              <span>Exercise {currentExerciseIdx + 1} of {selectedRoutine.exercises.length}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {currentExercise.name}
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg text-slate-300">
                Target: <span className="text-white font-bold">{currentExercise.targetMuscle}</span>
              </span>
              <span className="text-xs bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg text-slate-300">
                Scheme: <span className="text-emerald-400 font-bold">{currentExercise.repsOrDuration}</span>
              </span>
              <span className="text-xs bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg text-slate-300">
                {currentExercise.sets} Sets
              </span>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-white block mb-0.5">Trainer Cue:</span>
              {currentExercise.instruction}
            </div>
          </div>

          {/* Right: Timer Clock & Interactive Controls */}
          <div className="flex flex-col items-center justify-center bg-slate-900/90 p-6 rounded-2xl border border-slate-700/60 min-w-72">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Circular progress SVG */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  className="text-slate-800"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  className="text-emerald-500 transition-all duration-1000 ease-linear"
                  strokeWidth="8"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * (45 - timerSeconds)) / 45}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-black tracking-tight text-white font-mono">
                  00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-1">
                  {isPlaying ? 'Interval Active' : 'Paused'}
                </span>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleResetTimer}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleTogglePlay}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
                <span>{isPlaying ? 'Pause' : 'Start Interval'}</span>
              </button>

              <button
                onClick={handleNextExercise}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                title="Next exercise"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Routine Catalog */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Programmed Routines</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WORKOUT_ROUTINES.map((routine) => (
            <div
              key={routine.id}
              className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between shadow-xs ${
                selectedRoutine.id === routine.id ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={routine.thumbnail}
                    alt={routine.title}
                    className="w-full h-full object-cover"
                  />
                  {routine.partnerBadge && (
                    <span className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur-xs text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/10">
                      {routine.partnerBadge}
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded-md">
                    {routine.durationMin} mins
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{routine.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span className="font-semibold text-emerald-600">~{routine.caloriesBurned} kcal</span>
                    <span>·</span>
                    <span>{routine.difficulty}</span>
                    <span>·</span>
                    <span>{routine.equipment}</span>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {routine.exercises.map((ex, i) => (
                    <div key={i} className="py-1.5 flex justify-between text-slate-600">
                      <span>{ex.name}</span>
                      <span className="font-semibold text-slate-900">{ex.repsOrDuration}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleStartWorkout(routine)}
                className="w-full mt-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start This Session</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Completion Modal */}
      {completedWorkoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <Award className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-black text-slate-900">Workout Completed!</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Incredible work, {user.name}! You finished <span className="font-bold text-slate-900">{selectedRoutine.title}</span> and burned approximately <span className="font-bold text-emerald-600">~{selectedRoutine.caloriesBurned} kcal</span>.
            </p>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-bold flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>+60 FitPoints Awarded to your Balance</span>
            </div>

            <button
              onClick={() => setCompletedWorkoutModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs"
            >
              Awesome, Return to Dashboard
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
