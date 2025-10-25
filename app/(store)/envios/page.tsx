import { Card } from '@/components/ui/card'
import { 
  Truck, 
  Calendar, 
  Shield, 
  MapPin,
  Package,
  DollarSign,
  MessageCircle,
  Clock
} from 'lucide-react'

export default function EnviosPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Truck className="h-8 w-8 text-primary-600" />
            <h1 className="text-4xl font-bold">Envíos y Entregas</h1>
          </div>
          <p className="text-xl text-gray-600">
            Toda la información sobre nuestros métodos de envío y entrega
          </p>
        </div>

        {/* Información General de Envíos */}
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
                  Las cartas se empaquetan con <strong>Folios y Top Loaders</strong> para preservar su 
                  estado y asegurar la conservación.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  <strong>HACEMOS ENVÍOS A TODO EL PAÍS:</strong> Moto mensajería a CABA y alrededores, 
                  envíos por correo argentino a todo el país.
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

        {/* Información Detallada de Correo Argentino */}
        <section className="mb-12">
          <Card className="p-8 bg-green-50 border-green-200">
            <div className="flex items-center gap-3 mb-6">
              <Package className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-green-900">Información de Envío</h2>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-green-900 mb-4">Correo Argentino:</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-800 font-medium">Buenos Aires:</p>
                    <p className="text-green-700">$6.000 a domicilio / $4.000 a sucursal</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-800 font-medium">Interior:</p>
                    <p className="text-green-700">$10.000 a domicilio / $6.000 a sucursal</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-100 border border-green-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-green-800">
                  <strong>El envío se coordina por WhatsApp después del pago. Los costos son estimativos.</strong>
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Proceso de Envío */}
        <section className="mb-12">
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Proceso de Envío</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Pago</h3>
                <p className="text-gray-700 text-sm">
                  Realizá el pago de tu pedido a través de los métodos disponibles
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Coordinación</h3>
                <p className="text-gray-700 text-sm">
                  Te contactamos por WhatsApp para coordinar el envío
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Envío</h3>
                <p className="text-gray-700 text-sm">
                  Procesamos y enviamos tu pedido los días lunes
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Protección de Cartas */}
        <section className="mb-12">
          <Card className="p-8 bg-green-50 border-green-200">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-green-900">Protección de Cartas</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-green-800">
                  <strong>Empaque Profesional:</strong> Todas las cartas se empaquetan con folios 
                  protectores y top loaders rígidos para garantizar su protección durante el envío.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-green-800">
                  <strong>Embalaje Seguro:</strong> Utilizamos materiales de calidad para asegurar 
                  que tus cartas lleguen en perfecto estado.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-green-800">
                  <strong>Gestión Organizada:</strong> Los envíos se procesan de manera organizada 
                  cada lunes para garantizar la eficiencia del servicio.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="p-8 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Tenés dudas sobre los envíos?
            </h2>
            <p className="text-gray-700 mb-6">
              Contactanos por WhatsApp para coordinar tu envío o resolver cualquier consulta
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WSP_PHONE_NUMBER}?text=${encodeURIComponent('¡Hola! Tengo una consulta sobre envíos.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
              >
                Contactar por WhatsApp
              </a>
              <a
                href="/faq"
                className="inline-flex items-center justify-center px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition font-semibold"
              >
                Ver Preguntas Frecuentes
              </a>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
