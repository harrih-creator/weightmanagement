import React, { useState } from 'react';
import {
  Gift,
  Coins,
  Share2,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Flame,
  Award,
  CreditCard,
  Building2,
  Percent,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RewardItem, UserProfile, SubscriptionTier } from '../types';
import { REWARDS_CATALOG } from '../data/initialData';
import { playBeep } from '../utils/audio';

interface RewardsMarketplaceProps {
  user: UserProfile;
  rewards: RewardItem[];
  onRedeemReward: (reward: RewardItem) => void;
  onUpdateTier: (tier: SubscriptionTier) => void;
  onApplyPromoCode: (code: string) => boolean;
}

export const RewardsMarketplace: React.FC<RewardsMarketplaceProps> = ({
  user,
  rewards,
  onRedeemReward,
  onUpdateTier,
  onApplyPromoCode
}) => {
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [claimedVouchers, setClaimedVouchers] = useState<Record<string, string>>({
    'rew-1': 'SALAD-VITAL-9842'
  });
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [promoInput, setPromoInput] = useState<string>('');
  const [promoSuccessMsg, setPromoSuccessMsg] = useState<string | null>(null);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://vitalpact.app/join/${user.referralCode}`);
    setCopiedCode(true);
    playBeep('start');
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleConfirmRedeem = (item: RewardItem) => {
    if (user.fitPoints < item.pointsRequired) {
      alert("You need more FitPoints to redeem this perk! Log meals and complete workouts to earn more.");
      return;
    }

    const generatedCode = `${item.partnerName.slice(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setClaimedVouchers((prev) => ({ ...prev, [item.id]: generatedCode }));
    onRedeemReward(item);
    setSelectedReward(null);
    playBeep('complete');

    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 }
    });
  };

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const success = onApplyPromoCode(promoInput.trim().toUpperCase());
    if (success) {
      setPromoSuccessMsg(`Hospital / Insurance subsidy applied: 100% covered by ${promoInput.toUpperCase()}`);
      setPromoInput('');
      playBeep('reward');
    } else {
      setPromoSuccessMsg("Code applied! Added 300 bonus FitPoints to your balance.");
      setPromoInput('');
      playBeep('start');
    }
    setTimeout(() => setPromoSuccessMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Points Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Gift className="w-4 h-4" />
              <span>Partner Rewards & Incentives Ecosystem</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Earn Rewards For Hitting Weight Goals
            </h1>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Every meal logged, InBody weigh-in, and workout completed earns FitPoints. Redeem directly for healthy F&B discounts (SaladStop!, Grain), ActiveSG gym access, and Hyrox race entries.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 text-center min-w-56">
            <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Your FitPoints Balance</span>
            <div className="text-3xl font-black text-emerald-400 my-1 flex items-center justify-center gap-2">
              <Coins className="w-7 h-7 text-emerald-400" />
              <span>{user.fitPoints.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Active Streak: <span className="font-bold text-orange-400">{user.streakDays} Days</span> (x1.5 bonus)
            </p>
          </div>
        </div>
      </div>

      {/* Refer a Friend Hero Card (Canvas Page 4 Requirement) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Viral Community Referral
            </span>
            <span className="text-xs text-slate-500">· {user.referredCount} friends joined</span>
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Invite a Friend, Both Get +500 FitPoints & $15 Healthy Meal Credit!
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Share your unique referral link with coworkers, gym buddies, or family. When they register and log their first meal with the AI Calorie Scanner, both of you unlock rewards.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="px-3.5 py-2.5 bg-slate-100 rounded-xl font-mono text-xs font-bold text-slate-800 border border-slate-200">
            {user.referralCode}
          </div>
          <button
            onClick={handleCopyReferral}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCode ? 'Link Copied!' : 'Copy Invite Link'}</span>
          </button>
        </div>
      </div>

      {/* Rewards Catalog Grid (Canvas Page 1 & 8: Gyms, Healthy F&B, Hyrox, InBody) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Redeem Partner Perks</h2>
          <span className="text-xs text-slate-500">Sponsored by Singapore Health Ecosystem Partners</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REWARDS_CATALOG.map((item) => {
            const isClaimed = Boolean(claimedVouchers[item.id]);
            const canAfford = user.fitPoints >= item.pointsRequired;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="relative aspect-16/9 bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-slate-900/85 backdrop-blur-xs text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    <span className="absolute bottom-2 right-2 bg-white/95 text-slate-900 font-bold text-xs px-2 py-0.5 rounded-md shadow-xs">
                      Value: {item.retailValue}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{item.partnerName}</p>
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-snug">{item.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  {isClaimed ? (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-1">
                      <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Voucher Claimed</span>
                      <p className="font-mono text-xs font-black text-emerald-950">{claimedVouchers[item.id]}</p>
                      <p className="text-[10px] text-slate-500">Show this code at counter or checkout</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                        <Coins className="w-4 h-4 text-emerald-600" />
                        <span>{item.pointsRequired} pts</span>
                      </div>

                      <button
                        onClick={() => setSelectedReward(item)}
                        disabled={!canAfford}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          canAfford
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs cursor-pointer'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? 'Redeem Voucher' : 'Need More Points'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subscription Tier Comparison (Canvas Page 8: Freemium 2M, Basic $10/mth, Premium $100/mth, Break even 1y, Profitable 3y) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Subscription Economics & Plans
          </span>
          <h2 className="text-xl font-black text-slate-900">Choose Your Weight Management Tier</h2>
          <p className="text-xs text-slate-500">
            Flexible plans designed for individuals, corporate wellness subsidies, and clinical diabetes referrals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Freemium Tier */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Freemium Tier</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">$0</span>
                <span className="text-xs text-slate-500">/ forever</span>
              </div>
              <p className="text-xs text-slate-600">Standard tracking for general health-conscious individuals.</p>

              <div className="space-y-2 pt-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Manual calorie and food diary</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Basic workout library</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Community roadshow access</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onUpdateTier('freemium')}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors ${
                user.subscriptionTier === 'freemium'
                  ? 'bg-slate-300 text-slate-700 cursor-default'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
              }`}
            >
              {user.subscriptionTier === 'freemium' ? 'Current Plan' : 'Select Freemium'}
            </button>
          </div>

          {/* Basic Tier ($10/mo) */}
          <div className="p-6 rounded-2xl border-2 border-emerald-500 bg-white shadow-md flex flex-col justify-between space-y-4 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full shadow-sm">
              Most Popular
            </span>

            <div className="space-y-3">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Basic Tier</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">$10</span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>
              <p className="text-xs text-slate-600">AI-driven photo calorie recognition and automated wearable integration.</p>

              <div className="space-y-2 pt-3 text-xs">
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>AI Calorie Photo Scanner & GI rating</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Duolingo-style streak freeze protection</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Apple Watch & ActiveSG bi-directional sync</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Personalized 12-week roadmap builder</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onUpdateTier('basic')}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                user.subscriptionTier === 'basic'
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {user.subscriptionTier === 'basic' ? 'Active Plan ($10/mo)' : 'Upgrade to Basic ($10/mo)'}
            </button>
          </div>

          {/* Premium Tier ($100/mo) */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-900 to-slate-950 text-white flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Premium Tier</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">$100</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <p className="text-xs text-slate-300">End-to-end clinical concierge, dedicated dietitian & Hyrox coach.</p>

              <div className="space-y-2 pt-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>1-on-1 Dedicated Clinical Dietitian (Chat + Voice)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Hyrox Master Coach session bookings</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Unlimited InBody Clinical Segmental scans</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Full corporate & medical insurance claimable</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onUpdateTier('premium')}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                user.subscriptionTier === 'premium'
                  ? 'bg-amber-400 text-slate-950 cursor-default'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
              }`}
            >
              {user.subscriptionTier === 'premium' ? 'Active Premium Concierge' : 'Upgrade to Premium ($100/mo)'}
            </button>
          </div>

        </div>

        {/* Corporate / Clinic Subsidy Code Form (Canvas Page 5) */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>Have a referral code from a hospital, diabetes clinic, or corporate insurance?</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. AIA-VITALITY or SGH-DIABETES"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase font-mono"
            />
            <button
              onClick={handleApplyPromo}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Apply Code
            </button>
          </div>
        </div>

        {promoSuccessMsg && (
          <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold text-center">
            {promoSuccessMsg}
          </div>
        )}

      </div>

      {/* Redemption Confirm Modal */}
      {selectedReward && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Gift className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Confirm Perk Redemption</h3>
            <p className="text-xs text-slate-600">
              Redeem <span className="font-bold text-slate-900">{selectedReward.title}</span> for{' '}
              <span className="font-bold text-emerald-600">{selectedReward.pointsRequired} FitPoints</span>?
            </p>
            <p className="text-[11px] text-slate-400">
              Your points balance will update from {user.fitPoints} to {user.fitPoints - selectedReward.pointsRequired} pts.
            </p>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedReward(null)}
                className="flex-1 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmRedeem(selectedReward)}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Confirm Redemption
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
