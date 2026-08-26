import { forwardRef } from 'react'
import ProductCard from './ProductCard'

const MenuSection = forwardRef(function MenuSection({ category, products }, ref) {
  if (products.length === 0) return null

  return (
    <section ref={ref} id={`cat-${category.id}`} className="scroll-mt-32 py-6">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="font-heading text-xl sm:text-2xl font-bold mb-4">
          {category.icon} {category.name}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
})

export default MenuSection
