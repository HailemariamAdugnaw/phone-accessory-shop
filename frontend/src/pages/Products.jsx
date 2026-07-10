import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import api from '../services/api'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null })

  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const minPrice = searchParams.get('min_price') || ''
  const maxPrice = searchParams.get('max_price') || ''
  const ordering = searchParams.get('ordering') || ''
  const page = searchParams.get('page') || '1'

  useEffect(() => {
    api.get('/products/categories/')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    if (minPrice) params.set('min_price', minPrice)
    if (maxPrice) params.set('max_price', maxPrice)
    if (ordering) params.set('ordering', ordering)
    if (page !== '1') params.set('page', page)

    api.get(`/products/?${params.toString()}`)
      .then((res) => {
        setProducts(res.data.results || res.data)
        if (res.data.count !== undefined) {
          setPagination({
            count: res.data.count,
            next: res.data.next,
            previous: res.data.previous,
          })
        }
      })
      .catch((err) => console.error('Products fetch error:', err))
      .finally(() => setLoading(false))
  }, [search, category, minPrice, maxPrice, ordering, page])

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    // Reset to page 1 on filter change
    if (key !== 'page') next.delete('page')
    setSearchParams(next)
  }

  function clearFilters() {
    setSearchParams(new URLSearchParams())
  }

  const hasFilters = search || category || minPrice || maxPrice

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {category
            ? categories.find((c) => c.slug === category)?.name || 'Products'
            : search
            ? `Search: "${search}"`
            : 'All Products'}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {pagination.count > 0 ? `${pagination.count} products found` : 'Browse our collection'}
        </p>
      </div>

      <div className="flex gap-8">
        {/* ─── Sidebar Filters ─── */}
        <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-black/50 lg:bg-transparent lg:static lg:inset-auto' : 'hidden'} lg:block w-full lg:w-64 shrink-0`}>
          <div className={`${showFilters ? 'absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white p-6 overflow-y-auto lg:static lg:w-full lg:p-0' : ''} lg:bg-transparent`}>
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <h3 className="font-bold text-slate-900">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 lg:sticky lg:top-24">
              {/* Category */}
              <div>
                <h3 className="font-semibold text-sm text-slate-900 mb-3">Category</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => updateParam('category', '')}
                    className={`block text-sm w-full text-left px-3 py-1.5 rounded-lg transition-colors ${
                      !category ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateParam('category', cat.slug)}
                      className={`block text-sm w-full text-left px-3 py-1.5 rounded-lg transition-colors ${
                        category === cat.slug ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {cat.name} <span className="text-slate-400">({cat.product_count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-sm text-slate-900 mb-3">Price Range</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => updateParam('min_price', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <span className="text-slate-400">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => updateParam('max_price', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* ─── Products Grid ─── */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-slate-500 hidden sm:block">Sort by:</span>
              <select
                value={ordering}
                onChange={(e) => updateParam('ordering', e.target.value)}
                className="px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="">Newest</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-rating">Highest Rated</option>
                <option value="-num_reviews">Most Reviewed</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">No products found.</p>
              <button onClick={clearFilters} className="mt-4 text-brand-600 font-medium hover:text-brand-700">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.count > 12 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {pagination.previous && (
                    <button
                      onClick={() => updateParam('page', String(Number(page) - 1))}
                      className="px-4 py-2 border border-slate-300 rounded-xl text-sm hover:bg-slate-50"
                    >
                      Previous
                    </button>
                  )}
                  <span className="px-4 py-2 text-sm text-slate-600">Page {page}</span>
                  {pagination.next && (
                    <button
                      onClick={() => updateParam('page', String(Number(page) + 1))}
                      className="px-4 py-2 border border-slate-300 rounded-xl text-sm hover:bg-slate-50"
                    >
                      Next
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}