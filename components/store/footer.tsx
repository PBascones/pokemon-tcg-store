import Link from 'next/link'
import { Instagram, Twitch, Youtube, Phone } from 'lucide-react'
import Image from 'next/image'

export function Footer() {
  const message = '¡Hola! Me gustaría hacer una consulta sobre los productos de Poke Addiction.'

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sobre Nosotros */}
            <Image
              src="/images/white-logo.png"
              alt="Poke Addiction"
              width={1000}
              height={1000}
              className="object-contain rounded-md"
              priority
            />

          {/* Encontranos */}
          <div>
            <h3 className="text-lg font-semibold mb-4 mt-8">Encontranos</h3>
            <div className="flex space-x-4">
            <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WSP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <Phone className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com/pokeaddictionok/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://www.twitch.tv/pokeadicction"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <Twitch className="h-6 w-6" />
              </a>
              <a
                href="https://www.youtube.com/@pokeaddiction-b8i"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Información útil */}
          <div>
            <h3 className="text-lg font-semibold mb-4 mt-8">Información útil</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contacto" className="text-gray-400 hover:text-white transition">
                  Envíos
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Medios de Pago */}
          <div>
            <h3 className="text-lg font-semibold mb-4 mt-8">Medios de Pago</h3>
              <p className="text-gray-400 text-xs">
                Transferencias bancarias y en USD,
              </p>
              <p className="text-gray-400 text-xs">
                USDT y/o Crypto con un 10% de recargo.
              </p>
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
