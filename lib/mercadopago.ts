import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  throw new Error('MERCADOPAGO_ACCESS_TOKEN no está configurado')
}

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  options: {
    timeout: 5000,
  },
})

export const preference = new Preference(client)
export const payment = new Payment(client)

// Tipos para MercadoPago
export interface MercadoPagoItem {
  id: string
  title: string
  quantity: number
  unit_price: number
  currency_id: string
  picture_url?: string
  description?: string
  category_id?: string
}

export interface PreferenceData {
  items: MercadoPagoItem[]
  payer?: {
    name?: string
    surname?: string
    email?: string
    phone?: {
      area_code?: string
      number?: string
    }
    address?: {
      zip_code?: string
      street_name?: string
      street_number?: string
    }
    identification?: {
      type?: string
      number?: string
    }
  }
  back_urls: {
    success: string
    failure: string
    pending: string
  }
  auto_return: 'approved' | 'all'
  external_reference: string
  notification_url?: string
  statement_descriptor?: string
  binary_mode?: boolean
  installments?: number
  expires?: boolean
  expiration_date_from?: string
  expiration_date_to?: string
}

export async function createPreference(data: PreferenceData) {
  try {
    const response = await preference.create({
      body: data,
    })
    return response
  } catch (error) {
    console.error('Error creating MercadoPago preference:', error)
    throw error
  }
}

export async function getPayment(paymentId: string) {
  try {
    const response = await payment.get({ id: paymentId })
    return response
  } catch (error) {
    console.error('Error getting payment:', error)
    throw error
  }
}
