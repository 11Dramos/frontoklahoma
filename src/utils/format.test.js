import { describe, expect, test } from 'vitest'
import { formatPrice } from './format'

// Intl usa espacios especiales segun la version de Node; los quitamos para comparar.
const plain = (text) => text.replace(/\s/g, '')

describe('formatPrice', () => {
  test('formatea en pesos chilenos con punto de miles', () => {
    expect(plain(formatPrice(3500))).toBe('$3.500')
    expect(plain(formatPrice(1234567))).toBe('$1.234.567')
  })

  test('no muestra decimales', () => {
    expect(plain(formatPrice(3500.7))).toBe('$3.501')
  })

  test('formatea el cero', () => {
    expect(plain(formatPrice(0))).toBe('$0')
  })
})
