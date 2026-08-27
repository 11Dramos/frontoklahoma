export default function CategoryNav({ categories, activeCategory, onSelect }) {
  return (
    <nav className="sticky top-0 z-20 bg-cream/95 backdrop-blur border-b border-ink/10">
      <div className="max-w-5xl mx-auto flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-brand text-white border-brand'
                : 'bg-white/60 text-ink/80 border-ink/10 hover:border-brand/40'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>
    </nav>
  )
}
