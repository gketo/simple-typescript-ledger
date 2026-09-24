import Fastify from 'fastify'
import cors from '@fastify/cors'

import { DatabaseSync } from 'node:sqlite'

async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const database = new DatabaseSync('./data/ledger.db')

const PORT = 3000

const fastify = Fastify()

await fastify.register(cors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE'],
})

fastify.get('/', async (request, reply) => {
  reply.send({ message: '/ Welcome!' })
})

fastify.get('/transactions', async (request, reply) => {
  try {
    const sqlQuery = database.prepare('SELECT * FROM transactions ORDER BY date')

    await sleep(1000)

    reply.code(200).send({ transactions: sqlQuery.all() })
    // sqlQuery.close()
  } catch (error) {
    reply.code(500).send({
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while retrieving transactions',
      },
    })
  }
})

// todo impodency key with periodic cleaninc in separate table
fastify.post(
  '/transactions',
  {
    schema: {
      body: {
        type: 'object',
        required: ['date', 'description', 'amount'],
        properties: {
          date: { type: 'string' },
          description: { type: 'string' },
          amount: { type: 'number' },
        },
      },
    },
  },
  async (request, reply) => {
    const transactionJSON = request.body

    if (transactionJSON.date && transactionJSON.description && transactionJSON.amount !== 0) {
      const sqlInsert = database.prepare(
        'INSERT INTO transactions (date, description, amount) VALUES (?, ?, ?)',
      )

      const { changes, lastInsertRowid } = sqlInsert.run(
        transactionJSON.date,
        transactionJSON.description,
        transactionJSON.amount,
      )
      // sqlInsert.close()

      if (changes === 1) {
        reply.code(201).send({ ...transactionJSON, id: lastInsertRowid })
      } else {
        reply.code(500).send({
          error: {
            code: 'SERVER_ERROR',
            message: 'An error occurred while creating the transaction.',
          },
        })
      }
    } else {
      reply.code(400).send({
        error: {
          code: 'EMPTY_FIELD',
          message: 'Required transaction fields are missing',
          details: [
            {
              field: 'date',
              message: 'Date is required',
            },
            {
              field: 'description',
              message: 'Description is required',
            },
            {
              field: 'amount',
              message: 'Amount is required',
            },
          ],
        },
      })
    }
  },
)

fastify.delete(
  '/transactions/:id',
  {
    schema: {
      body: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number' },
        },
      },
    },
  },
  async (request, reply) => {
    const id = parseInt(request.params.id)

    const sqlDelete = database.prepare('DELETE FROM transactions WHERE id = (?)')
    const { changes } = sqlDelete.run(id)
    // sqlDelete.close()

    if (changes === 1) {
      reply.code(200).send(id)
    } else {
      reply.code(404).send({
        error: {
          code: 'ID_NOT_FOUND',
          message: "Transaction not found. Couldn't delete",
          details: `Transaction with id ${id} does not exist`,
          field: '',
        },
      })
    }
  },
)

try {
  const address = await fastify.listen({ port: PORT })
  console.info(`server listening on ${address}`)
} catch (err) {
  console.error(err)
  process.exit(1)
}
