import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, Search, LogOut, Package } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { currentUser, logout } = useAuth()
  const { cartCount } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setMobileOpen(false)
    }
  }

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/products' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl text-slate-900 hidden sm:block">PhoneGear</span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search accessories..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-100 border border-transparent focus:bg-white focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all text-sm"
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/cart"
              className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5 text-slate-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {currentUser ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <User className="w-5 h-5 text-slate-700" />
                  <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5 text-slate-700" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="btn-secondary !py-2 !px-4 text-sm">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary !py-2 !px-4 text-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Secondary nav links */}
        <nav className="hidden lg:flex items-center gap-6 h-10 border-t border-slate-100">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? 'text-brand-600'
                  : 'text-slate-600 hover:text-brand-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/products?category=phone-cases" className="text-sm text-slate-600 hover:text-brand-600">
            Cases
          </Link>
          <Link to="/products?category=chargers" className="text-sm text-slate-600 hover:text-brand-600">
            Chargers
          </Link>
          <Link to="/products?category=earphones" className="text-sm text-slate-600 hover:text-brand-600">
            Earphones
          </Link>
          <Link to="/products?category=power-banks" className="text-sm text-slate-600 hover:text-brand-600">
            Power Banks
          </Link>
        </nav>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-4 space-y-4">
            <form onSubmit={handleSearch} className="md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search accessories..."
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-100 focus:outline-none text-sm"
                />
              </div>
            </form>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-slate-700 hover:text-brand-600"
              >
                {link.label}
              </Link>
            ))}

            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-slate-700"
                >
                  <Package className="w-4 h-4" /> My Orders
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false) }}
                  className="flex items-center gap-2 text-sm font-medium text-slate-700"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary !py-2 flex-1 text-sm">
                  Login
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary !py-2 flex-1 text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}