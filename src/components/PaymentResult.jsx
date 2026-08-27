import { useEffect, useState } from 'react'
import { getOrder } from '../lib/api'
import { formatPrice } from '../utils/format'

const OUTCOME_BY_PATH = {
  '/pago/exito': { icon: '✅', title: 'Pago exitoso', tone: 'ok' },
  '/pago/error': { icon: '❌', title: 'El pago no se pudo procesar', tone: 'error' },
  '/pago/pendiente': { icon: '⏳', title: 'Tu pago está pendiente', tone: 'pending' },
}

export default function PaymentResult() {
  const outcome = OUTCOME_BY_PATH[window.location.pathname]
  const orderId = new URLSearchParams(window.location.search).get('orderId')
  const [order, setOrder] = useState(null)

  useEffect(() => {
    if (!orderId) return
    getOrder(orderId).then(setOrder).catch(() => {})
  }, [orderId])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-4">
      <span className="text-5xl">{outcome.icon}</span>
      <h1 className="font-heading text-xl font-bold">{outcome.title}</h1>
      {order && (
        <p className="text-ink/60 text-sm">
          Pedido #{order._id.slice(-6)} · {formatPrice(order.total)} · estado del pago:{' '}
          <strong>{order.payment.status}</strong>
        </p>
      )}
      <a
        href="/"
        className="mt-2 bg-brand text-white rounded-full px-6 py-2.5 font-semibold hover:bg-brand-dark transition-colors"
      >
        Volver al menú
      </a>
    </div>
  )
}
