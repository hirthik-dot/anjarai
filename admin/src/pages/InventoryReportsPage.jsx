import React from 'react';
import { ClipboardList, PieChart, BarChart } from 'lucide-react';

export default function InventoryReportsPage() {
  return (
    <div className="p-20 text-center animate-in fade-in duration-1000">
      <div className="w-20 h-20 bg-brand-green/10 text-brand-green rounded-[32px] flex items-center justify-center mx-auto mb-6">
        <ClipboardList size={40} />
      </div>
      <h2 className="text-2xl font-head font-black text-brand-dark mb-2">Inventory Reports</h2>
      <p className="text-brand-dark/50 font-bold uppercase tracking-widest text-[10px] mb-8">Feature coming in Phase 3</p>
      
      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
        <div className="bg-white p-4 rounded-2xl border border-brand-green/5 opacity-50"><PieChart className="mx-auto text-brand-dark/20" /></div>
        <div className="bg-white p-4 rounded-2xl border border-brand-green/5 opacity-50"><BarChart className="mx-auto text-brand-dark/20" /></div>
      </div>
    </div>
  );
}
