import Fastify from 'fastify'
import cors from '@fastify/cors'

import type { Transaction } from '../src/types/Transaction.ts'

const transactions = [
  { id: 1, date: new Date(2026, 8, 1), description: 'Server', amount: 10 },
  { id: 2, date: new Date(2026, 8, 2), description: 'Server1', amount: 100 },
  { id: 3, date: new Date(2026, 8, 3), description: 'Server2', amount: -1000 },
]

const PORT = 3000

const fastify = Fastify()
await fastify.register(cors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE'],
})

fastify.get('/', async (request, reply) => {
  reply.send({ message: '/ Welcome!' })
})

fastify.get('/transaction', async (request, reply) => {
  reply.send({ transactions })
})

fastify.post('/transaction', async (request, reply) => {
  const transactionSTR = request.body

  if (transactionSTR.date && transactionSTR.description && transactionSTR.amount !== 0) {
    const lastT = transactions.at(-1)

    const newTransaction = {
      ...transactionSTR,
      id: lastT ? lastT.id + 1 : 1,
      date: new Date(transactionSTR.date),
    }

    transactions.push(newTransaction)

    reply.send(newTransaction)
  } else {
    reply
      .code(400)
      .send({ info: "mandatory transaction's properties not filled, transaction not registered" })
  }
})

fastify.delete('/transaction/:id', async (request, reply) => {
  const id = parseInt(request.params.id)

  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].id === id) {
      transactions.splice(i, 1)
      reply.send({ deleted: true })
      return
    }
  }
  reply.code(400).send({ info: `couldn't delete transaction: transaction with id ${id} not found` })
})

try {
  const address = await fastify.listen({ port: PORT })
  console.info(`server listening on ${address}`)
} catch (err) {
  console.error(err)
  process.exit(1)
}
