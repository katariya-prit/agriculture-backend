import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () =>
  import('#controllers/auth_controller')

const AccessTokensController = () =>
  import('#controllers/access_tokens_controller')

const ProfileController = () =>
  import('#controllers/profile_controller')

const SellingAccountController = () =>
  import('#controllers/selling_accounts_controller')

const Ai = () =>
  import('#controllers/ais_controller')

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
    // ---- Chat / Plant Analysis ----
    router.post('chat', [Ai, 'chat'])

    router.get('chat', async ({ response }) => {
      return response.ok({
        success: true,
        service: 'AgriPluce AI',
        model: 'AgriPluce 1.0.0',
        route: '/api/ai/chat',
        method: 'POST',
        message:
          'AgriPluce AI chat route is working. Use POST /api/ai/chat for AI requests.',
      })
    })

    router.post('predict', [Ai, 'predict'])

    // ---- Mind Map ----
    router.post('mindmap', [Ai, 'mindmap'])

    router.get('mindmap', async ({ response }) => {
      return response.ok({
        success: true,
        service: 'AgriPluce AI Map',
        model: 'AgriPluce AI Map 1.0.0',
        route: '/api/ai/mindmap',
        method: 'POST',
        languages: ['english', 'hindi', 'gujarati'],
        message:
          'AgriPluce AI Map route is working. Use POST /api/ai/mindmap to generate a mind map.',
      })
    })

    router.post('mindmap/stream', [Ai, 'mindmapStream'])
  })
  .prefix('/api/ai')
  .use(middleware.auth())

router
  .group(() => {
    router.get('product-salls/my', [ProductSallsController, 'myListings']) // ⚠️ resource pehla lakhvu, nahi to /my ne :id samji leshe
    router.resource('product-salls', ProductSallsController).apiOnly()
  })
  .prefix('api')
  .use(middleware.auth({ guards: ['api'] }))