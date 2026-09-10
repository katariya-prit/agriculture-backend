/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.register': {
    methods: ["POST"],
    pattern: '/auth/signup',
    tokens: [{"old":"/auth/signup","type":0,"val":"auth","end":""},{"old":"/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.register']['types'],
  },
  'auth.verify_email': {
    methods: ["POST"],
    pattern: '/auth/verify-email',
    tokens: [{"old":"/auth/verify-email","type":0,"val":"auth","end":""},{"old":"/auth/verify-email","type":0,"val":"verify-email","end":""}],
    types: placeholder as Registry['auth.verify_email']['types'],
  },
  'access_tokens.store': {
    methods: ["POST"],
    pattern: '/auth/login',
    tokens: [{"old":"/auth/login","type":0,"val":"auth","end":""},{"old":"/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['access_tokens.store']['types'],
  },
  'access_tokens.destroy': {
    methods: ["DELETE"],
    pattern: '/auth/logout',
    tokens: [{"old":"/auth/logout","type":0,"val":"auth","end":""},{"old":"/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['access_tokens.destroy']['types'],
  },
  'profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/auth/me',
    tokens: [{"old":"/auth/me","type":0,"val":"auth","end":""},{"old":"/auth/me","type":0,"val":"me","end":""}],
    types: placeholder as Registry['profile.show']['types'],
  },
  'selling_account.store': {
    methods: ["POST"],
    pattern: '/api/selling-account',
    tokens: [{"old":"/api/selling-account","type":0,"val":"api","end":""},{"old":"/api/selling-account","type":0,"val":"selling-account","end":""}],
    types: placeholder as Registry['selling_account.store']['types'],
  },
  'selling_account.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/selling-account',
    tokens: [{"old":"/api/selling-account","type":0,"val":"api","end":""},{"old":"/api/selling-account","type":0,"val":"selling-account","end":""}],
    types: placeholder as Registry['selling_account.show']['types'],
  },
  'selling_account.update_basic_identity': {
    methods: ["PATCH"],
    pattern: '/api/selling-account/basic-identity',
    tokens: [{"old":"/api/selling-account/basic-identity","type":0,"val":"api","end":""},{"old":"/api/selling-account/basic-identity","type":0,"val":"selling-account","end":""},{"old":"/api/selling-account/basic-identity","type":0,"val":"basic-identity","end":""}],
    types: placeholder as Registry['selling_account.update_basic_identity']['types'],
  },
  'selling_account.update_farm_and_land_details': {
    methods: ["PATCH"],
    pattern: '/api/selling-account/farm-details',
    tokens: [{"old":"/api/selling-account/farm-details","type":0,"val":"api","end":""},{"old":"/api/selling-account/farm-details","type":0,"val":"selling-account","end":""},{"old":"/api/selling-account/farm-details","type":0,"val":"farm-details","end":""}],
    types: placeholder as Registry['selling_account.update_farm_and_land_details']['types'],
  },
  'selling_account.update_crop_and_production_info': {
    methods: ["PATCH"],
    pattern: '/api/selling-account/crop-info',
    tokens: [{"old":"/api/selling-account/crop-info","type":0,"val":"api","end":""},{"old":"/api/selling-account/crop-info","type":0,"val":"selling-account","end":""},{"old":"/api/selling-account/crop-info","type":0,"val":"crop-info","end":""}],
    types: placeholder as Registry['selling_account.update_crop_and_production_info']['types'],
  },
  'product_salls.my_listings': {
    methods: ["GET","HEAD"],
    pattern: '/api/product-salls/my',
    tokens: [{"old":"/api/product-salls/my","type":0,"val":"api","end":""},{"old":"/api/product-salls/my","type":0,"val":"product-salls","end":""},{"old":"/api/product-salls/my","type":0,"val":"my","end":""}],
    types: placeholder as Registry['product_salls.my_listings']['types'],
  },
  'product_salls.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/product-salls',
    tokens: [{"old":"/api/product-salls","type":0,"val":"api","end":""},{"old":"/api/product-salls","type":0,"val":"product-salls","end":""}],
    types: placeholder as Registry['product_salls.index']['types'],
  },
  'product_salls.store': {
    methods: ["POST"],
    pattern: '/api/product-salls',
    tokens: [{"old":"/api/product-salls","type":0,"val":"api","end":""},{"old":"/api/product-salls","type":0,"val":"product-salls","end":""}],
    types: placeholder as Registry['product_salls.store']['types'],
  },
  'product_salls.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/product-salls/:id',
    tokens: [{"old":"/api/product-salls/:id","type":0,"val":"api","end":""},{"old":"/api/product-salls/:id","type":0,"val":"product-salls","end":""},{"old":"/api/product-salls/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['product_salls.show']['types'],
  },
  'product_salls.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/product-salls/:id',
    tokens: [{"old":"/api/product-salls/:id","type":0,"val":"api","end":""},{"old":"/api/product-salls/:id","type":0,"val":"product-salls","end":""},{"old":"/api/product-salls/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['product_salls.update']['types'],
  },
  'product_salls.destroy': {
    methods: ["DELETE"],
    pattern: '/api/product-salls/:id',
    tokens: [{"old":"/api/product-salls/:id","type":0,"val":"api","end":""},{"old":"/api/product-salls/:id","type":0,"val":"product-salls","end":""},{"old":"/api/product-salls/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['product_salls.destroy']['types'],
  },
  'market_rates.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/market-rates',
    tokens: [{"old":"/api/market-rates","type":0,"val":"api","end":""},{"old":"/api/market-rates","type":0,"val":"market-rates","end":""}],
    types: placeholder as Registry['market_rates.index']['types'],
  },
  'market_rates.price_history': {
    methods: ["GET","HEAD"],
    pattern: '/api/price-history',
    tokens: [{"old":"/api/price-history","type":0,"val":"api","end":""},{"old":"/api/price-history","type":0,"val":"price-history","end":""}],
    types: placeholder as Registry['market_rates.price_history']['types'],
  },
  'ai.analyze_crop_image': {
    methods: ["POST"],
    pattern: '/api/ai/crop-analysis',
    tokens: [{"old":"/api/ai/crop-analysis","type":0,"val":"api","end":""},{"old":"/api/ai/crop-analysis","type":0,"val":"ai","end":""},{"old":"/api/ai/crop-analysis","type":0,"val":"crop-analysis","end":""}],
    types: placeholder as Registry['ai.analyze_crop_image']['types'],
  },
  'ai.chat_with_gemini': {
    methods: ["POST"],
    pattern: '/api/ai/gemini/chat',
    tokens: [{"old":"/api/ai/gemini/chat","type":0,"val":"api","end":""},{"old":"/api/ai/gemini/chat","type":0,"val":"ai","end":""},{"old":"/api/ai/gemini/chat","type":0,"val":"gemini","end":""},{"old":"/api/ai/gemini/chat","type":0,"val":"chat","end":""}],
    types: placeholder as Registry['ai.chat_with_gemini']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
