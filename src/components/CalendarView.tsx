import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Video,
  Download,
  Plus,
  Filter,
  CheckCircle2,
  Dumbbell,
  Scale,
  Users,
  Utensils,
  ExternalLink
} from 'lucide-react';
import { CalendarEvent, Booking } from '../types';
import { playBeep } from '../utils/audio';

interface CalendarViewProps {
  events: CalendarEvent[];
  bookings: Booking[];
  onAddEvent: (event: CalendarEvent) => void;
  onNavigateToTrainers: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  bookings,
  onAddEvent,
  onNavigateToTrainers
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [downloadToast, setDownloadToast] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Event Form State
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDate, setNewDate] = useState<string>('2026-10-24');
  const [newTime, setNewTime] = useState<string>('07:00 PM');
  const [newType, setNewType] = useState<CalendarEvent['type']>('workout');
  const [newDesc, setNewDesc] = useState<string>('ActiveSG Gym Routine');

  const filteredEvents = events.filter((ev) => {
    if (filterType === 'all') return true;
    return ev.type === filterType;
  });

  const handleExportICS = () => {
    // Generate clean .ics calendar format
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//VitalPact//Weight Management App//EN',
      ...events.map(
        (ev) =>
          `BEGIN:VEVENT\nSUMMARY:${ev.title}\nDESCRIPTION:${ev.description}\nDTSTART:${ev.date.replace(/-/g, '')}T090000Z\nEND:VEVENT`
      ),
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'VitalPact-Schedule.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    playBeep('reward');
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 4000);
  };

  const handleCreateEvent = () => {
    if (!newTitle.trim()) return;
    const ev: CalendarEvent = {
      id: 'cust-ev-' + Date.now(),
      title: newTitle,
      date: newDate,
      time: newTime,
      type: newType,
      description: newDesc,
      locationOrUrl: 'Personal Calendar'
    };
    onAddEvent(ev);
    setShowAddModal(false);
    setNewTitle('');
    playBeep('start');
  };

  const getEventBadge = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'workout':
        return { label: 'Workout', icon: Dumbbell, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'consultation':
        return { label: 'Consultation', icon: Users, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'inbody_scan':
        return { label: 'InBody Scan', icon: Scale, color: 'bg-teal-50 text-teal-700 border-teal-200' };
      case 'meal_prep':
        return { label: 'Nutrition', icon: Utensils, color: 'bg-amber-50 text-amber-700 border-amber-200' };
      default:
        return { label: 'Event', icon: CalendarIcon, color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {downloadToast && (
        <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-between animate-in fade-in">
          <span>✓ VitalPact-Schedule.ics downloaded! Ready to import to Apple Calendar or Google Calendar.</span>
          <button onClick={() => setDownloadToast(false)} className="underline ml-3">Dismiss</button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Integrated Schedule & Activity Bookings</h1>
            <span className="text-xs font-bold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
              Calendar Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Unified chronological schedule syncing all dietician video appointments, Hyrox training blocks, InBody milestone scans, and ActiveSG community events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportICS}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export to iCal / Google</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-xs font-bold text-slate-500 ml-2 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Filter:
        </span>
        {[
          { id: 'all', label: 'All Activities' },
          { id: 'workout', label: 'Workouts' },
          { id: 'consultation', label: 'Dietitian & Trainers' },
          { id: 'inbody_scan', label: 'InBody Scans' },
          { id: 'community_event', label: 'Community & Hyrox' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterType === tab.id
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">Upcoming Timeline ({filteredEvents.length})</h2>
          <span className="text-xs text-slate-400">Timezone: Asia/Singapore (SGT)</span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">No events found in this category.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map((ev) => {
              const badge = getEventBadge(ev.type);
              const BadgeIcon = badge.icon;

              return (
                <div
                  key={ev.id}
                  className="p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-800 shrink-0">
                      <span className="text-[10px] uppercase font-bold text-slate-400 leading-none">
                        {new Date(ev.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-base font-black leading-tight mt-0.5">
                        {new Date(ev.date).getDate() || 15}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${badge.color}`}>
                          <BadgeIcon className="w-3 h-3" />
                          {badge.label}
                        </span>
                        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {ev.time}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900">{ev.title}</h3>
                      <p className="text-xs text-slate-600">{ev.description}</p>

                      {ev.locationOrUrl && (
                        <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 pt-0.5">
                          {ev.locationOrUrl.startsWith('http') ? (
                            <>
                              <Video className="w-3 h-3" />
                              <span className="underline cursor-pointer">{ev.locationOrUrl}</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="w-3 h-3" />
                              <span>{ev.locationOrUrl}</span>
                            </>
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between gap-2 shrink-0">
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Synced
                    </span>
                    {ev.locationOrUrl?.startsWith('http') && (
                      <a
                        href={ev.locationOrUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                      >
                        <span>Join Call</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Custom Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Activity to Schedule</h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Event Title:</label>
                <input
                  type="text"
                  placeholder="e.g. ActiveSG Evening Run or InBody Check"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Date:</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Time:</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Type:</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs"
                >
                  <option value="workout">Workout Session</option>
                  <option value="consultation">Dietitian / Trainer Consult</option>
                  <option value="inbody_scan">InBody Body Fat Scan</option>
                  <option value="community_event">Community Roadshow / Hyrox</option>
                  <option value="meal_prep">Meal Prep Session</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Details & Location:</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl"
              >
                Save to Calendar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
