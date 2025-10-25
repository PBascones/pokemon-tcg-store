import { Card } from '@/components/ui/card'
import { 
  HelpCircle, 
  Calendar, 
  DollarSign, 
  Shield, 
  Gavel, 
  Tag, 
  Truck, 
  MapPin,
  MessageCircle,
  AlertTriangle
} from 'lucide-react'

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="h-8 w-8 text-primary-600" />
            <h1 className="text-4xl font-bold">Preguntas Frecuentes</h1>
          </div>
          <p className="text-xl text-gray-600">
            Todo lo que necesitás saber sobre nuestros productos y servicios
          </p>
        </div>

        {/* Eventos de Apertura */}
        <section className="mb-12">
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Eventos de Apertura</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  ¿Qué es un evento de apertura?
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Un evento de apertura es un día especial en donde realizamos un live streaming 
                  desde nuestras redes para abrir gran variedad de sobres Pokémon (productos 
                  originales completamente sellados).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  ¿Qué beneficios tiene?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">
                      Los sobres se venden mucho más baratos y el 100% de las cartas que salen 
                      de ellos se envían a sus compradores posteriormente.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">
                      Las cartas especiales son colocadas en folios protectores y toploaders 
                      rígidos (totalmente gratis) para asegurar su correcta protección y conservación.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Claims y Subastas */}
        <section className="mb-12">
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Gavel className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">CLAIM - SUBASTAS</h2>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 font-medium">
                Toda la información que necesitas saber para comprar cartas en nuestra 
                comunidad de WhatsApp
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  ¿Qué significa "CLAIM"?
                </h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  La palabra "Claim" se usa para tener el derecho de compra sobre una carta 
                  publicada a la venta con su respectivo precio. El primer "Claim" después 
                  de publicada la carta es el que se toma como válido para la adquisición de la misma.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Todo evento de claim/subasta tiene fecha límite de pago establecida por el 
                  vendedor, a excepción de participantes nuevos que siempre deberán abonar en el momento.
                </p>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="font-bold text-red-800">¡EL CLAIM ES COMPROMISO DE COMPRA!</span>
                  </div>
                  <p className="text-red-700">
                    No se aceptan cancelaciones de claims. Si esto sucede se penaliza con 
                    expulsión directa. Valoramos y priorizamos siempre el tiempo que todos 
                    se toman al participar.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  ¿Qué es una subasta?
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Las subastas se realizan con cartas solicitadas por muchas personas. 
                  Primero se muestra una foto/video del producto y se da aviso de comienzo 
                  de la subasta con precio base y subas de un valor determinado, ej: $100, 
                  $200, $500 o $1000 (todo depende del valor de la carta y de quién la esté 
                  subastando). Se determina cierto tiempo de puja y quien haya ofrecido el 
                  monto más alto será quien adquiera la carta.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  ¿Qué significa "TAG"?
                </h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Antes de realizarse un claim/subasta, el vendedor publica un adelanto de 
                  lo que estará ofreciendo a la venta. Pedís "tag" cuando estás interesado 
                  en comprar alguna de esas cartas y queres que te avisen antes de publicarla, 
                  ej: "Tag Charizard Ex".
                </p>
                <p className="text-gray-700 leading-relaxed">
                  El subastador entonces, antes de ofrecer esa carta al grupo, te arrobará 
                  para que te llegue la notificación al teléfono y puedas estar atento para 
                  ser el primero en "claimearla" o ser parte de la subasta.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3 font-medium">
                  Recordá que si alguien envía "claim" sobre la publicación antes que vos, 
                  esa persona pasa a ser la compradora de la carta.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Envíos y Entregas */}
        <section className="mb-12">
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Truck className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Envíos y Entregas</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  Las gestiones de envíos se realizan los días <strong>Lunes</strong>.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  Las cartas se empaquetan con Folios y Top Loaders para preservar su 
                  estado y asegurar la conservación.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  <strong>HACEMOS ENVÍOS A TODO EL PAÍS: </strong>
                  Moto mensajería a CABA y alrededores, envíos por correo argentino a todo el país.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  Las entregas en <strong>Capital Federal - Buenos Aires</strong> se realizan 
                  todos los sábados en <strong>Caballito, zona Parque Rivadavia</strong>.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Reglas del Grupo de WhatsApp */}
        <section className="mb-12">
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Reglas del Grupo de WhatsApp</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Tag className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  En el grupo de WhatsApp podrás publicar y vender tus cartas subiendo 
                  foto sí o sí con precio (puede ser en dólares o pesos).
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <Tag className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  Podés vender artículos relacionados con Pokémon siempre y cuando sean 
                  artículos <strong>USADOS</strong>.
                </p>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-700">
                      Está <strong>TERMINANTEMENTE PROHIBIDA</strong> la venta de 
                      <strong> PRODUCTOS SELLADOS</strong> en el grupo, ya sean paquetes 
                      (booster packs), cajas (etb, booster bundle, etc) o carpetas (binder).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="p-8 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Tenés más preguntas?
            </h2>
            <p className="text-gray-700 mb-6">
              No dudes en contactarnos a través de WhatsApp o nuestras redes sociales
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WSP_PHONE_NUMBER}?text=${encodeURIComponent('¡Hola! Tengo una consulta para hacerles.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
              >
                Contactar por WhatsApp
              </a>
              <a
                href="https://www.instagram.com/pokeaddictionok/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition font-semibold"
              >
                Seguinos en Instagram
              </a>
              
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
