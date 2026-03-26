export default function SectionCard({ title, subtitle, children, onSave, saving = false }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 flex flex-col mb-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center px-8 py-6 border-b border-gray-50 bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div>
          <h3 className="font-head text-2xl font-bold text-brand-dark tracking-tight">{title}</h3>
          {subtitle && <p className="text-brand-mid text-xs font-semibold mt-1 opacity-70 uppercase tracking-widest">{subtitle}</p>}
        </div>
        {onSave && (
          <button 
            onClick={onSave}
            disabled={saving}
            className="bg-brand-green hover:bg-brand-green-light text-white rounded-2xl px-8 py-2.5 text-sm font-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-brand-green/20"
          >
            {saving ? (
              <><span className="animate-spin text-lg">⏳</span> SAVING...</>
            ) : (
              'SAVE CHANGES'
            )}
          </button>
        )}
      </div>
      <div className="p-8 bg-brand-light/5">
        {children}
      </div>
    </div>
  );
}
