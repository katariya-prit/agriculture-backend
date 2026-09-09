// app/services/market_data_service.ts

export type Trend = "up" | "down" | "stable"

export interface MandiRate {
  id: string
  crop: string
  variety: string
  market: string
  district: string
  state: string
  minPrice: number
  maxPrice: number
  modalPrice: number
  unit: string
  trend: Trend
  changePercent: number
  updatedAt: string
}

export interface PriceHistoryPoint {
  day: string
  price: number
}

const CROPS = [
  { crop: "Cotton", variety: "Shankar-6", basePrice: 7200 },
  { crop: "Groundnut", variety: "Bold", basePrice: 6400 },
  { crop: "Wheat", variety: "Lokwan", basePrice: 2450 },
  { crop: "Cumin (Jeeru)", variety: "Desi", basePrice: 28500 },
  { crop: "Castor", variety: "Common", basePrice: 6100 },
  { crop: "Onion", variety: "Red", basePrice: 1350 },
  { crop: "Potato", variety: "Pukhraj", basePrice: 1100 },
  { crop: "Tomato", variety: "Hybrid", basePrice: 1650 },
  { crop: "Bajra", variety: "Hybrid", basePrice: 2100 },
  { crop: "Chana (Gram)", variety: "Desi", basePrice: 5800 },
  { crop: "Mustard", variety: "Black", basePrice: 5450 },
  { crop: "Guar Seed", variety: "Common", basePrice: 5200 },
]

const MARKETS = [
  { market: "Ahmedabad APMC", district: "Ahmedabad", state: "Gujarat" },
  { market: "Rajkot APMC", district: "Rajkot", state: "Gujarat" },
  { market: "Unjha APMC", district: "Mehsana", state: "Gujarat" },
  { market: "Gondal APMC", district: "Rajkot", state: "Gujarat" },
  { market: "Deesa APMC", district: "Banaskantha", state: "Gujarat" },
  { market: "Surat APMC", district: "Surat", state: "Gujarat" },
]

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function buildRate(cropIndex: number, marketIndex: number): MandiRate {
  const cropInfo = CROPS[cropIndex]
  const marketInfo = MARKETS[marketIndex]

  const seed = cropIndex * 31 + marketIndex * 7
  const wobble = (seededRandom(seed) - 0.5) * 0.12
  const modalPrice = Math.round(cropInfo.basePrice * (1 + wobble))

  const spread = Math.round(modalPrice * 0.04)
  const minPrice = modalPrice - spread
  const maxPrice = modalPrice + spread

  const changePercent = Number(((seededRandom(seed + 100) - 0.45) * 8).toFixed(1))
  const trend: Trend = changePercent > 0.3 ? "up" : changePercent < -0.3 ? "down" : "stable"

  return {
    id: `${cropInfo.crop}-${marketInfo.market}`.replace(/\s+/g, "-").toLowerCase(),
    crop: cropInfo.crop,
    variety: cropInfo.variety,
    market: marketInfo.market,
    district: marketInfo.district,
    state: marketInfo.state,
    minPrice,
    maxPrice,
    modalPrice,
    unit: "Quintal",
    trend,
    changePercent,
    updatedAt: new Date().toISOString(),
  }
}

export default class MarketDataService {
  async getMarketRates(): Promise<MandiRate[]> {
    const rates: MandiRate[] = []

    CROPS.forEach((_, cropIndex) => {
      const marketIndex = cropIndex % MARKETS.length
      rates.push(buildRate(cropIndex, marketIndex))

      const secondMarketIndex = (cropIndex + 3) % MARKETS.length
      if (secondMarketIndex !== marketIndex) {
        rates.push(buildRate(cropIndex, secondMarketIndex))
      }
    })

    return rates
  }

  async getPriceHistory(crop: string): Promise<PriceHistoryPoint[]> {
    const cropInfo = CROPS.find((c) => c.crop === crop) ?? CROPS[0]
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"]

    return days.map((day, index) => {
      const seed = cropInfo.basePrice + index * 13
      const wobble = (seededRandom(seed) - 0.5) * 0.08
      return {
        day,
        price: Math.round(cropInfo.basePrice * (1 + wobble * (index + 1) * 0.15)),
      }
    })
  }
}