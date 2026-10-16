import { act, renderHook } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { CartProvider, useCart } from './CartContext'

const burger = { id: 'b1', name: 'Oklahoma Burger', price: 8500 }
const fries = { id: 'f1', name: 'Papas fritas', price: 3500 }

function setup() {
  return renderHook(() => useCart(), { wrapper: CartProvider })
}

describe('CartContext', () => {
  test('el carrito parte vacío', () => {
    const { result } = setup()
    expect(result.current.items).toEqual([])
    expect(result.current.totalItems).toBe(0)
    expect(result.current.subtotal).toBe(0)
  })

  test('agregar el mismo producto suma la cantidad en vez de duplicarlo', () => {
    const { result } = setup()
    act(() => result.current.addItem(burger))
    act(() => result.current.addItem(burger))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].qty).toBe(2)
  })

  test('calcula el subtotal y el total de unidades', () => {
    const { result } = setup()
    act(() => result.current.addItem(burger))
    act(() => result.current.addItem(burger))
    act(() => result.current.addItem(fries))
    expect(result.current.subtotal).toBe(2 * 8500 + 3500)
    expect(result.current.totalItems).toBe(3)
  })

  test('setQty cambia la cantidad de un producto', () => {
    const { result } = setup()
    act(() => result.current.addItem(fries))
    act(() => result.current.setQty('f1', 4))
    expect(result.current.items[0].qty).toBe(4)
    expect(result.current.subtotal).toBe(4 * 3500)
  })

  test('setQty con cero o menos elimina el producto', () => {
    const { result } = setup()
    act(() => result.current.addItem(fries))
    act(() => result.current.setQty('f1', 0))
    expect(result.current.items).toEqual([])
  })

  test('removeItem y clearCart vacían lo que corresponde', () => {
    const { result } = setup()
    act(() => result.current.addItem(burger))
    act(() => result.current.addItem(fries))
    act(() => result.current.removeItem('b1'))
    expect(result.current.items.map((i) => i.product.id)).toEqual(['f1'])
    act(() => result.current.clearCart())
    expect(result.current.items).toEqual([])
  })

  test('useCart fuera del provider lanza un error claro', () => {
    expect(() => renderHook(() => useCart())).toThrow(
      'useCart debe usarse dentro de <CartProvider>',
    )
  })
})
