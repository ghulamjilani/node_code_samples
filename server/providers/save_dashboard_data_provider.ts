import Performance from '#models/performance'
import type { ApplicationService } from '@adonisjs/core/types'
import { getDashboardStates, getHistoricalValues } from '../api/tercero_apis.js'
import User from '#models/user'
import HistoricalValue from '#models/historical_value'

export default class SaveDashboardDatumProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * The process has been started
   */
  async ready() {
    // Main function to process users' performance data
    async function processPerformanceData() {
      // First loop: process users with terceroClientId and terceroPortfolioId
      const users = await User.all()

      for (const user of users) {
        const { terceroClientId, terceroPortfolioId } = user

        if (!terceroClientId || !terceroPortfolioId) continue

        try {
          const cardData = await getDashboardStates(terceroClientId, terceroPortfolioId)
          const graphData = await getHistoricalValues(terceroClientId, terceroPortfolioId)

          await HistoricalValue.updateOrCreate(
            { userId: user.id },
            {
              terceroClientId,
              userId: user.id,
              portfolioId: terceroPortfolioId,
              data: graphData,
            }
          )

          const flows = cardData?.Flows
          let totalMoneyIn
          let totalMoneyOut

          if (flows) {
            totalMoneyIn = flows
              .filter((flow: { SignOfMovement: number }) => flow.SignOfMovement === 1)
              .reduce((acc: any, curr: { Amount: any }) => acc + curr.Amount, 0)

            totalMoneyOut = flows
              .filter((flow: { SignOfMovement: number }) => flow.SignOfMovement === -1)
              .reduce((acc: any, curr: { Amount: any }) => acc + curr.Amount, 0)
          }

          // // Save performance data to the database
          await Performance.updateOrCreate(
            { userId: user.id },
            {
              terceroClientId,
              userId: user.id,
              portfolioId: terceroPortfolioId,
              data: cardData,
              totalMoneyIn,
              totalMoneyOut,
            }
          )

          console.log(`Data saved for user: ${user.id}`)
        } catch (error) {
          console.error(`Failed to fetch or store data for user: ${user.id}`, error)
        }
      }

      console.log(
        'All users with terceroClientId and terceroPortfolioId now have performance data.'
      )
    }

    // async function getUsersWithoutPerformance() {
    //   // Find users who have non-null tercero_client_id and tercero_portfolio_id but lack performance
    //   return await User.query()
    //     .whereNotNull('users.tercero_client_id') // Ensure terceroClientId is not null
    //     .andWhereNotNull('users.tercero_portfolio_id') // Ensure terceroPortfolioId is not null
    //     .leftJoin('performances', 'users.id', 'performances.user_id') // Perform a LEFT JOIN with performances
    //     .whereNull('performances.user_id') // Filter where no performance data exists
    // }

    setTimeout(() => {
      processPerformanceData()
    }, 10000)
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
