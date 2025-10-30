'use client'

import { createContext, useContext, ReactNode } from 'react'

interface ExchangeRateContextType {
  exchangeRate: number
}

const ExchangeRateContext = createContext<ExchangeRateContextType | undefined>(undefined)

export function ExchangeRateProvider({ 
  children, 
  exchangeRate 
}: { 
  children: ReactNode
  exchangeRate: number 
}) {
  return (
    <ExchangeRateContext.Provider value={{ exchangeRate }}>
      {children}
    </ExchangeRateContext.Provider>
  )
}

export function useExchangeRate() {
  const context = useContext(ExchangeRateContext)
  if (context === undefined) {
    throw new Error('useExchangeRate must be used within ExchangeRateProvider')
  }
  return context.exchangeRate
}

