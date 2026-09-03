/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    register: typeof routes['auth.register']
    verifyEmail: typeof routes['auth.verify_email']
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
  ai: {
    chat: typeof routes['ai.chat']
    predict: typeof routes['ai.predict']
    mindmap: typeof routes['ai.mindmap']
    mindmapStream: typeof routes['ai.mindmap_stream']
  }
  productSalls: {
    myListings: typeof routes['product_salls.my_listings']
    index: typeof routes['product_salls.index']
    store: typeof routes['product_salls.store']
    show: typeof routes['product_salls.show']
    update: typeof routes['product_salls.update']
    destroy: typeof routes['product_salls.destroy']
  }
}
