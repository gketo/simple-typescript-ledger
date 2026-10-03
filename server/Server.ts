import Fastify from 'fastify'
import cors from '@fastify/cors'

import { transactionRoutes } from './routes/transactions.ts'
import { categoryRoutes } from './routes/categories.ts'
import { accountRoutes } from './routes/accounts.ts'

// listening port
const PORT = 3000

// fastify instanc
const fastify = Fastify()

// CORS
await fastify.register(cors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE'],
})

// transaction routes
fastify.register(transactionRoutes)
// category routes
fastify.register(categoryRoutes)
// accounts routes
fastify.register(accountRoutes)

// todo useless
fastify.get('/', async (request, reply) => {
  reply.send({ message: '/ Welcome!' })
})

try {
  const address = await fastify.listen({ port: PORT })
  console.info(`server listening on ${address}`)
} catch (err) {
  console.error(err)
  process.exit(1)
}
