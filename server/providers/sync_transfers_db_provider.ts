import type { ApplicationService } from '@adonisjs/core/types'

import User from '#models/user'
import Transfer from '#models/transfer'
import { fetchTransfters } from '../api/platanium_apis.js'
import StateService from './state_management.js'

export default class SyncTransfersDbProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * The application has been booted
   */
  async ready() {
    this.startCronJob()
  }

  startCronJob() {
    setTimeout(() => {
      if (StateService.get('platinumAccessToken')) {
        this.runTask()
      } else {
        console.log('No TOken')
      }
    }, 30000)
  }

  async runTask() {
    try {
      console.log('Running task to fetch transfer information for all users')

      // Fetch all users
      const users = await User.all()

      for (const user of users) {
        if (user?.plataniumMemberId) {
          const transfers = await fetchTransfters(user?.plataniumMemberId)

          for (const transferDetail of transfers) {
            await Transfer.updateOrCreate(
              { IntegerPK: transferDetail.IntegerPK },
              {
                RequestedDate: transferDetail?.RequestedDate,
                TransferringSchemeReference: transferDetail?.TransferringSchemeReference,
                TransferringScheme: transferDetail?.TransferringScheme,
                Status: transferDetail?.Status,
                TotalExpectedAmount: transferDetail?.TotalExpectedAmount,
                AmountReceived: transferDetail?.AmountReceived,
                userId: user.id,
              }
            )
          }
        }
      }
    } catch (error) {
      console.error('Error fetching or storing transfers:', error)
    }
  }
}
