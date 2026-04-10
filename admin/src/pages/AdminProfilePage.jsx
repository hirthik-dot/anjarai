import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { User, Mail, Phone, ShieldCheck, Save, Send, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({ full_name: '', email: '', phone: '', whatsapp_number: '', email_verified: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/admin-profile');
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
      await api.put('/admin-profile', { 
        full_name: profile.full_name, 
        email: profile.email,
        phone: profile.phone,
        whatsapp_number: profile.whatsapp_number 
      });
      toast.success('Profile and Admin Login updated');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-brand-dark/30 italic">Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 pb-20">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-brand-green/10 text-brand-green rounded-[24px]">
          <User size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-head font-black text-brand-dark">Admin <span className="text-brand-green">Profile</span></h1>
          <p className="text-brand-dark/50 font-bold uppercase tracking-widest text-[10px]">Manage your administrative identity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Main Info */}
        <div className="bg-white p-10 rounded-[48px] shadow-sm border border-brand-green/5 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
             <User size={200} />
          </div>

          <form onSubmit={handleUpdate} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest px-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/20" size={18} />
                  <input 
                    type="text" 
                    value={profile.full_name} 
                    onChange={e => setProfile({...profile, full_name: e.target.value})}
                    className="w-full bg-brand-green/5 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-brand-warm transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest px-1">Login Email / Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/20" size={18} />
                  <input 
                    type="email" 
                    value={profile.email} 
                    onChange={e => setProfile({...profile, email: e.target.value})}
                    className="w-full bg-brand-green/5 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-brand-warm transition-all outline-none"
                  />
                </div>
                <p className="text-[9px] text-brand-sale font-black uppercase tracking-tighter ml-1 italic opacity-70">Updating this will change your login email & website contact info</p>
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
                    className="w-full bg-brand-green/5 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-brand-warm transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest px-1">WhatsApp Number</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/20 font-black text-[10px]">WA</div>
                  <input 
                    type="text" 
                    value={profile.whatsapp_number || ''} 
                    onChange={e => setProfile({...profile, whatsapp_number: e.target.value})}
                    placeholder="919994617120"
                    className="w-full bg-brand-green/5 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-brand-warm transition-all outline-none"
                  />
                </div>
                <p className="text-[9px] text-brand-dark/40 font-bold ml-1 opacity-60">Include country code (e.g. 91xxxxxxxxxx)</p>
              </div>
            </div>

            <div className="pt-6 border-t border-brand-green/10 flex justify-end">
              <button 
                type="submit" 
                disabled={saving}
                className="w-full md:w-fit px-12 bg-brand-green text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-green/20 disabled:opacity-50"
              >
                {saving ? 'Processing...' : <><Save size={20} /> Save Profile Changes</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
