/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const MesAdministratorsController = () => import('#controllers/mes_administrators_controller')
const WithdrawalController = () => import('#controllers/withdrawal_request_controller')
const NetworkController = () => import('#controllers/network_controller')
const FirmAdministratorsController = () => import('#controllers/firm_administrators_controller')
const AdviceFirmsController = () => import('#controllers/advice_firms_controller')
const SuperAdminsController = () => import('#controllers/super_admins_controller')
const DealingsController = () => import('#controllers/dealings_controller')

const AdviserClientsController = () => import('#controllers/adviser_clients_controller')
const TransferContributionsController = () =>
  import('#controllers/transfer_contributions_controller')
const InvestmentPortfoliosController = () => import('#controllers/investment_portfolios_controller')
const PerformancesController = () => import('#controllers/performances_controller')
const DashboardController = () => import('#controllers/dashboard_controller')
const UsersController = () => import('#controllers/users_controller')
const SettingsController = () => import('#controllers/settings_controller')
const DepositsController = () => import('#controllers/deposits_controller')
const BeneficiariesController = () => import('#controllers/beneficiaries_controller')
const MaintenanceController = () => import('#controllers/maintenance_controller')

// Public APIS

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/signup', [UsersController, 'signup'])
router.post('/login', [UsersController, 'signin'])
router.get('/resend-otp/:id', [UsersController, 'resendOtp'])
router.post('/add-previous-client', [UsersController, 'previoudClient'])

router.post('/forgot-password', [UsersController, 'forgotPassword'])
router.post('/identity-events', [UsersController, 'identityEvents'])
router.post('/identity-decision', [UsersController, 'identityDecision'])
router.post('/check-unique-email', [UsersController, 'checkUniqueEmail'])
router.post('/check-unique-number', [UsersController, 'checkUniqueContactNumber'])
router.get('/countries', [UsersController, 'getCountriesApi'])

router.post('/webhooks/payment', [DepositsController, 'getPaymentWebhooks'])
router.get('/transfers-contributions/providers', [
  TransferContributionsController,
  'getCurrentPensionProvidersList',
])

router.get('/security/overall', [DealingsController, 'searchSecurityOverAll'])
router.get('/advice-fees', [AdviserClientsController, 'getAdviceFeesAPI'])
router.get('/beneficiary/relationships', [BeneficiariesController, 'getRelationshipsApi'])
router.get('/relationship/organization', [UsersController, 'uniqueOrganizationName'])
router.get('/check-active-maintenance', [MaintenanceController, 'checkActiveMaintenance'])

