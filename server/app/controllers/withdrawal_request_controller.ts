import { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import {
  getCrystallisationHistory,
  getHMRCAllowances,
  getHMRCProtections,
  getMemberFundSplit,
} from '../../api/platanium_apis'

// Define interfaces for expected data
interface ProductData {
  plataniumMemberId: string
  terceroPortfolioId: string
}

interface MemberFundSplit {
  fundName: string
  amount: number
}

interface CrystallisationHistory {
  eventDate: string
  amount: number
}

interface HMRCAllowance {
  memberId: number
  allowanceType: string
  amount: number
}

interface HMRCProtection {
  memberId: number
  protectionType: string
  protectionAmount: number
}

export default class WithdrawalController {
  // Helper to send JSON response with consistent structure
  private sendResponse(
    response: HttpContext['response'],
    status: number,
    success: boolean,
    data: object
  ) {
    return response.status(status).json({ status: success, data })
  }

  // Get withdrawal requests record
  public async getWithdrawalRequests({ request, response }: HttpContext) {
    const selectedPortfolio: string = request.input('selectedPortfolio')

    try {
      const product: ProductData | null = await Product.query()
        .where('tercero_portfolio_id', selectedPortfolio)
        .first()

      if (!product) {
        return this.sendResponse(response, 200, true, {
          withdrawalsData: [],
          withdrawalCrystallisationHistory: [],
        })
      }

      const withdrawalsData: MemberFundSplit[] = await getMemberFundSplit(
        product.plataniumMemberId
      )

      const withdrawalCrystallisationHistory: CrystallisationHistory[] = await getCrystallisationHistory(
        product.plataniumMemberId
      )

      return this.sendResponse(response, 200, true, {
        withdrawalsData,
        withdrawalCrystallisationHistory,
      })
    } catch (error) {
      console.error('Error fetching withdrawal requests:', error)
      return this.sendResponse(response, 500, false, {
        message: 'Failed to fetch withdrawal requests.',
      })
    }
  }

  // Get HMRC Allowances and Protections
  public async getHMRCdataApi({ request, response }: HttpContext) {
    const selectedPortfolio: string = request.input('selectedPortfolio')

    try {
      const product: ProductData | null = await Product.query()
        .where('tercero_portfolio_id', selectedPortfolio)
        .first()

      if (!product) {
        return this.sendResponse(response, 200, true, {
          HMRCAllowancesData: [],
          HMRCProtectionsData: [],
        })
      }

      const HMRCAllowancesData: HMRCAllowance[] = await getHMRCAllowances()
      const HMRCProtectionsData: HMRCProtection[] = await getHMRCProtections()

      const allowancesFilteredData = HMRCAllowancesData?.filter(
        (item) => product.plataniumMemberId && item.memberId === +product.plataniumMemberId
      )

      const protectionsFilteredData = HMRCProtectionsData?.filter(
        (item) => product.plataniumMemberId && item.memberId === +product.plataniumMemberId
      )

      return this.sendResponse(response, 200, true, {
        HMRCAllowancesData: allowancesFilteredData,
        HMRCProtectionsData: protectionsFilteredData,
      })
    } catch (error) {
      console.error('Error fetching HMRC data:', error)
      return this.sendResponse(response, 500, false, {
        message: 'Failed to fetch HMRC data.',
      })
    }
  }
}
