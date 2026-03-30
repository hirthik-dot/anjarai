import { useState } from 'react';

export default function DataTable({ columns, data, onEdit, onDelete, searchable = true, placeholder = "Search..." }) {
  const [search, setSearch] = useState('');

  const filtered = data.filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100/50 shadow-sm overflow-hidden flex flex-col">
      {searchable && (
        <div className="px-4 sm:px-8 py-3 sm:py-6 border-b border-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="relative flex-1 w-full max-w-md">
            <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-brand-mid text-base sm:text-lg transition-colors group-focus-within:text-brand-green">🔍</span>
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-brand-light/50 border-2 border-brand-green-pale rounded-xl sm:rounded-2xl pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold focus:border-brand-green outline-none transition-all placeholder:text-brand-mid/50"
            />
          </div>
          <div className="text-[9px] sm:text-[10px] font-black text-brand-mid/50 uppercase tracking-widest bg-brand-light px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-gray-100 self-end sm:self-auto shrink-0">
            {filtered.length} Results
          </div>
        </div>
      )}
      <div className="overflow-x-auto min-h-[200px] sm:min-h-[400px]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-brand-light/30 border-b border-gray-100">
              {columns.map((col, i) => (
                <th key={i} className="py-3 sm:py-5 px-3 sm:px-6 text-[9px] sm:text-[11px] font-black uppercase tracking-wider sm:tracking-widest text-brand-mid/70 border-r border-gray-100/30 last:border-r-0 whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 sm:py-20 text-center text-brand-mid font-bold italic opacity-40 text-sm">
                  No records found... 🌿
                </td>
              </tr>
            ) : (
              filtered.map((item, idx) => (
                <tr key={idx} className="hover:bg-brand-green-pale/10 transition-colors group">
                  {columns.map((col, i) => (
                    <td key={i} className="py-3 sm:py-4 px-3 sm:px-6 text-brand-dark/90 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] sm:max-w-[300px] text-xs sm:text-sm">
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