router
  .group(() => {
    // Client private apis
    router.get('/get-user', [UsersController, 'getUser'])

    router.post('/maintenance', [MaintenanceController, 'createMaintenance'])
    router.put('/maintenance/:id', [MaintenanceController, 'updateMaintenance'])

    router.get('/maintenance', [MaintenanceController, 'getMaintenances'])

    router.put('/set-password', [UsersController, 'resetPassword'])
    router.get('/welcome-message-displayed', [UsersController, 'welcomeMessageDisplayedAPI'])
    router.get('/get-tercero-user', [UsersController, 'getTerceroUser'])
    router.post('/contact-us', [SettingsController, 'sendSupportEmail'])

    router.put('/update-user', [UsersController, 'updateProfileUser'])
    router.resource('/beneficiary', BeneficiariesController)

    router.post('/fx-request', [DepositsController, 'submitFxRequest'])
    router.get('/client/:client/Fx-Requests', [DepositsController, 'getFxRequestsForClient'])
    router.post('/create-payment', [DepositsController, 'createPayment'])
    router.get('/get-payments', [DepositsController, 'getAllPayments'])
    router.get('/cash-balances', [DepositsController, 'getCashBalances'])
    router.post('/create/cash-account', [DepositsController, 'createCashAccountApi'])

    router.get('/dashboard/:portfolioId', [DashboardController, 'getDashboardStats'])
    router.get('/dashboard/updated-stats/:portfolioId', [
      DashboardController,
      'getUpdatedDashboardStats',
    ])

    router.get('/dashboard/transactions/:portfolioId/:terceroId', [
      DashboardController,
      'getRecentTransactions',
    ])

    router.get('/performance/:portfolioId', [PerformancesController, 'getPerformanceStats'])

    router.get('/security/exchnage-rates', [DealingsController, 'getEchangeRates'])
    router.get('/security/exchnage-rates-order', [DealingsController, 'getEchangeRatesForOrders'])

    router.get('/security', [DealingsController, 'searchSecurity'])

    router.get('/security/:id/overview', [DealingsController, 'getSecurityOverview'])
    router.post('/security/order', [DealingsController, 'placeOrder'])
    router.get('/security/holdings/:id', [DealingsController, 'getTransactionsAdnHoldings'])

    // getPortfolioDetails

    router.get('/investment-portfolio/pending-orders/:userId', [
      InvestmentPortfoliosController,
      'getPendingOrderAPI',
    ])

    router.get('/investment-portfolio/pending-orders/updated/:userId', [
      InvestmentPortfoliosController,
      'getUpdatedPendingOrderAPI',
    ])

    router.resource('/investment-portfolio', InvestmentPortfoliosController)

    router.get('/transfers', [TransferContributionsController, 'getTransfters'])
    router.get('/transfers/updated', [TransferContributionsController, 'getUpdatedTransfters'])

    router.get('/contributions', [TransferContributionsController, 'getContributions'])

    router.get('/transfers-contributions/:memberFk/:integerPk', [
      TransferContributionsController,
      'getTransftersInTransactions',
    ])

    router.post('/transfers', [TransferContributionsController, 'addNewTransfer'])
    // Admin APIS
    router.get('/admin/all_clients', [SuperAdminsController, 'allClients'])
    router.post('/admin/mes_administrator', [SuperAdminsController, 'createMESAdministrator'])
    router.get('/admin/mes_administrator', [SuperAdminsController, 'getMESAdministrators'])
    router.get('/admin/model-structure-options', [SuperAdminsController, 'modelStructureOptions'])
    router.put('/admin/update-model-structure/:structureId/:firmId', [
      SuperAdminsController,
      'updateModelStructure',
    ])

    // MES Administrator APIS
    router.post('/mes-administrator/advisor', [
      MesAdministratorsController,
      'createFinancialAdvisor',
    ])
    router.get('/mes-administrator/advice_firm', [MesAdministratorsController, 'getAdviceFirms'])
    router.get('/mes-administrator/advice_firm/options', [
      MesAdministratorsController,
      'getAllAdviceFirmsOptions',
    ])
    router.get('/mes-administrator/network/options', [
      MesAdministratorsController,
      'getAllNetworksOptions',
    ])
    router.get('/mes-administrator/financial_advisor/options', [
      MesAdministratorsController,
      'getAllAdviserOptions',
    ])

    router.post('/mes-administrator/advice_firm', [
      MesAdministratorsController,
      'createAdviceFirms',
    ])
    router.get('/mes-administrator/transfers', [MesAdministratorsController, 'getTransfers'])
    router.post('/mes-administrator/transfers/:id/comment', [
      MesAdministratorsController,
      'addCommentOnTransfers',
    ])
    router.get('/mes-administrator/Fx-Requests', [MesAdministratorsController, 'getFxRequests'])

    router.get('/mes-administrator/portfolio-requests', [
      MesAdministratorsController,
      'getPortfolioRequests',
    ])

    router.post('/mes-administrator/network', [MesAdministratorsController, 'createNetwork'])
    router.get('/mes-administrator/networks', [MesAdministratorsController, 'getNetworks'])
    router.put('/mes-administrator/update-user/:userId', [
      MesAdministratorsController,
      'updateUserDetails',
    ])
    router.put('/mes-administrator/toggle-user-access/:userId', [
      MesAdministratorsController,
      'toggleAccessOfUser',
    ])
    router.post('/mes-administrator/fx-requests/status/:fxRequestId', [
      MesAdministratorsController,
      'updateStatusOfFxRequest',
    ])

    // networks apis

    router.get('/network/advice-firms', [NetworkController, 'getNetworkFirms'])

    // Advice Firms  APIS

    router.get('/advice_firm/advisors', [AdviceFirmsController, 'getFinancialAdvisors'])
    router.post('/advice_firm/administrator', [AdviceFirmsController, 'createAdministrators'])
    router.get('/advice_firm/administrators', [AdviceFirmsController, 'getAdministrators'])
    router.get('/advice_firm/clients', [AdviceFirmsController, 'getClients'])
    router.post('/advice_firm/model_portfolio', [AdviceFirmsController, 'createModelPortfolio'])
    router.get('/advice_firm/model_portfolio', [AdviceFirmsController, 'getModelPortfolios'])

    // Financial Advisor APIS
    router.resource('/adviser/clients', AdviserClientsController)

    router.get('/performance/:terceroId/:portfolioId', [
      AdviserClientsController,
      'getDashboardDataForClients',
    ])
    router.post('/advisor/contribution', [AdviserClientsController, 'addNewContributions'])
    router.post('/advisor/product', [AdviserClientsController, 'createNewProduct'])
    router.get('/advisor/transfers/:userId', [AdviserClientsController, 'getTransftersForClients'])
    router.get('/advisor/transfers/updated/:userId', [
      AdviserClientsController,
      'getUpdatedTransftersForClients',
    ])

    router.get('/advisor/contributions/:platinumId', [
      AdviserClientsController,
      'getContributionsForClients',
    ])

    router.post('/advisor/transfer', [AdviserClientsController, 'addNewTransferForClient'])
    router.post('/advisor/reporting', [AdviserClientsController, 'exportData'])
    router.get('/advisor/structures/:id', [AdviserClientsController, 'getSingleModelStructure'])
    router.put('/advisor/structures/:clientId/:portfolioId', [
      AdviserClientsController,
      'dealingForClient',
    ])
    router.get('/advisor/get-tercero-user/:terceroId', [
      AdviserClientsController,
      'getTerceroUserForClient',
    ])

    router.get('/advisor/client/:id', [AdviserClientsController, 'getSingleClient'])
    router.get('/adviser/transactions/:id', [
      AdviserClientsController,
      'getSingleClientTransactions',
    ])
    router.get('/adviser/allclients', [AdviserClientsController, 'getClients'])
    router.get('/adviser/clients/beneficiaries/:id', [
      AdviserClientsController,
      'getSingleClientBeneficiaries',
    ])
    router.get('/adviser/investment-portfolio/:id', [
      AdviserClientsController,
      'getSingleClientAssets',
    ])

    router.get('/adviser/fee-rule/:id', [AdviserClientsController, 'getAdviserFeeRule'])

    router.put(
      '/adviser/fee-rule/client/:client/terceroClient/:terceroClient/portfolio/:portfolioId/feerules/:feeRuleId',
      [AdviserClientsController, 'updateFeeRuleAPI']
    )
    router.post(
      '/adviser/fee-rule/client/:client/terceroClient/:terceroClient/portfolio/:portfolioId/feerules',
      [AdviserClientsController, 'saveFeeRuleAPI']
    )

    router.get('/adviser/bulk-export', [AdviserClientsController, 'exportClientDataInBulk'])
    router.get('/adviser/export/cash-transactions', [
      AdviserClientsController,
      'exportClientTransactions',
    ])
    router.get('/adviser/pendingtransfers', [AdviserClientsController, 'getPendingTransfers'])

    router.get('/adviser/security/holdings/:securityId/client/:clientId/portfolio/:portfolioId', [
      AdviserClientsController,
      'adviserSecurityHoldings',
    ])
    router.get('/advisor/structures', [AdviserClientsController, 'getModelStructuresList'])
    router.post('/adviser/fx-request/:userId', [
      AdviserClientsController,
      'submitFxRequestForClient',
    ])

    // Firm Administrator
    router.get('/firm/advisers', [FirmAdministratorsController, 'getFinancialAdvisors'])

    // withdrawal requests
    router.get('/withdrawal/requests', [WithdrawalController, 'getWithdrawalRequests'])
    router.get('/withdrawal/HMRCdata', [WithdrawalController, 'getHMRCdataApi'])
  })
  .use(middleware.auth({ guards: ['api'] }))

router
  .group(() => {
    router.get('/verify-email', [UsersController, 'verifyEmail'])
    router.put('/reset-password', [UsersController, 'resetPassword'])
    router.post('/verify-contact-number', [UsersController, 'verifyContactNumber'])
    router.get('/user/verification-status', [UsersController, 'getVerificationStatus'])
  })
  .use(middleware.auth({ guards: ['verification'] }))

// getFinancialAdvisors
