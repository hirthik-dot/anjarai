import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin, API_BASE } from '../context/AdminContext';
import { Eye, EyeOff, Lock, User, Terminal, CheckCircle2, Award, Box, Leaf } from 'lucide-react';

export default function AdminLoginPage() {
  const { admin, login } = useAdmin();
  const navigate = useNavigate();
  const [form,     setForm]     = useState({ username: '', password: '' });
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (admin) {
      navigate('/dashboard', { replace: true });
    }
  }, [admin, navigate]);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form)
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
      <div className="flex-1 flex items-center justify-center p-8 bg-brand-light/50 relative overflow-hidden">
        <div className="bg-white rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.08)] w-full max-w-[480px] p-12 relative border border-gray-100">
          <div className="mb-10 text-center">
            <h2 className="font-head text-4xl font-black text-brand-dark tracking-tight">Admin Login</h2>
            <p className="text-brand-mid font-bold text-sm mt-3 opacity-60">Sign in to manage your empire</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-brand-mid/70 ml-2">
                <User size={12} /> Username
              </label>
              <input
                name="username" type="text" value={form.username}
                onChange={handleChange} placeholder="e.g. admin" required
                className="w-full bg-brand-light/20 border-2 border-brand-green-pale rounded-2xl px-5 py-4 text-sm font-bold font-body outline-none focus:border-brand-green focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-brand-mid/70 ml-2">
                <Lock size={12} /> Password
              </label>
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
              className="w-full bg-brand-green text-white font-black rounded-2xl py-4 text-base transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl"
            >
              {loading ? "AUTHENTICATING..." : "SIGN IN TO PANEL"}
            </button>
          </form>

          <p className="text-center text-[10px] font-black tracking-widest text-brand-mid/40 mt-10 uppercase py-3 border-y border-gray-50">
            Powered by Anjaraipetti Admin Core
          </p>
        </div>
      </div>
    </div>
  );
}
