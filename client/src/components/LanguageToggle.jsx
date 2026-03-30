// client/src/components/LanguageToggle.jsx
import { useLang } from '../context/LanguageContext';

export default function LanguageToggle({ className = '' }) {
  const { isTamil, toggleLang } = useLang();

  return (
    <button
      onClick={toggleLang}
      className={`relative flex items-center gap-1.5 bg-green-pale/60 hover:bg-green-pale rounded-full px-1 py-1 transition-all duration-300 group border border-green/10 ${className}`}
      aria-label="Toggle language"
      title={isTamil ? 'Switch to English' : 'தமிழுக்கு மாற்றவும்'}
    >
      {/* EN label */}
      <span
        className={`relative z-10 text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2 py-1 rounded-full transition-all duration-300 select-none ${
          !isTamil 
            ? 'text-white' 
            : 'text-green/60 hover:text-green'
        }`}
      >
        EN
      </span>

      {/* Tamil label */}
      <span
        className={`relative z-10 text-[10px] sm:text-[11px] font-black tracking-wider px-2 py-1 rounded-full transition-all duration-300 select-none ${
          isTamil 
            ? 'text-white' 
            : 'text-green/60 hover:text-green'
        }`}
      >
        த
      </span>

      {/* Sliding pill indicator */}
      <span
        className={`absolute top-1 bottom-1 w-[calc(50%-2px)] bg-green rounded-full shadow-md shadow-green/30 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isTamil ? 'left-[calc(50%+1px)]' : 'left-1'
        }`}
      />
    </button>
  );
}
