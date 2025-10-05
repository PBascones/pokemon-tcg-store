import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sobre Nosotros */}
          <div>
            <h3 className="text-xl font-bold mb-4">Poke Addiction</h3>
            <p className="text-gray-400 text-sm">
              Tu tienda de confianza para cartas Pokémon en Argentina. 
              Productos 100% originales y auténticos.
            </p>
            <a 
              href="https://www.instagram.com/pokeaddictionok/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
            >
              @pokeaddictionok
            </a>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/productos" className="text-gray-400 hover:text-white transition">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="text-gray-400 hover:text-white transition">
                  Categorías
                </Link>
              </li>
              <li>
                <Link href="/ofertas" className="text-gray-400 hover:text-white transition">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-gray-400 hover:text-white transition">
                  Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Atención al Cliente */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Atención al Cliente</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contacto" className="text-gray-400 hover:text-white transition">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/envios" className="text-gray-400 hover:text-white transition">
                  Información de Envíos
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="text-gray-400 hover:text-white transition">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/pokeaddictionok/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <Twitter className="h-6 w-6" />
              </a>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Métodos de Pago</h4>
              <p className="text-gray-400 text-sm">
                Aceptamos MercadoPago y transferencias bancarias
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Poke Addiction. Todos los derechos reservados.</p>
          <div className="mt-2 space-x-4">
            <Link href="/terminos" className="hover:text-white transition">
              Términos y Condiciones
            </Link>
            <Link href="/privacidad" className="hover:text-white transition">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
