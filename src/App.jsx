import { useEffect, useMemo, useState } from 'react'
import { CartProvider } from './context/CartContext'
import { getMenu } from './lib/api'
import Header from './components/Header'
import CategoryNav from './components/CategoryNav'
import SearchBar from './components/SearchBar'
import MenuSection from './components/MenuSection'
import CartBar from './components/CartBar'
import CartDrawer from './components/CartDrawer'
import CheckoutFlow from './components/CheckoutFlow'
import Footer from './components/Footer'

function App() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [menuStatus, setMenuStatus] = useState('loading') // loading | ready | error

  const [fulfillment, setFulfillment] = useState('delivery')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  useEffect(() => {
    loadMenu()
  }, [])

  async function loadMenu() {
    setMenuStatus('loading')
    try {
      const data = await getMenu()
      const cats = data.categories.map((c) => ({ ...c, id: c.key }))
      setCategories(cats)
      setProducts(data.products.map((p) => ({ ...p, id: p._id })))
      setActiveCategory(cats[0]?.id ?? null)
      setMenuStatus('ready')
    } catch {
      setMenuStatus('error')
    }
  }

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products
    const q = search.trim().toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q),
    )
  }, [search, products])

  function handleSelectCategory(id) {
    setActiveCategory(id)
    document
      .getElementById(`cat-${id}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (menuStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink/50">
        Cargando menú…
      </div>
    )
  }

  if (menuStatus === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-ink/70">
          No pudimos conectar con el servidor. ¿Está corriendo el backend?
        </p>
        <button
          type="button"
          onClick={loadMenu}
          className="bg-brand text-white rounded-full px-5 py-2 font-semibold hover:bg-brand-dark cursor-pointer"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header fulfillment={fulfillment} setFulfillment={setFulfillment} />
        <CategoryNav
          categories={categories}
          activeCategory={activeCategory}
          onSelect={handleSelectCategory}
        />
        <SearchBar value={search} onChange={setSearch} />

        <main className="flex-1">
          {categories.map((cat) => (
            <MenuSection
              key={cat.id}
              category={cat}
              products={filteredProducts.filter((p) => p.category === cat.id)}
            />
          ))}

          {search.trim() && filteredProducts.length === 0 && (
            <p className="text-center text-ink/50 py-16">
              No encontramos ningún producto
            </p>
          )}
        </main>

        <Footer />

        <CartBar onOpen={() => setCartOpen(true)} />
        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          onCheckout={() => {
            setCartOpen(false)
            setCheckoutOpen(true)
          }}
        />
        <CheckoutFlow
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          fulfillment={fulfillment}
        />
      </div>
    </CartProvider>
  )
}

export default App
