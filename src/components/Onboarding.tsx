import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OnboardingData } from '../types';
import { Check, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  initialStep: number;
  onboardingData: OnboardingData;
  onUpdateStep: (step: number, data: Partial<OnboardingData>) => void;
  onOnboardingComplete: () => void;
}

export default function Onboarding({
  initialStep,
  onboardingData,
  onUpdateStep,
  onOnboardingComplete
}: OnboardingProps) {
  const [step, setStep] = useState<number>(initialStep || 1);
  const [niche, setNiche] = useState(onboardingData.niche || '');
  const [audience, setAudience] = useState(onboardingData.audience || '');
  const [problem, setProblem] = useState(onboardingData.problem || '');
  const [offerName, setOfferName] = useState(onboardingData.offerName || '');
  const [offerPrice, setOfferPrice] = useState(onboardingData.offerPrice || '');
  const [offerSentence, setOfferSentence] = useState(onboardingData.offerSentence || '');
  
  // Tool connections
  const [gmailConnected, setGmailConnected] = useState<boolean>(onboardingData.gmail_connected || false);
  const [emailPlatform, setEmailPlatform] = useState<string>(onboardingData.email_platform || '');
  const [emailPlatformKey, setEmailPlatformKey] = useState<string>(onboardingData.email_platform_key || '');

  // Controls fullscreen success state
  const [showSuccess, setShowSuccess] = useState(false);

  // Keep internal states in sync with props changes if needed (resets)
  useEffect(() => {
    setNiche(onboardingData.niche || '');
    setAudience(onboardingData.audience || '');
    setProblem(onboardingData.problem || '');
    setOfferName(onboardingData.offerName || '');
    setOfferPrice(onboardingData.offerPrice || '');
    setOfferSentence(onboardingData.offerSentence || '');
    setGmailConnected(onboardingData.gmail_connected || false);
    setEmailPlatform(onboardingData.email_platform || '');
    setEmailPlatformKey(onboardingData.email_platform_key || '');
  }, [onboardingData]);

  // Form step navigation
  const handleContinueStep1 = () => {
    if (!niche.trim()) return;
    onUpdateStep(2, { niche: niche.trim() });
    setStep(2);
  };

  const handleContinueStep2 = () => {
    if (!audience.trim() || !problem.trim()) return;
    onUpdateStep(3, { audience: audience.trim(), problem: problem.trim() });
    setStep(3);
  };

  const handleContinueStep3 = () => {
    if (!offerName.trim() || !offerPrice.trim() || !offerSentence.trim()) return;
    onUpdateStep(4, {
      offerName: offerName.trim(),
      offerPrice: offerPrice.trim(),
      offerSentence: offerSentence.trim()
    });
    setStep(4);
  };

  const handleFinishSetup = () => {
    // Save all connection properties into state and update
    onUpdateStep(4, {
      gmail_connected: gmailConnected,
      email_platform: emailPlatform,
      email_platform_key: emailPlatformKey
    });

    // Enter Success Page state for 2 seconds
    setShowSuccess(true);
    setTimeout(() => {
      onOnboardingComplete();
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center font-sans px-6 text-center select-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex flex-col items-center"
        >
          {/* Large custom checkmark inside premium border */}
          <div className="w-20 h-20 rounded-full bg-[#edfc47] border-2 border-black flex items-center justify-center text-black mb-6">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>

          <h2 className="text-3xl md:text-5xl font-roobert font-extrabold tracking-tight mb-2">
            You're all set.
          </h2>
          <p className="text-[#4d4d4d] text-base md:text-lg max-w-sm mx-auto font-medium">
            Your marketing system is ready. Let's get you some leads.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#000000] selection:bg-[#edfc47] font-sans flex flex-col justify-between py-12 px-6">
      {/* Progressive Top Progress Bar */}
      <div className="max-w-[500px] w-full mx-auto mb-16">
        <div className="flex justify-between items-center text-xs font-semibold text-[#4d4d4d] font-mono mb-3">
          <span>SETUP WIZARD</span>
          <span>STEP {step} OF 4</span>
        </div>

        {/* Progress tracks */}
        <div className="h-1.5 bg-[#f7f6f5] border border-[#cccccc] rounded-full overflow-hidden flex">
          <div 
            className="bg-black border-r border-black h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className="flex justify-between mt-2">
          {["Tell Us About Your Niche", "Who Are You Selling To?", "What Are You Selling?", "Connect Your Tools"].map((lbl, idx) => (
            <span 
              key={lbl} 
              className={`text-[9px] font-bold font-mono tracking-wider uppercase ${step === idx + 1 ? "text-black" : "text-[#4d4d4d]/60"}`}
            >
              {lbl.split(" ")[0]}..
            </span>
          ))}
        </div>
      </div>

      {/* Main questionnaire screens */}
      <div className="max-w-[580px] w-full mx-auto bg-white border border-[#cccccc] rounded-xl p-8 md:p-10 shadow-sm flex-1 flex flex-col justify-between min-h-[420px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl md:text-3xl font-roobert font-extrabold text-black tracking-tight" id="onb-s1-header">
                  First, what’s your niche?
                </h2>
                <p className="text-sm text-[#4d4d4d] mt-1.5 leading-relaxed" id="onb-s1-sub">
                  This helps us personalize every playbook, every piece of generated copy, and every partner outreach asset to your specific market.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4d4d4d] mb-1.5 uppercase font-mono tracking-wider">
                  My niche is...
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. fitness, food, real estate, home services, ecommerce, content creation"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full bg-[#f7f6f5] border border-[#cccccc] focus:border-black rounded p-3 text-sm focus:outline-none focus:bg-white transition-all text-black"
                  id="onb-s1-input"
                />
                <p className="text-xs text-[#4d4d4d] mt-2 italic">
                  Be specific. "Vegan catering" or "residential plumbing" works better than just "food" or "plumbing".
                </p>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl md:text-3xl font-roobert font-extrabold text-black tracking-tight" id="onb-s2-header">
                  Who is your ideal customer?
                </h2>
                <p className="text-sm text-[#4d4d4d] mt-1.5 leading-relaxed" id="onb-s2-sub">
                  Describe the exact person you want to attract. The more specific, the more compelling the copy becomes.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4d4d4d] mb-1.5 uppercase font-mono tracking-wider">
                    My target audience is...
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. homeowners aged 35–50, college students, local families, small business owners"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full bg-[#f7f6f5] border border-[#cccccc] focus:border-black rounded p-3 text-sm focus:outline-none focus:bg-white transition-all text-black"
                    id="onb-s2-input-audience"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4d4d4d] mb-1.5 uppercase font-mono tracking-wider">
                    Their biggest problem is...
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. they can’t find a trustworthy service provider in their area"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="w-full bg-[#f7f6f5] border border-[#cccccc] focus:border-black rounded p-3 text-sm focus:outline-none focus:bg-white transition-all text-black"
                    id="onb-s2-input-problem"
                  />
                </div>
                
                <p className="text-xs text-[#4d4d4d] pt-1 italic">
                  Think about the person who needs you most. What keeps them awake at night?
                </p>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div>
                <h2 className="text-2xl md:text-3xl font-roobert font-extrabold text-black tracking-tight" id="onb-s3-header">
                  What’s your main offer?
                </h2>
                <p className="text-sm text-[#4d4d4d] mt-1.5 leading-relaxed" id="onb-s3-sub">
                  This is what you ultimately want people to buy — your digital course, high-ticket consulting, premium product, or local service.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-3">
                    <label className="block text-xs font-semibold text-[#4d4d4d] mb-1.5 uppercase font-mono tracking-wider">
                      My offer is called...
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. a plumbing service, online course, Shopify store, coaching program"
                      value={offerName}
                      onChange={(e) => setOfferName(e.target.value)}
                      className="w-full bg-[#f7f6f5] border border-[#cccccc] focus:border-black rounded p-3 text-sm focus:outline-none focus:bg-white transition-all text-black"
                      id="onb-s3-input-offer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4d4d4d] mb-1.5 uppercase font-mono tracking-wider">
                      Price ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-[#4d4d4d] text-sm">$</span>
                      <input
                        type="text"
                        required
                        placeholder="97"
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full pl-7 bg-[#f7f6f5] border border-[#cccccc] focus:border-black rounded p-3 text-sm focus:outline-none focus:bg-white transition-all text-black font-mono"
                        id="onb-s3-input-price"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4d4d4d] mb-1.5 uppercase font-mono tracking-wider">
                    In one sentence, it helps people...
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. quickly locate reliable home maintenance experts or launch their Shopify store"
                    value={offerSentence}
                    onChange={(e) => setOfferSentence(e.target.value)}
                    className="w-full bg-[#f7f6f5] border border-[#cccccc] focus:border-black rounded p-3 text-sm focus:outline-none focus:bg-white transition-all text-black"
                    id="onb-s3-input-sentence"
                  />
                </div>
                
                <p className="text-xs text-[#4d4d4d] pt-1 italic">
                  Don’t overthink this. You can adjust and refine this anytime inside settings!
                </p>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl md:text-3xl font-roobert font-extrabold text-black tracking-tight" id="onb-s4-header">
                  Connect Your Tools
                </h2>
                <p className="text-sm text-[#4d4d4d] mt-1.5 leading-relaxed" id="onb-s4-sub">
                  Perfect. Integrate your essential communication interfaces to automate your partnership outreach and email sequences.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Card 1 - Gmail Connection */}
                <div className={`p-5 rounded-xl border transition-all flex flex-col justify-between min-h-[160px] ${gmailConnected ? 'border-black bg-zinc-50' : 'border-[#cccccc] bg-white hover:border-black'}`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center text-red-500 font-extrabold text-xs font-mono shadow-sm">
                        GM
                      </div>
                      <span className={`w-2 h-2 rounded-full ${gmailConnected ? 'bg-green-500 animate-ping' : 'bg-[#cccccc]'}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-black font-roobert">Google Gmail</h4>
                      <p className="text-[11px] text-[#4d4d4d] leading-relaxed">
                        Authorize automated outbound invitations from your inbox.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    {gmailConnected ? (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded">
                          ✓ Connected
                        </span>
                        <button 
                          type="button" 
                          onClick={() => setGmailConnected(false)} 
                          className="text-[11px] font-bold text-red-500 hover:text-red-700 hover:underline cursor-pointer"
                        >
                          Disconnect
                        </button>
                      </div>
                    ) : (
                      <button 
                        type="button" 
                        onClick={() => setGmailConnected(true)} 
                        className="w-full bg-black hover:bg-zinc-900 text-white font-bold text-xs py-1.5 px-3 rounded text-center cursor-pointer transition-colors"
                      >
                        Connect Gmail
                      </button>
                    )}
                  </div>
                </div>

                {/* Card 2 - Email Platform Integration */}
                <div className={`p-5 rounded-xl border transition-all flex flex-col justify-between min-h-[160px] ${emailPlatform ? 'border-black bg-zinc-50' : 'border-[#cccccc] bg-white hover:border-black'}`}>
                  <div className="space-y-2">
                    <div className="w-9 h-9 bg-purple-50 border border-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-extrabold text-xs font-mono shadow-sm">
                      EP
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-black font-roobert">Email Platform</h4>
                      <p className="text-[11px] text-[#4d4d4d] leading-relaxed">
                        Sync captured subscribers with your email provider list.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1.5 text-left">
                    <select
                      value={emailPlatform}
                      onChange={(e) => setEmailPlatform(e.target.value)}
                      className="w-full bg-[#f7f6f5] border border-[#cccccc] rounded p-1.5 text-[11px] font-medium text-black focus:outline-none focus:border-black"
                    >
                      <option value="">-- Choose Integration --</option>
                      <option value="Mailchimp">Mailchimp Sync</option>
                      <option value="ConvertKit">ConvertKit Sync</option>
                      <option value="ActiveCampaign">ActiveCampaign Sync</option>
                      <option value="Mailerlite">Mailerlite Sync</option>
                      <option value="Brevo">Brevo Sync</option>
                    </select>

                    {emailPlatform && (
                      <input
                        type="password"
                        placeholder="Enter API Secret Key"
                        value={emailPlatformKey}
                        onChange={(e) => setEmailPlatformKey(e.target.value)}
                        className="w-full bg-[#f7f6f5] border border-[#cccccc] rounded p-1.5 text-[10px] focus:outline-none focus:border-black text-black font-mono"
                      />
                    )}
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-[#4d4d4d] italic">
                Skip for now or change anytime from the Sandbox Settings tab.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic step continue buttons */}
        <div className="pt-8 mt-6 border-t border-[#cccccc]/40 flex justify-end">
          {step === 1 && (
            <button
              onClick={handleContinueStep1}
              disabled={!niche.trim()}
              className={`btn-primary flex items-center justify-center gap-2 ${!niche.trim() ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
              id="onb-btn-continue-s1"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 2 && (
            <button
              onClick={handleContinueStep2}
              disabled={!audience.trim() || !problem.trim()}
              className={`btn-primary flex items-center justify-center gap-2 ${(!audience.trim() || !problem.trim()) ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
              id="onb-btn-continue-s2"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 3 && (
            <button
              onClick={handleContinueStep3}
              disabled={!offerName.trim() || !offerPrice.trim() || !offerSentence.trim()}
              className={`btn-primary flex items-center justify-center gap-2 ${(!offerName.trim() || !offerPrice.trim() || !offerSentence.trim()) ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
              id="onb-btn-continue-s3"
            >
              Continue to Connections
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 4 && (
            <button
              onClick={handleFinishSetup}
              className="btn-primary flex items-center justify-center gap-2 cursor-pointer"
              id="onb-btn-continue-s4"
            >
              Finish Setup
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Static help signature */}
      <div className="text-center text-xs text-[#4d4d4d] mt-12 w-full">
        Step progress saved. Safe local-cache memory initialized. Playbook Co.
      </div>
    </div>
  );
}
