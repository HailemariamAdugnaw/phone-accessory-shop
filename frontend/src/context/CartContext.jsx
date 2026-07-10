import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart_items')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items))
  }, [items])

  function addToCart(product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: parseFloat(product.effective_price || product.price),
        image_url: product.image_url,
        stock: product.stock,
        quantity,
      }]
    })
    toast.success(`${product.name} added to cart`)
  }

  function removeFromCart(productId) {
    setItems((prev) => prev.filter((i) => i.id !== productId))
    toast.success('Item removed from cart')
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) return
    setItems((prev) =>
      prev.map((i) => (i.id === productId ? { ...i, quantity } : i))
    )
  }

  function clearCart() {
    setItems([])
  }

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const cartSubtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shippingCost = cartSubtotal >= 50 || cartSubtotal === 0 ? 0 : 5.99
  const cartTotal = cartSubtotal + shippingCost

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartSubtotal,
    shippingCost,
    cartTotal,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}