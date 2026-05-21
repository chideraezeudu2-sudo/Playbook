import { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import Auth from "./components/Auth";
import Checkout from "./components/Checkout";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import InfoPages from "./components/InfoPages";
import { UserProfile, OnboardingData, UserPlan } from "./types";

export default function App() {
  // Screen Router States: 'landing' | 'auth-login' | 'auth-signup' | 'checkout' | 'onboarding' | 'dashboard' | 'info-page'
  const [screen, setScreen] = useState<string>("landing");

  // Authentication Context state
  const [user, setUser] = useState<UserProfile | null>(null);

  // Selected pricing plan placeholder (to carry forward into checkout or during signup)
  const [selectedPlan, setSelectedPlan] = useState<UserPlan | null>(null);

  // Business strategy custom details
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    niche: "",
    audience: "",
    problem: "",
    offerName: "",
    offerPrice: "",
    offerSentence: "",
    gmail_connected: false,
    email_platform: "",
    email_platform_key: "",
    step: 1
  });

  // Secondary subpage variable loader
  const [infoPageName, setInfoPageName] = useState<string>("");

  // Sync state loops from local browser cache on build initialization
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("pbook_user_session");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Pick routing destination based on setup variables
        const storedOnb = localStorage.getItem("pbook_onboarding_session");
        if (storedOnb) {
          const parsedOnb = JSON.parse(storedOnb);
          setOnboardingData(parsedOnb);
          
          if (parsedUser.plan === "Free") {
            setScreen("checkout");
          } else if (parsedOnb.step < 5) {
            setScreen("onboarding");
          } else {
            setScreen("dashboard");
          }
        } else {
          setScreen("onboarding");
        }
      } else {
        setScreen("landing");
      }
    } catch (e) {
      console.warn("localStorage sync error:", e);
    }
  }, []);

  // --- Router Callback Handlers ---

  // Trigger Sign Up flow from pricing tiers
  const handleSelectPricingTier = (plan: UserPlan) => {
    setSelectedPlan(plan);
    setScreen("auth-signup");
  };

  // Auth Success Bridge
  const handleAuthSuccess = (name: string, email: string, assignedPlan: UserPlan) => {
    const freshUser: UserProfile = {
      name,
      email,
      plan: assignedPlan
    };
    setUser(freshUser);
    localStorage.setItem("pbook_user_session", JSON.stringify(freshUser));

    // Evaluate Next Screen
    if (assignedPlan === "Free") {
      setScreen("checkout");
    } else {
      // Direct Onboarding check
      setScreen("onboarding");
    }
  };

  // Payment Confirmation Success Bridge
  const handlePaymentSuccess = (finalPlan: UserPlan) => {
    if (user) {
      const updatedUser = { ...user, plan: finalPlan };
      setUser(updatedUser);
      localStorage.setItem("pbook_user_session", JSON.stringify(updatedUser));
    }
    setScreen("onboarding");
  };

  // Update progressive onboarding step variables
  const handleUpdateOnboardingStep = (nextStep: number, fields: Partial<OnboardingData>) => {
    const updated = {
      ...onboardingData,
      ...fields,
      step: nextStep
    };
    setOnboardingData(updated);
    localStorage.setItem("pbook_onboarding_session", JSON.stringify(updated));
  };

  // Finish Onboarding Setup
  const handleOnboardingComplete = () => {
    const completedOnb = {
      ...onboardingData,
      step: 5 // Marks completed
    };
    setOnboardingData(completedOnb);
    localStorage.setItem("pbook_onboarding_session", JSON.stringify(completedOnb));
    setScreen("dashboard");
  };

  // Logouts Cleanup
  const handleLogout = () => {
    setUser(null);
    setSelectedPlan(null);
    setOnboardingData({
      niche: "",
      audience: "",
      problem: "",
      offerName: "",
      offerPrice: "",
      offerSentence: "",
      gmail_connected: false,
      email_platform: "",
      email_platform_key: "",
      step: 1
    });

    // Reset caches safely
    localStorage.removeItem("pbook_user_session");
    localStorage.removeItem("pbook_onboarding_session");
    localStorage.removeItem("pn_lmag");
    localStorage.removeItem("pn_d100");
    localStorage.removeItem("pn_email");
    localStorage.removeItem("pn_linkedin");
    localStorage.removeItem("pn_trip");
    localStorage.removeItem("pn_counts");

    setScreen("landing");
  };

  // Secondary subpages trigger route loop
  const handleNavigate = (target: string) => {
    if (target === "login") {
      setScreen("auth-login");
    } else if (target === "signup") {
      setScreen("auth-signup");
    } else if (["about", "changelog", "contact", "privacy", "terms"].includes(target)) {
      setInfoPageName(target);
      setScreen("info-page");
    } else {
      setScreen("landing");
    }
  };

  return (
    <div className="bg-[#ffffff] min-h-screen text-[#000000] selection:bg-[#edfc47] font-sans antialiased">
      {screen === "landing" && (
        <LandingPage 
          onNavigate={handleNavigate}
          onSelectPlanAndSignup={handleSelectPricingTier}
        />
      )}

      {screen === "auth-login" && (
        <Auth 
          initialMode="login" 
          selectedPlan={selectedPlan}
          onAuthSuccess={handleAuthSuccess}
          onNavigateHome={() => setScreen("landing")}
        />
      )}

      {screen === "auth-signup" && (
        <Auth 
          initialMode="signup" 
          selectedPlan={selectedPlan}
          onAuthSuccess={handleAuthSuccess}
          onNavigateHome={() => setScreen("landing")}
        />
      )}

      {screen === "checkout" && (
        <Checkout 
          currentPlan={user?.plan || "Free"}
          onPaymentSuccess={handlePaymentSuccess}
          onNavigateHome={() => setScreen("landing")}
        />
      )}

      {screen === "onboarding" && (
        <Onboarding 
          initialStep={onboardingData.step}
          onboardingData={onboardingData}
          onUpdateStep={handleUpdateOnboardingStep}
          onOnboardingComplete={handleOnboardingComplete}
        />
      )}

      {screen === "dashboard" && user && (
        <Dashboard 
          user={user}
          onboardingData={onboardingData}
          onLogout={handleLogout}
          onUpdateProfile={(data) => {
            const upd = { ...user, ...data };
            setUser(upd);
            localStorage.setItem("pbook_user_session", JSON.stringify(upd));
          }}
          onUpdateOnboarding={(data) => {
            setOnboardingData(data);
            localStorage.setItem("pbook_onboarding_session", JSON.stringify(data));
          }}
          onTriggerUpgradeCheckout={() => setScreen("checkout")}
        />
      )}

      {screen === "info-page" && (
        <InfoPages 
          page={infoPageName}
          onBack={() => setScreen("landing")}
        />
      )}
    </div>
  );
}
