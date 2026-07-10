import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CreditCard, Lock, CheckCircle, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function Checkout() {
  const { items, cartSubtotal, shippingCost, cartTotal, clearCart } = useCart()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(null)

  const [form, setForm] = useState({
    full_name: currentUser?.displayName || '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'United States',
    phone: '',
    card_number: '',
    card_expiry: '',
    card_cvv: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setProcessing(true)

    try {
      const orderData = {
        items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
        full_name: form.full_name,
        address_line_1: form.address_line_1,
        address_line_2: form.address_line_2,
        city: form.city,
        state: form.state,
        zip_code: form.zip_code,
        country: form.country,
        phone: form.phone,
        payment_method: 'mock_card',
      }

      const res = await api.post('/orders/', orderData)
      setSuccess(res.data)
      clearCart()
      toast.success('Order placed successfully!')
    } catch (err) {
      toast.error(err.userMessage || 'Failed to place order. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  // Success screen
  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
        <p className="text-slate-500 mb-4">Thank you for your purchase.</p>
        <div className="bg-slate-50 rounded-2xl p-6 mb-6">
          <p className="text-sm text-slate-500">Order Number</p>
          <p className="text-xl font-bold text-brand-600">#{success.order_number}</p>
          <p className="text-sm text-slate-500 mt-3">Total Paid</p>
          <p className="text-xl font-bold text-slate-900">${success.total}</p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link to="/profile" className="btn-secondary">
            View Orders
          </Link>
          <Link to="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500 text-lg mb-4">Your cart is empty.</p>
        <Link to="/products" className="btn-primary inline-flex">Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping */}
          <div className="card p-6">
            <h2 className="font-bold text-lg text-slate-900 mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text" name="full_name" required value={form.full_name}
                  onChange={handleChange} className="input-field"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 1</label>
                <input
                  type="text" name="address_line_1" required value={form.address_line_1}
                  onChange={handleChange} className="input-field" placeholder="Street address"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 2 (Optional)</label>
                <input
                  type="text" name="address_line_2" value={form.address_line_2}
                  onChange={handleChange} className="input-field" placeholder="Apartment, suite, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                <input
                  type="text" name="city" required value={form.city}
                  onChange={handleChange} className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                <input
                  type="text" name="state" required value={form.state}
                  onChange={handleChange} className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ZIP Code</label>
                <input
                  type="text" name="zip_code" required value={form.zip_code}
                  onChange={handleChange} className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="tel" name="phone" required value={form.phone}
                  onChange={handleChange} className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-slate-900">Payment</h2>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Lock className="w-3 h-3" /> Mock Payment (no real charge)
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text" name="card_number" required maxLength="19"
                    value={form.card_number}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
                      setForm({ ...form, card_number: v })
                    }}
                    placeholder="4242 4242 4242 4242"
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text" name="card_expiry" required maxLength="5"
                    value={form.card_expiry}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, '')
                      if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2)
                      setForm({ ...form, card_expiry: v })
                    }}
                    placeholder="12/27"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                  <input
                    type="text" name="card_cvv" required maxLength="4"
                    value={form.card_cvv}
                    onChange={(e) => setForm({ ...form, card_cvv: e.target.value.replace(/\D/g, '') })}
                    placeholder="123"
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-bold text-lg text-slate-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <img src={item.image_url} alt={item.name} className="w-12 h-12 object-cover rounded-lg bg-slate-100" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 line-clamp-1">{item.name}</p>
                    <p className="text-slate-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                  </div>
                  <span className="font-semibold text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-semibold">${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Shipping</span>
                <span className="font-semibold">
                  {shippingCost === 0 ? <span className="text-green-600">FREE</span> : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-bold text-xl text-brand-600">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button type="submit" disabled={processing} className="btn-primary w-full mt-6">
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" /> Place Order
                </>
              )}
            </button>

            <p className="text-xs text-slate-400 text-center mt-3">
              This is a demo. No real payment will be processed.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}