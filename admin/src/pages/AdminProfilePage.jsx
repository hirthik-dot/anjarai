import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, ShieldCheck, Save, Send, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({ full_name: '', email: '', phone: '', email_verified: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState('');
  const toast = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/admin-profile');
        setProfile(res.data);
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/admin-profile', { full_name: profile.full_name, phone: profile.phone });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleRequestVerify = async () => {
    if (!profile.email) return toast.error('Please enter an email first');
    setVerifying(true);
    try {
      const res = await axios.post('/admin-profile/request-email-verify', { email: profile.email });
      toast.success(res.data.message);
      setOtpMode(true);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Verification request failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post('/admin-profile/verify-email', { email: profile.email, otp });
      toast.success(res.data.message);
      setProfile({ ...profile, email_verified: true });
      setOtpMode(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Incorrect OTP');
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-brand-dark/30 italic">Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-brand-green/10 text-brand-green rounded-[24px]">
          <User size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-head font-black text-brand-dark">Admin <span className="text-brand-green">Profile</span></h1>
          <p className="text-brand-dark/50 font-bold uppercase tracking-widest text-[10px]">Verify your account for enhanced security</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-brand-green/5 space-y-6">
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest px-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/20" size={18} />
                  <input 
                    type="text" 
                    value={profile.full_name} 
                    onChange={e => setProfile({...profile, full_name: e.target.value})}
                    className="w-full bg-brand-green/5 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-brand-warm transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest px-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/20" size={18} />
                  <input 
                    type="tel" 
                    value={profile.phone} 
                    onChange={e => setProfile({...profile, phone: e.target.value})}
                    placeholder="10-digit number"
                    className="w-full bg-brand-green/5 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-brand-warm transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-green/5">
              <button 
                type="submit" 
                disabled={saving}
                className="w-full bg-brand-green text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-green/20 disabled:opacity-50"
              >
                {saving ? 'Saving...' : <><Save size={20} /> Update Profile</>}
              </button>
            </div>
          </form>
        </div>

        {/* Verification Card */}
        <div className="bg-brand-dark text-white p-8 rounded-[40px] shadow-xl space-y-6 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <ShieldCheck size={160} />
          </div>

          <div className="relative z-10 space-y-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${profile.email_verified ? 'bg-brand-green' : 'bg-brand-warm'}`}>
              {profile.email_verified ? <CheckCircle size={24} /> : <ShieldCheck size={24} />}
            </div>

            <div>
              <h3 className="text-xl font-head font-black tracking-tight leading-none">Account Verification</h3>
              <p className="text-white/40 text-[10px] font-black tracking-widest uppercase mt-2">Required for Security</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Admin Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input 
                    type="email" 
                    disabled={profile.email_verified || otpMode}
                    value={profile.email} 
                    onChange={e => setProfile({...profile, email: e.target.value})}
                    className="w-full bg-white/10 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-brand-warm transition-all"
                  />
                </div>
              </div>

              {otpMode ? (
                <div className="space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-warm uppercase tracking-widest px-1">Enter OTP (Sent to Mail)</label>
                    <input 
                      type="text" 
                      value={otp} 
                      onChange={e => setOtp(e.target.value)}
                      placeholder="6-digit code"
                      className="w-full bg-white/20 border-2 border-brand-warm/30 rounded-2xl py-4 text-center text-xl font-black tracking-[10px]"
                    />
                  </div>
                  <button 
                    onClick={handleVerifyOtp}
                    className="w-full bg-brand-warm text-brand-dark py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-brand-warm/20"
                  >
                    Verify Email
                  </button>
                  <button onClick={() => setOtpMode(false)} className="w-full text-[10px] font-black uppercase tracking-[3px] text-white/40">Cancel</button>
                </div>
              ) : profile.email_verified ? (
                <div className="bg-brand-green/20 border border-brand-green/30 p-4 rounded-2xl flex items-center gap-3">
                  <CheckCircle className="text-brand-green" size={20} />
                  <span className="text-xs font-bold text-brand-green">Email is officially verified</span>
                </div>
              ) : (
                <button 
                  onClick={handleRequestVerify}
                  disabled={verifying}
                  className="w-full bg-brand-warm text-brand-dark py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-warm/20"
                >
                  {verifying ? 'Sending...' : <><Send size={18} /> Verify Email</>}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
