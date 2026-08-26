import { useMemo, useState } from 'react'
import { CartProvider } from './context/CartContext'
import { categories, products } from './data/menu'
import Header from './components/Header'
import CategoryNav from './components/CategoryNav'
import SearchBar from './components/SearchBar'
import MenuSection from './components/MenuSection'
import CartBar from './components/CartBar'
import CartDrawer from './components/CartDrawer'
import CheckoutFlow from './components/CheckoutFlow'
import Footer from './components/Footer'

function App() {
  const [fulfillment, setFulfillment] = useState('delivery')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(categories[0].id)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products
    const q = search.trim().toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q),
    )
  }, [search])

  function handleSelectCategory(id) {
    setActiveCategory(id)
    document
      .getElementById(`cat-${id}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header fulfillment={fulfillment} setFulfillment={setFulfillment} />
        <CategoryNav activeCategory={activeCategory} onSelect={handleSelectCategory} />
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
