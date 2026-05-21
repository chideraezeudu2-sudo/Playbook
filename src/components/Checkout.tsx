import React, { useState } from 'react';
import { UserPlan } from '../types';
import { Check, ArrowRight, Lock, Sparkles, Zap, ShieldCheck, Target, Award } from 'lucide-react';

interface CheckoutProps {
  currentPlan: UserPlan;
  onPaymentSuccess: (finalPlan: UserPlan) => void;
  onNavigateHome: () => void;
}

export default function Checkout({ currentPlan, onPaymentSuccess, onNavigateHome }: CheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activatedPlan, setActivatedPlan] = useState<UserPlan | null>(null);

  const handleSelectPlan = (plan: UserPlan) => {
    setActivatedPlan(plan);
    setIsProcessing(true);

    // Simulate instant secure database update after selection
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      
      setTimeout(() => {
        onPaymentSuccess(plan);
      }, 1500);
    }, 1800);
  };

  const basicPerks = [
    "Russell Brunson's Lead Magnet Builder",
    "Alex Hormozi's Dream 100 Partner Finder",
    "GaryVee's 4-Part Email Nurture Sequence",
    "Up to 20 custom AI generations per tool",
    "Copy/paste ready layout structures",
    "Standard platform support email access"
  ];

  const proPerks = [
    "Everything included in Basic package",
    "Justin Welsh's LinkedIn Repurposing Engine",
    "Perry Marshall's 80/20 Partner Scorecard",
    "Ryan Deiss's Tripwire Upsell Offer Wizard",
    "Generous 100 generations per tool limit",
    "Priority fast-track creator support channel"
  ];

  return (
    <div className="min-h-screen bg-[#f7f6f5] py-12 px-6 flex flex-col justify-between selection:bg-[#edfc47] text-black font-sans">
      
      {/* Navigation Header */}
      <div className="text-center max-w-5xl mx-auto w-full mb-10 flex justify-between items-center pb-6 border-b border-[#cccccc]/40">
        <div 
          onClick={onNavigateHome}
          className="font-roobert font-extrabold text-2xl tracking-tight cursor-pointer inline-flex items-center gap-1.5 text-black"
        >
          <span>Playbook</span>
          <span className="w-2 rounded-full h-2 bg-[#edfc47] border border-black" />
        </div>
        <div className="text-xs font-semibold text-[#4d4d4d] flex items-center gap-1.5 font-mono">
          <Lock className="w-3.5 h-3.5" /> SECURE INSTANT ACTIVATION
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col justify-center">
        
        {success ? (
          <div className="bg-white border border-[#cccccc] rounded-[10px] p-12 text-center max-w-md mx-auto shadow-sm w-full">
            <div className="w-16 h-16 rounded-full bg-[#edfc47] border-2 border-black flex items-center justify-center text-black mb-6 mx-auto animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="text-2xl font-roobert font-extrabold text-black mb-3">
              {activatedPlan} Activated!
            </h3>
            <p className="text-sm text-[#4d4d4d] leading-relaxed">
              Your marketing profile has been updated. Provisioning your strategic toolkits and custom blueprints...
            </p>
          </div>
        ) : isProcessing ? (
          <div className="bg-white border border-[#cccccc] rounded-[10px] p-12 text-center max-w-md mx-auto shadow-sm w-full">
            <div className="w-12 h-12 border-4 border-black border-t-[#edfc47] rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-lg font-roobert font-bold text-black mb-2">
              Configuring Your Space...
            </h3>
            <p className="text-xs text-[#4d4d4d]">
              Locking in your {activatedPlan} resources. No credentials required of third-party systems.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="bg-[#edfc47] text-black text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-black/10">
                Pick Your Focus Grid
              </span>
              <h1 className="text-3xl md:text-4xl font-roobert font-extrabold tracking-tight">
                Select a Plan to Continue.
              </h1>
              <p className="text-sm text-[#4d4d4d]">
                No credit credit inputs or commitment. Try Basic for 3 days or upgrade to Pro unlock.
              </p>
            </div>

            {/* Bento Grid Comparative Styling */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-3xl mx-auto w-full">
              
              {/* Basic Plan Card */}
              <div className="bg-white border border-[#cccccc] hover:border-black rounded-[10px] p-8 flex flex-col justify-between transition-colors duration-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#cccccc] group-hover:bg-black transition-colors" />
                
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold font-roobert text-black">Basic Plan</h3>
                      <p className="text-xs text-[#4d4d4d] mt-1">Core loop inbound marketing system.</p>
                    </div>
                    <span className="bg-[#edfc47] border border-black/10 text-black text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                      3-Day Free Trial
                    </span>
                  </div>

                  <div className="border-y border-[#cccccc]/30 py-4 flex items-baseline gap-2">
                    <span className="text-4xl font-bold font-roobert">$15</span>
                    <span className="text-xs text-[#4d4d4d]">/ month after trial</span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-bold text-black uppercase tracking-wider font-mono">What's Included:</p>
                    <ul className="space-y-2.5">
                      {basicPerks.map((perk, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-black">
                          <span className="w-4 h-4 rounded-full bg-[#e6f9e6] border border-[#cccccc] flex items-center justify-center shrink-0 text-[#1e561e] text-[10px] font-bold">
                            ✓
                          </span>
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => handleSelectPlan('Basic')}
                    className="w-full bg-white border border-black hover:bg-black hover:text-[#edfc47] transition-all py-3.5 rounded-[10px] text-xs font-bold uppercase tracking-wider text-black flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <span>Start 3-Day Free Trial</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[10px] text-[#4d4d4d] text-center mt-2.5">
                    Immediate entry. Cancel anytime in Settings in 3 days.
                  </p>
                </div>
              </div>

              {/* Pro Plan Card */}
              <div className="bg-white border-2 border-black rounded-[10px] p-8 flex flex-col justify-between shadow-md relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-black text-[#edfc47] text-[8px] font-bold py-1 px-3 rounded-bl uppercase tracking-wider font-mono">
                  POPULAR CHOICE
                </div>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold font-roobert text-black">Pro Plan</h3>
                      <p className="text-xs text-[#4d4d4d] mt-1">Unlock distribution content limits.</p>
                    </div>
                    <span className="bg-black text-[#edfc47] border border-black text-[9px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 fill-[#edfc47]" /> FULL SCOPE
                    </span>
                  </div>

                  <div className="border-y border-black/10 py-4 flex items-baseline gap-2">
                    <span className="text-4xl font-bold font-roobert">$30</span>
                    <span className="text-xs text-[#4d4d4d]">/ month billed recurrently</span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-bold text-black uppercase tracking-wider font-mono">Premium Superpowers:</p>
                    <ul className="space-y-2.5">
                      {proPerks.map((perk, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-black">
                          <span className="w-4 h-4 rounded-full bg-[#edfc47] border border-black flex items-center justify-center shrink-0 text-black text-[10px] font-bold">
                            ✓
                          </span>
                          <span className={i === 0 ? "font-semibold" : ""}>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => handleSelectPlan('Pro')}
                    className="w-full bg-black text-[#edfc47] hover:bg-[#1a1a1a] transition-all py-3.5 rounded-[10px] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <span>Activate Pro Access</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[10px] text-[#4d4d4d] text-center mt-2.5">
                    Immediate premium access. Upgrade or downgrade instantly.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Trust guarantees badge line matching Bento standards */}
      <div className="text-center text-xs text-[#4d4d4d] max-w-md mx-auto w-full mt-10 space-y-1">
        <div>Protected under secure internal framework protocols. Playbook inc 2026.</div>
      </div>

    </div>
  );
}
