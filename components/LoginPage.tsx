import React, { useState, FormEvent } from 'react';
import { GoogleIcon, CheckCircleIcon, InfoIcon } from './icons';
import VerificationEmailModal from './VerificationEmailModal';

interface LoginPageProps {
  onLogin: () => void;
}

interface User {
  email: string;
  password: string;
  verified: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'verify'>('login');
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationInput, setVerificationInput] = useState('');
  
  // "Backend" state simulation
  const [users, setUsers] = useState<User[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [emailForVerification, setEmailForVerification] = useState<string | null>(null);
  
  // UI state
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailModalContent, setEmailModalContent] = useState({ code: '', body: '' });

  const validatePassword = (pass: string): boolean => {
    const hasMinLength = pass.length >= 8;
    const hasNumber = /\d/.test(pass);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass);
    return hasMinLength && hasNumber && hasSpecialChar;
  };

  const generateAndShowVerificationEmail = async (userEmail: string) => {
    setLoading(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);
    setEmailForVerification(userEmail);

    try {
        const apiKey = typeof process !== 'undefined' && process?.env?.API_KEY ? process.env.API_KEY : null;

        if (!apiKey) {
            throw new Error("API_KEY not found. Using fallback email simulation.");
        }
        
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey });
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a short, friendly email body for a user signing up for 'Habit Tracker'. The email must include the verification code: ${code}. The tone should be welcoming and clear.`,
        });
        
        setEmailModalContent({ code, body: response.text });
    } catch (e) {
        console.error("AI generation failed, using fallback content.", e);
        setEmailModalContent({
            code,
            body: `Welcome to Habit Tracker!\n\nYour verification code is ${code}.`
        });
    }

    setIsEmailModalOpen(true);
    setLoading(false);
  };

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
        const user = users.find(u => u.email === email);

        if (!user || user.password !== password) {
            setError('Invalid email or password.');
            setLoading(false);
            return;
        }

        if (!user.verified) {
            setError('Your account is not verified. A new code has been sent.');
            generateAndShowVerificationEmail(email); 
            setMode('verify');
            setLoading(false);
            return;
        }

        setLoading(false);
        onLogin();
    }, 500);
  };

  const handleSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setPasswordError('');
    if (!validatePassword(password)) {
        setPasswordError('Password does not meet the requirements.');
        return;
    }

    if (users.find(u => u.email === email)) {
        setError('An account with this email already exists. Please sign in.');
        setMode('login');
        return;
    }
    
    setUsers(prev => [...prev, { email, password, verified: false }]);
    await generateAndShowVerificationEmail(email);
  };

  const handleVerifySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      if (verificationInput === verificationCode) {
        setUsers(prevUsers => prevUsers.map(user => 
            user.email === emailForVerification ? { ...user, verified: true } : user
        ));
        
        alert('Verification successful! Welcome.');
        setEmailForVerification(null);
        onLogin();
      } else {
        setError('Invalid verification code. Please try again.');
      }
      setLoading(false);
    }, 500);
  };

  const resendCode = async () => {
    if (loading || !emailForVerification) return;
    setError('');
    await generateAndShowVerificationEmail(emailForVerification);
  }

  const renderTitle = () => (
    <div className="text-center">
        <div className="flex justify-center items-center gap-3 mb-4">
            <CheckCircleIcon className="w-10 h-10 text-sky-500" />
            <h1 className="text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                Habit Tracker
            </h1>
        </div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 min-h-[20px]">
        {mode === 'login' && 'Sign in to continue your journey'}
        {mode === 'signup' && 'Create an account to start your journey'}
        {mode === 'verify' && `Enter the 6-digit code for ${emailForVerification}`}
      </p>
    </div>
  );

  const renderContent = () => {
    switch(mode) {
      case 'signup':
        return (
          <>
            <form className="mt-8 space-y-6" onSubmit={handleSignupSubmit}>
              {error && <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email-address-signup" className="sr-only">Email address</label>
                  <input id="email-address-signup" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 rounded-t-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm" placeholder="Email address" />
                </div>
                <div>
                  <label htmlFor="password-signup" className="sr-only">Password</label>
                  <input id="password-signup" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 rounded-b-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm" placeholder="Password" />
                </div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 px-1">
                <p className="flex items-center gap-2"><InfoIcon className="w-4 h-4 text-slate-400"/> At least 8 characters</p>
                <p className="flex items-center gap-2"><InfoIcon className="w-4 h-4 text-slate-400"/> A number (0-9)</p>
                <p className="flex items-center gap-2"><InfoIcon className="w-4 h-4 text-slate-400"/> A special character (!, @, #, etc.)</p>
              </div>
              {passwordError && <p className="text-sm text-red-500 dark:text-red-400 text-center">{passwordError}</p>}
              <div>
                <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-800 transition-colors disabled:opacity-50">
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300 focus:outline-none">
                    Sign in
                </button>
            </p>
          </>
        );
      case 'verify':
        return (
          <>
            <form className="mt-8 space-y-6" onSubmit={handleVerifySubmit}>
              <div>
                <label htmlFor="code" className="sr-only">Verification Code</label>
                <input id="code" name="code" type="text" value={verificationInput} onChange={e => setVerificationInput(e.target.value)} required maxLength={6} className="appearance-none relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 rounded-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-lg text-center tracking-[0.5em] font-mono" placeholder="------" />
              </div>
              {error && <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}
              <div>
                <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-800 transition-colors disabled:opacity-50">
                  {loading ? 'Verifying...' : 'Verify Account'}
                </button>
              </div>
            </form>
            <div className="mt-6 text-center text-sm">
                <button onClick={resendCode} disabled={loading} className="font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300 focus:outline-none disabled:opacity-50">
                    Resend code
                </button>
            </div>
          </>
        );
      case 'login':
      default:
        return (
          <>
            <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email-address-login" className="sr-only">Email address</label>
                  <input id="email-address-login" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 rounded-t-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm" placeholder="Email address" />
                </div>
                <div>
                  <label htmlFor="password-login" className="sr-only">Password</label>
                  <input id="password-login" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 rounded-b-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm" placeholder="Password" />
                </div>
              </div>
              {error && <p className="mt-2 text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}

              <div className="flex items-center justify-between text-sm">
                <a href="#" className="font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300">
                  Forgot your password?
                </a>
              </div>

              <div>
                <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-800 transition-colors disabled:opacity-50">
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-slate-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-800/80 text-slate-500 dark:text-slate-400">Or continue with</span>
              </div>
            </div>

            <div className='mt-6'>
                <button onClick={onLogin} type="button" className="w-full inline-flex justify-center items-center py-3 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-800 transition-colors">
                    <GoogleIcon className="w-5 h-5 mr-2" />
                    Sign in with Google
                </button>
            </div>
             <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400 px-4">
                By continuing with Google, you agree to our <a href="#" className="underline hover:text-sky-500">Terms of Service</a> and <a href="#" className="underline hover:text-sky-500">Privacy Policy</a>.
            </p>

            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300 focus:outline-none">
                    Sign up
                </button>
            </p>
          </>
        );
    }
  }

  return (
    <>
      <VerificationEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          setMode('verify');
        }}
        code={emailModalContent.code}
        emailBody={emailModalContent.body}
      />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-50 to-slate-200 dark:from-sky-900/50 dark:to-slate-900">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
          {renderTitle()}
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default LoginPage;