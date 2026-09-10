import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import MarketRatesController from '#controllers/market-controller'
import AiController from '#controllers/ai_controller'

const AuthController = () =>
  import('#controllers/auth_controller')

const AccessTokensController = () =>
  import('#controllers/access_tokens_controller')

const ProfileController = () =>
  import('#controllers/profile_controller')

const SellingAccountController = () =>
  import('#controllers/selling_accounts_controller')


const ProductSallsController = () => import('#controllers/product_salls_controller')

// ============================================================
// AUTH
// ============================================================

router
  .group(() => {
    router.post('signup', [AuthController, 'register'])
    router.post('verify-email', [AuthController, 'verifyEmail'])
    router.post('login', [AccessTokensController, 'store'])

    router
      .group(() => {
        router.delete('logout', [AccessTokensController, 'destroy'])
        router.get('me', [ProfileController, 'show'])
      })
      .use(middleware.auth({ guards: ['api'] }))
  })
  .prefix('auth')

// ============================================================
// SELLING ACCOUNT
// Fakt logged-in user j potanu selling account create/manage kari shake
// ============================================================

router
  .group(() => {
    router.post('/', [SellingAccountController, 'store'])
    router.get('/', [SellingAccountController, 'show'])
    router.patch('/basic-identity', [SellingAccountController, 'updateBasicIdentity'])
    router.patch('/farm-details', [SellingAccountController, 'updateFarmAndLandDetails'])
    router.patch('/crop-info', [SellingAccountController, 'updateCropAndProductionInfo'])
  })
  .prefix('/api/selling-account')
  .use(middleware.auth({ guards: ['api'] }))

// ============================================================
// AI — AgriPluce 1.0.0 + AgriPluce AI Map 1.0.0
// Fakt logged-in khedut j AI vapari shake (misuse rokva mate)
// ============================================================

router
  .group(() => {
    router.get('product-salls/my', [ProductSallsController, 'myListings']) // ⚠️ resource pehla lakhvu, nahi to /my ne :id samji leshe
    router.resource('product-salls', ProductSallsController).apiOnly()
  })
  .prefix('api')
  .use(middleware.auth({ guards: ['api'] }))

router
  .group(() => {
    router.get('/api/market-rates', [MarketRatesController, 'index'])
    router.get('/api/price-history', [MarketRatesController, 'priceHistory'])
  })

router
  .group(() => {
    router.post('/crop-analysis', [AiController, 'analyzeCropImage'])
    router.post('/gemini/chat', [AiController, 'chatWithGemini'])
  })
  .prefix('/api/ai')