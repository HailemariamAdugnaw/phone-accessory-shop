import { Link } from 'react-router-dom'
import { Star, ShoppingCart, Check } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div className="card group hover:shadow-lg transition-shadow">
      <Link to={`/products/${product.slug}`} className="block relative overflow-hidden">
        <div className="aspect-square bg-slate-100 overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        {product.discount_percentage > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            -{product.discount_percentage}%
          </span>
        )}
        {!product.in_stock && (
          <span className="absolute top-3 right-3 bg-slate-800 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Out of Stock
          </span>
        )}
      </Link>

      <div className="p-4">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 mb-1 hover:text-brand-600 transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs text-slate-600">{product.rating}</span>
          <span className="text-xs text-slate-400">({product.num_reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-slate-900">${product.effective_price}</span>
            {product.discount_price && (
              <span className="text-xs text-slate-400 line-through">${product.price}</span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            disabled={!product.in_stock}
            className="p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}