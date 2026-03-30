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
      className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100/50 hover:shadow-xl hover:-translate-y-1.5 transition-all cursor-pointer group active:scale-[0.97]`}
    >
      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-3xl transition-transform group-hover:scale-110 duration-300 ${colors[color] || colors.green}`}>
        {icon}
      </div>
      <div className="mt-3 sm:mt-5">
        <h4 className="text-brand-mid text-[10px] sm:text-sm font-bold tracking-tight uppercase group-hover:text-brand-green transition-colors leading-tight">{label}</h4>
        <div className="text-2xl sm:text-4xl font-black text-brand-dark font-head mt-0.5 sm:mt-1 flex items-baseline gap-1">
          {value}
          <span className="text-[8px] sm:text-[10px] text-brand-green font-bold animate-pulse">●</span>
        </div>
      </div>
    </div>
  );
}
