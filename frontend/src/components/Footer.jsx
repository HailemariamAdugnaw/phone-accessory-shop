import { Link } from 'react-router-dom'
import { Twitter, Instagram, Facebook, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="font-bold text-xl text-white">PhoneGear</span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs">
              Premium phone accessories for every device. Quality you can trust, prices you'll love.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products?category=phone-cases" className="hover:text-brand-400">Phone Cases</Link></li>
              <li><Link to="/products?category=chargers" className="hover:text-brand-400">Chargers</Link></li>
              <li><Link to="/products?category=earphones" className="hover:text-brand-400">Earphones</Link></li>
              <li><Link to="/products?category=power-banks" className="hover:text-brand-400">Power Banks</Link></li>
              <li><Link to="/products?category=cables" className="hover:text-brand-400">Cables</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-brand-400">Help Center</a></li>
              <li><a href="#" className="hover:text-brand-400">Shipping Info</a></li>
              <li><a href="#" className="hover:text-brand-400">Returns</a></li>
              <li><a href="#" className="hover:text-brand-400">Warranty</a></li>
              <li><a href="#" className="hover:text-brand-400">Contact Us</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-4">Stay Updated</h4>
            <p className="text-sm text-slate-400 mb-4">Get the latest deals and new arrivals.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-brand-500"
              />
              <button className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 text-sm font-medium">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">© 2024 PhoneGear. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-400 hover:text-white"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-slate-400 hover:text-white"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="text-slate-400 hover:text-white"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="text-slate-400 hover:text-white"><Youtube className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}