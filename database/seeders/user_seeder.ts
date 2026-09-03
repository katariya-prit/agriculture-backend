import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        fullName: 'Admin User',
        email: 'admin@agriconnect.com',
        password: 'admin123',
      },
      {
        fullName: 'Test Farmer',
        email: 'farmer@agriconnect.com',
        password: 'test123',
      },
    ])
  }
}