import User from '#models/user'
import type { ApplicationService } from '@adonisjs/core/types'
import cron from 'node-cron'
import { getTerceroClientData } from '../api/tercero_apis.js'
import StateService from './state_management.js'
import Holding from '#models/holding'
import { fetchTransfters } from '../api/platanium_apis.js'
import { Roles } from '../app/utils/constants.js'

export default class AdviserDashboardStatsCron {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  ready() {
    this.startCronJob()
  }

  startCronJob() {
    setTimeout(() => {
      if (StateService.get('terceroAccessToken')) {
        this.runTask()
      } else {
        console.log('No Token')
      }
    }, 30000)
    // Schedule the task to run every 24 hour
    cron.schedule('0 0 * * *', () => {
      if (StateService.get('terceroAccessToken')) {
        this.runTask()
      } else {
        console.log('No Token')
      }
    })
  }

  async runTask() {
    try {
      // Fetch all financial advisers
      const financialAdvisers = await User.query().where('role', Roles.FINANCIAL_ADVISER)

      for (const adviser of financialAdvisers) {
        console.log('Running Job for adviser dashboard ', adviser.id)
        // Fetch clients for each financial adviser
        const clients = await User.query().where('adviser_id', adviser.id)

        let gbpBalance = 0
        let audBalance = 0
        let usdBalance = 0
        let eurBalance = 0
        let gbpSipp = 0
        let audSipp = 0
        let eurSipp = 0
        let usdSipp = 0
        let pendingTransfers = 0

        for (const client of clients) {
          let terceroData
          let transfers

          if (client?.terceroClientId) {
            terceroData = await getTerceroClientData(client?.terceroClientId)
          }
          if (client?.plataniumMemberId) {
            transfers = await fetchTransfters(client?.plataniumMemberId)
          }

          const pendingTranfersForThisClient = transfers?.filter(
            (transfer: { Status: string }) =>
              transfer?.Status === 'In Progress' ||
              transfer?.Status === 'Incomplete Transfer In Details'
          )?.length

          pendingTransfers += +pendingTranfersForThisClient

          const currency = terceroData?.Portfolios?.[0]?.CurrencyIso

          const marketValue = terceroData?.Portfolios?.[0]?.LatestValue?.MarketValue || 0
          const symbol = terceroData?.Portfolios?.[0]?.LatestValue?.Currency?.UpperSymbol

          if (currency === 'GBP') {
            gbpBalance += marketValue
            gbpSipp += 1
          } else if (currency === 'EUR') {
            eurBalance += marketValue
            eurSipp += 1
          } else if (currency === 'USD') {
            usdSipp += 1
            usdBalance += marketValue
          } else if (currency === 'AUD') {
            audSipp += 1
            audBalance += marketValue
          }

          // Sum the market value for all clients of the financial adviser

          // Update each client's schema with the latest market value
          await User.query()
            .where('id', client.id)
            .update({
              latestMarketValue: `${symbol ?? ''}${Number(marketValue)?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            })
        }

        await Holding.updateOrCreate(
          { userId: adviser.id },
          {
            gbpBalance,
            eurBalance,
            usdBalance,
            audBalance,
            pendingTransfers,
            usdSipp,
            gbpSipp,
            eurSipp,
            audSipp,
          }
        )
      }

      // Fetch all firms
      const firms = await User.query().where('role', 'advice_firm')

      for (const firm of firms) {
        console.log('Running Job For Firm Dashboard', firm.id)
        const advisers = await User.query().where('advice_firm_id', firm.id)

        let gbpBalance = 0,
          audBalance = 0,
          usdBalance = 0,
          eurBalance = 0
        let gbpSipp = 0,
          audSipp = 0,
          eurSipp = 0,
          usdSipp = 0
        let pendingTransfers = 0

        for (const adviser of advisers) {
          const adviserHolding = await Holding.query().where('userId', adviser.id).first()

          if (adviserHolding) {
            gbpBalance += +adviserHolding.gbpBalance
            eurBalance += +adviserHolding.eurBalance
            usdBalance += +adviserHolding.usdBalance
            audBalance += +adviserHolding.audBalance
            pendingTransfers += +adviserHolding.pendingTransfers
            gbpSipp += +adviserHolding.gbpSipp
            audSipp += +adviserHolding.audSipp
            eurSipp += +adviserHolding.eurSipp
            usdSipp += +adviserHolding.usdSipp
          }
        }

        // Update or create holding for the firm
        await Holding.updateOrCreate(
          { userId: firm.id },
          {
            gbpBalance,
            eurBalance,
            usdBalance,
            audBalance,
            pendingTransfers,
            usdSipp,
            gbpSipp,
            eurSipp,
            audSipp,
          }
        )
      }

      // Update current portfolio value for all direct clients

      const directClients = await User.query().where('role', Roles.CLIENT)

      for (const directClient of directClients) {
        let terceroData
        console.log('Running Cron Job For Direct Clients , ', directClient.id)
        if (directClient?.terceroClientId) {
          terceroData = await getTerceroClientData(directClient?.terceroClientId)
        }

        const marketValue = terceroData?.Portfolios?.[0]?.LatestValue?.MarketValue || 0
        const symbol = terceroData?.Portfolios?.[0]?.LatestValue?.Currency?.UpperSymbol

        // Sum the market value for all clients of the financial adviser

        // Update each client's schema with the latest market value
        await User.query()
          .where('id', directClient.id)
          .update({
            latestMarketValue: `${symbol ?? ''}${Number(marketValue)?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          })
      }
    } catch (error) {
      console.error('Error fetching or storing access token:', error)
    }
  }
}
