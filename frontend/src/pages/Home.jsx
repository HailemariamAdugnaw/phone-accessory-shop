import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Headphones, Star } from 'lucide-react'
import api from '../services/api'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/products/featured/'),
      api.get('/products/categories/'),
    ])
      .then(([featRes, catRes]) => {
        setFeatured(featRes.data)
        setCategories(catRes.data)
      })
      .catch((err) => console.error('Home fetch error:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div>
      {/* ─── Hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 text-white">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-block bg-white/20 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              🔥 Mega Sale — Up to 40% Off
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Premium Accessories for Your Phone
            </h1>
            <p className="text-lg text-brand-100 mb-8 max-w-xl">
              Discover top-quality phone cases, fast chargers, wireless earbuds, and more.
              Free shipping on orders over $50.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-700 font-bold rounded-xl hover:bg-brand-50 transition-colors shadow-lg">
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/products?category=phone-cases" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-colors">
                Browse Cases
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features bar ─────────────────────────────── */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: ShieldCheck, title: '2-Year Warranty', desc: 'On all products' },
              { icon: RotateCcw, title: '30-Day Returns', desc: 'Hassle-free returns' },
              { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
            ].map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <div className="w-11 h-11 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-900">{f.title}</p>
                  <p className="text-xs text-slate-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Categories ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Shop by Category</h2>
          <Link to="/products" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 hover:shadow-lg transition-shadow"
            >
              <img
                src={cat.image_url}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <div>
                  <h3 className="text-white font-semibold text-sm">{cat.name}</h3>
                  <p className="text-white/70 text-xs">{cat.product_count} items</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Featured Products ────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Featured Products</h2>
              <p className="text-slate-500 text-sm mt-1">Handpicked favorites loved by our customers</p>
            </div>
            <Link to="/products" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Promo Banner ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 to-brand-800 text-white p-8 sm:p-12 lg:p-16">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 80% 50%, white 2px, transparent 2px)',
            backgroundSize: '40px 40px'
          }} />
          <div className="relative max-w-lg">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Get 20% Off Your First Order
            </h2>
            <p className="text-slate-300 mb-6">
              Sign up today and instantly receive a 20% discount code for your first purchase.
              No minimum spend required.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors"
            >
              Create Account <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}