import Fastify from 'fastify'
import cors from '@fastify/cors'

import { transactionRoutes } from './routes/transaction-routes.js'
import { categoryRoutes } from './routes/category-routes.js'
import { accountRoutes } from './routes/account-routes.js'

// listening port
const PORT = 3000

// fastify instanc
const fastify = Fastify()

// CORS
await fastify.register(cors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
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
