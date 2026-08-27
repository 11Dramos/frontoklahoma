const API_URL = import.meta.env.VITE_API_URL

async function request(path, options) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(data?.error || `Error en ${path}`)
  }
  return data
}

export function getMenu() {
  return request('/api/menu')
}

export function getDeliveryQuote(address) {
  return request('/api/delivery/quote', {
    method: 'POST',
    body: JSON.stringify({ address }),
  })
}

export function simulatePayment(method, amount) {
  return request('/api/payments/simulate', {
    method: 'POST',
    body: JSON.stringify({ method, amount }),
  })
}

export function createOrder(order) {
  return request('/api/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  })
}

export function getOrder(id) {
  return request(`/api/orders/${id}`)
}

export function createMercadoPagoPreference(orderId) {
  return request('/api/payments/mercadopago/preference', {
    method: 'POST',
    body: JSON.stringify({ orderId }),
  })
}
