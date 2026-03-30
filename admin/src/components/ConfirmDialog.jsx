import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmDialog({ 
  isOpen, title, message, onConfirm, onCancel, 
  confirmLabel="Delete", confirmColor="sale" 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
            onClick={onCancel}
          />
          {/* Dialog */}
          <div className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 w-full sm:max-w-[400px] shadow-2xl relative safe-bottom"
            >
              <div className="text-4xl sm:text-5xl text-center mb-3 sm:mb-4">⚠️</div>
              <h3 className="font-head text-xl sm:text-2xl font-bold text-center text-brand-dark">{title}</h3>
              <p className="text-brand-mid text-xs sm:text-sm text-center mt-2 sm:mt-3 mb-6 sm:mb-8 px-2 sm:px-4 leading-relaxed">
                {message}
              </p>
              
              <div className="flex gap-3 sm:gap-4">
                <button 
                  onClick={onCancel}
                  className="flex-1 border-2 border-gray-200 rounded-xl sm:rounded-2xl py-3 font-bold text-brand-mid hover:bg-gray-50 transition-colors active:scale-95 text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={onConfirm}
                  className={`flex-1 rounded-xl sm:rounded-2xl py-3 font-bold text-white transition-opacity hover:opacity-90 active:scale-95 text-sm ${
                    confirmColor === 'sale' ? 'bg-brand-sale' : 'bg-brand-green'
                  }`}
                >
                  {confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
