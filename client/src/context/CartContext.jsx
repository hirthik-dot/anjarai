// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'

export const CartContext = createContext()

export function CartProvider({ children }) {
    const [items, setItems] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [addedItemName, setAddedItemName] = useState(null)

    const addItem = (product, qty = 1, openDrawer = true) => {
        setItems(prev => {
            const variantName = typeof product.selectedVariant === 'object' ? product.selectedVariant.name : product.selectedVariant;
            const cartItemId = variantName ? `${product.id}-${variantName}` : product.id;
            
            const ex = prev.find(i => i.cartItemId === cartItemId || i.id === cartItemId); // fallback for existing items
            if (ex) return prev.map(i => (i.cartItemId === cartItemId || i.id === cartItemId) ? { ...i, qty: i.qty + qty } : i)
            return [...prev, { ...product, cartItemId, qty }]
        })
        setAddedItemName(product.id)
        if (openDrawer) setIsOpen(true)

        // Clear the "Added!" feedback after 1100ms as per Section 10
        setTimeout(() => {
            setAddedItemName(null)
        }, 1100)
    }

    const removeItem = (cartItemId) => setItems(prev => prev.filter(i => (i.cartItemId || i.id) !== cartItemId))

    const updateQty = (cartItemId, qty) => {
        if (qty <= 0) return removeItem(cartItemId)
        setItems(prev => prev.map(i => (i.cartItemId || i.id) === cartItemId ? { ...i, qty } : i))
    }

    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
    const count = items.reduce((sum, i) => sum + i.qty, 0)

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQty,
            total,
            count,
            isOpen,
            setIsOpen,
            addedItemName
        }}>
            {children}
            
            {/* Android-style Toast Notification */}
            <div 
                className={`fixed bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-[10000] px-5 py-2.5 bg-neutral-800/90 backdrop-blur-sm text-white text-[12px] sm:text-[13px] font-medium rounded-full shadow-xl transition-all duration-300 pointer-events-none flex items-center gap-2
                ${addedItemName ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}
            >
                <div className="w-3.5 h-3.5 rounded-full bg-green text-white flex items-center justify-center text-[9px] font-black shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
                Added to cart
            </div>
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)
