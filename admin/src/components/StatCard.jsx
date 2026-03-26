export default function StatCard({ icon, label, value, color="green", onClick }) {
  const colors = {
    green: 'bg-brand-green-pale text-brand-green',
    warm:  'bg-brand-warm/10 text-brand-warm',
    sale:  'bg-brand-sale/10 text-brand-sale',
    dark:  'bg-brand-dark/10 text-brand-dark',
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50 hover:shadow-xl hover:-translate-y-1.5 transition-all cursor-pointer group animate-in slide-in-from-bottom-4 duration-500`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110 duration-300 ${colors[color] || colors.green}`}>
        {icon}
      </div>
      <div className="mt-5">
        <h4 className="text-brand-mid text-sm font-bold tracking-tight uppercase group-hover:text-brand-green transition-colors">{label}</h4>
        <div className="text-4xl font-black text-brand-dark font-head mt-1 flex items-baseline gap-1">
          {value}
          <span className="text-[10px] text-brand-green font-bold animate-pulse">●</span>
        </div>
      </div>
    </div>
  );
}
