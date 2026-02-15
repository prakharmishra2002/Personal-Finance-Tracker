/**
 * Currency Converter Component
 * 
 * A real-time currency converter with the following features:
 * - Convert between 10 different currencies
 * - Mock exchange rates (simulates API calls)
 * - Swap currencies functionality
 * - Refresh rates button
 * - Last updated timestamp
 * - Responsive layout
 * 
 * Note: This uses mock exchange rates for demonstration.
 * In production, you would integrate with a real currency API like:
 * - Open Exchange Rates (https://openexchangerates.org/)
 * - Fixer.io (https://fixer.io/)
 * - Currencylayer (https://currencylayer.com/)
 * - ExchangeRate-API (https://www.exchangerate-api.com/)
 */

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRightLeft, RefreshCw } from "lucide-react"

export default function CurrencyConverter() {
  // State management
  const [amount, setAmount] = useState<string>("1") // Amount to convert
  const [fromCurrency, setFromCurrency] = useState<string>("USD") // Source currency
  const [toCurrency, setToCurrency] = useState<string>("EUR") // Target currency
  const [convertedAmount, setConvertedAmount] = useState<string>("") // Conversion result
  const [exchangeRate, setExchangeRate] = useState<number | null>(null) // Current exchange rate
  const [loading, setLoading] = useState<boolean>(false) // Loading state during rate fetch
  const [lastUpdated, setLastUpdated] = useState<string>("") // Timestamp of last rate update

  // Available currencies for conversion
  const currencies = [
    { value: "USD", label: "US Dollar (USD)" },
    { value: "EUR", label: "Euro (EUR)" },
    { value: "GBP", label: "British Pound (GBP)" },
    { value: "JPY", label: "Japanese Yen (JPY)" },
    { value: "CAD", label: "Canadian Dollar (CAD)" },
    { value: "AUD", label: "Australian Dollar (AUD)" },
    { value: "CNY", label: "Chinese Yuan (CNY)" },
    { value: "INR", label: "Indian Rupee (INR)" },
    { value: "BRL", label: "Brazilian Real (BRL)" },
    { value: "ZAR", label: "South African Rand (ZAR)" },
  ]

  /**
   * Mock exchange rates data structure
   * In production, this would be fetched from a currency API
   * 
   * Structure: { fromCurrency: { toCurrency: rate } }
   * Example: USD to EUR rate is 0.92
   */
  const mockExchangeRates: Record<string, Record<string, number>> = {
    USD: {
      EUR: 0.92,
      GBP: 0.79,
      JPY: 150.25,
      CAD: 1.35,
      AUD: 1.52,
      CNY: 7.23,
      INR: 83.12,
      BRL: 5.05,
      ZAR: 18.45,
      USD: 1,
    },
    EUR: {
      USD: 1.09,
      GBP: 0.86,
      JPY: 163.35,
      CAD: 1.47,
      AUD: 1.65,
      CNY: 7.86,
      INR: 90.35,
      BRL: 5.49,
      ZAR: 20.05,
      EUR: 1,
    },
    GBP: {
      USD: 1.27,
      EUR: 1.16,
      JPY: 190.19,
      CAD: 1.71,
      AUD: 1.92,
      CNY: 9.15,
      INR: 105.22,
      BRL: 6.39,
      ZAR: 23.35,
      GBP: 1,
    },
    // Additional currencies would be added here in a complete implementation
  }

  /**
   * Fetches exchange rate for the given currency pair
   * Simulates an API call with a 500ms delay
   * 
   * @param from - Source currency code
   * @param to - Target currency code
   */
  const getExchangeRate = (from: string, to: string) => {
    setLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      let rate: number

      // Check if we have a direct rate from -> to
      if (mockExchangeRates[from] && mockExchangeRates[from][to]) {
        rate = mockExchangeRates[from][to]
      }
      // If not, try to calculate via USD as intermediary
      else if (
        mockExchangeRates[from] &&
        mockExchangeRates[from]["USD"] &&
        mockExchangeRates["USD"] &&
        mockExchangeRates["USD"][to]
      ) {
        rate = mockExchangeRates[from]["USD"] * mockExchangeRates["USD"][to]
      }
      // Default fallback (1:1 rate)
      else {
        rate = 1
      }

      // Add slight randomness to simulate real-time rate fluctuations
      const randomFactor = 0.995 + Math.random() * 0.01 // ±0.5% variation
      rate = rate * randomFactor

      // Update state with new rate
      setExchangeRate(rate)
      convert(amount, rate)
      setLastUpdated(new Date().toLocaleTimeString())
      setLoading(false)
    }, 500)
  }

  /**
   * Converts the amount using the current exchange rate
   * 
   * @param value - Amount to convert
   * @param rate - Exchange rate to use
   */
  const convert = (value: string, rate: number) => {
    if (value && !isNaN(Number.parseFloat(value)) && rate) {
      const result = Number.parseFloat(value) * rate
      setConvertedAmount(result.toFixed(2))
    } else {
      setConvertedAmount("")
    }
  }

  /**
   * Swaps the from and to currencies
   * Useful for quick reverse conversion
   */
  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    // The useEffect will trigger conversion when currencies change
  }

  /**
   * Effect: Update conversion when currencies change
   * Fetches new exchange rate whenever from or to currency changes
   */
  useEffect(() => {
    if (fromCurrency && toCurrency) {
      getExchangeRate(fromCurrency, toCurrency)
    }
  }, [fromCurrency, toCurrency])

  /**
   * Handles amount input changes
   * Updates the converted amount in real-time
   */
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAmount(value)
    if (exchangeRate) {
      convert(value, exchangeRate)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-[1fr_auto_1fr]">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
          />
        </div>

        <div className="flex items-center justify-center sm:items-end sm:pb-2 order-last sm:order-none">
          <Button variant="outline" size="icon" onClick={swapCurrencies} className="h-10 w-10">
            <ArrowRightLeft className="h-4 w-4" />
            <span className="sr-only">Swap currencies</span>
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="result">Converted Amount</Label>
          <Input id="result" value={convertedAmount} readOnly className="bg-muted" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fromCurrency">From</Label>
          <Select value={fromCurrency} onValueChange={setFromCurrency}>
            <SelectTrigger id="fromCurrency">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={`from-${currency.value}`} value={currency.value}>
                  {currency.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="toCurrency">To</Label>
          <Select value={toCurrency} onValueChange={setToCurrency}>
            <SelectTrigger id="toCurrency">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={`to-${currency.value}`} value={currency.value}>
                  {currency.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="text-xs sm:text-sm text-muted-foreground">
          {exchangeRate ? (
            <span>
              1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
            </span>
          ) : (
            <span>Loading exchange rate...</span>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => getExchangeRate(fromCurrency, toCurrency)}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Refresh
        </Button>
      </div>

      {lastUpdated && <div className="text-xs text-muted-foreground text-right">Last updated: {lastUpdated}</div>}

      <div className="rounded-md bg-muted p-3 sm:p-4 text-xs sm:text-sm">
        <p className="font-medium mb-1">Note:</p>
        <p className="text-muted-foreground">
          This is a demo currency converter using simulated exchange rates. In a production app, you would connect to a
          real-time currency API like Open Exchange Rates, Fixer.io, or Currencylayer to get accurate, up-to-date
          exchange rates.
        </p>
      </div>
    </div>
  )
}

