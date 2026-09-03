/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'auth.register': {
    methods: ["POST"]
    pattern: '/auth/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').registerValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').registerValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['register']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['register']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.verify_email': {
    methods: ["POST"]
    pattern: '/auth/verify-email'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').verifyEmailValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').verifyEmailValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['verifyEmail']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['verifyEmail']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'access_tokens.store': {
    methods: ["POST"]
    pattern: '/auth/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'access_tokens.destroy': {
    methods: ["DELETE"]
    pattern: '/auth/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
    }
  }
  'profile.show': {
    methods: ["GET","HEAD"]
    pattern: '/auth/me'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
    }
  }
  'selling_account.store': {
    methods: ["POST"]
    pattern: '/api/selling-account'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/selling_account').createSellingAccountValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/selling_account').createSellingAccountValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/selling_accounts_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/selling_accounts_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'selling_account.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/selling-account'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/selling_accounts_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/selling_accounts_controller').default['show']>>>
    }
  }
  'selling_account.update_basic_identity': {
    methods: ["PATCH"]
    pattern: '/api/selling-account/basic-identity'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/selling_account').updateBasicIdentityValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/selling_account').updateBasicIdentityValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/selling_accounts_controller').default['updateBasicIdentity']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/selling_accounts_controller').default['updateBasicIdentity']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'selling_account.update_farm_and_land_details': {
    methods: ["PATCH"]
    pattern: '/api/selling-account/farm-details'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/selling_account').updateFarmAndLandDetailsValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/selling_account').updateFarmAndLandDetailsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/selling_accounts_controller').default['updateFarmAndLandDetails']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/selling_accounts_controller').default['updateFarmAndLandDetails']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'selling_account.update_crop_and_production_info': {
    methods: ["PATCH"]
    pattern: '/api/selling-account/crop-info'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/selling_account').updateCropAndProductionInfoValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/selling_account').updateCropAndProductionInfoValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/selling_accounts_controller').default['updateCropAndProductionInfo']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/selling_accounts_controller').default['updateCropAndProductionInfo']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'ai.chat': {
    methods: ["POST"]
    pattern: '/api/ai/chat'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/ais_controller').default['chat']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/ais_controller').default['chat']>>>
    }
  }
  'ai.predict': {
    methods: ["POST"]
    pattern: '/api/ai/predict'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/ais_controller').default['predict']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/ais_controller').default['predict']>>>
    }
  }
  'ai.mindmap': {
    methods: ["POST"]
    pattern: '/api/ai/mindmap'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/ais_controller').default['mindmap']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/ais_controller').default['mindmap']>>>
    }
  }
  'ai.mindmap_stream': {
    methods: ["POST"]
    pattern: '/api/ai/mindmap/stream'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/ais_controller').default['mindmapStream']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/ais_controller').default['mindmapStream']>>>
    }
  }
  'product_salls.my_listings': {
    methods: ["GET","HEAD"]
    pattern: '/api/product-salls/my'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/product_salls_controller').default['myListings']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/product_salls_controller').default['myListings']>>>
    }
  }
  'product_salls.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/product-salls'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/product_salls_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/product_salls_controller').default['index']>>>
    }
  }
  'product_salls.store': {
    methods: ["POST"]
    pattern: '/api/product-salls'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/product_sall').createProductSallValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/product_sall').createProductSallValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/product_salls_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/product_salls_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'product_salls.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/product-salls/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/product_salls_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/product_salls_controller').default['show']>>>
    }
  }
  'product_salls.update': {
    methods: ["PUT","PATCH"]
    pattern: '/api/product-salls/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/product_sall').updateProductSallValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/product_sall').updateProductSallValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/product_salls_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/product_salls_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'product_salls.destroy': {
    methods: ["DELETE"]
    pattern: '/api/product-salls/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/product_salls_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/product_salls_controller').default['destroy']>>>
    }
  }
}
