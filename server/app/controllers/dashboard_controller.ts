import { HttpContext } from '@adonisjs/core/http'
import Performance from '#models/performance'
import HistoricalValue from '#models/historical_value'
import User from '#models/user'
import {
  getDashboardStates,
  getHistoricalValues,
  getRecentTransactions,
} from '../../api/tercero_apis'

// Define types for better type safety
interface GraphData {
  Flows?: Array<Flow>
  Valuation?: Valuation
}

interface Flow {
  Date: string
  Amount: number
  SignOfMovement: number
}

interface Valuation {
  MarketValue: number
}

interface HistoricalValueData {
  Items: Array<{ ValuationDate: string; Valuation: Valuation }>
}

interface ProcessedGraphData {
  series: Array<{ name: string; data: number[] }>
  categories: string[]
}

// Helper to format response
const sendResponse = (response: any, statusCode: number, message: string, data = {}) => {
  return response.status(statusCode).json({ status: statusCode === 200, message, data })
}

// Process graph data (flows and valuation items)
function processGraphData(graphData: GraphData, performanceData: HistoricalValueData): ProcessedGraphData {
  const flows = (graphData.Flows || []).sort(
    (a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime()
  )

  const valuationItems = performanceData.Items || []
  const totalInvestedByDate: Record<string, number> = {}
  let cumulativeInvestment = 0

  // Calculate total invested by date
  flows.forEach((flow) => {
    const date = new Date(flow.Date).toISOString().substring(0, 10)
    const adjustedAmount = flow.Amount * flow.SignOfMovement
    cumulativeInvestment += adjustedAmount
    totalInvestedByDate[date] = cumulativeInvestment
  })

  const dates: string[] = []
  const totalInvested: number[] = []
  const performance: number[] = []

  // Adjust ValuationDate to show as -1 day and merge all dates from flows and valuation items
  const allDates = new Set<string>([
    ...flows.map((flow) => new Date(flow.Date).toISOString().substring(0, 10)),
    ...valuationItems.map((item) => {
      const valuationDate = new Date(item.ValuationDate)
      valuationDate.setDate(valuationDate.getDate() - 1)
      return valuationDate.toISOString().substring(0, 10)
    }),
  ])

  const sortedDates = Array.from(allDates).sort()

  let lastTotalInvested = 0
  let lastPerformance = 0

  // Process sorted dates to get the total invested and performance data
  sortedDates.forEach((date) => {
    if (totalInvestedByDate[date] !== undefined) {
      lastTotalInvested = totalInvestedByDate[date]
    }

    const valuationItem = valuationItems.find((item) => {
      const adjustedDate = new Date(item.ValuationDate)
      adjustedDate.setDate(adjustedDate.getDate() - 1)
      return adjustedDate.toISOString().substring(0, 10) === date
    })

    if (valuationItem && valuationItem.Valuation.MarketValue !== 0) {
      lastPerformance = valuationItem.Valuation.MarketValue
    }

    if (lastPerformance || lastTotalInvested) {
      performance.push(lastPerformance)
      totalInvested.push(lastTotalInvested)
      dates.push(date)
    }
  })

  const series = []
  if (performance.length > 0) series.push({ name: 'Value', data: performance })
  if (totalInvested.length > 0) series.push({ name: 'Net Amount Invested', data: totalInvested })

  return { series, categories: dates }
}

export default class DashboardController {
  // Fetch dashboard stats, including card data and graph data
  async getDashboardStats({ params, response }: HttpContext) {
    try {
      const { portfolioId } = params
      if (!portfolioId) return sendResponse(response, 400, 'Not valid account')

      // Fetch performance data for the portfolio
      const performance = await Performance.query().where('portfolioId', portfolioId).first()
      if (!performance) return sendResponse(response, 404, 'Performance data not found')

      const flowsCurrency = performance.data?.Currency?.UpperSymbol
      const historicalValues = await HistoricalValue.query().where('portfolioId', portfolioId).first()
      const graphData = processGraphData(performance.data, historicalValues?.data)

      return sendResponse(response, 200, 'Dashboard Data Fetched', {
        cardData: {
          totalMoneyIn: performance.totalMoneyIn,
          totalMoneyOut: performance.totalMoneyOut,
          flowsCurrency,
          PortfolioStats: performance.data?.PortfolioStats,
        },
        graphData,
        tableData: [], // Implement recent transactions if required
      })
    } catch (error) {
      console.error('Error:', error)
      return sendResponse(response, 500, 'Server error')
    }
  }

  // Fetch updated dashboard stats from Tercero
  async getUpdatedDashboardStats({ params, response }: HttpContext) {
    try {
      const { portfolioId } = params
      if (!portfolioId) return sendResponse(response, 400, 'Not valid account')

      // Fetch user data and validate tercero IDs
      const user = await User.query().where('tercero_portfolio_id', portfolioId).first()
      if (!user) return sendResponse(response, 404, 'User not found')

      const { terceroClientId, terceroPortfolioId } = user
      if (terceroClientId && terceroPortfolioId) {
        const cardData = await getDashboardStates(terceroClientId, terceroPortfolioId)
        const graphData = await getHistoricalValues(terceroClientId, terceroPortfolioId)

        // Update HistoricalValue and Performance
        await HistoricalValue.updateOrCreate(
          { portfolioId: terceroPortfolioId },
          { terceroClientId, userId: user.id, portfolioId: terceroPortfolioId, data: graphData }
        )

        const flows = cardData?.Flows
        const totalMoneyIn = flows
          .filter((flow) => flow.SignOfMovement === 1)
          .reduce((acc, curr) => acc + curr.Amount, 0)

        const totalMoneyOut = flows
          .filter((flow) => flow.SignOfMovement === -1)
          .reduce((acc, curr) => acc + curr.Amount, 0)

        await Performance.updateOrCreate(
          { portfolioId: terceroPortfolioId },
          { terceroClientId, userId: user.id, portfolioId: terceroPortfolioId, data: cardData, totalMoneyIn, totalMoneyOut }
        )
      }

      // Fetch updated performance data
      const performance = await Performance.query().where('portfolioId', portfolioId).first()
      const flowsCurrency = performance.data?.Currency?.UpperSymbol
      const historicalValues = await HistoricalValue.query().where('portfolioId', portfolioId).first()

      const graphData = processGraphData(performance.data, historicalValues?.data)

      return sendResponse(response, 200, 'Dashboard Data Fetched', {
        cardData: {
          totalMoneyIn: performance.totalMoneyIn,
          totalMoneyOut: performance.totalMoneyOut,
          flowsCurrency,
          PortfolioStats: performance.data?.PortfolioStats,
        },
        graphData,
      })
    } catch (error) {
      console.error('Error:', error)
      return sendResponse(response, 500, 'Server error')
    }
  }

  // Fetch recent transactions
  async getRecentTransactions({ params, response }: HttpContext) {
    try {
      const { terceroId, portfolioId } = params
      if (!terceroId || !portfolioId) return sendResponse(response, 400, 'Not valid account')

      const transactions = await getRecentTransactions(terceroId, portfolioId)

      return sendResponse(response, 200, 'Transactions Data Fetched', { transactions })
    } catch (error) {
      console.error('Error:', error)
      return sendResponse(response, 500, 'Server error')
    }
  }
}
