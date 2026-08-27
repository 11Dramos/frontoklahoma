// El menú (categorías y productos) ahora vive en la base de datos y se
// obtiene vía API (ver src/lib/api.js). Acá solo queda la info fija del
// local, que no se administra desde el backend.

export const restaurant = {
  name: 'Oklahoma Burgers & Ribs',
  tagline: 'Hamburguesas, costillas BBQ y más',
  address: 'AV CARRASCAL #4576',
  hours: '12:00 a 22:45',
  phone: '56944598692',
  whatsapp: 'https://api.whatsapp.com/send?phone=56944598692',
  email: 'inv.aukan.spa@gmail.com',
  instagram: 'https://www.instagram.com/oklahoma.burgers.andribs/',
}
