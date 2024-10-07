import type { ApplicationService } from '@adonisjs/core/types'
import querystring from 'node:querystring'

import cron from 'node-cron'
import axios from 'axios'
import StateService from './state_management.js'
import env from '#start/env'
// import User from '#models/user'
// import Product from '#models/product'

export default class AccessTokenCronProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  ready() {
    // Run the task initially when the server starts
    this.runTask()

    // Schedule the task to run every 1 hour
    cron.schedule('0 * * * *', () => {
      this.runTask()
    })
  }

  async runTask() {
    try {
      const retryDelay = 2000 // 10 seconds
      const maxRetries = 5 // Number of retries
      const timeout = 7000 // 7 seconds timeout for axios requests

      const fetchAccessToken = async (url: string, requestBody: any, config: any) => {
        try {
          const response = await axios.post(url, requestBody, { ...config, timeout })
          if (response.status === 200) {
            return response.data.access_token
          } else {
            console.error('Failed to obtain access token from', url)
            return null
          }
        } catch (error) {
          console.error('Error fetching access token from', url, error.message)
          return null
        }
      }

      const tryFetchAccessTokens = async () => {
        let retries = 0
        let terceroAccessToken = null
        let platinumAccessToken = null

        while (retries < maxRetries && (!terceroAccessToken || !platinumAccessToken)) {
          console.log(`Attempt ${retries + 1} to fetch access tokens...`)

          terceroAccessToken = await fetchAccessToken(
            `${env.get('TERCERO_API_ENDPOINT')}/token`,
            {
              grant_type: 'password',
              loginType: 'tercero',
              username: env.get('TERCERO_USERNAME'),
              password: env.get('TERCERO_PASSWORD'),
              domain: 'tps',
            },
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            }
          )

          const params = querystring.stringify({
            grant_type: 'client_credentials',
            client_id: env.get('PLATANIUM_CLIENT_ID'),
            client_secret: env.get('PLATANIUM_CLIENT_SECRET'),
            scope: env.get('PLATANIUM_API_SCOPE'),
          })

          platinumAccessToken = await fetchAccessToken(
            env.get('PLATANIUM_TOKEN_ENPOINT', ''),
            params,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            }
          )

          if (terceroAccessToken) {
            StateService.set('terceroAccessToken', terceroAccessToken)
            console.log(StateService.get('terceroAccessToken'))
          }

          if (platinumAccessToken) {
            StateService.set('platinumAccessToken', platinumAccessToken)
            console.log(StateService.get('platinumAccessToken'))
          }

          if (!terceroAccessToken || !platinumAccessToken) {
            retries++
            console.log(`Retrying in ${retryDelay / 1000} seconds...`)
            await new Promise((resolve) => setTimeout(resolve, retryDelay))
          }
        }

        if (!terceroAccessToken || !platinumAccessToken) {
          console.error('Failed to fetch all access tokens after maximum retries.')
        }
      }

      console.log('Running AccessTokenCron task...')

      // const users = await User.query()

      // // Insert data into the products table
      // for (const user of users) {
      //   console.log('Adding Products', user.id)
      //   await Product.updateOrCreate(
      //     { terceroPortfolioId: user?.terceroPortfolioId },
      //     {
      //       userId: user.id,
      //       plataniumMemberId: user?.plataniumMemberId,
      //       terceroAccountId: user?.terceroAccountId,
      //       terceroCashAccountId: user?.terceroCashAccountId,
      //       adviceFee: user?.initialAdviceFee,
      //       adviceFeeCurrency: user?.adviceFeeCurrency,
      //       terceroPortfolioId: user?.terceroPortfolioId,
      //     }
      //   )
      // }

      await tryFetchAccessTokens()
    } catch (error) {
      console.error('Error fetching or storing access token:', error)
    }
  }
}
