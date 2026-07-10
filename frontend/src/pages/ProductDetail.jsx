import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, ShoppingCart, Minus, Plus, ChevronRight, Truck, ShieldCheck, RotateCcw } from 'lucide-react'
import api from '../services/api'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  useEffect(() => {
    setLoading(true)
    setQuantity(1)
    api.get(`/products/${slug}/`)
      .then((res) => {
        setProduct(res.data)
        // Fetch related products
        if (res.data.category_slug) {
          return api.get(`/products/?category=${res.data.category_slug}&ordering=-rating&page_size=5`)
        }
      })
      .then((res) => {
        if (res) {
          const relatedProducts = (res.data.results || res.data).filter((p) => p.slug !== slug).slice(0, 4)
          setRelated(relatedProducts)
        }
      })
      .catch((err) => console.error('Product detail error:', err))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <LoadingSpinner />
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500 text-lg">Product not found.</p>
        <Link to="/products" className="text-brand-600 font-medium mt-4 inline-block">
          ← Back to products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/products" className="hover:text-brand-600">Products</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/products?category=${product.category_slug}`} className="hover:text-brand-600">
          {product.category_name}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900 truncate">{product.name}</span>
      </nav>

      {/* Product main */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="relative">
          <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.discount_percentage > 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
              -{product.discount_percentage}% OFF
            </span>
          )}
        </div>

        {/* Info */}
        <div>
          <Link
            to={`/products?category=${product.category_slug}`}
            className="inline-block text-sm font-medium text-brand-600 mb-2"
          >
            {product.category_name}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-slate-200 text-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-slate-600">
              {product.rating} ({product.num_reviews} reviews)
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-slate-900">${product.effective_price}</span>
            {product.discount_price && (
              <span className="text-lg text-slate-400 line-through">${product.price}</span>
            )}
          </div>

          <p className="text-slate-600 mb-6 leading-relaxed">{product.description}</p>

          {/* Stock */}
          <div className="mb-6">
            {product.in_stock ? (
              <span className="inline-flex items-center gap-2 text-sm text-green-600 font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm text-red-600 font-medium">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                Out of Stock
              </span>
            )}
          </div>

          {/* Quantity & Add to cart */}
          {product.in_stock && (
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-slate-300 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-slate-100 rounded-l-xl transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 py-3 font-semibold min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 hover:bg-slate-100 rounded-r-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => addToCart(product, quantity)}
                className="btn-primary flex-1"
              >
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
            <div className="flex flex-col items-center text-center gap-1">
              <Truck className="w-5 h-5 text-brand-600" />
              <span className="text-xs text-slate-600">Free Shipping<br />over $50</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <ShieldCheck className="w-5 h-5 text-brand-600" />
              <span className="text-xs text-slate-600">2-Year<br />Warranty</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <RotateCcw className="w-5 h-5 text-brand-600" />
              <span className="text-xs text-slate-600">30-Day<br />Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-slate-900 mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}