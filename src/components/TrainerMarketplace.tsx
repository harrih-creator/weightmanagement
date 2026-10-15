import React, { useState } from 'react';
import {
  Users,
  Search,
  Star,
  DollarSign,
  Calendar,
  Clock,
  ShieldCheck,
  Award,
  MessageSquare,
  Check,
  X,
  Volume2,
  Send,
  Video,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Trainer, Booking, Message, UserProfile } from '../types';
import { TRAINERS_LIST, INITIAL_MESSAGES } from '../data/initialData';
import { playBeep } from '../utils/audio';

interface TrainerMarketplaceProps {
  user: UserProfile;
  bookings: Booking[];
  onAddBooking: (booking: Booking) => void;
  onNavigateToCalendar: () => void;
}

export const TrainerMarketplace: React.FC<TrainerMarketplaceProps> = ({
  user,
  bookings,
  onAddBooking,
  onNavigateToCalendar
}) => {
  // Filter state
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Booking modal state
  const [selectedTrainerForBooking, setSelectedTrainerForBooking] = useState<Trainer | null>(null);
  const [bookingDate, setBookingDate] = useState<string>('2026-10-20');
  const [bookingSlot, setBookingSlot] = useState<string>('09:00 AM');
  const [bookingSessionType, setBookingSessionType] = useState<Booking['sessionType']>('1-on-1 Online Consultation');
  const [bookingSuccessModal, setBookingSuccessModal] = useState<Booking | null>(null);

  // Engagement / Chat state
  const [activeChatTrainer, setActiveChatTrainer] = useState<Trainer | null>(TRAINERS_LIST[0]);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Filter trainers
  const specialties = [
    'All',
    'Weight Loss',
    'Diabetes & Medical',
    'Hyrox & Endurance',
    'Clinical Nutrition',
    'Senior Mobility'
  ];

  const filteredTrainers = TRAINERS_LIST.filter((trainer) => {
    const matchesPrice = trainer.hourlyRate <= maxPrice;
    const matchesSpecialty =
      selectedSpecialty === 'All' ||
      trainer.specialties.includes(selectedSpecialty as any);
    const matchesSearch =
      trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trainer.partnerAffiliation && trainer.partnerAffiliation.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesPrice && matchesSpecialty && matchesSearch;
  });

  // Handle booking confirm
  const handleConfirmBooking = () => {
    if (!selectedTrainerForBooking) return;

    const newBooking: Booking = {
      id: 'bk-' + Date.now(),
      trainerId: selectedTrainerForBooking.id,
      trainerName: selectedTrainerForBooking.name,
      trainerRole: selectedTrainerForBooking.role,
      trainerAvatar: selectedTrainerForBooking.avatar,
      sessionType: bookingSessionType,
      date: new Date(bookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timeSlot: `${bookingSlot} - 45 mins`,
      cost: selectedTrainerForBooking.hourlyRate,
      status: 'confirmed',
      meetingLink: `https://vitalpact.meet/session/${selectedTrainerForBooking.id}`,
      calendarSynced: true
    };

    onAddBooking(newBooking);
    setSelectedTrainerForBooking(null);
    setBookingSuccessModal(newBooking);
    playBeep('complete');

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Handle send message
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !activeChatTrainer) return;

    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      trainerId: activeChatTrainer.id,
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    playBeep('short');

    // Simulate instant trainer response
    setTimeout(() => {
      const trainerReply: Message = {
        id: 'msg-reply-' + Date.now(),
        sender: 'trainer',
        trainerId: activeChatTrainer.id,
        text: `Got your update Alex! Let's review this in our upcoming session. Remember to hydrate and keep your carbs complex. You're doing amazing!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, trainerReply]);
      playBeep('start');
    }, 1500);
  };

  const handlePlayVoiceMemo = () => {
    setIsPlayingAudio(true);
    playBeep('start');
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Find & Book Suitable Trainers & Dietitians</h1>
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              Verified Partners
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Filter by price, medical specialty (diabetes, hypertension), or athletic conditioning (Hyrox). Engage online via direct messaging, voice coaching, and calendar-integrated video calls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const el = document.getElementById('trainer-chat-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Online Trainer Chat ({messages.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar (Filtered by Price & Specialty from Canvas Page 3) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Search box (5 cols) */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, 'Hyrox', 'ActiveSG', 'Diabetes'..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          {/* Price Range Slider (4 cols) - Requirement: "Filtered by price" */}
          <div className="md:col-span-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                Max Hourly Rate:
              </span>
              <span className="font-extrabold text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                ${maxPrice} / hr
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="120"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>$30/hr</span>
              <span>$75/hr</span>
              <span>$120/hr</span>
            </div>
          </div>

          {/* Result Count (3 cols) */}
          <div className="md:col-span-3 text-right">
            <p className="text-xs font-semibold text-slate-600">
              Showing <span className="font-bold text-slate-900">{filteredTrainers.length}</span> certified specialists
            </p>
          </div>

        </div>

        {/* Specialty Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 no-scrollbar">
          <span className="text-xs font-bold text-slate-500 mr-2 shrink-0">Specialty:</span>
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedSpecialty === spec
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Trainers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTrainers.map((trainer) => (
          <div
            key={trainer.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div className="space-y-4">
              {/* Header: Photo, Name, Rate */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={trainer.avatar}
                    alt={trainer.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold text-slate-900">{trainer.name}</h3>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-xs font-semibold text-slate-600">{trainer.role}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-900">{trainer.rating}</span>
                      <span className="text-slate-400">({trainer.reviewCount} reviews)</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500 font-medium">{trainer.experienceYears}y exp</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-black text-slate-900">${trainer.hourlyRate}</div>
                  <span className="text-[11px] text-slate-400 font-medium">/ 45-min session</span>
                </div>
              </div>

              {/* Partner Badge */}
              {trainer.partnerAffiliation && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{trainer.partnerAffiliation}</span>
                </div>
              )}

              {/* Bio */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {trainer.bio}
              </p>

              {/* Specialties tags */}
              <div className="flex flex-wrap gap-1.5">
                {trainer.specialties.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Certifications snippet */}
              <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-3">
                <span className="font-bold text-slate-700">Credentials: </span>
                {trainer.certifications.join(' · ')}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveChatTrainer(trainer);
                  const el = document.getElementById('trainer-chat-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                <span>Message</span>
              </button>

              <button
                onClick={() => setSelectedTrainerForBooking(trainer)}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all hover:scale-[1.01] cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Session (${trainer.hourlyRate})</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Online Engagement & Trainer Chat Section (Canvas Page 3 Requirement) */}
      <div id="trainer-chat-section" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-3">
            <img
              src={activeChatTrainer?.avatar}
              alt={activeChatTrainer?.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{activeChatTrainer?.name}</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[11px] text-emerald-700 font-semibold">Online</span>
              </div>
              <p className="text-xs text-slate-500">{activeChatTrainer?.role} · {activeChatTrainer?.partnerAffiliation}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedTrainerForBooking(activeChatTrainer)}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5"
            >
              <Video className="w-3.5 h-3.5 text-emerald-600" />
              <span>Schedule Video Consult</span>
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="my-4 space-y-3 max-h-80 overflow-y-auto p-3 bg-slate-50 rounded-xl border border-slate-100">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-md rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-bl-xs'
                }`}
              >
                {msg.text}

                {/* Voice Note Player */}
                {msg.hasAudio && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={handlePlayVoiceMemo}
                      className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-full transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-semibold text-slate-700">
                      Voice Note ({msg.audioDuration})
                    </span>
                    {isPlayingAudio && (
                      <span className="text-[10px] text-emerald-600 font-mono animate-pulse">Playing feedback...</span>
                    )}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Ask ${activeChatTrainer?.name} about meal swaps, form adjustments, or Hyrox pacing...`}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
          <button
            onClick={handleSendMessage}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedTrainerForBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Book Session with {selectedTrainerForBooking.name}</h3>
              <button
                onClick={() => setSelectedTrainerForBooking(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <img
                src={selectedTrainerForBooking.avatar}
                alt={selectedTrainerForBooking.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">{selectedTrainerForBooking.name}</p>
                <p className="text-[11px] text-slate-500">{selectedTrainerForBooking.role}</p>
                <p className="text-xs font-bold text-emerald-700 mt-0.5">${selectedTrainerForBooking.hourlyRate} / session</p>
              </div>
            </div>

            {/* Session Type */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Consultation Format:</label>
              <select
                value={bookingSessionType}
                onChange={(e) => setBookingSessionType(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              >
                <option value="1-on-1 Online Consultation">1-on-1 Online Consultation (Encrypted Video)</option>
                <option value="Dietary Review & Meal Planning">Dietary Review & Glycemic Meal Planning</option>
                <option value="Personal Workout Session">In-Person Gym Session (ActiveSG / Anytime Fitness)</option>
                <option value="Form Check & Hyrox Prep">Form Check & Hyrox Functional Pacing</option>
              </select>
            </div>

            {/* Date & Time Picker */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Date:</label>
                <input
                  type="date"
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Available Time Slot:</label>
                <select
                  value={bookingSlot}
                  onChange={(e) => setBookingSlot(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  {selectedTrainerForBooking.availableSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calendar Integration Checkbox */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Session will be synchronized automatically to your app Calendar & Google/Apple Calendar.</span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedTrainerForBooking(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
              >
                Confirm & Pay (${selectedTrainerForBooking.hourlyRate})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Confirmed Toast / Success Modal */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Session Confirmed & Synced!</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your appointment with <span className="font-bold text-slate-900">{bookingSuccessModal.trainerName}</span> is confirmed for{' '}
              <span className="font-bold text-emerald-700">{bookingSuccessModal.date} at {bookingSuccessModal.timeSlot}</span>.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
              Meeting link generated: <span className="font-mono text-emerald-600 font-bold">{bookingSuccessModal.meetingLink}</span>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setBookingSuccessModal(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  setBookingSuccessModal(null);
                  onNavigateToCalendar();
                }}
                className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500"
              >
                View on Calendar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
