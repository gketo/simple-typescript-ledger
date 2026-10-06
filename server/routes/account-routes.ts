import type { FastifyInstance } from 'fastify'

import { dbGetAccounts } from '../services/account-database.ts'

export async function accountRoutes(fastify: FastifyInstance) {
  fastify.get('/accounts', async (request, reply) => {
    try {
      const accounts = dbGetAccounts()

      reply.code(200).send({ accounts: accounts })
    } catch (error) {
      console.log(error)
      reply.code(500).send({
        error: {
          code: 'SERVER_ERROR',
          message: 'An error occurred while retrieving accounts',
        },
      })
    }
  })
}
