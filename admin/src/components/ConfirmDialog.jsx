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
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-[400px] w-full shadow-2xl relative"
            >
              <div className="text-5xl text-center mb-4">⚠️</div>
              <h3 className="font-head text-2xl font-bold text-center text-brand-dark">{title}</h3>
              <p className="text-brand-mid text-sm text-center mt-3 mb-8 px-4 leading-relaxed">
                {message}
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={onCancel}
                  className="flex-1 border-2 border-gray-200 rounded-2xl py-3 font-bold text-brand-mid hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={onConfirm}
                  className={`flex-1 rounded-2xl py-3 font-bold text-white transition-opacity hover:opacity-90 ${
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
