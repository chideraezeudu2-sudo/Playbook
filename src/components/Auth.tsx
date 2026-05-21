import React, { useState } from 'react';
import { UserPlan } from '../types';

interface AuthProps {
  initialMode: 'login' | 'signup';
  selectedPlan: UserPlan | null;
  onAuthSuccess: (name: string, email: string, assignedPlan: UserPlan) => void;
  onNavigateHome: () => void;
}

export default function Auth({ initialMode, selectedPlan, onAuthSuccess, onNavigateHome }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  // Form values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Quick structural checks
    if (mode === 'signup' && !name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid business email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must exceed 5 alphanumeric characters.');
      return;
    }

    // Success! Let's pass the state up.
    // If a plan was pre-selected from the Pricing section, preserve it, else default to 'Free' (which leads to the Plan Selector!)
    const targetPlan = selectedPlan || 'Free';
    onAuthSuccess(
      mode === 'signup' ? name.trim() : email.split('@')[0], 
      email.trim().toLowerCase(), 
      targetPlan
    );
  };

  return (
    <div className="min-h-screen bg-white selection:bg-[#edfc47] selection:text-black flex flex-col justify-between py-12 px-6">
      {/* Upper Logo */}
      <div className="text-center max-w-md mx-auto w-full mb-8">
        <div 
          onClick={onNavigateHome}
          className="font-roobert font-extrabold text-2xl tracking-tight cursor-pointer inline-flex items-center gap-1.5 text-black"
        >
          <span>Playbook</span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#edfc47] border border-black" />
        </div>
      </div>

      {/* Main Card */}
      <div className="max-w-[440px] w-full mx-auto bg-white border border-[#cccccc] rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-roobert font-bold text-black mb-1">
          {mode === 'signup' ? 'Create your account' : 'Welcome back'}
        </h2>
        <p className="text-sm text-[#4d4d4d] mb-6">
          {mode === 'signup' 
            ? 'Start your 3-day free trial on our Basic roadmap.' 
            : 'Access your fully automated marketing strategies.'}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded text-xs font-semibold text-red-800">
            {error}
          </div>
        )}

        {selectedPlan && mode === 'signup' && (
          <div className="mb-6 p-3.5 bg-[#f7f6f5] border border-[#cccccc] rounded-lg text-xs font-medium text-black flex items-center justify-between">
            <span>Pre-selected: <strong className="font-semibold text-black uppercase">{selectedPlan} Plan</strong></span>
            <span className="text-[#4d4d4d] italic font-mono">{selectedPlan === 'Basic' ? '$15/mo' : '$30/mo'}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-[#4d4d4d] mb-1.5 uppercase font-mono tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#f7f6f5] border border-[#cccccc] focus:border-black rounded p-3 text-sm focus:outline-none transition-colors"
                id="auth-input-name"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#4d4d4d] mb-1.5 uppercase font-mono tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="jane@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#f7f6f5] border border-[#cccccc] focus:border-black rounded p-3 text-sm focus:outline-none transition-colors"
              id="auth-input-email"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4d4d4d] mb-1.5 uppercase font-mono tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#f7f6f5] border border-[#cccccc] focus:border-black rounded p-3 text-sm focus:outline-none transition-colors"
              id="auth-input-password"
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary py-3.5 text-center mt-6"
            id="auth-submit-btn"
          >
            {mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#cccccc]/40 text-center text-sm">
          {mode === 'signup' ? (
            <p className="text-[#4d4d4d]">
              Already have an account?{' '}
              <button
                onClick={() => { setError(''); setMode('login'); }}
                className="font-semibold text-black underline hover:opacity-75 cursor-pointer"
                id="auth-link-login"
              >
                Login
              </button>
            </p>
          ) : (
            <p className="text-[#4d4d4d]">
              Don’t have an account?{' '}
              <button
                onClick={() => { setError(''); setMode('signup'); }}
                className="font-semibold text-black underline hover:opacity-75 cursor-pointer"
                id="auth-link-signup"
              >
                Sign up
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Trust terms footer */}
      <div className="text-center text-xs text-[#4d4d4d] max-w-md mx-auto w-full mt-8">
        By clicking continue, you agree to our terms of sandbox service and privacy guidelines. Secured with Clerk credentials protection.
      </div>
    </div>
  );
}
