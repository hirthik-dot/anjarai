import React, { useState } from 'react';
import axios from 'axios';
import { Lock, Mail, Key, ShieldAlert, Send, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function ChangePasswordPage() {
  const [step, setStep] = useState(1); // 1: request, 2: verify
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ otp: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const toast = useToast();

  const handleRequestOtp = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/auth/request-password-otp');
      setMessage(res.data.message);
      setStep(2);
      toast.success('OTP sent to your verified email');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const res = await axios.post('/auth/verify-password-otp', formData);
      toast.success(res.data.message);
      setStep(3); // success state
    } catch (err) {
      toast.error(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-brand-sale/10 text-brand-sale rounded-[24px]">
          <Lock size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-head font-black text-brand-dark">Update <span className="text-brand-sale">Password</span></h1>
          <p className="text-brand-dark/50 font-bold uppercase tracking-widest text-[10px]">Secure your administrative access</p>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[48px] shadow-sm border border-brand-green/5 relative overflow-hidden">
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-brand-green/10 text-brand-green rounded-[24px] flex items-center justify-center">
                <ShieldAlert size={32} />
              </div>
              <h2 className="text-2xl font-head font-black text-brand-dark">Two-Step Verification</h2>
              <p className="text-brand-dark/50 font-bold text-sm leading-relaxed">
                To protect your account, we will send a one-time password (OTP) to your <span className="text-brand-green font-black underline underline-offset-4">verified email address</span>. You'll need this to confirm your password change.
              </p>
            </div>

            <button 
              onClick={handleRequestOtp}
              disabled={loading}
              className="w-full bg-brand-green text-white py-5 rounded-2xl font-black uppercase tracking-[2px] shadow-lg shadow-brand-green/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? 'Sending OTP...' : <><Send size={20} /> Request OTP via Email</>}
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyPassword} className="space-y-8 animate-in slide-in-from-right-8 duration-500">
            <div className="bg-brand-green/5 p-6 rounded-3xl border border-brand-green/10 flex items-start gap-4">
              <Mail className="text-brand-green flex-shrink-0 mt-1" size={20} />
              <p className="text-xs font-bold text-brand-green leading-relaxed italic">{message}</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest px-1">Enter OTP Code</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/20" size={18} />
                  <input 
                    type="text" 
                    placeholder="6-digit code"
                    value={formData.otp} 
                    onChange={e => setFormData({...formData, otp: e.target.value})}
                    className="w-full bg-brand-green/5 border-none rounded-2xl py-4 pl-12 pr-4 text-center text-xl font-black tracking-[10px] focus:ring-2 focus:ring-brand-warm transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest px-1">New Password</label>
                  <input 
                    type="password" 
                    value={formData.newPassword} 
                    onChange={e => setFormData({...formData, newPassword: e.target.value})}
                    className="w-full bg-brand-green/5 border-none rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-brand-warm transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest px-1">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={formData.confirmPassword} 
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full bg-brand-green/5 border-none rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-brand-warm transition-all"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand-sale text-white py-5 rounded-2xl font-black uppercase tracking-[2px] shadow-lg shadow-brand-sale/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? 'Changing Password...' : <><ShieldAlert size={20} /> Update Password Now</>}
            </button>
            
            <button type="button" onClick={() => setStep(1)} className="w-full text-[10px] font-black text-brand-dark/30 uppercase tracking-[2px] hover:text-brand-dark transition-colors">Go Back</button>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-8 py-10 text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-brand-green text-white rounded-[40px] flex items-center justify-center mx-auto shadow-xl shadow-brand-green/20">
              <CheckCircle2 size={48} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-head font-black text-brand-dark tracking-tight">Success! 🚀</h2>
              <p className="text-brand-dark/50 font-bold uppercase tracking-widest text-[10px]">Your Password has been updated</p>
            </div>
            <p className="text-sm font-bold text-brand-dark/70 bg-brand-green/5 py-4 px-6 rounded-2xl border border-brand-green/10">
              The changes are effective immediately. You'll need to use your new password next time you sign in.
            </p>
            <button 
              onClick={() => window.location.href = '/admin/dashboard'}
              className="px-10 py-4 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 mx-auto hover:bg-black transition-all"
            >
              Back to Dashboard <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
