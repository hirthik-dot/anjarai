import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, User, Mail, Phone, Calendar, Search, Filter, ShieldCheck, XCircle, RefreshCcw } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function ClientUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, verified, unverified, inactive
  const toast = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/clients/list');
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const stats = {
    total: users.length,
    verified: users.filter(u => u.email_verified).length,
    unverified: users.filter(u => !u.email_verified).length,
    inactive: users.filter(u => !u.is_active).length
  };

  const filtered = users.filter(u => {
    const matchesSearch = u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.phone?.includes(searchTerm);
    if (filter === 'verified') return matchesSearch && u.email_verified;
    if (filter === 'unverified') return matchesSearch && !u.email_verified;
    if (filter === 'inactive') return matchesSearch && !u.is_active;
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-head font-black text-brand-dark flex items-center gap-3">
            <Users className="text-brand-green" size={32} />
            Customer <span className="text-brand-warm">Registry</span>
          </h1>
          <p className="text-brand-dark/50 font-bold mt-1 uppercase tracking-widest text-[10px]">Manage your registered shoppers</p>
        </div>
        
        <button 
          onClick={fetchUsers}
          className="p-3 bg-white border border-brand-green/10 rounded-2xl text-brand-green hover:bg-brand-green/5 transition-colors shadow-sm self-start md:self-auto"
        >
          <RefreshCcw size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <UserStatCard label="Total Customers" value={stats.total} icon={Users} color="blue" />
        <UserStatCard label="Verified Emails" value={stats.verified} icon={ShieldCheck} color="green" />
        <UserStatCard label="Unverified" value={stats.unverified} icon={AlertTriangle} color="orange" onClick={() => setFilter('unverified')} isActive={filter === 'unverified'} />
        <UserStatCard label="Inactive" value={stats.inactive} icon={XCircle} color="red" onClick={() => setFilter('inactive')} isActive={filter === 'inactive'} />
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-brand-green/5 overflow-hidden">
        <div className="p-8 border-b border-brand-green/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" size={18} />
            <input 
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-brand-green/5 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold placeholder:text-brand-dark/30 focus:ring-2 focus:ring-brand-warm transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={18} className="text-brand-dark/30 mr-1" />
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-brand-green text-white' : 'bg-brand-green/5 text-brand-green hover:bg-brand-green/10'}`}>All</button>
            <button onClick={() => setFilter('verified')} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'verified' ? 'bg-brand-green text-white' : 'bg-brand-green/5 text-brand-green hover:bg-brand-green/10'}`}>Verified</button>
            <button onClick={() => setFilter('unverified')} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'unverified' ? 'bg-brand-warm text-white' : 'bg-brand-warm/5 text-brand-warm hover:bg-brand-warm/10'}`}>Unverified</button>
          </div>
        </div>

        <div className="overflow-x-auto px-4">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr>
                <th className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Customer</th>
                <th className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Contact Info</th>
                <th className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Status</th>
                <th className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Joined On</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="py-20 text-center text-brand-dark/30 font-bold italic">Gathering customer data...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="4" className="py-20 text-center text-brand-dark/30 font-bold italic">No customers found</td></tr>
              ) : filtered.map((u) => (
                <tr key={u._id} className="group transition-all">
                  <td className="px-6 py-4 bg-brand-green/[0.02] rounded-l-[24px] group-hover:bg-brand-green/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[20px] bg-brand-warm/10 text-brand-warm flex items-center justify-center font-black text-lg border border-brand-warm/20">
                        {u.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-brand-dark text-sm">{u.full_name}</p>
                        <p className="text-[10px] font-black text-brand-dark/30 uppercase tracking-widest mt-0.5">ID: {u._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 bg-brand-green/[0.02] group-hover:bg-brand-green/5 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-brand-dark/70">
                        <Mail size={12} className="text-brand-green" /> {u.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-brand-dark/70">
                        <Phone size={12} className="text-brand-green" /> {u.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 bg-brand-green/[0.02] group-hover:bg-brand-green/5 transition-colors">
                    <div className="flex flex-col gap-2">
                       {u.email_verified ? (
                         <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-brand-green">
                           <ShieldCheck size={14} /> Verified
                         </span>
                       ) : (
                         <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-brand-warm">
                           <AlertTriangle size={14} /> Unverified
                         </span>
                       )}
                       {u.is_active ? (
                         <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-brand-green/60">Active Account</span>
                       ) : (
                         <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-brand-sale">Disabled</span>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-4 bg-brand-green/[0.02] rounded-r-[24px] group-hover:bg-brand-green/5 transition-colors">
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-dark/50">
                      <Calendar size={14} />
                      {new Date(u.created_at).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UserStatCard({ label, value, icon: Icon, color, isActive, onClick }) {
  const colors = {
    blue:   'bg-blue-50 text-blue-600 border-blue-100',
    green:  'bg-emerald-50 text-emerald-600 border-emerald-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    red:    'bg-rose-50 text-rose-600 border-rose-100'
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-[32px] border transition-all cursor-pointer ${
        isActive ? 'ring-2 ring-brand-warm shadow-xl translate-y-[-4px]' : 'border-brand-green/5 shadow-sm hover:translate-y-[-2px]'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-[18px] border shadow-sm ${colors[color]}`}>
          <Icon size={24} />
        </div>
        <div className={`text-2xl font-head font-black ${colors[color].split(' ')[1]}`}>
          {value}
        </div>
      </div>
      <p className="text-[10px] font-black text-brand-dark/40 uppercase tracking-[2px]">{label}</p>
    </div>
  );
}

const AlertTriangle = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);
