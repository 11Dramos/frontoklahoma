import { restaurant } from '../data/menu'

export default function Footer() {
  return (
    <footer className="bg-ink text-cream mt-10 pb-24">
      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h3 className="font-heading font-bold mb-3">Dirección y horarios</h3>
          <p className="text-sm text-cream/70">{restaurant.address}</p>
          <p className="text-sm text-cream/70 mt-1">{restaurant.hours}</p>
        </div>
        <div>
          <h3 className="font-heading font-bold mb-3">Contacto</h3>
          <a
            href={`tel:${restaurant.phone}`}
            className="block text-sm text-cream/70 hover:text-tan"
          >
            {restaurant.phone}
          </a>
          <a
            href={`mailto:${restaurant.email}`}
            className="block text-sm text-cream/70 hover:text-tan mt-1"
          >
            {restaurant.email}
          </a>
        </div>
        <div>
          <h3 className="font-heading font-bold mb-3">Redes sociales</h3>
          <a
            href={restaurant.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="block text-sm text-cream/70 hover:text-tan"
          >
            WhatsApp
          </a>
          <a
            href={restaurant.instagram}
            target="_blank"
            rel="noreferrer"
            className="block text-sm text-cream/70 hover:text-tan mt-1"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  )
}
