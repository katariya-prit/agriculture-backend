import type { HttpContext } from '@adonisjs/core/http'
import MarketDataService from '#services/market_data_service'

export default class MarketRatesController {
    async index({ response }: HttpContext) {
        const service = new MarketDataService()
        const rates = await service.getMarketRates()

        return response.ok({
            success: true,
            data: rates,
        })
    }
    async priceHistory({ request, response }: HttpContext) {
        const crop = request.qs().crop
        const service = new MarketDataService()
        const history = await service.getPriceHistory(crop)

        return response.ok({ success: true, data: history })
    }
}