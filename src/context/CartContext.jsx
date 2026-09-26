// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

const STORAGE_KEY = 'cart'

export default function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  // A cart line is unique by product + variant (size/color combo).
  // Adding the same product+variant again just bumps the quantity.
  const addItem = ({ productId, variantId, name, price, image, size, color, quantity = 1 }) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.productId === productId && item.variantId === variantId
      )
      if (existing) {
        return prev.map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { productId, variantId, name, price, image, size, color, quantity }]
    })
  }

  const updateQuantity = (productId, variantId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId, variantId)
      return
    }
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const removeItem = (productId, variantId) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.variantId === variantId)
      )
    )
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}