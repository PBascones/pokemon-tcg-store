import Link from 'next/link'
import { Bell } from 'lucide-react'
import Image from 'next/image'

export function Footer() {
  const message = '¡Hola! Me gustaría hacer una consulta sobre los productos de Poke Addiction.'

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo */}
          <div>
            <Image
              src="/images/white-logo.png"
              alt="Poke Addiction"
              width={1000}
              height={1000}
              className="object-contain rounded-md"
              priority
            />
          </div>

          {/* Encontranos */}
          <div>
            <h2 className="text-xl font-semibold mb-2 mt-8">Encontranos</h2>
            <div className="flex space-x-2">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WSP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition rounded-md"
              >
                <Image
                  src="/images/icon-whatsapp_1.svg"
                  alt="WhatsApp"
                  width={36}
                  height={36}
                />
              </a>
              <a
                href="https://www.instagram.com/pokeaddictionok/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition rounded-md"
              >
                <Image
                  src="/images/icon-instagram.svg"
                  alt="Instagram"
                  width={36}
                  height={36}
                />
              </a>
              <a
                href="https://www.twitch.tv/pokeadicction"
                target="_blank"
                rel="noopener noreferrer"
                className="transition rounded-md"
              >
                <Image
                  src="/images/icon-twitch.svg"
                  alt="Twitch"
                  width={36}
                  height={36}
                />
              </a>
              <a
                href="https://www.youtube.com/@pokeaddiction-b8i"
                target="_blank"
                rel="noopener noreferrer"
                className="transition rounded-md"
              >
                <Image
                  src="/images/icon-youtube.svg"
                  alt="YouTube"
                  width={36}
                  height={36}
                />
              </a>
            </div>
          </div>

          {/* Información útil */}
          <div>
            <h2 className="text-xl font-semibold mb-2 mt-8">Información útil</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/envios" className="text-gray-400 hover:text-white transition">
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
            <h2 className="text-2xl font-semibold mb-2 mt-8">Medios de pago</h2>
            <div className="flex flex-wrap mb-3">
              <Image
                src="/images/logo-mp.svg"
                alt="Mercado Pago"
                width={80}
                height={32}
                className="bg-transparent rounded pr-1"
              />
              <Image
                src="/images/logo-visa.svg"
                alt="Visa"
                width={50}
                height={32}
                className="bg-transparent rounded px-1"
              />
              <Image
                src="/images/logo-master.svg"
                alt="Mastercard"
                width={50}
                height={32}
                className="bg-transparent rounded px-2"
              />
              <Image
                src="/images/logo-amex.svg"
                alt="American Express"
                width={25}
                height={25}
                className="bg-transparent rounded"
              />
            </div>
            <p className="text-gray-400 text-xs">
              Transferencias bancarias
            </p>
            <p className="text-gray-400 text-xs">
              y en USD, USDT y/o Crypto con
            </p>
            <p className="text-gray-400 text-xs">
              un 10% de recargo.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Bell className="h-6 w-6" />
              <h3 className="text-xl font-semibold">
                ¡Unite a la comunidad y enterate de todas las novedades!
              </h3>
              <Bell className="h-6 w-6" />
            </div>
            <a
              href="https://chat.whatsapp.com/E0Ao3dksRz19cQBt4Ib0xN"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-semibold px-8 py-3 rounded-md transition"
            >
              Quiero ser parte
            </a>
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
