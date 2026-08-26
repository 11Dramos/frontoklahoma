export default function SearchBar({ value, onChange }) {
  return (
    <div className="max-w-5xl mx-auto px-4 pt-4">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40">🔍</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar por productos"
          className="w-full rounded-full border border-ink/15 bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-brand transition-colors"
        />
      </div>
    </div>
  )
}
