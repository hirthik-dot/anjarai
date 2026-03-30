export default function SectionCard({ title, subtitle, children, onSave, saving = false }) {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden border border-gray-100 flex flex-col mb-4 sm:mb-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-50 bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="min-w-0">
          <h3 className="font-head text-lg sm:text-2xl font-bold text-brand-dark tracking-tight leading-tight">{title}</h3>
          {subtitle && <p className="text-brand-mid text-[10px] sm:text-xs font-semibold mt-0.5 sm:mt-1 opacity-70 uppercase tracking-widest truncate">{subtitle}</p>}
        </div>
        {onSave && (
          <button 
            onClick={onSave}
            disabled={saving}
            className="bg-brand-green hover:bg-brand-green-light text-white rounded-xl sm:rounded-2xl px-5 sm:px-8 py-2.5 text-xs sm:text-sm font-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-brand-green/20 w-full sm:w-auto shrink-0"
          >
            {saving ? (
              <><span className="animate-spin text-lg">⏳</span> SAVING...</>
            ) : (
              'SAVE CHANGES'
            )}
          </button>
        )}
      </div>
      <div className="p-4 sm:p-8 bg-brand-light/5">
        {children}
      </div>
    </div>
  );
}
