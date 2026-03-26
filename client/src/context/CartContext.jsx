// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'

export const CartContext = createContext()

export function CartProvider({ children }) {
    const [items, setItems] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [addedItemName, setAddedItemName] = useState(null)

    const addItem = (product, qty = 1) => {
        setItems(prev => {
            const ex = prev.find(i => i.id === product.id)
            if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
            return [...prev, { ...product, qty }]
        })
        setAddedItemName(product.id)
        setIsOpen(true)

        // Clear the "Added!" feedback after 1100ms as per Section 10
        setTimeout(() => {
            setAddedItemName(null)
        }, 1100)
    }

    const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id))

    const updateQty = (id, qty) => {
        if (qty <= 0) return removeItem(id)
        setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
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
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)
