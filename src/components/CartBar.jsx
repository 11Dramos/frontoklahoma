import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'

export default function CartBar({ onOpen }) {
  const { totalItems, subtotal } = useCart()

  if (totalItems === 0) return null

  return (
    <button
      type="button"
      onClick={onOpen}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-brand text-white rounded-full pl-4 pr-5 py-3 shadow-xl hover:bg-brand-dark transition-colors cursor-pointer"
    >
      <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
        {totalItems}
      </span>
      <span className="font-medium text-sm sm:text-base">Ver mi pedido</span>
      <span className="font-semibold text-sm sm:text-base">{formatPrice(subtotal)}</span>
    </button>
  )
}
