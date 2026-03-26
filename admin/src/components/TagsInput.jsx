import { useState } from 'react';

export default function TagsInput({ value = [], onChange, placeholder }) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = input.trim();
      if (val && !value.includes(val)) {
        onChange([...value, val]);
        setInput('');
      }
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="border-2 border-brand-green-pale rounded-xl px-3 py-2 flex flex-wrap gap-2 bg-brand-light/50 focus-within:border-brand-green transition-colors min-h-[48px]">
      {value.map((tag, i) => (
        <span 
          key={i} 
          className="bg-brand-green-pale text-brand-green text-xs font-black rounded-full px-3 py-1 flex items-center gap-2 animate-in zoom-in-90 duration-200"
        >
          {tag}
          <button 
            type="button" 
            onClick={() => removeTag(i)} 
            className="hover:text-brand-sale transition-colors text-base leading-none"
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 bg-transparent outline-none text-brand-dark text-[14px] min-w-[80px]"
      />
    </div>
  );
}
