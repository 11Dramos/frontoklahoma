import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'
import { createMercadoPagoPreference, createOrder, getDeliveryQuote, simulatePayment } from '../lib/api'

const PAYMENT_METHODS = [
  { id: 'webpay', label: 'Webpay Plus', icon: '💳' },
  { id: 'mercadopago', label: 'Mercado Pago', icon: '🅼' },
]

export default function CheckoutFlow({ open, onClose, fulfillment }) {
  const { items, subtotal, clearCart } = useCart()
  const [address, setAddress] = useState('')
  const [quote, setQuote] = useState(null)
  const [scheduleMode, setScheduleMode] = useState('asap')
  const [scheduleDay, setScheduleDay] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [payment, setPayment] = useState('webpay')
  const [status, setStatus] = useState('form') // form | processing | success
  const [errorMsg, setErrorMsg] = useState('')

  // Cotiza el delivery contra el backend cada vez que cambia la dirección
  // (con un pequeño debounce para no disparar una request por cada tecla).
  useEffect(() => {
    if (fulfillment !== 'delivery' || !address.trim()) {
      setQuote(null)
      return
    }
    const timer = setTimeout(() => {
      getDeliveryQuote(address).then(setQuote).catch(() => setQuote(null))
    }, 400)
    return () => clearTimeout(timer)
  }, [address, fulfillment])

  const deliveryFee = quote?.fee ?? 0
  const total = subtotal + deliveryFee

  const canSubmit =
    items.length > 0 &&
    name.trim() &&
    phone.trim() &&
    (fulfillment !== 'delivery' || (address.trim() && quote)) &&
    (scheduleMode !== 'schedule' || (scheduleDay && scheduleTime))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    setErrorMsg('')
    setStatus('processing')
    try {
      const order = await createOrder({
        items: items.map((i) => ({ productId: i.product.id, qty: i.qty })),
        fulfillment,
        schedule: { mode: scheduleMode, day: scheduleDay, time: scheduleTime },
        customer: { name, phone },
        address: fulfillment === 'delivery' ? address : '',
        delivery: fulfillment === 'delivery' ? quote : undefined,
        payment: { method: payment },
      })

      if (payment === 'mercadopago') {
        // Pago real: se redirige a Mercado Pago, el pedido queda "pending"
        // hasta que confirmen el pago por webhook.
        const { init_point } = await createMercadoPagoPreference(order._id)
        clearCart()
        window.location.href = init_point
        return
      }

      // Webpay sigue simulado por ahora.
      await simulatePayment(payment, total)
      setStatus('success')
      clearCart()
    } catch (err) {
      setErrorMsg(err.message || 'No pudimos procesar el pedido')
      setStatus('form')
    }
  }

  function handleClose() {
    setStatus('form')
    setErrorMsg('')
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-ink/50" onClick={handleClose} />
      <div className="relative bg-cream w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
        {status === 'success' ? (
          <div className="p-8 flex flex-col items-center text-center gap-3">
            <span className="text-5xl">✅</span>
            <h2 className="font-heading text-xl font-bold">¡Pedido confirmado!</h2>
            <p className="text-ink/60 text-sm max-w-xs">
              Tu pedido quedó guardado en el sistema. El pago y la cotización
              de envío todavía son simulados, hasta conectar Webpay/Mercado
              Pago y Uber Direct reales.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-2 bg-brand text-white rounded-full px-6 py-2.5 font-semibold hover:bg-brand-dark transition-colors cursor-pointer"
            >
              Listo
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-ink/10 sticky top-0 bg-cream">
              <h2 className="font-heading text-lg font-bold">Finalizar pedido</h2>
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 rounded-full hover:bg-ink/10 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="px-4 py-4 flex flex-col gap-6">
              <section>
                <h3 className="font-semibold text-sm mb-2">
                  {fulfillment === 'delivery' ? '📍 Dirección de entrega' : '🏬 Retiro en local'}
                </h3>
                {fulfillment === 'delivery' ? (
                  <>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Calle, número, depto/casa"
                      className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
                    />
                    {address.trim() && (
                      <p className="text-xs text-ink/50 mt-2">
                        {quote ? (
                          <>
                            Envío estimado (simulado, vía Uber Direct):{' '}
                            <strong>{formatPrice(quote.fee)}</strong> · llega en ~
                            {quote.etaMin} min
                          </>
                        ) : (
                          'Cotizando envío…'
                        )}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-ink/60">AV CARRASCAL #4576</p>
                )}
              </section>

              <section>
                <h3 className="font-semibold text-sm mb-2">🕒 Cuándo</h3>
                <div className="flex rounded-full bg-tan/40 p-1 w-full">
                  {[
                    { id: 'asap', label: 'Lo antes posible' },
                    { id: 'schedule', label: 'Programar' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setScheduleMode(opt.id)}
                      className={`flex-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                        scheduleMode === opt.id
                          ? 'bg-brand text-white shadow'
                          : 'text-ink/70'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {scheduleMode === 'schedule' && (
                  <div className="flex gap-2 mt-3">
                    <input
                      type="date"
                      value={scheduleDay}
                      onChange={(e) => setScheduleDay(e.target.value)}
                      className="flex-1 rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                    />
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="flex-1 rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                    />
                  </div>
                )}
              </section>

              <section>
                <h3 className="font-semibold text-sm mb-2">🙋 Tus datos</h3>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre"
                    className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Teléfono"
                    className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
                  />
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-sm mb-2">💳 Pago</h3>
                <div className="flex flex-col gap-2">
                  {PAYMENT_METHODS.map((m) => (
                    <label
                      key={m.id}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 cursor-pointer transition-colors ${
                        payment === m.id
                          ? 'border-brand bg-brand/5'
                          : 'border-ink/15 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={payment === m.id}
                        onChange={() => setPayment(m.id)}
                        className="accent-brand"
                      />
                      <span>{m.icon}</span>
                      <span className="text-sm font-medium">{m.label}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-ink/40 mt-2">
                  {payment === 'mercadopago'
                    ? 'Te vamos a redirigir a Mercado Pago para pagar de verdad.'
                    : 'Webpay todavía está simulado, pendiente de integración real.'}
                </p>
              </section>

              <section className="border-t border-ink/10 pt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-ink/60">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {fulfillment === 'delivery' && (
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-ink/60">Envío</span>
                    <span>{quote ? formatPrice(quote.fee) : '—'}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-base mt-2">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </section>

              {errorMsg && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  {errorMsg}
                </p>
              )}
            </div>

            <div className="sticky bottom-0 bg-cream px-4 py-4 border-t border-ink/10">
              <button
                type="submit"
                disabled={!canSubmit || status === 'processing'}
                className="w-full bg-brand text-white rounded-full py-3 font-semibold hover:bg-brand-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {status === 'processing' ? 'Procesando pago…' : `Pagar ${formatPrice(total)}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
