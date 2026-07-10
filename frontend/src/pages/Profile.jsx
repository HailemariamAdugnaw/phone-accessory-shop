import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Mail, User, LogOut, ChevronRight, Calendar, DollarSign } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Profile() {
  const { currentUser, logout } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/')
      .then((res) => setOrders(res.data.results || res.data))
      .catch((err) => console.error('Orders fetch error:', err))
      .finally(() => setLoading(false))
  }, [])

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    paid: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* User card */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {(currentUser?.displayName || currentUser?.email || '?')[0].toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {currentUser?.displayName || 'Welcome'}
              </h1>
              <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                <Mail className="w-3.5 h-3.5" /> {currentUser?.email}
              </p>
            </div>
          </div>
          <button onClick={logout} className="btn-secondary !py-2 text-sm">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Orders */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Package className="w-5 h-5" /> Order History
        </h2>
        <span className="text-sm text-slate-500">{orders.length} orders</span>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : orders.length === 0 ? (
        <div className="card p-12 text-center">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 mb-4">You haven't placed any orders yet.</p>
          <Link to="/products" className="btn-primary inline-flex">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">#{order.order_number}</span>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${statusColors[order.status] || 'bg-slate-100 text-slate-700'}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Total</p>
                  <p className="text-xl font-bold text-brand-600">${order.total}</p>
                </div>
              </div>

              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg bg-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.product.slug}`}
                        className="font-medium text-slate-900 hover:text-brand-600 line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-slate-500 text-xs">
                        Qty: {item.quantity} × ${item.price_at_purchase}
                      </p>
                    </div>
                    <span className="font-semibold text-slate-900">
                      ${item.line_total}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  Ship to: {order.full_name}, {order.city}, {order.state} {order.zip_code}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}