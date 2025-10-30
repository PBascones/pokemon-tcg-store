// Script para testear el webhook de Mercado Pago localmente
// Uso: node test-webhook.js <paymentId>

const paymentId = process.argv[2] || '1234567890'

const testPayload = {
  action: 'payment.updated',
  api_version: 'v1',
  data: {
    id: paymentId
  },
  date_created: new Date().toISOString(),
  id: Math.floor(Math.random() * 1000000),
  live_mode: false,
  type: 'payment',
  user_id: '123456789'
}

console.log('🧪 Testeando webhook con payload:')
console.log(JSON.stringify(testPayload, null, 2))
console.log('\n📡 Enviando a: http://localhost:3000/api/mercadopago/webhook\n')

fetch('http://localhost:3000/api/mercadopago/webhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testPayload)
})
  .then(res => res.json())
  .then(data => {
    console.log('✅ Respuesta del webhook:', data)
    console.log('\n💡 Revisá los logs de tu servidor Next.js para ver el detalle del procesamiento')
  })
  .catch(err => {
    console.error('❌ Error:', err.message)
  })

