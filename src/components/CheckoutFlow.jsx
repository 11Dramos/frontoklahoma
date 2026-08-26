import { useMemo, useState } from 'react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'

const PAYMENT_METHODS = [
  { id: 'webpay', label: 'Webpay Plus', icon: '💳' },
  { id: 'mercadopago', label: 'Mercado Pago', icon: '🅼' },
]

// Cotización simulada de Uber Direct. Cuando exista el backend, esto se
// reemplaza por una llamada real a la API (Create Quote) usando la dirección.
function mockDeliveryQuote(address) {
  if (!address.trim()) return null
  const fee = 2500 + (address.length % 5) * 300
  const etaMin = 25 + (address.length % 4) * 5
  return { fee, etaMin }
}

export default function CheckoutFlow({ open, onClose, fulfillment }) {
  const { items, subtotal, clearCart } = useCart()
  const [address, setAddress] = useState('')
  const [scheduleMode, setScheduleMode] = useState('asap')
  const [scheduleDay, setScheduleDay] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [payment, setPayment] = useState('webpay')
  const [status, setStatus] = useState('form') // form | processing | success

  const quote = useMemo(
    () => (fulfillment === 'delivery' ? mockDeliveryQuote(address) : null),
    [fulfillment, address],
  )

  const deliveryFee = quote?.fee ?? 0
  const total = subtotal + deliveryFee

  const canSubmit =
    items.length > 0 &&
    name.trim() &&
    phone.trim() &&
    (fulfillment !== 'delivery' || address.trim()) &&
    (scheduleMode !== 'schedule' || (scheduleDay && scheduleTime))

  function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    setStatus('processing')
    // Simulación: aquí se reemplaza por la llamada real a Webpay/Mercado Pago
    // y por el guardado del pedido en el panel en tiempo real (backend futuro).
    setTimeout(() => {
      setStatus('success')
      clearCart()
    }, 1400)
  }

  function handleClose() {
    setStatus('form')
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
              Este es un flujo de demostración: el pago y el envío del pedido al
              panel del local aún son simulados, hasta conectar el backend real.
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
                    {quote && (
                      <p className="text-xs text-ink/50 mt-2">
                        Envío estimado (simulado, vía Uber Direct):{' '}
                        <strong>{formatPrice(quote.fee)}</strong> · llega en ~
                        {quote.etaMin} min
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
                <h3 className="font-semibold text-sm mb-2">💳 Pago (simulado)</h3>
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
                  Pasarela de pago pendiente de integración real.
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
