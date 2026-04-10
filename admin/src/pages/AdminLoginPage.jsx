import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin, API_BASE } from '../context/AdminContext';
import { Eye, EyeOff, Lock, Mail, Terminal, CheckCircle2, Award, Box } from 'lucide-react';

export default function AdminLoginPage() {
  const { admin, login } = useAdmin();
  const navigate = useNavigate();
  const [form,     setForm]     = useState({ email: '', password: '' });
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Forgot Password States
  const [mode, setMode] = useState('login'); // login | forgot | reset
  const [resetData, setResetData] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });
  const [resetMsg, setResetMsg] = useState('');

  useEffect(() => {
    if (admin) {
      navigate('/dashboard', { replace: true });
    }
  }, [admin, navigate]);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleResetChange = (e) => setResetData(rd => ({ ...rd, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: form.email.trim().toLowerCase(), password: form.password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      login(data.token, data.username);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetData.email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      setResetMsg(data.message);
      setMode('reset');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalReset = async (e) => {
    e.preventDefault();
    if (resetData.newPassword !== resetData.confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password-with-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resetData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset failed');
      alert('Password reset successful! Please login with your new email and new password.');
      setMode('login');
      setForm({ email: resetData.email, password: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-brand-light font-body">
      {/* LEFT — Brand Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[520px] bg-brand-green p-16 text-white flex-shrink-0 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="font-head text-4xl font-bold tracking-tight">
            The <span className="text-brand-warm italic">Anjaraipetti</span>
          </h1>
          <div className="flex items-center gap-2 mt-2 opacity-60">
            <Terminal size={14} />
            <span className="text-xs font-black uppercase tracking-[3px]">Admin Control Panel</span>
          </div>
        </div>

        <div className="relative z-10">
          <div className="text-[100px] mb-8 leading-none">🌿</div>
          <h2 className="font-head text-5xl font-bold leading-tight">
            Manage Your Store, <br />
            <span className="text-brand-warm/80 italic">Rooted in Tradition.</span>
          </h2>
          <p className="text-white/70 text-base leading-relaxed mt-6 mb-12 max-w-sm">
            Full control over every pixel of your store — products, banners, videos,
            offers, and more.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-white/90 font-bold text-sm bg-white/5 p-3 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-brand-warm/20 flex items-center justify-center text-brand-warm">
                <Box size={16} />
              </div>
              Product Inventory & CRUD
            </div>
            <div className="flex items-center gap-4 text-white/90 font-bold text-sm bg-white/5 p-3 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-brand-warm/20 flex items-center justify-center text-brand-warm">
                <CheckCircle2 size={16} />
              </div>
              Live Page Sections & Banners
            </div>
            <div className="flex items-center gap-4 text-white/90 font-bold text-sm bg-white/5 p-3 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-brand-warm/20 flex items-center justify-center text-brand-warm">
                <Award size={16} />
              </div>
              Newsletter & Subscriber Data
            </div>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap relative z-10">
          <span className="bg-white/10 border border-white/20 rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white/80">🏅 FSSAI Certified</span>
          <span className="bg-white/10 border border-white/20 rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white/80">🔒 JWT Secured</span>
        </div>
      </div>

      {/* RIGHT — Login Card */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 bg-brand-light/50 relative overflow-hidden min-h-screen lg:min-h-0">
        {/* Mobile brand header */}
        <div className="lg:hidden text-center mb-8 sm:mb-10">
          <h1 className="font-head text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
            The <span className="text-brand-warm italic">Anjaraipetti</span>
          </h1>
          <p className="text-brand-mid text-[10px] sm:text-xs font-black uppercase tracking-[2px] sm:tracking-[3px] mt-1.5 opacity-50">Admin Control Panel</p>
        </div>
        <div className="bg-white rounded-[24px] sm:rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:shadow-[0_40px_100px_rgba(0,0,0,0.08)] w-full max-w-[480px] p-6 sm:p-12 relative border border-gray-100">
          
          {mode === 'login' && (
            <div className="animate-in fade-in duration-500">
              <div className="mb-6 sm:mb-10 text-center">
                <h2 className="font-head text-2xl sm:text-4xl font-black text-brand-dark tracking-tight">Admin Login</h2>
                <p className="text-brand-mid font-bold text-xs sm:text-sm mt-2 sm:mt-3 opacity-60">Sign in to manage your empire</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-brand-mid/70 ml-2">
                    <Mail size={12} /> Email Address
                  </label>
                  <input
                    name="email" type="email" value={form.email}
                    onChange={handleChange} placeholder="your@email.com" required
                    className="w-full bg-brand-light/20 border-2 border-brand-green-pale rounded-2xl px-5 py-4 text-sm font-bold font-body outline-none focus:border-brand-green focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-2">
                    <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-brand-mid/70">
                      <Lock size={12} /> Password
                    </label>
                    <button type="button" onClick={() => setMode('forgot')} className="text-[10px] font-black uppercase text-brand-sale hover:underline tracking-widest">Forgot?</button>
                  </div>
                  <div className="relative">
                    <input
                      name="password" type={showPass ? 'text' : 'password'}
                      value={form.password} onChange={handleChange}
                      placeholder="••••••••" required
                      className="w-full bg-brand-light/20 border-2 border-brand-green-pale rounded-2xl px-5 py-4 pr-14 text-sm font-bold font-body outline-none focus:border-brand-green focus:bg-white transition-all tracking-widest"
                    />
                    <button 
                      type="button" onClick={() => setShowPass(s => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center text-brand-mid transition-all"
                    >
                      {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-brand-sale/10 border-2 border-brand-sale/20 rounded-2xl px-5 py-4 flex items-center gap-3 text-brand-sale">
                    <p className="text-xs font-black uppercase tracking-wide leading-tight">{error}</p>
                  </div>
                )}

                <button 
                  type="submit" disabled={loading}
                  className="w-full bg-brand-green text-white font-black rounded-2xl py-4 text-base transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02]"
                >
                  {loading ? "AUTHENTICATING..." : "SIGN IN TO PANEL"}
                </button>
              </form>
            </div>
          )}

          {mode === 'forgot' && (
            <div className="animate-in slide-in-from-right-8 duration-500">
              <div className="mb-6 sm:mb-10 text-center">
                <h2 className="font-head text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">Forgot Credentials?</h2>
                <p className="text-brand-mid font-bold text-xs sm:text-sm mt-3 opacity-60">Enter your registered email to receive an OTP</p>
              </div>

              <form onSubmit={handleRequestReset} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-brand-mid/70 ml-2">Registered Email</label>
                  <input
                    name="email" type="email" value={resetData.email}
                    onChange={handleResetChange} placeholder="your@email.com" required
                    className="w-full bg-brand-light/20 border-2 border-brand-green-pale rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-brand-green focus:bg-white transition-all"
                  />
                </div>

                {error && <p className="text-xs font-black text-brand-sale uppercase ml-2 italic">{error}</p>}

                <button 
                  type="submit" disabled={loading}
                  className="w-full bg-brand-dark text-white font-black rounded-2xl py-4 text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? "SENDING..." : "SEND RESET OTP"}
                </button>
                <button type="button" onClick={() => setMode('login')} className="w-full text-[10px] font-black uppercase text-brand-mid/40 hover:text-brand-mid tracking-[3px]">Back to Login</button>
              </form>
            </div>
          )}

          {mode === 'reset' && (
            <div className="animate-in slide-in-from-right-8 duration-500">
              <div className="mb-6 text-center">
                <h2 className="font-head text-2xl font-black text-brand-dark tracking-tight">Reset Your Access</h2>
                <p className="text-brand-green font-bold text-[10px] mt-2 uppercase tracking-widest italic">{resetMsg}</p>
              </div>

              <form onSubmit={handleFinalReset} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-brand-mid/70 ml-2">OTP Code (6 digits)</label>
                  <input
                    name="otp" type="text" value={resetData.otp}
                    onChange={handleResetChange} required maxLength={6}
                    className="w-full bg-brand-light/20 border-2 border-brand-green/20 rounded-xl px-4 py-3 text-center text-xl font-black tracking-[10px] outline-none focus:border-brand-green"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-brand-mid/70 ml-2">New Password</label>
                  <input
                    name="newPassword" type="password" value={resetData.newPassword}
                    onChange={handleResetChange} required
                    className="w-full bg-brand-light/20 border rounded-xl px-4 py-3 text-sm font-bold outline-none border-brand-green/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-brand-mid/70 ml-2">Confirm Password</label>
                  <input
                    name="confirmPassword" type="password" value={resetData.confirmPassword}
                    onChange={handleResetChange} required
                    className="w-full bg-brand-light/20 border rounded-xl px-4 py-3 text-sm font-bold outline-none border-brand-green/20"
                  />
                </div>

                {error && <p className="text-xs font-black text-brand-sale uppercase ml-2 italic">{error}</p>}

                <button 
                  type="submit" disabled={loading}
                  className="w-full bg-brand-sale text-white font-black rounded-2xl py-4 text-sm tracking-widest uppercase transition-all shadow-lg hover:bg-red-600"
                >
                  {loading ? "RESETTING..." : "RESET CREDENTIALS NOW"}
                </button>
                <button type="button" onClick={() => setMode('login')} className="w-full text-[10px] font-black uppercase text-brand-mid/40 hover:text-brand-mid tracking-[3px]">Cancel</button>
              </form>
            </div>
          )}

          <p className="text-center text-[9px] sm:text-[10px] font-black tracking-widest text-brand-mid/40 mt-6 sm:mt-8 uppercase py-2 sm:py-3 border-y border-gray-50">
            Powered by Anjaraipetti Admin Core
          </p>
        </div>
      </div>
    </div>
  );
}
