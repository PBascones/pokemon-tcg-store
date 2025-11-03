import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NosotrosPage() {
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/background-about-us.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image Section */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/about-us-picture.jpeg"
                  alt="Joaco y Ceci - PokeAddiction"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Text Section */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl border border-orange-200/30">
              <h1 className="text-3xl md:text-4xl font-bold text-primary-600 mb-4">
                Nosotros
              </h1>
              
              <div className="space-y-3 text-gray-900 text-base md:text-xl leading-relaxed">
                <p>
                  ¡Hola! Somos Joaco y Ceci y queremos compartir con vos nuestra pasión por el Mundo Pokémon.
                </p>
                
                <p>
                  En paralelo a nuestra rutina laboral del Seguro y la Gastronomía creamos la comunidad de PoKeAddiction como un espacio de distensión para encontrarnos con fans y coleccionistas del TCG.
                </p>
                
                <p>
                  Acá vas a encontrar productos sellados de tus sets favoritos, cartas singles para completar tus colecciones, rifas, sorteos y eventos de apertura en vivo donde vamos a perseguir juntos esos hits tan buscados.
                </p>
                
                <p>
                  Te invitamos a formar parte de PokeAddiction y transitar juntos este hermoso camino a convertirnos en verdaderos maestros y maestras Pokémon.
                </p>
              </div>

              {/* CTA Button */}
              <div className="mt-6 flex justify-center">
                <Link
                  href="https://www.instagram.com/pokeaddictionok/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button 
                    size="lg" 
                    className="w-full md:w-auto bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 text-base md:text-lg"
                  >
                    ¡Seguinos!
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

