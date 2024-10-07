import type { ApplicationService } from '@adonisjs/core/types'
import cron from 'node-cron'
import { modelStructuresList } from '../api/tercero_apis.js'
import ModelStructure from '#models/model_structure'

export default class ModelStructureProvider {
  constructor(protected app: ApplicationService) {}

  ready() {
    this.startCronJob()
  }

  startCronJob() {
    setTimeout(() => {
      this.runTask()
    }, 30000)

    // Runs every Week
    cron.schedule('0 0 * * 0', () => {
      this.runTask()
    })
  }

  async runTask() {
    try {
      console.log('Running task to fetch model structures')

      const { Items } = await modelStructuresList()

      for (const item of Items) {
        await ModelStructure.updateOrCreate(
          { Id: item.Id },
          {
            Active: item.Active,
            Name: item.Name,
            AnalysisStructureUsages: JSON.stringify(item.AnalysisStructureUsages),
            Versions: JSON.stringify(item.Versions),
            userId: 43,
          }
        )
      }

      console.log('Model structures saved to the database')
    } catch (error) {
      console.error('Error fetching or storing model structures:', error)
    }
  }
}
