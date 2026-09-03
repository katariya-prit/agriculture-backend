import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.verify_email': { paramsTuple?: []; params?: {} }
    'access_tokens.store': { paramsTuple?: []; params?: {} }
    'access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'profile.show': { paramsTuple?: []; params?: {} }
    'selling_account.store': { paramsTuple?: []; params?: {} }
    'selling_account.show': { paramsTuple?: []; params?: {} }
    'selling_account.update_basic_identity': { paramsTuple?: []; params?: {} }
    'selling_account.update_farm_and_land_details': { paramsTuple?: []; params?: {} }
    'selling_account.update_crop_and_production_info': { paramsTuple?: []; params?: {} }
    'ai.chat': { paramsTuple?: []; params?: {} }
    'ai.predict': { paramsTuple?: []; params?: {} }
    'ai.mindmap': { paramsTuple?: []; params?: {} }
    'ai.mindmap_stream': { paramsTuple?: []; params?: {} }
    'product_salls.my_listings': { paramsTuple?: []; params?: {} }
    'product_salls.index': { paramsTuple?: []; params?: {} }
    'product_salls.store': { paramsTuple?: []; params?: {} }
    'product_salls.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'product_salls.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'product_salls.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.verify_email': { paramsTuple?: []; params?: {} }
    'access_tokens.store': { paramsTuple?: []; params?: {} }
    'selling_account.store': { paramsTuple?: []; params?: {} }
    'ai.chat': { paramsTuple?: []; params?: {} }
    'ai.predict': { paramsTuple?: []; params?: {} }
    'ai.mindmap': { paramsTuple?: []; params?: {} }
    'ai.mindmap_stream': { paramsTuple?: []; params?: {} }
    'product_salls.store': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'product_salls.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'profile.show': { paramsTuple?: []; params?: {} }
    'selling_account.show': { paramsTuple?: []; params?: {} }
    'product_salls.my_listings': { paramsTuple?: []; params?: {} }
    'product_salls.index': { paramsTuple?: []; params?: {} }
    'product_salls.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'profile.show': { paramsTuple?: []; params?: {} }
    'selling_account.show': { paramsTuple?: []; params?: {} }
    'product_salls.my_listings': { paramsTuple?: []; params?: {} }
    'product_salls.index': { paramsTuple?: []; params?: {} }
    'product_salls.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'selling_account.update_basic_identity': { paramsTuple?: []; params?: {} }
    'selling_account.update_farm_and_land_details': { paramsTuple?: []; params?: {} }
    'selling_account.update_crop_and_production_info': { paramsTuple?: []; params?: {} }
    'product_salls.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'product_salls.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}