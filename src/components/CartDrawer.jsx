import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'

export default function CartDrawer({ open, onClose, onCheckout }) {
  const { items, setQty, removeItem, subtotal } = useCart()

  return (
    <>
      <div
        className={`fixed inset-0 bg-ink/40 z-40 transition-opacity ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-cream z-50 shadow-2xl transition-transform flex flex-col ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-ink/10">
          <h2 className="font-heading text-lg font-bold">Mi pedido</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-ink/10 flex items-center justify-center cursor-pointer"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-ink/50 gap-2">
              <span className="text-4xl">🛒</span>
              <p>Pedido vacío</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm leading-snug">{product.name}</p>
                    <p className="text-brand-dark font-semibold text-sm mt-1">
                      {formatPrice(product.price * qty)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setQty(product.id, qty - 1)}
                        className="w-7 h-7 rounded-full border border-ink/20 flex items-center justify-center cursor-pointer hover:bg-ink/5"
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-sm">{qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(product.id, qty + 1)}
                        className="w-7 h-7 rounded-full border border-ink/20 flex items-center justify-center cursor-pointer hover:bg-ink/5"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="ml-auto text-xs text-ink/40 hover:text-brand cursor-pointer"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-ink/10 px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-ink/60 text-sm">Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <button
              type="button"
              onClick={onCheckout}
              className="w-full bg-brand text-white rounded-full py-3 font-semibold hover:bg-brand-dark transition-colors cursor-pointer"
            >
              Continuar
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
