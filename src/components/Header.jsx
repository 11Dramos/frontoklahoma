import { useState } from 'react'
import { restaurant } from '../data/menu'

const SCHEDULE_DAYS = ['Lo antes posible', 'Programar pedido']

export default function Header({ fulfillment, setFulfillment }) {
  const [scheduleMode, setScheduleMode] = useState('asap')

  return (
    <header className="relative">
      <div className="h-56 sm:h-72 w-full bg-gradient-to-br from-brand via-brand-dark to-ink relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent_35%)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 px-4 text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-cream border-4 border-cream shadow-lg flex items-center justify-center text-4xl mb-3">
            🍔
          </div>
          <h1 className="font-heading text-white text-2xl sm:text-4xl font-bold drop-shadow-sm">
            {restaurant.name}
          </h1>
          <p className="text-tan text-sm sm:text-base mt-1">{restaurant.tagline}</p>
        </div>
      </div>

      <div className="bg-cream border-b border-ink/10 px-4 py-3">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-center">
          <div className="flex rounded-full bg-tan/40 p-1 w-full sm:w-auto">
            {[
              { id: 'delivery', label: 'Delivery' },
              { id: 'pickup', label: 'Para retirar' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFulfillment(opt.id)}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  fulfillment === opt.id
                    ? 'bg-brand text-white shadow'
                    : 'text-ink/70 hover:text-ink'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex rounded-full bg-tan/40 p-1 w-full sm:w-auto">
            {[
              { id: 'asap', label: SCHEDULE_DAYS[0] },
              { id: 'schedule', label: SCHEDULE_DAYS[1] },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setScheduleMode(opt.id)}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  scheduleMode === opt.id
                    ? 'bg-brand text-white shadow'
                    : 'text-ink/70 hover:text-ink'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
