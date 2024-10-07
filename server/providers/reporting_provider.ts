import type { ApplicationService } from '@adonisjs/core/types'
import StateService from './state_management.js'
import cron from 'node-cron'
import User from '#models/user'
import { getRecentTransactions, getTerceroClientData } from '../api/tercero_apis.js'
import ClientReporting from '#models/client_reporting'
import CashTransaction from '#models/cash_transaction'

export default class ReportingProvider {
  constructor(protected app: ApplicationService) {}

  fullName(user: User) {
    const firstName = user?.firstName ?? ''
    const middleName = user?.middlename ? ' ' + user?.middlename + ' ' : ' '
    const lastName = user?.lastName ?? ''

    return firstName + middleName + lastName
  }
  /**
   * The application has been booted
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
    }, 12000)
    // Schedule the task to run every  24 hour
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
      console.log('Running task to fetch reporting for financial advisers')

      // Fetch all financial advisers
      const advice_firms = await User.query().where('role', 'advice_firm')

      for (const firms of advice_firms) {
        // Fetch clients for each financial adviser
        const clients = await User.query().where('advice_firm_id', firms.id).preload('adviser')

        for (const client of clients) {
          if (client?.terceroClientId) {
            const terceroClientData = await getTerceroClientData(client?.terceroClientId)
            const portfolio = terceroClientData.Portfolios?.[0]

            if (client.terceroClientId && portfolio?.Id && client?.adviser?.id) {
              const { Items } = await getRecentTransactions(client.terceroClientId, portfolio?.Id)
              const filteredTransactions = Items[0]?.Transactions?.filter(
                (trans: { TransactionType: string }) =>
                  trans.TransactionType === 'One-off Charge' ||
                  trans.TransactionType === 'Intermediary Fee'
              )
              for (const transactionToSave of filteredTransactions) {
                await CashTransaction.updateOrCreate(
                  { CashTransactionId: transactionToSave?.CashTransactionId },
                  {
                    ...transactionToSave,
                    name: this.fullName(client),
                    portfolioName: portfolio?.CollectiveName,
                    portfolioStructure: portfolio?.ModelStructureName ?? '',
                    firmId: firms?.id,
                    userId: client?.id,
                    adviserId: client?.adviser?.id,
                  }
                )
              }
            }

            await ClientReporting.updateOrCreate(
              { userId: client?.id },
              {
                name: this.fullName(client),
                portfolioName: portfolio?.CollectiveName,
                portfolioStructure: portfolio?.ModelStructureName ?? '',
                availableCash:
                  portfolio?.Accounts?.[0]?.CashAccounts?.[0]?.AvailableBalance?.MarketValue ?? '0',
                portfolioValue: portfolio?.LatestValue?.MarketValue ?? '0',
                adviserName: this.fullName(client.adviser),
                firmId: firms.id,
                userId: client?.id,
                adviserId: client?.adviser?.id,
              }
            )
          }
        }
      }
    } catch (error) {
      console.error('Error fetching or storing access token:', error)
    }
  }
}
