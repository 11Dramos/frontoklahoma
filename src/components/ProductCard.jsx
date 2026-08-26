import { formatPrice } from '../utils/format'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addItem } = useCart()

  return (
    <div className="flex gap-3 bg-white rounded-2xl border border-ink/10 p-3 hover:shadow-md transition-shadow">
      <div className="flex-1 min-w-0 flex flex-col">
        <h3 className="font-semibold text-sm sm:text-base leading-snug">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs sm:text-sm text-ink/60 mt-1 line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="font-semibold text-brand-dark">
            {formatPrice(product.price)}
          </span>
          <button
            type="button"
            onClick={() => addItem(product)}
            className="w-8 h-8 rounded-full bg-brand text-white text-lg leading-none flex items-center justify-center hover:bg-brand-dark transition-colors cursor-pointer"
            aria-label={`Agregar ${product.name}`}
          >
            +
          </button>
        </div>
      </div>
      <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl bg-tan/50 flex items-center justify-center text-3xl overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>🍽️</span>
        )}
      </div>
    </div>
  )
}
