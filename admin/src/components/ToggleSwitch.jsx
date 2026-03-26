export default function ToggleSwitch({ checked, onChange, label }) {
  return (
    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onChange(!checked)}>
      <div 
        className={`w-11 h-6 rounded-full relative transition-all duration-300 shadow-inner ${
          checked ? 'bg-brand-green' : 'bg-brand-mid/20'
        }`}
      >
        <div 
          className={`absolute w-5 h-5 bg-white rounded-full shadow-md top-0.5 transition-all duration-300 ${
            checked ? 'left-5.5 scale-110' : 'left-0.5 scale-100'
          }`}
          style={{ left: checked ? '22px' : '2px' }}
        />
      </div>
      {label && <span className="text-[13px] font-bold text-brand-dark/70 group-hover:text-brand-dark transition-colors">{label}</span>}
    </div>
  );
}
