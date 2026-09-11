/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    register: typeof routes['auth.register']
    verifyEmail: typeof routes['auth.verify_email']
    resendVerification: typeof routes['auth.resend_verification']
  }
  accessTokens: {
    store: typeof routes['access_tokens.store']
    destroy: typeof routes['access_tokens.destroy']
  }
  profile: {
    show: typeof routes['profile.show']
  }
  sellingAccount: {
    store: typeof routes['selling_account.store']
    show: typeof routes['selling_account.show']
    updateBasicIdentity: typeof routes['selling_account.update_basic_identity']
    updateFarmAndLandDetails: typeof routes['selling_account.update_farm_and_land_details']
    updateCropAndProductionInfo: typeof routes['selling_account.update_crop_and_production_info']
  }
  productSalls: {
    myListings: typeof routes['product_salls.my_listings']
    index: typeof routes['product_salls.index']
    store: typeof routes['product_salls.store']
    show: typeof routes['product_salls.show']
    update: typeof routes['product_salls.update']
    destroy: typeof routes['product_salls.destroy']
  }
  marketRates: {
    index: typeof routes['market_rates.index']
    priceHistory: typeof routes['market_rates.price_history']
  }
  ai: {
    analyzeCropImage: typeof routes['ai.analyze_crop_image']
    chatWithGemini: typeof routes['ai.chat_with_gemini']
  }
}
